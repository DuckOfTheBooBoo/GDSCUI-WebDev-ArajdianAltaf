<script setup lang="ts">
import GroupType from './GroupType.vue'
import Checkbox from 'primevue/checkbox'
defineProps({
    title: String,
    subTask: Array,
    dueDate: Date,
    groupType: String,
    priority: String
})
</script>

<template>
    <div class="flex flex-row ring-2 rounded-md">
        <Checkbox :binary="false"/>
        <span>{{ title }}</span>
        <GroupType :groupName="'General'" />
    </div>
</template>
