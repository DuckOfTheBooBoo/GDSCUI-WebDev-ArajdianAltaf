<script setup lang="ts">
import TaskGroup from './components/TaskGroup.vue'
import InlineMessage from 'primevue/inlinemessage';
import Dropdown from 'primevue/dropdown';
import CascadeSelect from 'primevue/cascadeselect';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import TaskForm from './components/TaskForm.vue';
import { useTodoStore } from './stores/todoStores'
import Filter from './models/Filter';
import Group from './models/Group';
import { ref, Ref, reactive, onMounted, computed } from 'vue';
import { GROUPS_UPDATED, TASKS_UPDATED } from './constants'
// @ts-ignore
import { MqResponsive } from 'vue3-mq'

const todoStore = useTodoStore()

const groups: Group[] = reactive<Group[]>([])

const filterGroups = computed(() => {
    return [
        { id: 0, name: 'None', color: '#000000' },
        ...groups
    ] as Group[]
})

const filterOptions = ref([
    {
        name: 'Priority',
        options: [
            { label: 'None', value: null },
            { label: 'Priority > Ascending', value: 'priority-asc' },
            { label: 'Priority > Descending', value: 'priority-desc' }
        ]
    },
    {
        name: 'Title',
        options: [
            { label: 'None', value: null },
            { label: 'Title > Ascending', value: 'title-asc' },
            { label: 'Title > Descending', value: 'title-desc' }
        ]
    },
    {
        name: 'Due date',
        options: [
            { label: 'None', value: null },
            { label: 'Due Date > Ascending', value: 'due-asc' },
            { label: 'Due Date > Descending', value: 'due-desc' }
        ]
    }
])

const getGroupData = (groupId: number): Group | undefined => filterGroups.value.find(group => group.id === groupId)

const selectedFilter: Ref<Filter> = ref({
    sort: '',
    group: 0,
    query: ''
})

const addNewTaskDialogVisible = ref(false)

const fetchGroups = () => {
    const newGroups = todoStore.getAllGroups()
    groups.splice(0, groups.length, ...newGroups)
}

onMounted(() => {
    fetchGroups()
    todoStore.eventEmitter.on(GROUPS_UPDATED, fetchGroups)
})
</script>

<template>
    <Dialog v-model:visible="addNewTaskDialogVisible" :style="{ width: '70%', maxWidth: '70%' }" modal>
        <template #container="{ closeCallback }">
            <TaskForm :close-callback="closeCallback" :addNew="true" />
        </template>
    </Dialog>
    <!-- Add Button -->
    <div class="fixed bottom-0 right-0 z-40">
        <Button @click="addNewTaskDialogVisible = true" class="m-5 shadow-3xl " size="large" rounded>
            <i class="pi pi-plus py-3 px-2"></i>
        </Button>
    </div>

    <div class="flex flex-col w-[100vw] h-[100vh] items-center">
        <div class="w-full max-w-3xl flex flex-col justify-center gap-1">
            <div class="flex flex-col m-1 p-3 gap-2 rounded-md bg-surface-50 border border-surface-200">
                <!-- SEARCH BAR -->
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-search"></i>
                    </InputGroupAddon>
                    <InputText placeholder="Search Task" v-model="selectedFilter.query" />
                </InputGroup>

                <div class="flex flex-row justify-between gap-2">
                    <!-- GROUP FILTER -->
                    <Dropdown v-model="selectedFilter.group" class="flex-1" :options="filterGroups"
                        placeholder="Group Filter" optionValue="id">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="">
                                <Tag :style="`background-color: ${getGroupData(slotProps.value)?.color}`">
                                    <span>{{ getGroupData(slotProps.value)?.name }}</span>
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
                    <CascadeSelect v-model="selectedFilter.sort" class="flex-1" :options="filterOptions" optionLabel="label"
                        optionGroupLabel="name" :optionGroupChildren="['options']" placeholder="Sort by"
                        optionValue="value">
                        <template #option="slotProps" class="w-full">
                            <div class="w-full">
                                <span>
                                    {{ slotProps.option.name }}
                                </span>
                                <div class="flex items-center">
                                    <span class="flex-2">
                                        {{ slotProps.option.label }}
                                    </span>
                                </div>
                            </div>
                        </template>
                    </CascadeSelect>
                </div>
            </div>
            <InlineMessage class="mx-3" severity="info">Click task title to show details</InlineMessage>

            <!-- TASK  -->
            <TaskGroup :sort="selectedFilter.sort" :query="selectedFilter.query" :group="selectedFilter.group" />
        </div>
    </div>
</template>

<style scoped></style>
