const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const pool = require('../../util/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check,validationResult} = require('express-validator')

//Register user
router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check('first_name','First name is required').notEmpty().trim(),
    check('last_name','Last name is required').notEmpty().trim(),
    check('password','Password is required and must contain at least 8 characters').isLength({min:8})
],async(req,res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array() })
    }

    const {first_name,last_name,email,password} = req.body

    try {
        //see if user exists
        let [existingUser] = await pool.execute("SELECT * FROM users WHERE email = ?",[email])
        if(existingUser.length === 1){
          return res.status(400).json({ errors: [ { msg: 'User already exists' }] })
        } 
             //get the avatar of the user
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d: 'mm'
        })
        //encrypt the password
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password,salt)
        //create instance of the user
        await pool.execute("INSERT INTO `users`(`first_name`,`last_name`,`email`,`password`,`avatar`) VALUES(?,?,?,?,?)",
        [first_name,last_name,email,hashpassword,avatar])

        const [newUser] = await pool.execute('SELECT * FROM users WHERE email = ?',[email])

        const payload = {
            user: {
                id: newUser[0].id_users
            }
        }
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err,token) => {
                    if(err) throw err
                    res.json({token})
                }
            )
    } catch (error) {
        res.status(500).send('Server error')
        console.log(error)
    }

    
})



//GET all the users
router.get('/all',async(req,res) => {
   try {
       const [rows] = await pool.execute('SELECT * FROM users')

       if(rows.length === 0){
           return res.status(400).send({msg: 'There is no users'})
       }
       res.json(rows)
   } catch (error) {
       res.status(500).send('server error')
   }
})


module.exports = router