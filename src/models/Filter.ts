export default interface Filter {
    group: number | null,
    query: string | null,
    sort: '' | 'priority-asc' | 'priority-desc' | 'due-asc' | 'due-desc' | 'title-asc' | 'title-desc'
}