import {defineStore} from 'pinia'
import EventEmitter from 'eventemitter3'
import Task from '../models/Task'
import TaskFormData from '../models/TaskFormData'
import Group from '../models/Group'

export const useTodoStore = defineStore('todo', {
    state: () => ({
        tasks: [
            { id: 1, title: 'Feed dog', completed: false, dueDate: new Date(), group: 1, priority: 3 },
            { id: 2, title: 'Feed cat', completed: false, dueDate: new Date(), group: 1, priority: 1 }
        ],
        groups: [
            { name: "General", color: "", id: 1 },
            { name: "Work", color: "#3b82f6", id: 2 },
            { name: "School", color: "#facc15", id: 3 },
          ],
        priorities: [
            { name: "Low", value: 1 },
            { name: "Medium", value: 2 },
            { name: "High", value: 3 },
          ],
        eventEmitter: new EventEmitter(),
    }),
    getters: {
        getTask: (state) => (taskId: number) => state.tasks.find(task => task.id === taskId),
        getAllTasks: (state) => () => state.tasks,
        getPriorities: (state) => () => state.priorities,
        getAllGroups: (state) => () => state.groups,
        getGroup: (state) => (groupId: number) => state.groups.find(group => group.id === groupId)
    },
    actions: {
        getNewId() {
            const ids = this.tasks.map(task => task.id)
            return Math.max(...ids) + 1
        },
        addTask(newTask: TaskFormData): number {
            const task: Task = {
                id: this.getNewId(),
                completed: false,
                ...newTask
            }
            this.tasks.push(task)
            this.eventEmitter.emit('taskUpdated')
            return task.id
        },
        updateTask(updatedTask: Task): void {
            const taskIndex = this.tasks.findIndex((task) => task.id === updatedTask.id);
            this.tasks[taskIndex] = updatedTask;
            this.eventEmitter.emit('tasksUpdated')
        },
        removeTask(taskId: number): void {
            this.tasks = this.tasks.filter(task => task.id !== taskId)
            this.eventEmitter.emit('tasksUpdated')
        },
        addGroup(newGroup: Group): void {
            const existGroup = this.groups.find(group => group.name.toLowerCase() === newGroup.name.toLowerCase())
            if (!existGroup) {
                this.groups.push(newGroup)
            }
        },
        removeGroup(groupId: number): void {
            this.groups = this.groups.filter(group => group.id !== groupId)
        }
    }
})