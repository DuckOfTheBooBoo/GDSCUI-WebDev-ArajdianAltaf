<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import SplitButton from 'primevue/splitbutton'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import TaskForm from './TaskForm.vue'
import TaskDetail from './TaskDetail.vue'
import TodoService from '../services/TodoService'
import Group from '../models/Group'

// @ts-ignore
import { MqResponsive } from 'vue3-mq'

const confirm = useConfirm()

const deleteDialog = () => {
    confirm.require({
        group: 'headless',
        message: 'Are you sure you want to delete this task?',
        header: 'Confirmation',
        accept: () => { },
        reject: () => { }
    })
}

const props = defineProps<{
    title: string,
    // subTask: rray,
    dueDate: Date,
    group: number,
    priority: number,
    isCompletedProp: boolean
}>()

const isCompleted = ref(props.isCompletedProp)

const otherOptions = [
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: deleteDialog
    }
]

const taskGroup: Group = TodoService.getGroup(props.group)!

const taskDetailDialogVisible = ref(false)
const taskEditDialogVisible = ref(false)
// const priorities = ref([
//     { label: 'Low', value: 'low'},
//     { label: 'Medium', value: 'medium'},
//     { label: 'High', value: 'high'}
// ]);
// const selectedPriority = ref('')
// const groups = [
//     {name: 'General', color: 'bg-red-500'},
//     {name: 'Work', color: 'bg-blue-500'},
//     {name: 'School', color: 'bg-yellow-400'},
// ]

</script>

<template>
    <!-- TODO: Make it responsive -->
    <!-- Detail -->
    <Dialog class="!sm:w-[90vw]" :style="{ width: '90vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        v-model:visible="taskDetailDialogVisible" modal>
        <TaskDetail></TaskDetail>
    </Dialog>

    <!-- Edit -->
    <Dialog :style="{ width: '90vw' }" v-model:visible="taskEditDialogVisible" modal>
        <template #container="{closeCallback}">
            <TaskForm :close-callback="closeCallback" :addNew="false" />
        </template>
    </Dialog>
    
    <div v-ripple class="w-full flex flex-row gap-2 shadow-md bg-white shadow-primary-200
    rounded-xl items-center px-2 py-3 hover:cursor-pointer hover:shadow-md hover:shadow-primary-300 transition-shadow">
        <Checkbox class="mr-1" v-model="isCompleted" :binary="true" />

        <div class="flex flex-col flex-1 gap-1">
            <p class="font-bold text-base sm:text-xl" @click="taskDetailDialogVisible = true">{{ title }}</p>
            <!-- Chips -->
            <div class="flex gap-1">
                <!-- Group -->
                <Tag :value="taskGroup.name" :style="`background-color: ${taskGroup.color};`" rounded>
                    <span class="text-xs">General</span>
                </Tag>

                <!-- Priority -->
                <Tag v-if="priority === 1" severity="info" rounded>
                    <span class="text-xs">Low</span>
                </Tag>
                <Tag v-else-if="priority === 2" value="Medium" severity="warning" rounded>
                    <span class="text-xs">Medium</span>
                </Tag>
                <Tag v-else-if="priority === 3" value="High" severity="danger" rounded>
                    <span class="text-xs">High</span>
                </Tag>

                <!-- Due Date -->
                <Tag icon="pi pi-calendar" class="!bg-orange-600" rounded>
                    <span class="text-xs">{{ dueDate.toLocaleString('en-GB') }}</span>
                </Tag>
            </div>
        </div>


        <!-- TODO: ConfirmDialog looks terrible in mobile view -->
        <ConfirmDialog group="headless">
            <template #container="{ message, acceptCallback, rejectCallback }">
                <div class="flex flex-col items-center p-5 bg-surface-0 dark:bg-surface-700 rounded-md">
                    <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                    <p class="mb-0">{{ message.message }}</p>
                    <div class="flex items-center gap-2 mt-4">
                        <Button label="Delete" severity="danger" @click="acceptCallback"></Button>
                        <Button label="Cancel" outlined @click="rejectCallback"></Button>
                    </div>
                </div>
            </template>
        </ConfirmDialog>
        <!-- Buttons -->
        <MqResponsive target="md+">
            <div class="">
                <div class="flex gap-1 flex-col sm:flex-row">
                    <Button @click="taskEditDialogVisible = true" outlined icon="pi pi-pencil" size="small"></Button>
                    <Button outlined icon="pi pi-trash" @click="deleteDialog" severity="danger" size="small"></Button>
                </div>
            </div>
        </MqResponsive>
        <MqResponsive target="sm-">
            <SplitButton class="self-end" label="Edit" :model="otherOptions" @click="taskEditDialogVisible = true">
                <i class="pi pi-pencil"></i>
            </SplitButton>
        </MqResponsive>
    </div>
</template>
