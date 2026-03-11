// Import service yang berisi logika query ke database
const complianceService = require('../services/complianceService')

/**
 * Mengambil daftar semua area dari database
 * 
 * Endpoint : GET /api/areas
 */
async function getAreas(req, res) {
  try {
    // Panggil service untuk query tabel store_area
    const areas = await complianceService.getAreas()

    // Kirim hasil ke frontend dalam format JSON
    res.json({
      data: areas
    })
  } catch (err) {
    console.error("getAreas error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * Mengambil data compliance berdasarkan filter dari frontend
 * 
 * Endpoint : GET /api/compliance
 * Query    : area_id, date_from, date_to
 */
async function getCompliance(req, res) {
  try {
    // Ambil parameter filter dari query string URL
    // Contoh: /api/compliance?area_id=1&date_from=2021-01-01&date_to=2021-01-31
    const { area_id, date_from, date_to } = req.query

    // Validasi parameter wajib sebelum query ke database
    if (!date_from || !date_to) {
      return res.status(400).json({ error: "date_from dan date_to wajib diisi" })
    }

    // Jalankan kedua query secara paralel agar lebih cepat
    // tableRows → data mentah per brand per area (untuk tabel)
    // chartRows → data agregat per area (untuk chart)
    const [tableRows, chartRows] = await Promise.all([
      complianceService.getComplianceData(area_id, date_from, date_to),
      complianceService.getComplianceChart(area_id, date_from, date_to)
    ])

    // Kirim kedua hasil sekaligus ke frontend
    res.json({
      data: {
        tableData: tableRows, // akan dipivot per brand di frontend
        chartData: chartRows  // akan diformat ke Chart.js di frontend
      }
    })
  } catch (err) {
    console.error("getCompliance error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Export kedua fungsi agar bisa dipakai di complianceRoutes.js
module.exports = {
  getAreas,
  getCompliance
}