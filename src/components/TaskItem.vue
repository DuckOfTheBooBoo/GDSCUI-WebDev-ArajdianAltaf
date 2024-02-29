<script setup lang="ts">
import { ref, Ref } from 'vue'
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
import Group from '../models/Group'
import Task from '../models/Task'
import { useTodoStore } from '../stores/todoStores'
import { reactive } from 'vue'

// @ts-ignore
import { MqResponsive } from 'vue3-mq'

const props = defineProps<{
    taskId: number,
    deleteDialogFunc: Function
}>();

const todoStore = useTodoStore()

const otherOptions = [
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: null
    }
]

let task: Task = reactive({} as Task)
if (task) {
    task = todoStore.getTask(props.taskId)!
} else {
    console.log('Task is undefined', task)
}

const taskGroup: Ref<Group> = ref({} as Group)
taskGroup.value = todoStore.getGroup(task.group)!

if (!taskGroup.value) {
    console.log('taskGroup is undefined', taskGroup.value)
}

const taskDetailDialogVisible = ref(false)
const taskEditDialogVisible = ref(false)

</script>

<template>
    <div class="">
        <!-- TODO: Make it responsive -->
        <!-- Detail -->
        <Dialog class="!sm:w-[90vw]" :style="{ width: '90vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            v-model:visible="taskDetailDialogVisible" modal>
            <TaskDetail :task-id="taskId"></TaskDetail>
        </Dialog>

        <!-- Edit -->
        <Dialog :style="{ width: '90vw' }" v-model:visible="taskEditDialogVisible" modal>
            <template #container="{ closeCallback }">
                <TaskForm :close-callback="closeCallback" :addNew="false" :task-id="taskId" />
            </template>
        </Dialog>

        <div v-ripple class="w-full flex flex-row gap-2 shadow-md bg-white shadow-primary-200
    rounded-xl items-center px-2 py-3 hover:cursor-pointer hover:shadow-md hover:shadow-primary-300 transition-shadow
    hover:z-50 animate-fade-left animate-once animate-duration-[650ms] animate-delay-100">
            <Checkbox class="mr-1" v-model="task.completed" :binary="true" />

            <div class="flex flex-col flex-1 gap-1">
                <p class="font-bold text-base sm:text-xl" @click="taskDetailDialogVisible = true">{{ task?.title }}</p>
                <!-- Chips -->
                <div class="flex gap-1">
                    <!-- Group -->
                    <!-- TODO: Force re render this -->
                    <Tag :style="`background-color: ${taskGroup?.color};`" rounded>
                        <span class="text-[10px] sm:text-xs">{{ taskGroup?.name }}</span>
                    </Tag>

                    <!-- Priority -->
                    <Tag v-if="task?.priority === 1" severity="info" rounded>
                        <span class="text-[10px] sm:text-xs">Low</span>
                    </Tag>
                    <Tag v-else-if="task.priority === 2" value="Medium" severity="warning" rounded>
                        <span class="text-[10px] sm:text-xs">Medium</span>
                    </Tag>
                    <Tag v-else-if="task.priority === 3" value="High" severity="danger" rounded>
                        <span class="text-[10px] sm:text-xs">High</span>
                    </Tag>

                    <!-- Due Date -->
                    <Tag icon="pi pi-calendar" class="!bg-orange-600" rounded>
                        <span class="text-[10px] sm:text-xs">{{ task?.dueDate.toLocaleDateString('en-GB') }}</span>
                    </Tag>
                </div>
            </div>

            <!-- Buttons -->
            <!-- <MqResponsive target="sm-md"> -->
                <div class="">
                    <div class="flex gap-1 flex-row">
                        <Button @click="taskEditDialogVisible = true" outlined icon="pi pi-pencil" size="small"></Button>
                        <Button outlined icon="pi pi-trash" @click="deleteDialogFunc(taskId)" severity="danger" size="small"></Button>
                    </div>
                </div>
            <!-- </MqResponsive> -->
            <!-- <MqResponsive target="sm-">
                <SplitButton class="self-end" label="Edit" :model="otherOptions" @click="taskEditDialogVisible = true">
                    <i class="pi pi-pencil"></i>
                </SplitButton>
            </MqResponsive> -->
        </div>
    </div>
</template>
