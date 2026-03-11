<script setup>
// Import komponen tabel dan chart yang akan ditampilkan
import ComplianceTable from "../components/ComplianceTable.vue"
import ComplianceChart from "../components/ComplianceChart.vue"
// Import fungsi Vue yang dibutuhkan
import { ref, onMounted } from "vue"
import { api } from "../services/api"

// Menyimpan daftar area yang didapat dari backend
const areas = ref([])

// Menyimpan area yang dipilih user, default "all" (semua area)
const selectedArea = ref("all")

// Menyimpan tanggal filter, default 1 Januari 2021
const dateFrom = ref("2021-01-01")
const dateTo = ref("2021-01-01")

// Menyimpan data chart dalam format yang diterima Chart.js
const chartData = ref({ labels: [], datasets: [] })

// Menyimpan data baris tabel (sudah dipivot per brand)
const tableData = ref([])

// Menyimpan daftar nama area untuk header kolom tabel
const tableAreas = ref([])

/**
 * Mengambil daftar area dari backend
 * Dipanggil sekali saat halaman pertama kali dibuka
 * Hasil disimpan ke areas[] untuk mengisi dropdown filter
 */
async function loadAreas() {
  try {
    const res = await api.get("/areas")
    areas.value = res.data.data
  } catch (err) {
    console.error("error loadAreas:", err)
  }
}

/**
 * Mengambil data compliance dari backend berdasarkan filter
 * yang dipilih user (area, tanggal dari, tanggal sampai)
 * 
 * Melakukan 2 transformasi data setelah response diterima:
 * 1. chartData → diubah ke format Chart.js { labels, datasets }
 * 2. tableData → diubah dari flat rows menjadi pivot per brand
 */
async function loadCompliance() {
  try {
    // Kirim request ke backend dengan parameter filter
    const res = await api.get("/compliance", {
      params: {
        area_id: selectedArea.value,
        date_from: dateFrom.value,
        date_to: dateTo.value
      }
    })
    const data = res.data.data

    // ── Transform 1: Chart Data ──
    // Backend mengembalikan: [{area_name, nilai}, ...]
    // Chart.js membutuhkan: { labels: [...], datasets: [{ data: [...] }] }
    chartData.value = {
      labels: data.chartData.map(r => r.area_name),
      datasets: [{
        label: "Compliance (%)",
        data: data.chartData.map(r => r.nilai),
        backgroundColor: "rgba(59, 130, 246, 0.7)"
      }]
    }

    // ── Transform 2: Table Data ──
    // Ambil semua nama area unik untuk header kolom tabel
    const areaSet = [...new Set(data.tableData.map(r => r.area_name))]
    tableAreas.value = areaSet

    // Pivot data: kelompokkan per brand, area_name jadi key nilai
    const brandMap = {}
    data.tableData.forEach(r => {
      if (!brandMap[r.brand_name]) {
        brandMap[r.brand_name] = { brand_name: r.brand_name }
      }
      brandMap[r.brand_name][r.area_name] = r.nilai
    })
    tableData.value = Object.values(brandMap)
  } catch (err) {
    console.error("error loadCompliance:", err)
  }
}

// Dijalankan otomatis saat komponen pertama kali dimuat 
// Langsung load areas untuk isi dropdown filter area
onMounted(() => {
  loadAreas() // isi dropdown area
})

</script>

<template>

  <div class="p-6">

    <h1 class="text-2xl font-bold mb-6">
      Dashboard Test
    </h1>

    <!-- FILTER -->
    <div class="flex gap-4 mb-6">

      <select v-model="selectedArea" class="border p-2">
        <option value="all">All Area</option>

        <option v-for="area in areas" :key="area.area_id" :value="area.area_id">
          {{ area.area_name }}
        </option>

      </select>

      <input type="date" v-model="dateFrom" class="border p-2" />
      <input type="date" v-model="dateTo" class="border p-2" />

      <button @click="loadCompliance" class="bg-blue-500 px-4 py-2">
        View
      </button>

    </div>

    <!-- CHART -->
    <ComplianceChart :chartData="chartData" />

    <!-- TABLE -->
    <ComplianceTable :tableData="tableData" :tableAreas="tableAreas" />

  </div>

</template>