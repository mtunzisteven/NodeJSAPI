const { validationResult } = require('express-validator');
const Talent = require('../models/talent'); // get the model and in there, the Talent schema
const fs = require('fs');
const path = require('path');

exports.getTalents = async (req, res, next) => { // logged in admin can access Talents they created   
    
    try{

        console.log("Comes to getTalents!")

        const talents = await Talent.find() // get Talents by the specific user, not ones created by another user(for total Talents count)

        // end the sherade if there is no Talents found
        if(!talents){

            return res.status(404).json({
                message:'Error fetching talents', 
            });

        }

        res.status(200).json({
            message: 'Fetched talents successfully', 
            Talents:talents
        });

       
    }catch(err){

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;
    
            } // cannot throw error inside a promise, therefore we send it to next middleware
    
            next(err); // go to next middleware with err as an argument passed to it.
    }

};

exports.getTalent = async (req, res, next) => {

    const TalentId = req.params.TalentId;

    try{

        const talent = await Talent.findById(TalentId);

            console.log(talent);

            if(!talent){

                return res.status(404).json({
                    message:'Could not find Talent!', 
                });

            }

            // This response(res.json()) returns a json format response to the request
            // This response(res.status(200).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            res.status(200).json({
                Talent: talent
            })

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    };

};

exports.createTalent = async (req, res, next) => {

    if(req.user.admin != true){ // Only Admin can do this operation

        return res.status(422).json({
            message:'Error! You need to be an admin to add a talent.', 
        });
    }

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty

        return res.status(422).json({
            message:'Validation Failed: Entered data is incorrect!', 
        });
        
    }

    const title = req.body.title;

    const talent = new Talent({
        title:title, 
        creator: req.userId // req.userId defined at authentication of user
    });

    try{

        const result = await talent.save(); // store Talent in db

        // This response(res.json()) returns a json format response to the request
        // this Talent would be stored in the db
        res.status(201).json({
            message:'Talent created successfully!',
            Talent: Talent,
            result: result
        });

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    };
};

exports.updateTalent = async (req, res, next) => {

    if(req.user.admin != true){ // Only Admin can do this operation

        return res.status(422).json({
            message:'Error! You need to be an admin to add a talent.', 
        });
    }

    const talentId = req.params.talentId;
    const title = req.body.title;

    try{

        const talent = await Talent.findOne({_id:talentId});

        // Check if Talent was found
        if(!talent){
            return res.status(404).json({
                message:'Could not find Talent!', 
            });
        }

        // update Talent details
        talent.title = title;

        const result = await talent.save(); // save to db

 
        res.status(200)
            .json({
                massage:"Talent updated successfully", 
                talent:result // this is the Talent
            });

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    };
};

exports.deleteTalent = async (req, res, next) => {

    if(req.user.admin != true){ // Only Admin can do this operation

        return res.status(422).json({
            message:'Error! You need to be an admin to add a talent.', 
        });
    }

    const talentId = req.params.talentId;

    try{

        const talent = await Talent.findById(talentId)

        if(!talent){

            const error = new Error('Could not find Talent!');

            error.statusCode = 404;

            throw error; // will send us to catch block
        }

        // delete Talent
        const result = await Talent.findByIdAndRemove(talentId);


        res.status(200).json({
            massage:"Talent deleted successfully",
            result: result
        });
        
    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    };

}

// function for deleting an image in the server
const clearImage = filePath =>{

    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err=> console.log(err)); // deletes file in provided file path(images)
};
