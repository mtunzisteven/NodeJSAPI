const express = require('express');
const { body } = require('express-validator');


const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const User = require('../models/user');

const router = express.Router();

console.log("Routing!");

//PUT /auth/signup/
router.put(
    '/signup',    
    [ // validation middleware uses {check} above
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, {req})=>{

                return User
                        .findOne({email:value})
                        .then(userDoc=>{
                            
                            if(userDoc){
                                return Promise.reject('E-mail already exists!');
                            }
                        });
            }),
        body('name')
            .trim()
            .not()          // is not
            .isEmpty(),     // empty
        body('surname')
            .trim()
            .not()          // is not
            .isEmpty(),     // empty
        body('ward')
            .trim()
            .not()          // is not
            .isEmpty(),     // empty
        body('stake')
            .trim()
            .not()          // is not
            .isEmpty(),     // empty
        body('age')
            .trim()
            .not()          // is not
            .isEmpty(),     // empty
        body('memberId')
            .trim()
            .not()          // is not
            .isEmpty(),     // empty
        body('name')
            .trim()
            .not()          // is not
            .isEmpty(),     // empty
        body('password')
            .trim()
            .isLength({min:6}),
    ], 
    authController.signup
);
  
//POST /auth/login/
router.post('/login', authController.login); // not validated becausse checks are done in the controller

//GET /auth/users
router.get('/users', authController.getUsers);

//GET /auth/user/:userId
router.get('/user/:userId', authController.getUser);

//PUT /user/:userId
router.put('/user/:userId', isAuth, authController.updateUser);

module.exports = router;