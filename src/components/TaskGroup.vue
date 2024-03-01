<script setup lang="ts">
import TaskItem from './TaskItem.vue'
import { ref, onMounted, computed, reactive } from 'vue';
import Task from '../models/Task'
import { useTodoStore } from '../stores/todoStores';
import Filter from '../models/Filter';
import { useConfirm } from 'primevue/useconfirm';
import ConfirmDialog from 'primevue/confirmdialog';
// import 'animate.css'
import { TASKS_UPDATED } from '../constants';

const props: Filter = defineProps<Filter>()

const confirm = useConfirm()

const deleteDialog = (taskId: number): void => {
    confirm.require({
        group: 'headless',
        message: 'Are you sure you want to delete this task?',
        header: 'Confirmation',
        accept: () => todoStore.removeTask(taskId),
        reject: () => { }
    })
}


let tasks: Task[] = reactive([] as Task[])

const todoStore = useTodoStore()

const fetchTasks = () => {
    console.log('Fetching task...')
    const newTasks = todoStore.getAllTasks()
    console.log(newTasks)
    tasks.splice(0, tasks.length, ...newTasks)
}

const filterAndSortTasks = (tasks: Task[], selectedFilter: Filter): Task[] => {
    let todoTasks = [...tasks]

    // Sort uncompleted first
    todoTasks.sort((aTask, bTask) => {
        // If a is completed and b is not, b comes first 
        if (aTask.completed && !bTask.completed) {
            return 1;
        }
        // If b is completed and a is not, a comes first
        else if (!aTask.completed && bTask.completed) {
            return -1;
        }
        // Do not change in order
        else {
            return 0;
        }
    })

    // Sort if parameter is not null
    if (Boolean(selectedFilter.sort)) {
        switch (selectedFilter.sort) {
            case 'priority-asc': {
                todoTasks.sort((aTask, bTask) => bTask.priority - aTask.priority).reverse()
                break
            }
            case 'priority-desc': {
                todoTasks.sort((aTask, bTask) => bTask.priority - aTask.priority)
                break
            }
            case 'due-asc': {
                todoTasks.sort((aTask, bTask) => {
                    const aTaskUnixTimestamp = Math.floor(aTask.dueDate.getTime() / 1000)
                    const bTaskUnixTimestamp = Math.floor(bTask.dueDate.getTime() / 1000)
                    return bTaskUnixTimestamp - aTaskUnixTimestamp
                }).reverse()
                break
            }
            case 'due-desc': {
                todoTasks.sort((aTask, bTask) => {
                    const aTaskUnixTimestamp = Math.floor(aTask.dueDate.getTime() / 1000)
                    const bTaskUnixTimestamp = Math.floor(bTask.dueDate.getTime() / 1000)
                    return bTaskUnixTimestamp - aTaskUnixTimestamp
                })
                break
            }
            case 'title-asc': {
                todoTasks.sort((aTask, bTask) => {
                    if (aTask.title > bTask.title) {
                        return -1
                    }
                    if (bTask.title > aTask.title) {
                        return 1
                    }
                    return  0
                })
                break
            }
            case 'title-desc': {
                todoTasks.sort((aTask, bTask) => {
                    if (aTask.title > bTask.title) {
                        return -1
                    }
                    if (bTask.title > aTask.title) {
                        return 1
                    }
                    return  0
                }).reverse()
                break
            }
        }
    } else {
        console.log('Sort is null', todoTasks)
    }

    return todoTasks.filter(task => {
        const hasActiveFilter = (
            selectedFilter.group !== null ||
            selectedFilter.query !== null
        );

        // Check if theres no active filter
        if (!hasActiveFilter) {
            console.log('Has no active filter')
            return true
        }

        // Check if task.group is equal to selectedFilter.group
        if ((selectedFilter.group !== null && selectedFilter.group !== 0) && task.group !== selectedFilter.group) {
            console.log('Group didn\'t match')
            return false
        }

        // Check if query is inside task.title
        // if (!task.title.includes(selectedFilter.query!)) {
        //     return false
        // }
        
        if (!new RegExp(selectedFilter.query!, 'i').test(task.title)){
            return false
        }

        console.log('All filter passed')
        return true;
    })
}

const filteredTasks = computed(() => filterAndSortTasks(tasks, props))


onMounted(() => {
    fetchTasks()
    todoStore.eventEmitter.on(TASKS_UPDATED, fetchTasks)
})
</script>

<template>
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

    <TransitionGroup v-if="tasks.length > 0" name="fade" tag="TaskItem" class="mx-3 flex flex-col gap-2">
        <TaskItem v-for="task in filteredTasks" :task-id="task.id" :key="task.id" :delete-dialog-func="deleteDialog" class="item" />
    </TransitionGroup>
    <div v-else class="flex justify-center items-center flex-col gap-3">
        <img class="w-64" src="../assets/doge.png" alt="Doge">
        <p class="text-gray-400">Such empty... Create a new task would ya?</p>
    </div>
</template>

<style scoped>
.container {
  position: relative;
  padding: 0;
}

/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>