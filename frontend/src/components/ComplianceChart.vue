<script setup>
import { computed } from "vue"
import { Bar } from "vue-chartjs"
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"

// Daftarkan semua plugin dan komponen Chart.js yang digunakan
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels)

/**
 * Props yang diterima dari Dashboard.vue
 * chartData bisa berupa Array (default kosong) atau Object format Chart.js
 */
const props = defineProps({
  chartData: {
    type: [Array, Object],
    default: () => []
  }
})

/**
 * Guard agar Chart.js tidak crash saat data belum tersedia
 * Jika chartData masih Array kosong, kembalikan format Chart.js yang valid
 */
const safeChartData = computed(() => {
  if (!props.chartData || Array.isArray(props.chartData)) {
    return { labels: [], datasets: [] }
  }
  return props.chartData
})

// Konfigurasi tampilan chart
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    // Tampilkan nilai di atas setiap bar
    datalabels: {
      color: "black",
      anchor: "end",
      align: "top",
      font: { weight: "bold", size: 14 },
      formatter: (value) => value
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100, // Skala 0-100 karena nilai adalah persentase
      title: { display: true, text: "Percentage (%)" }
    }
  }
}
</script>

<template>
    <div class="border p-6 mb-10">
        <!-- pakai safeChartData, bukan chartData langsung -->
        <Bar :data="safeChartData" :options="chartOptions" />
    </div>
</template>