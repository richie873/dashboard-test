<script setup>
import { ref, onMounted } from 'vue'

const tableData = ref([])
const tableAreas = ref(['store_id', 'store_name', 'product_id', 'product_name'])

onMounted(async () => {
    const res = await fetch('/api/products') // sesuaikan endpoint Anda
    const data = await res.json()
    tableData.value = data
})
</script>

<template>
    <table class="w-full border">
        <thead class="bg-gray-200">
            <tr>
                <th v-for="area in tableAreas" :key="area" class="p-2">
                    {{ area }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="product in tableData" :key="product.product_id">
                <td v-for="area in tableAreas" :key="area" class="p-2">
                    {{ product[area] }}
                </td>
            </tr>
        </tbody>
    </table>
</template>