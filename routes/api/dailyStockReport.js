const express = require('express');
const { compareConcatArrays } = require('../../util/reusableFunctions')
const route = express.Router();
const pool = require('../../util/db');
const auth = require('../../middleware/auth');
const { validationResult, body,param } = require('express-validator');
const moment = require('moment')

//get the report from specific day for specific user restaurant
route.get(
  '/:facility_id/report-list/:report_date',
  auth,
  async (req, res) => {
    try {
      const [
        allProductsInTheReport,
      ] = await pool.execute(
        'SELECT product.name, product.brand,product.measurment_type,product.amount_in_container, product.currency_type,relation_facility_product.* FROM relation_facility_product JOIN product ON product.id_product = relation_facility_product.product WHERE facility = ? AND report_date = ?',
        [req.params.facility_id, req.params.report_date]
      );

      if (allProductsInTheReport.length === 0) {
        return res.status(400).json({
          msg: 'There is no report for this day',
        });
      }

      res.send(allProductsInTheReport);
    } catch (error) {
      res.status(500).send('Server error');
      console.log(error);
    }
  }
);
// //get single product of specific menu
// route.get('/:menu_id/single/:id_product', auth, async (req, res) => {
//   try {
//     const [
//       singleDishOfTheMenu,
//     ] = await pool.execute(
//       'SELECT * FROM product WHERE menu_connection = ? AND id_dish = ?',
//       [req.params.menu_id, req.params.id_product]
//     );

//     if (singleDishOfTheMenu.length === 0) {
//       return res.status(400).send({
//         msg: 'No product found',
//       });
//     }

//     res.send(singleDishOfTheMenu[0]);
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });

//create new report for the specific date
route.post(
  '/create-report/:facility_id/:report_date',
  [
    auth,
    [
      body('*.amount_in_stock', 'Amount in stock is required to provide')
        .notEmpty()
        .trim()
        .isDecimal(),
      body('*.comment', 'Comment is up to 135 characters.')
        .trim()
        .isLength({max:135}),
      param('report_date','Is required and must containe past or present date').notEmpty().trim().isBefore(new Date().toString())
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
      ({ product,amount_in_stock, comment }) => [
        Number(req.params.facility_id),
        product,
        req.params.report_date,
        amount_in_stock,
        comment,
      ]
    );
    const requestedDate = req.body.map((item) => [
      item.id_product,
      item.report_date,
    ]);
    try {
      //checking if the menu exists already
      let [existingReport] = await pool.execute(
        'SELECT * FROM relation_facility_product'
      );

      const existingDailyReport = existingReport.map((item) => [
        item.id_product,
        moment.utc(item.report_date).format('YYYY-MM-DD'),
      ]);

      const checkedForDuplicates = compareConcatArrays(requestedDate,existingDailyReport)

      if (checkedForDuplicates.length > 0) {
        return res
          .status(400)
          .send('Report already exist for this particular date');
      }

      //creating new product
      await pool.query(
        'INSERT INTO relation_facility_product(facility,product,report_date,amount_in_stock,comment) VALUES ?',
        [getItems]
      );

      let [
        createdReport
      ] = await pool.execute(
        'SELECT * FROM relation_facility_product WHERE facility = ? AND report_date = ?',
        [req.params.facility_id,req.params.report_date]
      );
      res.json(createdReport);
    } catch (error) {
        console.log(error)
      res.status(500).send('Server error');
    }
  }
);

//delete report
route.delete(
  '/:facility_id/delete-report/:report_date',
  auth,
  async (req, res) => {
    try {
      await pool.execute(
        'DELETE FROM relation_facility_product WHERE facility = ? AND report_date = ?',
        [req.params.facility_id, req.params.report_date]
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
  '/:facility_id/update-report/:id_product',
  auth,
  async (req, res) => {
    const { amount_in_stock, comment, report_date } = req.body;
    try {
      const [
        reportToUpdate,
      ] = await pool.execute(
        'SELECT * FROM relation_facility_product WHERE facility_id = ? AND id_product = ?',
        [req.params.facility_id, req.params.id_product]
      );
      const soldAmount = amount_in_stock || "0"
        ? amount_in_stock
        : reportToUpdate[0].amount_in_stock;
      const earnedMoney = comment || "0"
        ? comment
        : reportToUpdate[0].comment;

      await pool.execute(
        'UPDATE relation_facility_product SET amount_in_stock = ?, comment =  ? WHERE facility_id = ? AND id_product = ? AND report_date = ?',
        [
          soldAmount,
          earnedMoney,
          req.params.facility_id,
          req.params.id_product,
          moment.utc(report_date).format('YYYY-MM-DD')
        ]
      );
      const [
        allDishesInTheUpdatedReport,
      ] = await pool.execute(
        'SELECT product.name, product.portion,product.to_sell_price, product.currency_type,relation_facility_product.* FROM relation_facility_product JOIN product ON product.id_dish = relation_facility_product.id_product WHERE facility_id = ? AND report_date = ?',
        [req.params.facility_id, moment.utc(report_date).format('YYYY-MM-DD')]
      );
      res.json(allDishesInTheUpdatedReport);
    } catch (error) {
      console.log(error.sqlMessage);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = route;
