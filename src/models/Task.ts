export default interface Task {
    id: number,
    title: string,
    description?: string,
    group: number,
    priority: number,
    dueDate: Date,
    completed: boolean
}
