const express = require('express');
const { compareConcatArrays } = require('../../util/reusableFunctions')
const route = express.Router();
const pool = require('../../util/db');
const auth = require('../../middleware/auth');
const { validationResult, body } = require('express-validator');

//get the specific menu dishes
route.get('/:menu_id/list', auth, async (req, res) => {
  try {
    const [
      allDishesOfTheMenu,
    ] = await pool.execute('SELECT * FROM dish WHERE menu_connection = ?', [
      req.params.menu_id,
    ]);

    if (allDishesOfTheMenu.length === 0) {
      return res.status(400).send({
        msg: 'There is no dish created for this user yet',
      });
    }

    res.send(allDishesOfTheMenu);
  } catch (error) {
    res.status(500).send('Server error');
  }
});
//get the dishes which are included in the menu connected for specific restaurant
route.get('/connected-dishes/:restaurant_id', auth, async (req, res) => {
  try {
    const [
      connectedDishes,
    ] = await pool.execute(
      'SELECT dish.id_dish,dish.menu_connection,dish.name,dish.to_make_cost,dish.to_sell_price,dish.portion,dish.currency_type FROM dish,relation_restaurant_menu WHERE dish.menu_connection = relation_restaurant_menu.menu AND relation_restaurant_menu.restaurant = ?',
      [req.params.restaurant_id]
    );

    if (connectedDishes.length === 0) {
      return res.status(400).send({
        msg: 'There is no connection for this dish',
      });
    }
    res.json(connectedDishes);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});
//get single dish of specific menu
route.get('/:menu_id/single/:dish_id', auth, async (req, res) => {
  try {
    const [
      singleDishOfTheMenu,
    ] = await pool.execute(
      'SELECT * FROM dish WHERE menu_connection = ? AND id_dish = ?',
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

//create many dishes for specific menu
route.post(
  '/:menu_id/create-dish',
  [
    auth,
    [
      body('*.name', 'Name is required and must be a string').notEmpty().trim(),
      body('*.portion', 'Please provide the right selling amount of the dish')
        .notEmpty()
        .trim(),
      body('*.to_sell_price', 'Max 6 integers and 2 decimals')
        .notEmpty()
        .trim(),
      body('*.to_make_cost', 'Max 6 integers and 2 decimals').trim(),
      body('*.currency_type', 'Please choose the currency type.')
        .notEmpty()
        .trim(),
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
      ({ name, portion, to_make_cost, to_sell_price, currency_type }) => [
        req.params.menu_id,
        name,
        Number.parseFloat(to_make_cost).toFixed(2),
        Number.parseFloat(to_sell_price).toFixed(2),
        portion,
        currency_type,
      ]
    );
    const requestedNames = req.body.map((item) => [
      item.name,
      req.params.menu_id,
    ]);
    try {
      //checking if the menu exists already
      let [existingDish] = await pool.execute('SELECT * FROM dish');

      const existingNames = existingDish.map((item) => [
        item.name,
        req.params.menu_id,
      ]);


      const checkedForDuplicates = compareConcatArrays(requestedNames,existingNames)

      if (checkedForDuplicates.length > 0) {
        return res
          .status(400)
          .send('Dish already exist for this particular menu');
      }

      //creating new dish
      await pool.query(
        'INSERT INTO dish(menu_connection,name,to_make_cost,to_sell_price,portion,currency_type) VALUES ?',
        [getItems]
      );

      let [
        dishesForMenu,
      ] = await pool.execute('SELECT * FROM dish WHERE menu_connection = ?', [
        req.params.menu_id,
      ]);

      res.json(dishesForMenu);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }
);

//delete dish
route.delete('/:menu_id/delete/:dish_id', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM dish WHERE id_dish = ?', [
      req.params.dish_id,
    ]);
    const [
      allDishesOfTheMenu,
    ] = await pool.execute('SELECT * FROM dish WHERE menu_connection = ?', [
      req.params.menu_id,
    ]);

    res.json(allDishesOfTheMenu);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

//update dish

route.put('/:menu_id/update/:dish_id', auth, async (req, res) => {
  const {
    name,
    to_make_cost,
    to_sell_price,
    portion,
    currency_type,
  } = req.body;
  try {
    const [
      dishToUpdate,
    ] = await pool.execute(
      'SELECT * FROM dish WHERE menu_connection = ? AND id_dish = ?',
      [req.params.menu_id, req.params.dish_id]
    );
    const dishName = name ? name : dishToUpdate[0].name;
    const dishCost = to_make_cost ? to_make_cost : dishToUpdate[0].to_make_cost;
    const dishPrice = to_sell_price
      ? to_sell_price
      : dishToUpdate[0].to_sell_price;
    const dishPortion = portion ? portion : dishToUpdate[0].portion;
    const dishCurrencyType = currency_type
      ? currency_type
      : dishToUpdate[0].currency_type;

    await pool.execute(
      'UPDATE dish SET name = ?, to_make_cost = ?,to_sell_price = ?,portion = ?,currency_type =? WHERE menu_connection = ? AND id_dish = ?',
      [
        dishName,
        dishCost,
        dishPrice,
        dishPortion,
        dishCurrencyType,
        req.params.menu_id,
        req.params.dish_id,
      ]
    );

    let [
      allDishes,
    ] = await pool.execute('SELECT * FROM dish WHERE menu_connection = ?', [
      req.params.menu_id,
    ]);

    res.json(allDishes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = route;
