const express = require('express');

const usersController = require('../controllers/users');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//GET /users
router.get('/', usersController.getUsers);

//GET /users/:userId
router.get('/:userId', usersController.getUser);

//PUT /users/:userId
router.put('/:userId', isAuth, usersController.updateUser);

module.exports = router;