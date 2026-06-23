import { pool } from "../db.js";

export async function getAllProducts(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, category, sku, quantity, unit, price, status, supplier, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: "name and category are required" });
    }

    const result = await pool.query(
      `INSERT INTO products (name, category, sku, quantity, unit, price, status, supplier, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, category, sku, quantity || 0, unit || "pcs", price || 0, status || "In Stock", supplier, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { name, category, sku, quantity, unit, price, status, supplier, description } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = $1, category = $2, sku = $3, quantity = $4, unit = $5,
           price = $6, status = $7, supplier = $8, description = $9
       WHERE id = $10
       RETURNING *`,
      [name, category, sku, quantity, unit, price, status, supplier, description, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
