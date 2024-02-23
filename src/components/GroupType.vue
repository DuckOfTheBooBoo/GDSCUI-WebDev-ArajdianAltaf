<script setup lang="ts">
defineProps({
    groupName: String,
})
</script>

<template>
    <div class="ring-2 p-2 rounded-sm">
        <span class="">{{groupName}}</span>
    </div>
</template>