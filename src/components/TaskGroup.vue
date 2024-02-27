<script setup lang="ts">
import TaskItem from './TaskItem.vue'
import TodoService from '../services/TodoService';

const tasks = TodoService.getAllTasks()
</script>

<template>
    <div class="mx-3 flex flex-col gap-2">        
        <TaskItem v-for="task in tasks"
            :title="task.title"
            :due-date="task.dueDate"
            :priority="task.priority"
            :group="task.group"
            :is-completed-prop="task.completed"
        />
    </div>
</template>

<style scoped></style>