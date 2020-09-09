const express = require('express');
const { compareConcatArrays } = require('../../util/reusableFunctions')
const route = express.Router();
const pool = require('../../util/db');
const auth = require('../../middleware/auth');
const { validationResult, body } = require('express-validator');
const moment = require('moment')

//get connection for specific restaurant and specific menu connected to that restaurant
route.get(
  '/:facility_id/connection-list/:menu_id',
  auth,
  async (req, res) => {
    try {
      const [
        allConnectedIngredients,
      ] = await pool.execute(
        'SELECT dish.name, dish.portion,relation_dish_product.* FROM relation_dish_product JOIN dish ON dish.id_dish = relation_dish_product.dish AND dish.menu_conenction = ? WHERE facility_id = ?',
        [req.params.menu_id, req.params.facility_id]
      );

      if (allConnectedIngredients.length === 0) {
        return res.status(400).send({
          msg: 'There is no connections for this menu',
        });
      }

      res.send(allConnectedIngredients);
    } catch (error) {
      res.status(500).send('Server error');
      console.log(err);
    }
  }
);
//get the ingredients for specific dish in specific facility
route.get('/:facility_id/single/:dish_id', auth, async (req, res) => {
  try {
    const [
      singleConnectionOfDish,
    ] = await pool.execute(
      'SELECT product.name, dish.portion,relation_dish_product.* FROM relation_dish_product JOIN dish ON dish.id_dish = relation_dish_product.dish AND dish.menu_conenction = ? WHERE facility_id = ?',
      [req.params.menu_id, req.params.dish_id]
    );

    if (singleDishOfTheMenu.length === 0) {
      return res.status(400).send({
        msg: 'No dish found',
      });
    }

    res.send(singleDishOfTheMenu[0]);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

//create new connection
route.post(
  '/create-connection/:facility_id',
  [
    auth,
    [
      body('*.amount_to_use', 'Amount to use is required and it must be greater than 0')
        .notEmpty()
        .trim()
        .isDecimal(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const getItems = req.body.map(
      ({ dish, product,amount_to_use }) => [
        Number(req.params.facility_id),
        dish,
        product,
        amount_to_use
      ]
    );
    
    try {
      //checking if the menu exists already
      let [existingConnection] = await pool.execute(
        'SELECT * FROM relation_dish_product'
      );

      const existingConnectionArray = existingConnection.map((item) => [
        item.facility,
        item.dish,
        item.product,
        item.amount_to_use
      ]);

      const checkedForDuplicates = compareConcatArrays(getItems,existingConnectionArray)

      if (checkedForDuplicates.length > 0) {
        return res
          .status(400)
          .send('Some of the products are already connected to that dish');
      }

      //creating new connection
      await pool.query(
        'INSERT INTO relation_dish_product(facility,dish,product,amount_to_use) VALUES ?',
        [getItems]
      );

      
      res.send("Connection has been established");
    } catch (error) {
      console.log(error)
      res.status(500).send('Server error');
    }
  }
);

//delete entire connection for the specific dish
route.delete(
  '/delete-connection/:dish_id',
  auth,
  async (req, res) => {
    try {
      await pool.execute(
        'DELETE FROM relation_dish_product WHERE dish = ?',
        [req.params.dish_id]
      );

      res.send('All ingredients from this dish has beem deleted');
    } catch (error) {
      console.log(error.sqlMessage);
      res.status(500).send('Server Error');
    }
  }
);

//delete single product from the connection with dish
route.delete(
  '/delete-connection/:id',
  auth,
  async (req, res) => {
    try {
      await pool.execute(
        'DELETE FROM relation_dish_product WHERE id = ?',
        [req.params.id]
      );

      res.send('Report has been deleted');
    } catch (error) {
      console.log(error.sqlMessage);
      res.status(500).send('Server Error');
    }
  }
);

//update single ingredient for specifc restaurant and dish
route.put(
  '/update-connection/:id',
  auth,
  async (req, res) => {
    const { amount_to_use } = req.body;
    try {
      const [
        reportToUpdate,
      ] = await pool.execute(
        'SELECT * FROM relation_dish_product WHERE id = ?',
        [req.params.id]
      );
      const soldAmount = amount_to_use || "0"
        ? amount_to_use
        : reportToUpdate[0].amount_to_use;

      await pool.execute(
        'UPDATE relation_dish_product SET amount_to_use = ? WHERE id = ?',
        [
          amount_to_use,
          req.params.id,
        ]
      );
      
      res.send('Connection has been updated');
    } catch (error) {
      console.log(error.sqlMessage);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = route;
