<script setup lang="ts">
import TaskItem from './TaskItem.vue'
import { ref, onMounted, computed, reactive } from 'vue';
import Task from '../models/Task'
import { useTodoStore } from '../stores/todoStores';
import Filter from '../models/Filter';

const props: Filter = defineProps<Filter>()

let tasks: Task[] = reactive([] as Task[])
const todoStore = useTodoStore()


const fetchTasks = () => {
    console.log('Fetching task...')
    const newTasks = todoStore.getAllTasks()
    console.log(newTasks)
    tasks.splice(0, tasks.length, ...newTasks)
}

const filterAndSortTasks = (tasks: Task[], selectedFilter: Filter): Task[] => {
    let todoTasks = tasks

    // Sort if parameter is not null
    if (selectedFilter.sort !== null) {
        switch(selectedFilter.sort) {
            case 'priority-asc': {
                todoTasks = tasks.sort((aTask, bTask) => bTask.priority - aTask.priority).reverse()
                break
            }
            case 'priority-desc': {
                todoTasks = tasks.sort((aTask, bTask) => bTask.priority - aTask.priority)
                break
            }
            case 'due-asc': {
                todoTasks = tasks.sort((aTask, bTask) => {
                    const aTaskUnixTimestamp = Math.floor(aTask.dueDate.getTime() / 1000)
                    const bTaskUnixTimestamp = Math.floor(bTask.dueDate.getTime() / 1000)
                    return bTaskUnixTimestamp - aTaskUnixTimestamp
                }).reverse()
                break
            }
            case 'due-desc': {
                todoTasks = tasks.sort((aTask, bTask) => {
                    const aTaskUnixTimestamp = Math.floor(aTask.dueDate.getTime() / 1000)
                    const bTaskUnixTimestamp = Math.floor(bTask.dueDate.getTime() / 1000)
                    return bTaskUnixTimestamp - aTaskUnixTimestamp
                })
                break
            }
        }
    }

    return todoTasks.filter(task => {
        const hasActiveFilter = (
            selectedFilter.group !== null ||
            selectedFilter.query !== null
        );

        if (!hasActiveFilter) {
            return true
        }

        if (selectedFilter.group !== null && task.group !== selectedFilter.group) {
            return false
        }

        if (selectedFilter.query !== null) {
            const regex = new RegExp(selectedFilter.query)
            return regex.test(task.title)
        }

        return true;
    })
}

const filteredTasks = computed(() => filterAndSortTasks(tasks, props))


onMounted(() => {
    fetchTasks()
    todoStore.eventEmitter.on('tasksUpdated', fetchTasks)
})
</script>

<template>
    <Button @click="fetchTasks">Fetch Task</Button>
    <div v-if="tasks.length > 0" class="mx-3 flex flex-col gap-2">
        <TaskItem v-for="task in filteredTasks"
            :task-id="task.id"
            :key="task.id"
        />
    </div>
    <div v-else class="flex justify-center items-center flex-col gap-3">
        <img class="w-64" src="../assets/doge.png" alt="Doge">
        <p class="text-gray-400">Such empty... Create a new task would ya?</p>
    </div>
</template>

<style scoped></style>