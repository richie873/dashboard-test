// Import koneksi database yang sudah dikonfigurasi di config/db.js
const db = require("../config/db");

/**
 * Helper function untuk menjalankan query SQL ke database
 * Membungkus db.query() yang berbasis callback menjadi Promise
 * agar bisa digunakan dengan async/await
 * 
 * @param {string} sql    - Query SQL yang akan dijalankan
 * @param {Array}  params - Parameter untuk mengganti tanda ? di query (default [])
 * @returns {Promise}     - Resolve dengan hasil query, reject jika error
 */
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);   // Lempar error jika query gagal
      else resolve(results);  // Kembalikan hasil jika query berhasil
    });
  });
}

/**
 * Mengambil semua data area dari tabel store_area
 * Digunakan untuk mengisi dropdown filter area di frontend
 * 
 * @returns {Array} [{ area_id, area_name }, ...]
 */
async function getAreas() {
  const rows = await query(`
    SELECT area_id, area_name
    FROM store_area
    ORDER BY area_id
  `);
  return rows;
}

/**
 * Mengambil data compliance per brand per area untuk ditampilkan di tabel
 * 
 * Jika area_id = "all" atau kosong → ambil semua area
 * Jika area_id diisi → filter hanya area tersebut
 * 
 * @param {string|number} area_id   - ID area filter, "all" untuk semua area
 * @param {string}        date_from - Tanggal awal filter (format YYYY-MM-DD)
 * @param {string}        date_to   - Tanggal akhir filter (format YYYY-MM-DD)
 * @returns {Array} [{ brand_id, brand_name, area_id, area_name, nilai }, ...]
 */
async function getComplianceData(area_id, date_from, date_to) {
  // Kondisi WHERE default: filter berdasarkan rentang tanggal
  let whereConditions = ["rp.tanggal BETWEEN ? AND ?"];
  let params = [date_from, date_to];

  // Tambahkan filter area jika bukan "all"
  if (area_id && area_id !== "all") {
    whereConditions.push("sa.area_id = ?");
    params.push(area_id);
  }

  // Gabungkan semua kondisi WHERE dengan AND
  const where = whereConditions.join(" AND ");

  const sql = `
  SELECT
   pb.brand_id,
   pb.brand_name,
   sa.area_id,
   sa.area_name,
   -- Hitung rata-rata compliance dalam persen, dibulatkan 1 desimal
   ROUND(SUM(rp.compliance) / COUNT(rp.report_id) * 100, 1) AS nilai
  FROM report_product rp
  JOIN product p       ON rp.product_id = p.product_id 
  JOIN product_brand pb ON p.brand_id = pb.brand_id           
  JOIN store s         ON rp.store_id = s.store_id           
  JOIN store_area sa   ON s.area_id = sa.area_id             
  WHERE ${where}
  GROUP BY pb.brand_id, pb.brand_name, sa.area_id, sa.area_name  
  ORDER BY pb.brand_id, sa.area_id                               
 `;

  const rows = await query(sql, params);
  return rows;
}

/**
 * Mengambil data compliance per area untuk ditampilkan di chart
 * Berbeda dengan getComplianceData, hasil tidak dikelompokkan per brand
 * sehingga setiap area hanya menghasilkan 1 nilai agregat
 * 
 * @param {string|number} area_id   - ID area filter, "all" untuk semua area
 * @param {string}        date_from - Tanggal awal filter (format YYYY-MM-DD)
 * @param {string}        date_to   - Tanggal akhir filter (format YYYY-MM-DD)
 * @returns {Array} [{ area_name, nilai }, ...]
 */
async function getComplianceChart(area_id, date_from, date_to) {
  // Kondisi WHERE default: filter berdasarkan rentang tanggal
  let whereConditions = ["rp.tanggal BETWEEN ? AND ?"];
  let params = [date_from, date_to];

  // Tambahkan filter area jika bukan "all"
  if (area_id && area_id !== "all") {
    whereConditions.push("sa.area_id = ?");
    params.push(area_id);
  }

  // Gabungkan semua kondisi WHERE dengan AND
  const where = whereConditions.join(" AND ");

  const sql = `
  SELECT
   sa.area_name,
   -- Hitung rata-rata compliance seluruh brand dalam persen
   ROUND(SUM(rp.compliance) / COUNT(rp.report_id) * 100, 1) AS nilai
  FROM report_product rp
  JOIN store s       ON rp.store_id = s.store_id   
  JOIN store_area sa ON s.area_id = sa.area_id      
  WHERE ${where}
  GROUP BY sa.area_id, sa.area_name  
  ORDER BY sa.area_id
 `;

  const rows = await query(sql, params);
  return rows;
}

// Export semua fungsi agar bisa digunakan di complianceController.js
module.exports = {
  getAreas,        // untuk dropdown filter area
  getComplianceData,  // untuk data tabel
  getComplianceChart, // untuk data chart
};