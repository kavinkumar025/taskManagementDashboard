import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent {
  public taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.fb.group({
      title: [data?.title || '', [Validators.required]],
      description: [data?.description || ''],
      priority: [data?.priority || 'Medium', [Validators.required]],
      status: [data?.status || 'Pending', [Validators.required]],
    });
  }

  ngOnInit(): void { }

  public onSave(): void {
    if (this.taskForm.valid) {
      localStorage.setItem('taskFormData', JSON.stringify(this.taskForm.value));
      this.dialogRef.close(this.taskForm.value);
    }
  }
}
