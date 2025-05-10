import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
    SELECT * FROM products 
    ORDER BY created_at DESC
    `;

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};
export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }
  try {
    const [product] = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${image})
      RETURNING *
    `;
    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await sql`
        SELECT id, name, price, image FROM products WHERE id = ${id}
      `;

    console.log(product);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "product not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }
  try {
    const [product] = await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, image = ${image}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "product updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }
  try {
    const [product] = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING *
    `;
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "product deleted successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};
