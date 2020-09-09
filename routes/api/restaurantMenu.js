const express = require('express');
const route = express.Router();
const pool = require('../../util/db');
const auth = require('../../middleware/auth');

//connect menu to specify facility
route.post('/connect-menu/:id', auth, async (req, res) => {
    const restaurantMenuId = req.body.map((i) => [
      Number(req.params.id),
      i,
    ]);
    try {
      //checking if the facility exists already
      let [existingConnection] = await pool.execute(
        'SELECT restaurant, menu FROM relation_restaurant_menu'
      );
  
      if (restaurantMenuId.some((i) => existingConnection.includes(i))) {
        return res.status(400).send('Connection already exist');
      }
      //creating new facility
      await pool.query(
        'INSERT INTO relation_restaurant_menu(restaurant,menu) VALUES ?',
        [restaurantMenuId]
      );
      res.json(req.body);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  });
  
  //getting the all connection between restaurant and menu for specific restaurant
  route.get('/connected-menu/:id', auth, async (req, res) => {
    try {
      const [
        existingConnection,
      ] = await pool.execute(
        'SELECT menu.name, menu.category,relation_restaurant_menu.menu FROM relation_restaurant_menu JOIN  menu ON relation_restaurant_menu.menu =  menu.id_menu WHERE restaurant = ?',
        [req.params.id]
      );
  
      res.send(existingConnection);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  });
  
  //delete connected menu from the restaurant
  route.delete(
    '/connected-menu/:restaurantId/delete/:menuId',
    auth,
    async (req, res) => {
      try {
        await pool.execute(
          'DELETE FROM relation_restaurant_menu WHERE menu = ?',
          [req.params.menuId]
        );
        const [
          existingConnections,
        ] = await pool.execute(
          'SELECT menu.name, menu.category,relation_restaurant_menu.menu FROM relation_restaurant_menu JOIN  menu ON relation_restaurant_menu.menu =  menu.id_menu WHERE restaurant = ?',
          [req.params.restaurantId]
        );
  
        res.json(existingConnections);
      } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
      }
    }
  );
  module.exports = route;
  