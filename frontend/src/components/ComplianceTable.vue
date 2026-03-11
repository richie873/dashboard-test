<script setup>

const props = defineProps({
    tableData: {
        type: Array,
        default: () => []
    },
    tableAreas: {
        type: Array,
        default: () => []
    }
})

</script>

<template>

    <table class="w-full border">

        <thead class="bg-gray-200">

            <tr>

                <th class="p-2">Brand</th>

                <th v-for="area in tableAreas" :key="area" class="p-2">
                    {{ area }}
                </th>

            </tr>

        </thead>

        <tbody>

            <tr v-for="row in tableData" :key="row.brand_name">

                <td class="p-2 font-semibold">
                    {{ row.brand_name }}
                </td>

                <td v-for="area in tableAreas" :key="area" class="p-2 text-center">
                    {{ row[area] }}%
                </td>

            </tr>

        </tbody>

    </table>

</template>