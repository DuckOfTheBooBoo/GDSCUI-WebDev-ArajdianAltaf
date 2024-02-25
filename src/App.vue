<script setup lang="ts">
import TaskGroup from './components/TaskGroup.vue'
import ConfirmDialog from 'primevue/confirmdialog';

// @ts-ignore
const data = [{
    taskId: "928822",
    title: "Buy groceries",
    type: "Shopping",
    priority: 1
}]

</script>

<template>
    <ConfirmDialog></ConfirmDialog>
    <div class="flex flex-col w-[100vw] h-[100vh] items-center">
        <div class="w-full max-w-3xl flex flex-col justify-center">
            <h1>Tasks</h1>
            <TaskGroup />
        </div>
    </div>
</template>

<style scoped>
</style>
