export default interface TaskFormData {
    title: string,
    description?: string,
    dueDate: Date,
    priority: number,
    group: number
}