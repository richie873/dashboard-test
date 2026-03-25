// Import framework Express untuk membuat server HTTP
const express = require("express")

// Import middleware CORS agar frontend (beda port/domain) bisa akses API ini
// Tanpa cors(), browser akan memblokir request dari frontend ke backend
const cors = require("cors")

// Import router compliance yang berisi semua endpoint /areas dan /compliance
const complianceRoutes = require('./routes/complianceRoutes')
const productRoutes = require('./routes/productRoutes')

// Buat instance aplikasi Express
const app = express()

// Mengizinkan request dari semua origin (frontend Vue di port 5173, dll)
app.use(cors())

// Mengizinkan Express membaca request body dalam format JSON
app.use(express.json())

// Mount semua compliance routes dengan prefix /api
// Sehingga endpoint menjadi:
// → GET http://localhost:5000/api/areas
// → GET http://localhost:5000/api/compliance
// → GET http://localhost:5000/api/products
app.use('/api', complianceRoutes)
app.use('/api', productRoutes)
// =====================
// START SERVER
// =====================
const PORT = 5000

// Jalankan server dan tampilkan pesan konfirmasi di terminal
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})