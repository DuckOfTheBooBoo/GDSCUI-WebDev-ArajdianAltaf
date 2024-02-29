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
    let todoTasks = [...tasks]

    // Sort if parameter is not null
    if (selectedFilter.sort !== null) {
        switch(selectedFilter.sort) {
            case 'priority-asc': {
                todoTasks.sort((aTask, bTask) => bTask.priority - aTask.priority).reverse()
                break
            }
            case 'priority-desc': {
                todoTasks.sort((aTask, bTask) => bTask.priority - aTask.priority)
                break
            }
            case 'due-asc': {
                todoTasks.sort((aTask, bTask) => {
                    const aTaskUnixTimestamp = Math.floor(aTask.dueDate.getTime() / 1000)
                    const bTaskUnixTimestamp = Math.floor(bTask.dueDate.getTime() / 1000)
                    return bTaskUnixTimestamp - aTaskUnixTimestamp
                }).reverse()
                break
            }
            case 'due-desc': {
                todoTasks.sort((aTask, bTask) => {
                    const aTaskUnixTimestamp = Math.floor(aTask.dueDate.getTime() / 1000)
                    const bTaskUnixTimestamp = Math.floor(bTask.dueDate.getTime() / 1000)
                    return bTaskUnixTimestamp - aTaskUnixTimestamp
                })
                break
            }
        }
    } else {
        console.log('Sort is null', todoTasks)
    }

    return todoTasks.filter(task => {
        const hasActiveFilter = (
            selectedFilter.group !== null ||
            selectedFilter.query !== null
        );

        // Check if theres no active filter
        if (!hasActiveFilter) {
            console.log('Has no active filter')
            return true
        }

        // Check if task.group is equal to selectedFilter.group
        if ((selectedFilter.group !== null && selectedFilter.group !== 0) && task.group !== selectedFilter.group) {
            console.log('Group didn\'t match')
            return false
        }

        // Check if query is inside task.title
        if (!task.title.includes(selectedFilter.query!)) {
            return false
        }

        console.log('All filter passed')
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
    <!-- <Button @click="fetchTasks">Fetch Task</Button> -->
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