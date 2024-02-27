<script setup lang="ts">
import TaskItem from './TaskItem.vue'
import { ref, onMounted, onBeforeMount } from 'vue';
import Task from '../models/Task'
import { useTodoStore } from '../stores/todoStores';

const tasks = ref<Task[]>([])
const todoStore = useTodoStore()

const fetchTasks = () => {
    console.log('Fetching task...')
    tasks.value = todoStore.getAllTasks()
}

onMounted(() => {
    fetchTasks()
    todoStore.eventEmitter.on('taskUpdated', fetchTasks)
})
</script>

<template>
    <div class="mx-3 flex flex-col gap-2">
        <Button @click="fetchTasks">Fetch Task</Button>
        <TaskItem v-for="task in tasks"
            :task-id="task.id"
            :title="task.title"
            :due-date="task.dueDate"
            :priority="task.priority"
            :group="task.group"
            :is-completed-prop="task.completed"
        />
    </div>
</template>

<style scoped></style>