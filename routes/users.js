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

//PATCH /users/:userId
router.patch('/:userId', isAuth, usersController.approveUser);

//PATCH /users/admin/:userId
router.patch('/admin/:userId', isAuth, usersController.changeUserAdmin);

//DELETE /users/:userId
router.delete('/:userId', isAuth, usersController.deleteUser);

module.exports = router;