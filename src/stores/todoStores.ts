import {defineStore} from 'pinia'
import EventEmitter from 'eventemitter3'
import Task from '../models/Task'
import TaskFormData from '../models/TaskFormData'
import Group from '../models/Group'
import Priority from '../models/Priority'
import GroupFormData from '../models/GroupFormData'
import {GROUPS_UPDATED, TASKS_UPDATED} from '../constants'

export const useTodoStore = defineStore('todo', {
    state: () => ({
        tasks: [] as Task[],
        groups: [
            { name: "General", color: "", id: 1 },
            { name: "Work", color: "#3b82f6", id: 2 },
            { name: "School", color: "#facc15", id: 3 },
          ] as Group[],
        priorities: [
            { name: "Low", value: 1 },
            { name: "Medium", value: 2 },
            { name: "High", value: 3 },
          ] as Priority[],
        eventEmitter: new EventEmitter(),
    }),
    getters: {
        getTask: (state) => (taskId: number): Task | undefined => state.tasks.find(task => task.id === taskId),
        getAllTasks: (state) => () => state.tasks,
        getPriorities: (state) => () => state.priorities,
        getAllGroups: (state) => () => state.groups,
        getGroup: (state) => (groupId: number) => state.groups.find(group => group.id === groupId)
    },
    actions: {
        getNewId(target: 'task' | 'group'): number | undefined {
            if (target === 'task') {
                const ids = this.tasks.map(task => task.id)
                const max = Math.max(...ids)
                return max > 0 ? max + 1 : 1
            } else if (target === 'group') {
                const ids = this.groups.map(group => group.id)
                const max = Math.max(...ids)
                return max > 0 ? max + 1 : 1
            }

            return undefined
        },
        addTask(newTask: TaskFormData): number {
            const task: Task = {
                id: this.getNewId('task')!,
                completed: false,
                ...newTask
            }
            this.tasks.push(task)
            this.eventEmitter.emit(TASKS_UPDATED)
            this.saveToLocalStorage()
            return task.id
        },
        updateTask(updatedTask: Task): void {
            const taskIndex = this.tasks.findIndex((task) => task.id === updatedTask.id);
            this.tasks[taskIndex] = updatedTask;
            this.eventEmitter.emit(TASKS_UPDATED)
            this.saveToLocalStorage()
        },
        toggleTaskStatus(taskId: number): void {
            const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
            this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed
            this.eventEmitter.emit(TASKS_UPDATED)
            this.saveToLocalStorage()
        },
        removeTask(taskId: number): void {
            this.tasks = this.tasks.filter(task => task.id !== taskId)
            this.eventEmitter.emit(TASKS_UPDATED)
            this.saveToLocalStorage()
        },
        addGroup(newGroupData: GroupFormData): void {
            const existGroup = this.groups.find(group => group.name.toLowerCase() === newGroupData.name.toLowerCase())
            if (!existGroup) {
                const newGroup: Group = {
                    id: this.getNewId('group')!,
                    ...newGroupData
                }
                this.groups.push(newGroup)
                this.eventEmitter.emit(GROUPS_UPDATED)
                this.saveToLocalStorage()
            }
        },
        removeGroup(groupId: number): void {
            this.groups = this.groups.filter(group => group.id !== groupId)
            this.saveToLocalStorage()
        },
        getFromLocalStorage(): void {
            const jsonTasks = localStorage.getItem('tasks')
            if (jsonTasks) {
                const parsedTasks = JSON.parse(jsonTasks) as Task[]
                this.tasks = parsedTasks.map(task => {
                    const dueDate = new Date(task.dueDate)

                    return {
                        ...task,
                        dueDate: dueDate
                    }
                })
            }

            const jsonGroups = localStorage.getItem('groups')
            if (jsonGroups) {
                this.groups = JSON.parse(jsonGroups) as Group[]
            }
        },
        saveToLocalStorage(): void {
            // Serialize
            const serializedTasks = JSON.stringify(this.tasks)
            const serializedGroups = JSON.stringify(this.groups)

            localStorage.setItem('tasks', serializedTasks)
            localStorage.setItem('groups', serializedGroups)
        }
    }
})