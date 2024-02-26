<script setup lang="ts">
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import SelectButton from 'primevue/selectbutton';
import { ref } from 'vue';

const props = defineProps<{
    title?: string,
    description?: string,
    dueDate?: Date,
    closeCallback: VoidFunction,
    action: string
}>()
const selectedPriority = ref()

const priorities = ref([
    { label: 'Low', value: 'low'},
    { label: 'Medium', value: 'medium'},
    { label: 'High', value: 'high'}
]);
const groups = [
    {name: 'General', color: 'bg-red-500'},
    {name: 'Work', color: 'bg-blue-500'},
    {name: 'School', color: 'bg-yellow-400'},
]
const minDate = ref(new Date())
minDate.value.setDate(Date.now())
</script>

<template>
    <Card>
        <template #title>Edit</template>
        <template #content>
            <div class="flex flex-col gap-2">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-pencil"></i>
                    </InputGroupAddon>
                    <InputText placeholder="Task title" />
                </InputGroup>

                <Calendar :minDate="minDate" :manualInput="false" showButtonBar showIcon iconDisplay="input" placeholder="Due date"/>

                <Textarea placeholder="Description" autoResize />

                <p>Priority</p>
                <div class="flex justify-center">
                    <SelectButton v-model="selectedPriority" :options="priorities" optionLabel="label" optionValue="value"
                        aria-labelledby="custom">
                        <template #option="slotProps">
                            <i :class="slotProps.option.icon"></i>
                            <span class="font-bold">
                                {{ slotProps.option.label }}
                            </span>
                        </template>
                    </SelectButton>
                </div>

                <p>Group</p>
                <div class="flex justify-center">
                    <Dropdown placeholder="Select group" :options="groups">
                        <template #option="slotProps">
                            <Tag :class="slotProps.option.color">
                                <span>{{ slotProps.option.name }}</span>
                            </Tag>
                        </template>
                    </Dropdown>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex flex-row gap-1">
                <Button v-if="action === 'edit'" label="Save" severity="info" @click="closeCallback"></Button>
                <Button v-else-if="action === 'add'" label="Add" @click="closeCallback"></Button>
                <Button label="Cancel" outlined @click="closeCallback"></Button>
            </div>
        </template>
    </Card>
</template>