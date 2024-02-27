<script setup lang="ts">
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import SelectButton from 'primevue/selectbutton';
import { ref, reactive } from 'vue';
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import Task from '../models/Task';
import TaskFormData from '../models/TaskFormData';
import TodoService from '../services/TodoService';
import Group from '../models/Group';

const props = defineProps<{
  taskId?: number,
  title?: string,
  description?: string,
  dueDate?: Date,
  priority?: number,
  group?: number,
  closeCallback: VoidFunction,
  addNew: boolean // true for add new task, false for edit task
}>()

const formValues = reactive({
  title: props.title ? props.title : null,
  dueDate: props.dueDate ? props.dueDate : null,
  description: props.description ? props.description : null,
  priority: props.priority ? props.priority : null,
  group: props.group ? props.group : null
})

const formSchema = yup.object({
  title: yup.string().min(5, 'Title must be at least 5 characters').required('Title is required'),
  // TODO: Implement minimum date
  dueDate: yup.date().required('Due date is required'),
  description: yup.string().nullable(),
  priority: yup.string().required('Priority is required').oneOf(['1', '2', '3'], 'Invalid priority id'),
  group: yup.string().required('Group is required').oneOf(['1', '2', '3'], 'Invalid group id')
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


const priorities = ref([
  { label: 'Low', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'High', value: 3 }
]);

const groups = TodoService.getAllGroups()

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

    const newTaskId = TodoService.addTask(task)
    console.log(`Successfully added new task id: ${newTaskId}`)
  } else {
    // Edit task
    const oldTask: Task = TodoService.getTask(props.taskId!)!
    const updatedTask: Task = {
      ...oldTask,
      title: values.title!,
      description: values.description!,
      dueDate: values.dueDate!,
      priority: values.priority!,
      group: values.group!,
    }

    TodoService.updateTask(updatedTask)
    console.log(`Successfully updated task ${props.taskId}`)
  }

  props.closeCallback()
})
</script>

<template>
  <!-- TODO: Find out why invalid in field aren't working -->
  <form @submit.prevent="onSubmit">
    <Card>
      <template #title>{{ formTitle }}</template>
      <template #content>
        <div class="flex flex-col gap-2">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-pencil"></i>
            </InputGroupAddon>
            <InputText v-model="title" placeholder="Task title" :invalid="Boolean(errors.title)" />
          </InputGroup>
          <small class="text-red-500">{{ errors.title }}</small>

          <!-- TODO: Implement minimum date -->
          <Calendar v-model="dueDate" :manualInput="false" showButtonBar showIcon iconDisplay="input"
            placeholder="Due date" :invalid="Boolean(errors.dueDate)" />
          <small class="text-red-500">{{ errors.dueDate }}</small>

          <Textarea v-model="description" placeholder="Description" autoResize />

          <p>Priority</p>
          <div class="flex justify-center flex-col items-center">
            <SelectButton v-model="priority" :options="priorities" optionLabel="label" optionValue="value"
              :invalid="Boolean(errors.priority)">
              <template #option="slotProps">
                <i :class="slotProps.option.icon"></i>
                <span class="font-bold">
                  {{ slotProps.option.label }}
                </span>
              </template>
            </SelectButton>
            <small class="text-red-500">{{ errors.priority }}</small>
          </div>

          <p>Group</p>
          <div class="flex justify-center flex-col items-center">
            <Dropdown v-model="group" placeholder="Select group" :options="groups" optionValue="id"
              :invalid="Boolean(errors.group)">
              <template #value="slotProps">
                <div v-if="slotProps.value" class="">
                  <Tag :class="groupTag(slotProps.value)?.color">
                    <span>{{ groupTag(slotProps.value)?.name }}</span>
                  </Tag>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              <template #option="slotProps">
                <Tag :class="slotProps.option.color">
                  <span>{{ slotProps.option.name }}</span>
                </Tag>
              </template>
            </Dropdown>
            <small class="text-red-500">{{ errors.group }}</small>
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