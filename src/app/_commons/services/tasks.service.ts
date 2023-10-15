import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TaskItem } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskKey: string = 'tasks';

  //  l'observable sur le localstorage pour le tableau de tâches, récupérer les tâches
  private $tasks: BehaviorSubject<TaskItem[]> = new BehaviorSubject(
    JSON.parse(localStorage.getItem(this.taskKey)!) || []
  );

  //  l'observable sur le tableau de tâches
  public tasks: Observable<TaskItem[]> = this.$tasks.asObservable();

  constructor() {}

  // persistence
  public updateTasks(tasks: TaskItem[]): void {
    this.$tasks.next(tasks);
    localStorage.setItem(this.taskKey, JSON.stringify(tasks));
  }

  // flush supprime les données à l'interieur
  public resetTasks(): void {
    this.$tasks.next([]);
    localStorage.setItem(this.taskKey, JSON.stringify([]));
  }

  public addTask(task: TaskItem): void {
    const tasks: TaskItem[] = this.getTasks();

    tasks.push(task);
    this.updateTasks(tasks);
  }

  // restaurer l'ancienne valeur par défaut
  public rebaseTasks = (): void =>
    this.$tasks.next(JSON.parse(localStorage.getItem(this.taskKey)!) || []);

  public getTasks = (): TaskItem[] => this.$tasks.getValue();

  public editTask(task: TaskItem): void {
    const tasks: TaskItem[] = this.getTasks();

    tasks.map((t: TaskItem) => (t = task.id === t.id ? task : t));
    this.updateTasks(tasks);
  }

  public deleteTask(task: TaskItem): void {
    const tasks: TaskItem[] = this.getTasks();
    const taskId: number = tasks.findIndex((t: TaskItem) => t === task);

    tasks.splice(taskId, 1);
    this.updateTasks(tasks);
  }
}
