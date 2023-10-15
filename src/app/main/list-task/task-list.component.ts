import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TaskItem } from 'src/app/_commons/models/task';
import { TaskService } from 'src/app/_commons/services/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  // Tâches à faire
  // Tâches faites
  public todoTasks: TaskItem[] = [];
  public doneTasks: TaskItem[] = [];

  constructor(private _task: TaskService, public dialog: MatDialog) {
    // tasks est un observable dans le service
    // subscribe écoute les changements sur le tableau de tache TaskItem[] (voir le service)
    // fonction fléchée qui prend en paramètre le tableau de tache TaskItem[] émis par l'observable
    // filter créer un nouveau tableau avec les tâches qui ne sont pas terminée
    // filter créer un nouveau tableau avec les tâches qui sont terminée
    this._task.tasks.subscribe((tasks: TaskItem[]) => {
      this.todoTasks = tasks.filter((task) => !task.isDone);
      this.doneTasks = tasks.filter((task) => task.isDone);
    });
  }

  public ngOnInit(): void {}

  public dropDone(event: CdkDragDrop<TaskItem[]>) {
    /* 
     Vérifie que la tâche déplacé est dans la meme liste
     déplace la tâche à l'interieur de la meme liste mais à un autre emplacement. 
    */
    /* 
     Si la tâche est déplacé à l'interieur de la même liste, la fonction moveItemInArray
     déplace la tache de son index précédent à son nouvel index ce qui met à jour l'ordre des tâches dans la liste.  
    */
    // previousIndex = les taches à faire / currentIndex = les tâches terminée
    if (event.previousContainer === event.container) {
      moveItemInArray(this.doneTasks, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        this.todoTasks,
        this.doneTasks,
        event.previousIndex,
        event.currentIndex
      );

      // On prend notre tableau doneTasks[]
      // Comme on déplace la tache sur Done on passe la propriété isDone à true
      /*   
       On utilise event.currentIndex qui correspond à la position de l'élément dans la liste des taches faites
       après son déplacement   
      */
      this.doneTasks[event.currentIndex].isDone = true;
    }
    this.updateTasks();
  }

  public dropToDo(event: CdkDragDrop<TaskItem[]>) {
    /* 
     Vérifie que la tâche déplacé est dans la meme liste
     déplace la tâche à l'interieur de la meme liste mais à un autre emplacement. 
    */
    /* 
     Si la tâche est déplacé à l'interieur de la même liste, la fonction moveItemInArray
     déplace la tache de son index précédent à son nouvel index ce qui met à jour l'ordre des tâches dans la liste.  
    */
    // previousIndex = les tâches terminées / currentIndex = les taches à faire
    if (event.previousContainer === event.container) {
      moveItemInArray(this.todoTasks, event.previousIndex, event.currentIndex);
    } else {
      /*  
       Si la tâche est déplacé d'une liste à une autre la fonction transferArrayItem est utilisée pour
       transférer une tache du tableau doneTasks au tableau todoTasks ou inversement.  
      */
      transferArrayItem(
        this.doneTasks,
        this.todoTasks,
        event.previousIndex,
        event.currentIndex
      );

      // On prend notre tableau todoTasks[]
      /*   
       On utilise event.currentIndex qui correspond à la position de l'élément dans la liste des taches à faire
       après son déplacement   
      */
      // Comme on déplace la tache sur ToDo on passe la propriété isDone de notre modèle à false
      this.todoTasks[event.currentIndex].isDone = false;
    }
    this.updateTasks();
  }

  // concatène les deux tableaux dans un autre tableau stockée dans une constante
  // Enfin on met à jour les tâches avec le service _task qui fait appel à l'observable.
  private updateTasks() {
    const tasks = [...this.todoTasks, ...this.doneTasks];
    this._task.updateTasks(tasks);
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: { editMode: false },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}
