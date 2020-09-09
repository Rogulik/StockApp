const express = require('express');
const { compareConcatArrays } = require('../../util/reusableFunctions')
const route = express.Router();
const pool = require('../../util/db');
const auth = require('../../middleware/auth');
const { validationResult, body } = require('express-validator');

//get the user menu
route.get('/me', auth, async (req, res) => {
  try {
    const [allMenu] = await pool.execute('SELECT * FROM menu WHERE user = ?', [
      req.user.id,
    ]);

    if (allMenu.length === 0) {
      return res.status(400).send({
        msg: 'There is no Menu created for this user yet',
      });
    }

    res.send(allMenu);
  } catch (error) {
    res.status(500).send('Server error');
  }
});
//get single menu of the user
route.get('/me/:id', auth, async (req, res) => {
  try {
    const [
      singleMenu,
    ] = await pool.execute(
      'SELECT * FROM menu WHERE id_menu = ? AND user = ?',
      [req.params.id, req.user.id]
    );

    if (singleMenu.length === 0) {
      return res.status(400).send({
        msg: 'There is no Menu created for this user yet',
      });
    }
    res.send(singleMenu[0]);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

//create menu for the user
route.post(
  '/',
  [
    auth,
    [
      body('*.name', 'Name is required').notEmpty().trim(),
      body('*.category', 'Please provide category').notEmpty().trim(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const getItems = req.body.map(({ name, category }) => [
      name,
      category,
      req.user.id,
    ]);
    const requestedNames = req.body.map((item) => [item.name, item.user]);
    try {
      //checking if the menu exists already
      let [existingMenu] = await pool.execute('SELECT * FROM menu');

      const existingNames = existingMenu.map((item) => [
        item.name,
        item.user,
      ]);

      const checkedForDuplicates = compareConcatArrays(requestedNames,existingNames)

      if (checkedForDuplicates) {
        return res.status(400).send('Menu already exist');
      }

      //creating new menu
      await pool.query('INSERT INTO menu(name,category,user) VALUES ?', [
        getItems,
      ]);

      // let [newMenu] = await pool.execute('SELECT * FROM menu WHERE name = ?', [
      //   name,
      // ]);

      res.json(req.body);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  }
);

//delete menu
route.delete('/:menu_id', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM menu WHERE id_menu = ? AND user= ?', [
      req.params.menu_id,
      req.user.id,
    ]);
    const [allMenu] = await pool.execute('SELECT * FROM menu WHERE user = ?', [
      req.user.id,
    ]);

    res.json(allMenu);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
});

//update menu

route.put('/:menu_id', auth, async (req, res) => {
  const { name, category } = req.body;
  try {
    const [
      menuToUpdate,
    ] = await pool.execute(
      'SELECT * FROM menu WHERE user = ? AND id_menu = ?',
      [req.user.id, req.params.facility_id]
    );
    const menuName = name ? name : menuToUpdate[0].name;
    const menuCategory = location ? location : menuToUpdate[0].category;

    await pool.execute(
      'UPDATE menu SET name = ?, category = ? WHERE user = ? AND id_menu = ?',
      [menuName, menuCategory, req.user.id, req.params.menu_id]
    );

    let [
      updatedMenu,
    ] = await pool.execute(
      'SELECT * FROM menu WHERE user = ? AND id_menu = ?',
      [req.user.id, req.params.facility_id]
    );

    res.json(updatedMenu);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});
module.exports = route;
