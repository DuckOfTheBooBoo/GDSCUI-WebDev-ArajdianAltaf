<script setup lang="ts">
defineProps({
    isDone: Boolean,
    title: String,
})
</script>

<template>
    <div>
        <span>{{title}}</span>
        
    </div>
</template>