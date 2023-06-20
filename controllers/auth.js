const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET;

const User = require('../models/user'); // get the model and in there, the user schema
const Talent = require('../models/talent'); // get the model and in there, the user schema
 
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
    const talentId = req.body.talent;

    console.log(talentId);

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

        const talent = await  Talent.findOne({_id:talentId}); // get talent using talentId

        user.talents.push(talent);
        
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
                user: loadedUser
            });

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    }

};