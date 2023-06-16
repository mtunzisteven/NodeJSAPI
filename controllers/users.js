const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET;

const User = require('../models/user'); // get the model and in there, the user schema

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

                return res.status(401).json({
                    message:'User was not found', 
                })

            } // cannot throw error inside a promise, therefore we send catch block

            loadedUser = user;

            // This response(res.json()) returns a json format response to the request
            // This response(res.status(201).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            res.status(200).json({
                message:"User retrieved successfully!",
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

                return res.status(404).json({
                    message:'Users not found', 
                });

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
