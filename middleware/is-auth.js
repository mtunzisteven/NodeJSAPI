const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user'); // get the model and in there, the user schema

const SECRET = process.env.SECRET;

module.exports = async (req, res, next) => {

    const authHeader = req.get('Authorization');
    
    if(!authHeader){
        const error = new Error('Not Authenticated[No authHeader]: Error!');
        error.statusCode = 401;
    }

    const token = authHeader.split(' ')[1];

    let decodedToken;

    try{
        decodedToken = jwt.verify(token, SECRET); // same secret used in login middleware of auth controller 

    } catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not Authenticated: Error!');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    req.user = await User.findOne({_id:req.userId});

    next();
};