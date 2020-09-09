const express = require('express');
const { compareConcatArrays } = require('../../util/reusableFunctions')
const route = express.Router();
const pool = require('../../util/db');
const auth = require('../../middleware/auth');
const { validationResult, body } = require('express-validator');

//get the user facilities
route.get('/me', auth, async (req, res) => {
  try {
    const [
      allFacilities,
    ] = await pool.execute('SELECT * FROM facility WHERE id_user = ?', [
      req.user.id,
    ]);

    if (allFacilities.length === 0) {
      return res
        .status(400)
        .send({ msg: 'There is no facilities created for this user yet' });
    }

    res.send(allFacilities);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

//get single facility of the user
route.get('/:id', auth, async (req, res) => {
  try {
    const [
      singleFacility,
    ] = await pool.execute(
      'SELECT * FROM facility WHERE id_user = ? AND id_facility = ?',
      [req.user.id, req.params.id]
    );

    if (singleFacility.length === 0) {
      return res.status(400).send({ msg: 'Facility does not exists.' });
    }

    res.send(singleFacility[0]);
  } catch (error) {
    res.status(500).send('Server error.');
  }
});

//create facility for the user
route.post(
  '/',
  [
    auth,
    [
      body('*.name', 'Name is required').notEmpty().trim(),
      body('*.location', 'Please provide the address').notEmpty().trim(),
      body('*.owner', 'Owner is required').notEmpty().trim(),
      body('*.type', 'Type is required').notEmpty().trim(),
      body('*.establish_in', 'Date must be before the current day')
        .isBefore(new Date().toString())
        .trim(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const getItems = req.body.map(
      ({ name, location, owner, establish_in, type }) => [
        name,
        location,
        owner,
        establish_in,
        req.user.id,
        type,
      ]
    );
    const requestedNames = req.body.map((item) => ([
      item.name,
      req.user.id
    ]));

    try {
      //checking if the facility exists already
      let [existingFacility] = await pool.execute('SELECT * FROM facility');
      const existingNames = existingFacility.map((item) => [
        item.name,
        item.id_user
      ]);

     console.log(requestedNames.concat(existingNames))
      
      const checkedForDuplicates = await compareConcatArrays(requestedNames,existingNames)

      console.log(checkedForDuplicates)

      if (checkedForDuplicates.length > 0) {
        return res.status(400).send('Facility/ies already exists');
      }

      //creating new facility
      await pool.query(
        'INSERT INTO facility(name,location,owner,establish_in,id_user,type) VALUES ?',
        [getItems]
      );

      res.json(req.body);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  }
);

//delete facility
route.delete('/:facility_id', auth, async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM facility WHERE id_facility = ? AND id_user = ?',
      [req.params.facility_id, req.user.id]
    );
    const [
      allFacilities,
    ] = await pool.execute('SELECT * FROM facility WHERE id_user = ?', [
      req.user.id,
    ]);

    res.json(allFacilities);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
});

//update facility
route.put('/:facility_id', auth, async (req, res) => {
  const { name, location, owner, establish_in } = req.body;
  try {
    const [
      facilityToUpdate,
    ] = await pool.execute(
      'SELECT * FROM facility WHERE id_user = ? AND id_facility = ?',
      [req.user.id, req.params.facility_id]
    );
    const facilityName = name ? name : facilityToUpdate[0].name;
    const facilityLocation = location ? location : facilityToUpdate[0].location;
    const facilityOwner = owner ? owner : facilityToUpdate[0].owner;
    const facilityEstablishIn = establish_in
      ? establish_in
      : facilityToUpdate[0].establish_in;

    await pool.execute(
      'UPDATE facility SET name = ?, location = ?, owner = ?, establish_in = ? WHERE id_user = ? AND id_facility = ?',
      [
        facilityName,
        facilityLocation,
        facilityOwner,
        facilityEstablishIn,
        req.user.id,
        req.params.facility_id,
      ]
    );

    let [
      updatedFacility,
    ] = await pool.execute(
      'SELECT * FROM facility WHERE id_user = ? AND id_facility = ?',
      [req.user.id, req.params.facility_id]
    );

    res.json(updatedFacility);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = route;