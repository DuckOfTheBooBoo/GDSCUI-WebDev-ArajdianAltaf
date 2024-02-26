<script setup lang="ts">
import Tag from 'primevue/tag';

defineProps({
    title: String,
    subTask: Array,
    dueDate: Date,
    groupType: String,
    priority: Number
})
</script>

<template>
    <p class="font-bold text-3xl mb-2">Task Detail</p>
    <div class="flex gap-1 mb-5">
        <!-- Group -->
        <Tag value="General" rounded>
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
            <span class="text-xs">09/08/2005</span>
        </Tag>
    </div>
    <p class="font-bold text-xl">Description</p>
    <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex commodi necessitatibus repellat quia blanditiis
        omnis excepturi, architecto aliquid earum tenetur nemo reiciendis eum nostrum amet tempora fugit quam atque
        totam.

        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta vitae voluptas officia autem maxime, fugit
        cupiditate tenetur amet possimus maiores atque corrupti perspiciatis dolores beatae tempora excepturi
        eveniet, quis necessitatibus?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, iusto vero amet sit deserunt animi.
        Laudantium neque amet, error nihil quae possimus, ad, placeat aliquid beatae cum officia distinctio aliquam.

    </p>
</template>