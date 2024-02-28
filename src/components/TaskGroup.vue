<script setup lang="ts">
import TaskItem from './TaskItem.vue'
import { ref, onBeforeMount, onMounted, computed } from 'vue';
import Task from '../models/Task'
import { useTodoStore } from '../stores/todoStores';

const tasks = ref<Task[]>([])
const todoStore = useTodoStore()

// const forceUpdate = ref(0)

const fetchTasks = () => {
    console.log('Fetching task...')
    const newTasks = todoStore.getAllTasks()
    console.log(newTasks)
    tasks.value = newTasks
    // forceUpdate.value++
}


onMounted(() => {
    fetchTasks()
    todoStore.eventEmitter.on('tasksUpdated', fetchTasks)
})
</script>

<template>
    <div v-if="tasks.length > 0" class="mx-3 flex flex-col gap-2">
        <Button @click="fetchTasks">Fetch Task</Button>
        <TaskItem v-for="task in tasks"
            :task-id="task.id"
            :key="task.id"
        />
    </div>
    <div v-else class="flex justify-center items-center">
        <p class="text-gray-400 my-10">Such empty... Create a new task would ya?</p>
    </div>
</template>

<style scoped></style>