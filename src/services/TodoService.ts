import Task from "@/models/Task.ts";
import Group from "@/models/Group.ts";
import Priority from "@/models/Priority.ts";
import TaskFormData from "@/models/TaskFormData.ts";

export default class TodoService {
  private static tasks: Task[] = [];

  private static groups: Group[] = [
    { name: "General", color: "#ef4444", id: 1 },
    { name: "Work", color: "#3b82f6", id: 2 },
    { name: "School", color: "#facc15", id: 3 },
  ]

  private static priorities: Priority[] = [
    { name: "Low", value: 1 },
    { name: "Medium", value: 2 },
    { name: "High", value: 3 },
  ];

  private static getNewId = (): number => {
    const ids: number[] = this.tasks.map(task => task.id)
    return Math.max(...ids) + 1
  }

  public static addTask = (newTask: TaskFormData): number => {
    const task: Task = {
      id: this.getNewId(),
      completed: false,
      ...newTask
    }
    this.tasks.push(task);
    return task.id
  };

  public static removeTask = (taskId: number): void => {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  };

  public static updateTask = (updatedTask: Task): void => {
    const taskIndex = this.tasks.findIndex(
      (task) => task.id === updatedTask.id
    );
    this.tasks[taskIndex] = updatedTask;
  };

  public static getTask = (taskId: number): Task | undefined => {
    const task = this.tasks.find((task) => task.id === taskId);
    return task;
  };

  public static getAllTasks = (): Task[] => this.tasks;

  public static getPriorities = (): Priority[] => this.priorities;

  public static getAllGroups = (): Group[] => this.groups;

  public static getGroup = (groupId: number): Group | undefined => {
    const group = this.groups.find(group => group.id === groupId)
    if (group) {
      return group
    }

    return undefined
  }

  public static addGroup = (newGroup: Group): void => {
    const existGroup = this.groups.find(group => group.name.toLowerCase() === newGroup.name.toLowerCase())
    if (!existGroup) {
        this.groups.push(newGroup)
    }
  };

  public static removeGroup = (groupId: number): void => {
    this.groups = this.groups.filter(group => group.id !== groupId)
  };
}
