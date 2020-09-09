const express = require('express');
const { compareConcatArrays } = require('../../util/reusableFunctions')
const route = express.Router();
const pool = require('../../util/db');
const auth = require('../../middleware/auth');
const { validationResult, body } = require('express-validator');
const moment = require('moment')

//get the report from specific day for specific user restaurant
route.get(
  '/:restaurant_id/report-list/:report_date',
  auth,
  async (req, res) => {
    try {
      const [
        allDishesInTheReport,
      ] = await pool.execute(
        'SELECT dish.name, dish.portion,dish.to_sell_price, dish.currency_type,relation_restaurant_dish.* FROM relation_restaurant_dish JOIN dish ON dish.id_dish = relation_restaurant_dish.dish_id WHERE restaurant_id = ? AND report_date = ?',
        [req.params.restaurant_id, req.params.report_date]
      );

      if (allDishesInTheReport.length === 0) {
        return res.status(400).send({
          msg: 'There is no report for this day',
        });
      }

      res.send(allDishesInTheReport);
    } catch (error) {
      res.status(500).send('Server error');
      console.log(err);
    }
  }
);
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

//create new report for the specific date
route.post(
  '/create-report/:restaurant_id',
  [
    auth,
    [
      body('*.earned_money', 'Earned money volue is required')
        .notEmpty()
        .trim()
        .isDecimal(),
      body('*.sold_amount', 'Must be the value of an integer')
        .notEmpty()
        .trim()
        .isInt(),
      body('*.report_date', 'Date must only include past or present day')
        .isBefore(new Date().toString())
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
      ({ dish_id, report_date, sold_amount, earned_money }) => [
        dish_id,
        Number(req.params.restaurant_id),
        report_date,
        sold_amount,
        earned_money,
      ]
    );
    const requestedDate = req.body.map((item) => [
      item.dish_id,
      item.report_date,
    ]);
    try {
      //checking if the menu exists already
      let [existingReport] = await pool.execute(
        'SELECT * FROM relation_restaurant_dish'
      );

      const existingDailyReport = existingReport.map((item) => [
        item.dish_id,
        moment.utc(item.report_date).format('YYYY-MM-DD'),
      ]);

      const checkedForDuplicates = compareConcatArrays(requestedDate,existingDailyReport)

      if (checkedForDuplicates.length > 0) {
        return res
          .status(400)
          .send('Report already exist for this particular date');
      }

      //creating new dish
      await pool.query(
        'INSERT INTO relation_restaurant_dish(dish_id,restaurant_id,report_date,sold_amount,earned_money) VALUES ?',
        [getItems]
      );

      let [
        allReports,
      ] = await pool.execute(
        'SELECT * FROM relation_restaurant_dish WHERE restaurant_id = ?',
        [req.params.restaurant_id]
      );
      res.json(allReports);
    } catch (error) {
      console.log(error)
      res.status(500).send('Server error');
    }
  }
);

//delete report
route.delete(
  '/:restaurant_id/delete-report/:report_date',
  auth,
  async (req, res) => {
    try {
      await pool.execute(
        'DELETE FROM relation_restaurant_dish WHERE restaurant_id = ? AND report_date = ?',
        [req.params.restaurant_id, req.params.report_date]
      );

      res.send('Report has been deleted');
    } catch (error) {
      console.log(error.sqlMessage);
      res.status(500).send('Server Error');
    }
  }
);

//update single report
route.put(
  '/:restaurant_id/update-report/:dish_id',
  auth,
  async (req, res) => {
    const { sold_amount, earned_money, report_date } = req.body;
    try {
      const [
        reportToUpdate,
      ] = await pool.execute(
        'SELECT * FROM relation_restaurant_dish WHERE restaurant_id = ? AND dish_id = ?',
        [req.params.restaurant_id, req.params.dish_id]
      );
      const soldAmount = sold_amount || "0"
        ? sold_amount
        : reportToUpdate[0].sold_amount;
      const earnedMoney = earned_money || "0"
        ? earned_money
        : reportToUpdate[0].earned_money;

      await pool.execute(
        'UPDATE relation_restaurant_dish SET sold_amount = ?, earned_money =  ? WHERE restaurant_id = ? AND dish_id = ? AND report_date = ?',
        [
          soldAmount,
          earnedMoney,
          req.params.restaurant_id,
          req.params.dish_id,
          moment.utc(report_date).format('YYYY-MM-DD')
        ]
      );
      const [
        allDishesInTheUpdatedReport,
      ] = await pool.execute(
        'SELECT dish.name, dish.portion,dish.to_sell_price, dish.currency_type,relation_restaurant_dish.* FROM relation_restaurant_dish JOIN dish ON dish.id_dish = relation_restaurant_dish.dish_id WHERE restaurant_id = ? AND report_date = ?',
        [req.params.restaurant_id, moment.utc(report_date).format('YYYY-MM-DD')]
      );
      res.json(allDishesInTheUpdatedReport);
    } catch (error) {
      console.log(error.sqlMessage);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = route;
