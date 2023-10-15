import { Component, Input } from '@angular/core';
import { TaskItem } from 'src/app/_commons/models/task';
import { TaskFormComponent } from '../../task-form/task-form.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from 'src/app/_commons/services/tasks.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: TaskItem;

  constructor(public dialog: MatDialog, private _task: TaskService) {}

  public openDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: {
        editMode: true,
        task: this.task,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  public deleteTask(): void {
    this._task.deleteTask(this.task);
  }
}
