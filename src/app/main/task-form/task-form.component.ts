import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TaskItem } from 'src/app/_commons/models/task';
import { TaskService } from 'src/app/_commons/services/tasks.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  public editMode: boolean = false;
  public task?: TaskItem;

  public taskForm: FormGroup = this.fb.group({
    name: [null, [Validators.required]],
    description: [null],
  });

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    private _task: TaskService,
    @Inject(MAT_DIALOG_DATA)
    public data: { editMode: boolean; task?: TaskItem }
  ) {
    this.editMode = this.data.editMode;

    if (this.editMode && this.data.task) {
      this.editMode = this.data.editMode;
      this.task = this.data.task;
      this.taskForm.patchValue({
        name: this.data.task.name,
        description: this.data.task.description,
      });
    }
  }

  public ngOnInit() {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public addTask(): void {
    const date: Date = new Date();

    const newTask: TaskItem = {
      id: date.getTime(),
      name: this.taskForm.value.name,
      description: this.taskForm.value.description,
      isDone: false,
    };

    this._task.addTask(newTask);
    this.dialogRef.close();
  }

  public editTask(): void {
    const editTask: TaskItem = {
      id: this.task!.id,
      name: this.taskForm.value.name,
      description: this.taskForm.value.description,
      isDone: this.task!.isDone,
    };

    console.log(editTask);

    this._task.editTask(editTask);
  }
}
