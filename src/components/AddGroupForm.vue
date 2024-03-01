<script setup lang="ts">
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel'
import ColorPicker from 'primevue/colorpicker';
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { reactive } from 'vue';
import { useTodoStore } from '../stores/todoStores';
import Group from '../models/Group';
import GroupFormData from '../models/GroupFormData'

const props = defineProps<{
    closeCallback: VoidFunction
}>()

const todoStore = useTodoStore()

const formValues = reactive<{groupName: string | null, hexColor: string | null}>({
    groupName: null,
    hexColor: '00ffff'
})

const formSchema = yup.object({
    groupName: yup.string().min(3, 'Group name must be > 2 char').required('Group name is required'),
    hexColor: yup.string().required('Group color is required')
})

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: formSchema,
  initialValues: formValues
})

// FIELDS
const [groupName] = defineField('groupName')
const [hexColor] = defineField('hexColor')

const onSubmit = handleSubmit((values) => {
    const hexColorCode = '#' + values.hexColor
    const group: GroupFormData = {
        name: values.groupName!,
        color: hexColorCode
    }
    todoStore.addGroup(group)
    props.closeCallback()
})

</script>

<template>
    <form @submit.prevent="onSubmit">
        <Card>
            <template #title>Add New Group</template>
            <template #content>
                <div class="flex justify-center flex-col gap-2">
                    <InputText placeholder="Group Name" v-model="groupName"/>
                    <small class="text-red-500">{{ errors.groupName }}</small>
                    <div class="flex flex-row gap-2 items-center">
                        <p>Group color: </p>
                        <ColorPicker v-model="hexColor" />
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex flex-row gap-1">
                    <Button label="Add Group" type="submit"></Button>
                    <Button label="Cancel" outlined @click="closeCallback"></Button>
                </div>
            </template>
        </Card>
    </form>
</template>