const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET;

const User = require('../models/user'); // get the model and in there, the user schema
 
console.log("Controlling!"); 

exports.signup = async (req, res, next) => {

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty


        return res.status(422).json({
            message:'Validation Failed!', 
        })

    }


    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;    
    const surname = req.body.surname;
    const whatsApp = req.body.whatsApp;    
    const ward = req.body.ward;
    const stake = req.body.stake;
    const age = req.body.age;
    const memberId = req.body.memberId;

    try{

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await new User({
            email:email, 
            password:hashedPassword,
            name:name,
            whatsApp:whatsApp, 
            ward:ward,
            surname:surname,
            stake:stake, 
            age:age,
            memberId:memberId
        });
        
        const result = await user.save(); 
            res.status(201).json({
                    message:'User Created successfully!', 
                    userId:result._id
                })

    }catch(err){

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;
    
            } // cannot throw error inside a promise, therefore we send it to next middleware
    
            next(err); // go to next middleware with err as an argument passed to it.
    }
};

exports.login = async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    try{

        const user = await User.findOne({email: email})

            if(!user){ // give error a status code if it is not found 

                const error = new Error('User with this email was not found')

                error.statusCode = 401;

                throw error;

            } // cannot throw error inside a promise, therefore we send catch block

            loadedUser = user;

        const passwordCorrect = await bcrypt.compare(password, user.password); // check password is correct

            if(!passwordCorrect){// give error a status code if it is not correct 

                const error = new Error('Password and email combination not correct, Please try again');

                error.statusCode = 500;

                throw error;
            } // cannot throw error inside a promise, therefore we send catch block

            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString() 
                }, 
                SECRET, 
                {expiresIn:'1h'}
            );

            // This response(res.json()) returns a json format response to the request
            // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            res.status(200).json({
                token:token,
                userId: loadedUser._id.toString()
            });

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    }

};

exports.updateUser = async (req, res, next) => {

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty


        return res.status(422).json({
            message:'Validation Failed!', 
        })

    }

    const userId = req.params.userId;

    const email = req.body.email;
    const name = req.body.name;
    const surname = req.body.surname;
    const whatsApp = req.body.whatsApp;    
    const ward = req.body.ward;
    const stake = req.body.stake;
    const age = req.body.age;
    const memberId = req.body.memberId;

    try{

        const user = await User.findOne({_id: userId})

        console.log(user);

        // Check if Skill was found
        if(!user){
            const error = new Error('Could not find User!');

            error.statusCode = 404;

            throw error; // will send us to catch block
        }

        // check if the user trying to update the user is either the logged in user or an admin
        // if(user._id.toString() !== req.userId || user.admin == false){
        //     const error = new Error("Cannot edit User if you're not an admin");

        //     error.statusCode = 403;

        //     throw error; // will send us to catch block
        // }

        console.log(req.body);
        console.log(user);

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId }, 
            {
                email:email, 
                name:name,
                whatsApp:whatsApp, 
                ward:ward,
                surname:surname,
                stake:stake, 
                age:age,
                memberId:memberId
            }
        );

        console.log(updatedUser);
        
        res.status(201).json({
                message:'User updated successfully!'
            })

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    }
};

exports.getUser = async (req, res, next) => {

    const userId = req.params.userId;

    try{

        const user = await User.findOne({_id: userId.toString()});

            if(!user){ // give error a status code if it is not found 

                const error = new Error('User with this id was not found')

                error.statusCode = 401;

                throw error;

            } // cannot throw error inside a promise, therefore we send catch block

            loadedUser = user;

            // This response(res.json()) returns a json format response to the request
            // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            res.status(200).json({
                message:"User retrieved!",
                user: loadedUser
            });

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    }

};

exports.getUsers = async (req, res, next) => {

    try{

        const users = await User.find();

            if(!users){

                const error = new Error('Users not found');
                error.statusCode = 404;

                throw error;

            }

            // This response(res.json()) returns a json format response to the request
            // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            res.status(200).json({
                message:"Users retrieved!",
                users:users
            });

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    }
};
