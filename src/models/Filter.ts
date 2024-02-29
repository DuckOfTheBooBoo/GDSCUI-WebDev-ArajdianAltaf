export default interface Filter {
    group: number | null,
    query: string | null,
    sort: null | 'priority-asc' | 'priority-desc' | 'due-asc' | 'due-desc'
}