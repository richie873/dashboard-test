  const sql = `
  SELECT
   pb.brand_id,
   pb.brand_name,
   sa.store_id,
   sa.area_name,
   ROUND(SUM(rp.compliance)/COUNT(rp.report_id) * 100) as nilai
   FROM report_product rp
   JOIN product p ON rp.product_id = p.product_id
   JOIN product_brand pb ON p.brand_id = pb.brand_id
   JOIN store s ON rp.store_id = s.store_id
   join store_area sa ON s.area_id = sa.area_id
    WHERE rp.tanggal BETWEEN ? AND ?
    GROUP BY pb.brand_id, pb.brand_name, sa.store_id, sa.area_name
    ORDER BY pb.brand_id, sa.store_id
   `;