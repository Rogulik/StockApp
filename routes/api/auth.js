const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const pool = require('../../util/db');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

//get the user which is log in
router.get('/', auth, async (req, res) => {
  try {
    let [
      logInUser,
    ] = await pool.execute(
      'SELECT `id_users`,`first_name`,`last_name`,`email`,`created_at`,`avatar` FROM users WHERE id_users = ?',
      [req.user.id]
    );
    res.json(logInUser[0]);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

//log in the user
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //see if user exists
      let [
        existingUser,
      ] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length === 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, existingUser[0].password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          id: existingUser[0].id_users,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).send('Server error');
      console.log(error);
    }
  }
);

//delete user
router.delete('/', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM users WHERE id_users=?', [req.user.id]);

    res.json({ msg: 'User has been deleted' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
});

//update user
router.put(
  '/',
  [
    auth,
    [
      check(
        'password',
        'New password need contain at least 8 characters'
      ).isLength({ min: 8 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { oldPassword, password } = req.body;
    try {
      const [
        userToUpdate,
      ] = await pool.execute('SELECT password FROM users WHERE id_users = ?', [
        req.user.id,
      ]);

      const isMatch = await bcrypt.compare(
        oldPassword,
        userToUpdate[0].password
      );

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Incorrect Old Password' }] });
      }

      //encrypt the password
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);

      await pool.execute('UPDATE users SET password = ? WHERE id_users = ?', [
        hashpassword,
        req.user.id,
      ]);

      let [
        updatedUser,
      ] = await pool.execute(
        'SELECT first_name,last_name,email,avatar FROM users WHERE id_users = ?',
        [req.user.id]
      );

      res.json(updatedUser[0]);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
    }
  }
);
module.exports = router;
