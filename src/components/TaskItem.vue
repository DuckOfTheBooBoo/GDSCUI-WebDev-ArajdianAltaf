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
import { reactive, computed } from 'vue'
import { TASKS_UPDATED } from '../constants'

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

const getDueDaysRemaining = (dueDate: Date): number => {
    const miliSecDiff = dueDate.getTime() - new Date().getTime();

    if (miliSecDiff < 0) {
        return 0;
    }

    const dayDiff = Math.floor(miliSecDiff / (1000 * 60 * 60 * 24)); // Correct calculation
    return dayDiff + 1
}

const dueInDays = computed(() => getDueDaysRemaining(task.dueDate))

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
        <Dialog class="!sm:w-[90vw]" :style="{ width: '50vw' }"
            v-model:visible="taskDetailDialogVisible" modal>
            <TaskDetail :task-id="taskId"></TaskDetail>
        </Dialog>

        <!-- Edit -->
        <Dialog :style="{ width: '50vw' }" v-model:visible="taskEditDialogVisible" modal>
            <template #container="{ closeCallback }">
                <TaskForm :close-callback="closeCallback" :addNew="false" :task-id="taskId" />
            </template>
        </Dialog>

        <div v-ripple class="w-full flex flex-row gap-2 shadow-md bg-white shadow-primary-200
    rounded-xl items-center px-2 py-3 hover:cursor-pointer hover:shadow-md hover:shadow-primary-300 transition-shadow
    hover:z-50 animate-fade-left animate-once animate-duration-[650ms] animate-delay-100"
            :class="task.completed ? '!shadow-gray-300' : ''">
            <Checkbox :pt="{
                box: ({ props, context }) => ({
                    class: [
                        'flex',
                        'items-center',
                        'justify-center',
                        // Size
                        'w-6',
                        'h-6',
                        // Shape
                        'rounded-md',
                        'border-2',
                        // Colors
                        {
                            'border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900': !context.checked && !props.invalid,
                            'border-gray-400 bg-gray-400 dark:border-primary-400 dark:bg-primary-400': context.checked
                        },
                        // Invalid State
                        { 'border-red-500 dark:border-red-400': props.invalid },
                        // States
                        {
                            'peer-hover:border-primary-500 dark:peer-hover:border-primary-400': !props.disabled && !context.checked && !props.invalid,
                            'peer-hover:bg-primary-600 dark:peer-hover:bg-primary-300 peer-hover:border-primary-700 dark:peer-hover:border-primary-300': !props.disabled && context.checked,
                            'peer-focus-visible:border-primary-500 dark:peer-focus-visible:border-primary-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400/20 dark:peer-focus-visible:ring-primary-300/20': !props.disabled,
                            'cursor-default opacity-60': props.disabled
                        },
                        // Transitions
                        'transition-colors',
                        'duration-200'
                    ]
                })
            }" class="mr-1" v-model="task.completed" @update:model-value="todoStore.toggleTaskStatus(taskId)" :binary="true" />

            <div class="flex flex-col flex-1 gap-1">
                <p class="font-bold text-base sm:text-xl" @click="taskDetailDialogVisible = true">{{ task?.title }}</p>
                <!-- Chips -->
                <div class="flex gap-1">
                    <!-- Group -->
                    <Tag :style="`background-color: ${taskGroup?.color};`" :class="task.completed ? '!bg-gray-600' : ''"
                        rounded>
                        <span class="text-[10px] sm:text-xs">{{ taskGroup?.name }}</span>
                    </Tag>

                    <!-- Priority -->
                    <Tag v-if="task?.priority === 1" severity="info" :class="task.completed ? '!bg-gray-600' : ''" rounded>
                        <span class="text-[10px] sm:text-xs">Low</span>
                    </Tag>
                    <Tag v-else-if="task.priority === 2" value="Medium" severity="warning"
                        :class="task.completed ? '!bg-gray-600' : ''" rounded>
                        <span class="text-[10px] sm:text-xs">Medium</span>
                    </Tag>
                    <Tag v-else-if="task.priority === 3" value="High" severity="danger"
                        :class="task.completed ? '!bg-gray-600' : ''" rounded>
                        <span class="text-[10px] sm:text-xs">High</span>
                    </Tag>

                    <!-- Due Date -->
                    <Tag icon="pi pi-calendar" :class="task.completed ? '!bg-gray-600' : '!bg-orange-600'" rounded>
                        <span v-if="dueInDays === 0" class="text-[10px] sm:text-xs">Due: Today</span>
                        <span v-else-if="dueInDays < 10" class="text-[10px] sm:text-xs">
                            Due: {{ dueInDays }}
                            <span v-if="dueInDays === 1">day</span>
                            <span v-else>days</span>
                        </span>
                        <span v-else class="text-[10px] sm:text-xs">
                            {{ task.dueDate ? task.dueDate.toLocaleDateString('en-GB') : '' }}
                        </span>
                    </Tag>
                </div>
            </div>

            <!-- Buttons -->

            <div class="">
                <div class="flex gap-1 flex-row">
                    <Button @click="taskEditDialogVisible = true" outlined icon="pi pi-pencil"
                        :class="task.completed ? '!text-gray-600 !border-gray-600' : ''" size="small"
                        :disabled="task.completed"></Button>
                    <Button icon="pi pi-trash" @click="deleteDialogFunc(taskId)" outlined severity="danger"
                        size="small"></Button>
                </div>
            </div>
        </div>
    </div>
</template>
