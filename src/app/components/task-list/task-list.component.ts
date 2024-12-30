import { Component, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { MatDialog } from '@angular/material/dialog';

interface Task {
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  public tasks: Task[] = [];
  public filteredTasks: Task[] = [];
  public filterStatus: string = '';
  public displayedColumns: string[] = ['title', 'description', 'priority', 'status', 'actions'];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    const storedData = localStorage.getItem('taskFormData');
    if (storedData) {
      const storedTasks = JSON.parse(storedData);
      this.tasks = Array.isArray(storedTasks) ? storedTasks : [];
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = [];
    }
  }

  public openAddTaskModal(): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: Task) => {
      if (result) {
        this.tasks.push(result);
        this.applyFilter();
      }
    });
  }

  public openEditTaskModal(task: Task): void {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '400px',
      data: { ...task }
    });

    dialogRef.afterClosed().subscribe((result: Task) => {
      if (result) {
        Object.assign(task, result);
        this.applyFilter();
      }
    });
  }

  public openDeleteDialog(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete "${task.title}"?` }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.tasks = this.tasks.filter(t => t !== task);
        this.applyFilter();
      }
    });
  }

  public applyFilter(): void {
    this.filteredTasks = this.filterStatus ? this.tasks.filter(task => task.status === this.filterStatus) : [...this.tasks];
  }
}
