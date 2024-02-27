<script setup lang="ts">
import TaskGroup from './components/TaskGroup.vue'
import ConfirmDialog from 'primevue/confirmdialog';
import Toolbar from 'primevue/toolbar';
import InlineMessage from 'primevue/inlinemessage';
import Dropdown from 'primevue/dropdown';
import CascadeSelect from 'primevue/cascadeselect';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import TaskForm from './components/TaskForm.vue';
import TodoService from './services/TodoService'

import { ref } from 'vue';
// @ts-ignore
import { MqResponsive } from 'vue3-mq'
// @ts-ignore
const data = [{
    taskId: "928822",
    title: "Buy groceries",
    type: "Shopping",
    priority: 1
}]

const groups = TodoService.getAllGroups()

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

const addNewTaskDialogVisible = ref(false)

</script>

<template>
    <Dialog v-model:visible="addNewTaskDialogVisible" modal>
        <template #container="{closeCallback}">
            <TaskForm :close-callback="closeCallback" :addNew="true" />
        </template>
    </Dialog>
    <!-- Add Button -->
    <MqResponsive target="sm-">
        <div class="absolute bottom-0 right-0">
            <Button @click="addNewTaskDialogVisible=true" class="m-5 shadow-3xl " size="large" rounded>
                <i class="pi pi-plus py-3 px-2"></i>
            </Button>
        </div>
    </MqResponsive>

    <ConfirmDialog></ConfirmDialog>

    <div class="flex flex-col w-[100vw] h-[100vh] items-center">
        <div class="w-full max-w-3xl flex flex-col justify-center gap-1">
            <MqResponsive target="sm-">
                <div class="flex flex-col m-1 p-3 gap-2 rounded-md bg-surface-50 border border-surface-200">
                    <!-- SEARCH BAR -->
                    <InputGroup>
                        <InputGroupAddon>
                            <i class="pi pi-search"></i>
                        </InputGroupAddon>
                        <InputText placeholder="Search Task" />
                    </InputGroup>

                    <div class="flex flex-row justify-between gap-2">
                        <!-- GROUP FILTER -->
                        <Dropdown class="flex-1" :options="groups" placeholder="Group Filter">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="">
                                    <Tag :style="`background-color: ${slotProps.value.color}`">
                                        <span>{{ slotProps.value.name }}</span>
                                    </Tag>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <Tag :style="`background-color: ${slotProps.option.color}`">
                                    <span>{{ slotProps.option.name }}</span>
                                </Tag>
                            </template>
                        </Dropdown>


                        <!-- SORT FILTER -->
                        <CascadeSelect class="flex-1" :options="filterOptions" optionLabel="label" optionGroupLabel="name"
                            :optionGroupChildren="['options']" placeholder="Sort by">
                            <template #option="slotProps">
                                <div class="w-full">
                                    <span>{{ slotProps.option.name }}</span>
                                    <div class="flex items-center">
                                        <span class="flex-2">
                                            {{ slotProps.option.label }}
                                            <i v-if="slotProps.option.label === 'Ascending'" class="pi pi-chevron-up"> </i>
                                            <i v-else-if="slotProps.option.label === 'Descending'"
                                                class="pi pi-chevron-down">
                                            </i>
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </CascadeSelect>
                    </div>

                </div>
            </MqResponsive>

            <MqResponsive target="md+">
                <Toolbar class="">
                    <!-- Group Filter -->
                    <template #start>
                        <Dropdown :options="groups" placeholder="Group Filter">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="">
                                    <Tag :style="`background-color: ${slotProps.value.color}`">
                                        <span>{{ slotProps.value.name }}</span>
                                    </Tag>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <Tag :style="`background-color: ${slotProps.option.color}`">
                                    <span>{{ slotProps.option.name }}</span>
                                </Tag>
                            </template>
                        </Dropdown>
                    </template>

                    <!-- Search filter -->
                    <template #center>
                        <InputGroup>
                            <InputGroupAddon>
                                <i class="pi pi-search"></i>
                            </InputGroupAddon>
                            <InputText placeholder="Search Task" />
                        </InputGroup>
                    </template>

                    <!-- Sort by filter -->
                    <template #end>
                        <CascadeSelect :options="filterOptions" optionLabel="label" optionGroupLabel="name"
                            :optionGroupChildren="['options']" placeholder="Sort by">
                            <template #option="slotProps">
                                <div class="w-full">
                                    <span>{{ slotProps.option.name }}</span>
                                    <div class="flex items-center">
                                        <span class="flex-2">
                                            {{ slotProps.option.label }}
                                            <i v-if="slotProps.option.label === 'Ascending'" class="pi pi-chevron-up"> </i>
                                            <i v-else-if="slotProps.option.label === 'Descending'"
                                                class="pi pi-chevron-down">
                                            </i>
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </CascadeSelect>
                    </template>
                </Toolbar>
            </MqResponsive>

            <InlineMessage class="mx-3" severity="info">Click task title to show details</InlineMessage>

            <!-- TASK  -->
            <TaskGroup />
        </div>
    </div>
</template>

<style scoped></style>
