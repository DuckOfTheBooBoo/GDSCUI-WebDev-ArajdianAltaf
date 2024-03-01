<script setup lang="ts">
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import SelectButton from 'primevue/selectbutton';
import { onMounted, reactive, ref } from 'vue';
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import Task from '../models/Task';
import TaskFormData from '../models/TaskFormData';
import Group from '../models/Group';
import Priority from '../models/Priority';
import { useTodoStore } from '../stores/todoStores';
import AddGroupForm from './AddGroupForm.vue';
import { GROUPS_UPDATED } from '../constants';

const props = defineProps<{
  taskId?: number,
  closeCallback: VoidFunction,
  addNew: boolean // true for add new task, false for edit task
}>()

const todoStore = useTodoStore()

const task: Task | undefined = todoStore.getTask(props.taskId!)
const groups: Group[] = reactive<Group[]>([])


const addGroupFormVisible = ref(false)
const currentDate = ref(new Date())
const date = currentDate.value.getDate()
const month = currentDate.value.getMonth()
const year = currentDate.value.getFullYear()

let formValues = undefined
if (task) {
  formValues = reactive({
    title: task.title ? task.title : null,
    dueDate: task.dueDate ? task.dueDate : null,
    description: task.description ? task.description : null,
    priority: task.priority ? task.priority : null,
    group: task.group ? task.group : null
  })
}

const formSchema = yup.object({
  title: yup.string().min(5, 'Title must be at least 5 characters').required('Title is required'),
  dueDate: yup.date().required('Due date is required').min(new Date(year, month, date), 'Due date must be in the future. Unless you\'re a time traveler...'),
  description: yup.string().nullable(),
  priority: yup.string().required('Priority is required').oneOf(['1', '2', '3'], 'Invalid priority id'),
  group: yup.string().required('Group is required')
})

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: formSchema,
  initialValues: formValues
})

// FIELDS
const [title] = defineField('title')
const [dueDate] = defineField('dueDate')
const [description] = defineField('description')
const [priority] = defineField('priority')
const [group] = defineField('group')

const priorities: Priority[] = todoStore.getPriorities()

const groupTag = (groupId: number): Group | undefined => {
  return groups.find((group) => group.id === groupId)
}

const formTitle = props.addNew ? 'Add Task' : 'Edit Task'

const onSubmit = handleSubmit((values) => {
  console.log('Submitted with', values)

  // Add new task
  if (props.addNew) {
    const task: TaskFormData = {
      title: values.title!,
      description: values.description!,
      dueDate: values.dueDate!,
      priority: values.priority!,
      group: values.group!,
    }

    const newTaskId = todoStore.addTask(task)
    console.log(`Successfully added new task id: ${newTaskId}`)
  } else {
    // Edit task
    const oldTask: Task = todoStore.getTask(props.taskId!)!
    const updatedTask: Task = {
      ...oldTask,
      title: values.title!,
      description: values.description!,
      dueDate: values.dueDate!,
      priority: values.priority!,
      group: values.group!,
    }

    todoStore.updateTask(updatedTask)
    console.log(`Successfully updated task ${props.taskId}`)
  }

  props.closeCallback()
})

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
  <Dialog :style="{ width: '90vw' }" v-model:visible="addGroupFormVisible" modal>
    <template #container="{ closeCallback }">
      <AddGroupForm :close-callback="closeCallback" />
    </template>
  </Dialog>
  <form @submit.prevent="onSubmit">
    <Card>
      <template #title>{{ formTitle }}</template>
      <template #content>
        <div class="flex flex-col gap-2">
          <InputGroup class="shadow-lg">
            <InputGroupAddon>
              <i class="pi pi-pencil"></i>
            </InputGroupAddon>
            <InputText v-model="title" placeholder="Task title" :invalid="Boolean(errors.title)" />
          </InputGroup>
          <Transition name="fade">
            <small v-if="Boolean(errors.title)" class="text-red-500 mt-1">{{ errors.title }}</small>
          </Transition>

          <Calendar class="shadow-lg" v-model="dueDate" :manualInput="false" showButtonBar showIcon iconDisplay="input"
            placeholder="Due date" :invalid="Boolean(errors.dueDate)" dateFormat="dd/mm/yy" />
          <Transition name="fade">
            <small v-if="Boolean(errors.dueDate)" class="text-red-500 mt-1">{{ errors.dueDate }}</small>
          </Transition>

          <Textarea class="shadow-lg" v-model="description" placeholder="Description" autoResize />

          <p class="drop-shadow-lg">Priority</p>
          <div class="flex justify-center flex-col items-center">
            <SelectButton class="shadow-lg" v-model="priority" :options="priorities" optionLabel="label"
              optionValue="value" :invalid="Boolean(errors.priority)">
              <template #option="slotProps">
                <span class="font-bold">
                  {{ slotProps.option.name }}
                </span>
              </template>
            </SelectButton>
            <Transition name="fade">
              <small v-if="Boolean(errors.priority)" class="text-red-500 mt-1">{{ errors.priority }}</small>
            </Transition>
          </div>

          <p class="drop-shadow-lg">Group</p>
          <div class="flex justify-center flex-col items-center">
            <div class="flex flex-row gap-2">
              <Dropdown class="flex-2 shadow-lg" v-model="group" placeholder="Select group" :options="groups"
                optionValue="id" :invalid="Boolean(errors.group)">
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="">
                    <Tag :style="`background-color: ${groupTag(slotProps.value)?.color};`">
                      <span>{{ groupTag(slotProps.value)?.name }}</span>
                    </Tag>
                  </div>
                  <span v-else>{{ slotProps.placeholder }}</span>
                </template>
                <template #option="slotProps">
                  <Tag :style="`background-color: ${slotProps.option.color};`">
                    <span>{{ slotProps.option.name }}</span>
                  </Tag>
                </template>
              </Dropdown>

              <!-- ADD GROUP DIALOG -->
              <Button class="flex-1 border-gray-300 shadow-lg" icon="pi pi-plus" outlined @click="addGroupFormVisible = true"></Button>
            </div>
            <Transition name="fade">
              <small v-if="Boolean(errors.group)" class="text-red-500 mt-1">{{ errors.group }}</small>
            </Transition>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-row gap-1">
          <Button v-if="!addNew" label="Save" severity="info" type="submit" @click=""></Button>
          <Button v-else-if="addNew" label="Add" type="submit"></Button>
          <Button label="Cancel" outlined @click="closeCallback"></Button>
        </div>
      </template>
    </Card>
  </form>
</template>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>