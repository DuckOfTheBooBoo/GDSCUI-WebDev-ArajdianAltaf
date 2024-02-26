<script setup lang="ts">
import TaskGroup from './components/TaskGroup.vue'
import ConfirmDialog from 'primevue/confirmdialog';
import Toolbar from 'primevue/toolbar';
import InlineMessage from 'primevue/inlinemessage';
import Dropdown from 'primevue/dropdown';
import CascadeSelect from 'primevue/cascadeselect';
import { ref } from 'vue';
// @ts-ignore
const data = [{
    taskId: "928822",
    title: "Buy groceries",
    type: "Shopping",
    priority: 1
}]

const groupFilter = ref([
    { name: 'General', color: 'bg-red-500' },
    { name: 'School', color: 'bg-blue-500' }
])

const filterOptions = ref([
    {
        name: 'Priority',
        options: [
            { label: 'Ascending', value: 'priority-asc' },
            { label: 'Descending', value: 'priority-desc' }
        ]
    },
    {
        name: 'Due date',
        options: [
            { label: 'Ascending', value: 'due-asc' },
            { label: 'Descending', value: 'due-desc' }
        ]
    }
])

</script>

<template>
    <ConfirmDialog></ConfirmDialog>
    <div class="flex flex-col w-[100vw] h-[100vh] items-center">
        <div class="w-full max-w-3xl flex flex-col justify-center gap-1">
            <Toolbar class="flex flex-row">
                <template #start>
                    <!-- Group Filter -->
                    <Dropdown :options="groupFilter" placeholder="Group Filter">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="">
                                <Tag :class="slotProps.value.color">
                                    <span>{{ slotProps.value.name }}</span>
                                </Tag>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <Tag :class="slotProps.option.color">
                                <span>{{ slotProps.option.name }}</span>
                            </Tag>
                        </template>
                    </Dropdown>
                </template>
                <template #center>
                    <CascadeSelect :options="filterOptions" optionLabel="label" optionGroupLabel="name"
                        :optionGroupChildren="['options']" placeholder="Sort by">
                        <template #option="slotProps">
                            <div class="w-full">
                                <span>{{ slotProps.option.name }}</span>
                                <div class="flex items-center">
                                    <span class="flex-2">
                                        {{ slotProps.option.label }}
                                        <i v-if="slotProps.option.label === 'Ascending'" class="pi pi-chevron-up">  </i>
                                        <i v-else-if="slotProps.option.label === 'Descending'" class="pi pi-chevron-down">  </i>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </CascadeSelect>
                </template>
                <template #end>
                    <Button icon="pi pi-plus" label="Add Task"></Button>
                </template>
            </Toolbar>
            <InlineMessage severity="info">Click task title to show details</InlineMessage>
            <TaskGroup />

        </div>
    </div>
</template>

<style scoped></style>
