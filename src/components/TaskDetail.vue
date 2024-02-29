<script setup lang="ts">
import Tag from 'primevue/tag';
import { useTodoStore } from '../stores/todoStores';
import { reactive, Ref, ref } from 'vue';
import Task from '../models/Task';
import Group from '../models/Group';

const props = defineProps<{
    taskId: number
}>()

const todoStore = useTodoStore()

let task: Task = reactive({} as Task)
if (task) {
    task = todoStore.getTask(props.taskId)!
} else {
    console.log('Task is undefined', task)
}

const taskGroup: Ref<Group> = ref({} as Group)
taskGroup.value =  todoStore.getGroup(task.group)!

if (!taskGroup.value) {
    console.log('taskGroup is undefined', taskGroup.value)
}

</script>

<template>
    <p class="font-bold text-3xl mb-2">{{ task.title }}</p>
    <div class="flex gap-1 mb-5">
        <!-- Group -->
        <Tag :style="`background-color: ${taskGroup?.color};`" rounded>
            <span class="text-xs">{{ taskGroup?.name }}</span>
        </Tag>

        <!-- Priority -->
        <Tag v-if="task.priority === 1" severity="info" rounded>
            <span class="text-xs">Low</span>
        </Tag>
        <Tag v-else-if="task.priority === 2" value="Medium" severity="warning" rounded>
            <span class="text-xs">Medium</span>
        </Tag>
        <Tag v-else-if="task.priority === 3" value="High" severity="danger" rounded>
            <span class="text-xs">High</span>
        </Tag>

        <!-- Due Date -->
        <Tag icon="pi pi-calendar" class="!bg-orange-600" rounded>
            <span class="text-xs">{{ task?.dueDate.toLocaleDateString('en-GB') }}</span>
        </Tag>
    </div>
    <p class="font-bold text-xl">Description</p>
    <p v-if="task?.description">{{ task?.description }}</p>
    <p v-else class="text-gray-400">No description provided</p>
</template>