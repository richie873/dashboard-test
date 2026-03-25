const db = require('../config/db')

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })
}

async function getReportProducts() {
    const sql = `
    SELECT 
    
    `
}