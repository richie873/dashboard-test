const db = require('../config/db')

function query(sql = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) reject(err)
            else resolve(results)
        })
})
}

async function getProducts() {
    const sql = `
    SELECT
    s.store_id,
    s.store_name,
    p.product_id,
    p.product_name
    FROM report_product rp 
    JOIN store s ON rp.store_id = s.store_id
    JOIN product p ON rp.product_id = p.product_id
    GROUP BY s.store_id, s.store_name, p.product_id, p.product_name
    `
    const rows = await query(sql)  // eksekusi query
    return rows                          // return hasilnya
}

module.exports = {
    getProducts
}