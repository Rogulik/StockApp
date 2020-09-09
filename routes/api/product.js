const express = require('express');
const { compareConcatArrays } = require('../../util/reusableFunctions')
const route = express.Router();
const pool = require('../../util/db');
const auth = require('../../middleware/auth');
const { validationResult, body } = require('express-validator');

//get the user products
route.get('/', auth, async (req, res) => {
  try {
    const [allProducts] = await pool.execute('SELECT * FROM product WHERE user_id = ?', [
      req.user.id,
    ]);

    if (allProducts.length === 0) {
      return res.status(400).send({
        msg: 'There is no Products created for this user yet',
      });
    }

    res.send(allProducts);
  } catch (error) {
    console.log(error)
    res.status(500).send('Server error');
  }
});
//get single menu of the user
route.get('/:id_product', auth, async (req, res) => {
  try {
    const [
      singleProduct,
    ] = await pool.execute(
      'SELECT * FROM product WHERE id_product = ? AND user_id = ?',
      [req.params.id_product, req.user.id]
    );

    if (singleProduct.length === 0) {
      return res.status(400).send({
        msg: 'There is no Menu created for this user yet',
      });
    }
    res.send(singleProduct[0]);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

//create products for the user
route.post(
  '/',
  [
    auth,
    [
      body('*.name', 'Name is required').notEmpty().trim(),
      body('*.amount_in_container', 'Up to four integers and two decimals').trim().isDecimal({decimal_digits:'2'}),
      body("*.measurment_type","Choose one of the available option for measurment").notEmpty().trim().isIn(['l','kg','g','each']),
      body("*.currency_type","Currency type is required").notEmpty().trim(),
      body("*.cost","Cost is required and it must contain up to six integers and two decimals").isDecimal({decimal_digits:'2'}),
      body("*.brand","Brand or Marketplace name is required").notEmpty().trim(),

    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const getItems = req.body.map(
        ({ name, brand, amount_in_container, measurment_type,currency_type,cost }) => [
          req.user.id,
          name,
          brand,
          Number.parseFloat(amount_in_container).toFixed(2),
          measurment_type,
          currency_type,
          Number.parseFloat(cost).toFixed(2),
        ]
      );

    //get name to check if this product already exsit for this particular user
    const requestedProduct = req.body.map((item) => [
      item.name,
      req.user.id,
      item.brand,
    ]);
    try {
      //checking if the menu exists already
      let [existingProducts] = await pool.execute('SELECT * FROM product');

      const existingProductsNames = existingProducts.map((item) => [
        item.name,
        item.user_id,
        item.brand,
      ]);

      const checkedForDuplicates = compareConcatArrays(requestedProduct,existingProductsNames)

      if (checkedForDuplicates.length > 0) {
        return res
          .status(400)
          .send('One of the products alredy exist in your account');
      }

      //creating new menu
      await pool.query('INSERT INTO product(user_id,name,brand,amount_in_container,measurment_type,currency_type,cost) VALUES ?', [
        getItems,
      ]);


      res.json(req.body);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  }
);

//delete product
route.delete('/:id_product', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM product WHERE id_product = ? AND user_id = ?', [
      req.params.id_product,
      req.user.id,
    ]);
    const [allProducts] = await pool.execute('SELECT * FROM product WHERE user_id = ?', [
      req.user.id,
    ]);

    if (allProducts.length === 0) {
      return res.status(400).send('There is no Products to display');
    }
    res.json(allProducts);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

//update single product

route.put('/:id_product', auth, async (req, res) => {
  const { name, brand, amount_in_container, measurment_type, currency_type, cost } = req.body;
  try {
    const [
      productToUpdate,
    ] = await pool.execute(
      'SELECT * FROM product WHERE user_id = ? AND id_product = ?',
      [req.user.id, req.params.id_product]
    );
    const productName = name ? name : productToUpdate[0].name;
    const productBrand = brand ? brand : productToUpdate[0].brand;
    const productContainer = amount_in_container ? amount_in_container : productToUpdate[0].amount_in_container;
    const productMeasurment = measurment_type ? measurment_type : productToUpdate[0].measurment_type;
    const productCurrency = currency_type ? currency_type : productToUpdate[0].currency_type;
    const productCost = cost ? cost : productToUpdate[0].cost;

    await pool.execute(
      'UPDATE product SET name = ?, brand = ?, amount_in_container = ?, measurment_type = ?, currency_type = ?, cost = ? WHERE user_id = ? AND id_product = ?',
      [productName, productBrand,productContainer,productMeasurment,productCurrency,productCost, req.user.id,req.params.id_product]
    );

    let [
      updatedProduct,
    ] = await pool.execute(
      'SELECT * FROM product WHERE user_id = ? AND id_product = ?',
      [req.user.id, req.params.id_product]
    );

    res.json(updatedProduct);
  } catch (error) {
    console.log(error)
    res.status(500).send('Server Error');
  }
});
module.exports = route;
