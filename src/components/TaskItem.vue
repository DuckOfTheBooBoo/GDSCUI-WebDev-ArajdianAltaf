<script setup lang="ts">
import { ref, Ref } from 'vue'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import TaskForm from './TaskForm.vue'
import TaskDetail from './TaskDetail.vue'
import Group from '../models/Group'
import Task from '../models/Task'
import { useTodoStore } from '../stores/todoStores'
import { reactive } from 'vue'
import {TASKS_UPDATED} from '../constants'

// @ts-ignore
import { MqResponsive } from 'vue3-mq'

const props = defineProps<{
    taskId: number,
    deleteDialogFunc: Function
}>();

const todoStore = useTodoStore()

const task: Task = reactive({} as Task)
// if (task) {
Object.assign(task, todoStore.getTask(props.taskId)!)

const taskGroup: Group = reactive<Group>({} as Group)
Object.assign(taskGroup, todoStore.getGroup(task.group)!)

// if (!taskGroup.value) {
//     console.log('taskGroup is undefined', taskGroup.value)
// }

const taskDetailDialogVisible = ref(false)
const taskEditDialogVisible = ref(false)

todoStore.eventEmitter.on(TASKS_UPDATED, () => {
    const updatedTask = todoStore.getTask(props.taskId)
    
    if (updatedTask !== undefined) {
        if (task.group !== updatedTask.group) {
            const newGroup = todoStore.getGroup(updatedTask.group)!
            Object.assign(taskGroup, newGroup)
        }
    
        Object.assign(task, updatedTask)
    }
})

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
    hover:z-50 animate-fade-left animate-once animate-duration-[650ms] animate-delay-100" :class="task.completed ? '!shadow-gray-300' : ''">
            <Checkbox class="mr-1" v-model="task.completed" @click="todoStore.toggleTaskStatus(taskId)" :binary="true" />

            <div class="flex flex-col flex-1 gap-1">
                <p class="font-bold text-base sm:text-xl" @click="taskDetailDialogVisible = true">{{ task?.title }}</p>
                <!-- Chips -->
                <div class="flex gap-1">
                    <!-- Group -->
                    <Tag :style="`background-color: ${taskGroup?.color};`" :class="task.completed ? '!bg-gray-600' : ''" rounded>
                        <span class="text-[10px] sm:text-xs">{{ taskGroup?.name }}</span>
                    </Tag>

                    <!-- Priority -->
                    <Tag v-if="task?.priority === 1" severity="info" :class="task.completed ? '!bg-gray-600' : ''" rounded>
                        <span class="text-[10px] sm:text-xs">Low</span>
                    </Tag>
                    <Tag v-else-if="task.priority === 2" value="Medium" severity="warning" :class="task.completed ? '!bg-gray-600' : ''" rounded>
                        <span class="text-[10px] sm:text-xs">Medium</span>
                    </Tag>
                    <Tag v-else-if="task.priority === 3" value="High" severity="danger" :class="task.completed ? '!bg-gray-600' : ''" rounded>
                        <span class="text-[10px] sm:text-xs">High</span>
                    </Tag>

                    <!-- Due Date -->
                    <Tag icon="pi pi-calendar" :class="task.completed ? '!bg-gray-600' : '!bg-orange-600'" rounded>
                        <span class="text-[10px] sm:text-xs">{{ task?.dueDate.toLocaleDateString('en-GB') }}</span>
                    </Tag>
                </div>
            </div>

            <!-- Buttons -->

            <div class="">
                <div class="flex gap-1 flex-row">
                    <Button @click="taskEditDialogVisible = true" outlined icon="pi pi-pencil" :class="task.completed ? '!text-gray-600 !border-gray-600' : ''" size="small" :disabled="task.completed"></Button>
                    <Button icon="pi pi-trash" @click="deleteDialogFunc(taskId)" outlined severity="danger"
                        size="small"></Button>
                </div>
            </div>
        </div>
    </div>
</template>
