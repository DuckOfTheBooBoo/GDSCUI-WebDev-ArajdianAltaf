<script setup lang="ts">
import TaskItem from './TaskItem.vue'
</script>

<template>
    <div class="mx-3 flex flex-col gap-2">
        <TaskItem 
            :title="'Task Title'"
            :priority=3
        />
    </div>
</template>

<style scoped></style>