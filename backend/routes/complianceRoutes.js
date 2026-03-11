// Import Express dan buat instance Router
// Router digunakan untuk memisahkan definisi endpoint dari file utama (server.js)
const express = require('express')
const router = express.Router()

// Import controller yang berisi logika handler untuk setiap endpoint
const complianceController = require('../controllers/ComplianceController')

/**
 * GET /api/areas
 * Mengambil daftar semua area untuk mengisi dropdown filter di frontend
 */
router.get('/areas', complianceController.getAreas)

/**
 * GET /api/compliance?area_id=&date_from=&date_to=
 * Mengambil data compliance berdasarkan filter area dan rentang tanggal
 * 
 * Query params:
 * - area_id   : ID area yang dipilih, "all" untuk semua area
 * - date_from : Tanggal awal filter (format YYYY-MM-DD)
 * - date_to   : Tanggal akhir filter (format YYYY-MM-DD)
 */
router.get('/compliance', complianceController.getCompliance)

// Export router agar bisa di-mount di server.js dengan app.use('/api', complianceRoutes)
module.exports = router