const express = require('express');
const route = express.Router();
const axios = require('axios');

route.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://openexchangerates.org/api/currencies.json'
    );

    res.json(response.data);
  } catch (error) {
    throw error;
  }
});

module.exports = route;
