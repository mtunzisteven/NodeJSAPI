const { validationResult } = require('express-validator');
const Skill = require('../models/skill'); // get the model and in there, the Skill schema
const User = require('../models/user'); // get the model and in there, the Skill schema
const fs = require('fs');
const path = require('path');


exports.getSkills = (req, res, next) => { // logged in admin can access skills they created

    let currentPage = req.query.page || 1; // current page or initial page
    const perPage = 2;  // number of skills to show per page
    let totalItems; // total number of skills pulled for the user

    Skill.find({owner:req.userId}) // get Skills by the specific user, not ones created by another user(for total Skills count)
        .countDocuments() // get the total number of Skills in the db(Skills docuements)
        .then(count=>{

            totalItems =count;

            return Skill.find({owner:req.userId}) // for display
                .skip((currentPage - 1) * perPage)
                .limit(perPage) // per page set
        })
        .then(Skills=>{

            // end the sherade if there is no Skills found
            if(!Skills){
                return;
            }

            res.status(200).json({
                message: 'Fetched Skills successfully', 
                Skills:Skills,
                totalItems: totalItems
            });

        })
        .catch(err=>{

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;

            } // cannot throw error inside a promise, therefore we send it to next middleware

            next(err); // go to next middleware with err as an argument passed to it.
        })
};

exports.getSkill = async (req, res, next) => {

    const SkillId = req.params.SkillId;

    try{

        const Skill = await Skill.findById(SkillId);

            console.log(Skill);

            if(!Skill){
                const error = new Error('Could not find Skill!');

                error.statusCode = 404;

                throw error; // will send us to catch block
            }

            // This response(res.json()) returns a json format response to the request
            // This response(res.status(200).json()) includes status code to assist request understand outcome since they must decide what view to dispay
            res.status(200).json({
                Skill: Skill
            })

    }catch(err){

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    };

};

exports.createSkill = (req, res, next) => {

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty

        const error = new Error("Validation Failed: Entered data is incorrect!");

        error.statusCode = 422;

        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\" ,"/");
    let owner;
    const Skill = new Skill({
        title:title, 
        content:content,
        imageUrl:imageUrl,
        owner: req.userId // req.userId defined at authentication of user
    })

    Skill.save() // store Skill in db
        .then(result=> {
            return User.findById(req.userId); // get back the user logged using authentication defined userId

        })
        .then(user =>{
            owner = user; // save the user object in a variable so it can be passed through further then statements

            user.Skills.push(Skill); // add the Skill to the user in the db
            return user.save(); // save the user with the new Skill added
        })
        .then(result => {

            // This response(res.json()) returns a json format response to the request
            // this Skill would be stored in the db
            res.status(201).json({
                message:'Skill created subbessfully!',
                Skill: Skill,
                owner: {_id: owner._id, name: owner.name }
            });
        })
        .catch(err =>{

            if(!err.statusCode){ // give error a status code if it is not found 

                err.statusCode = 500;

            } // cannot throw error inside a promise, therefore we send it to next middleware

            next(err); // go to next middleware with err as an argument passed to it.
        });
};

exports.updateSkill = (req, res, next) => {

    const SkillId = req.params.SkillId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image; // already set in server. In react it is saved as image

    const errors = validationResult(req); // fetch all errors caught by express-validator in router

    if(!errors.isEmpty()){ // errors is not empty

        const error = new Error("Validation Failed: Entered data is incorrect!");

        error.statusCode = 422;

        throw error;
    }
    
    if(req.file){ // When a new image update is made

        imageUrl = req.file.path.replace("\\" ,"/");
    }

    if(!imageUrl){ // if failed to load file on both above ways, throw an error

        const error = new Error('Could not find file!');

        error.statusCode = 422;

        throw error; // will send us to catch block
    }

    Skill.findById(SkillId)
    .then(Skill =>{

        // Check if Skill was found
        if(!Skill){
            const error = new Error('Could not find Skill!');

            error.statusCode = 404;

            throw error; // will send us to catch block
        }

        // check if the user trying to update the Skill is the logged in user
        if(Skill.owner.toString() !== req.userId){
            const error = new Error('Cannot edit Skill created by another user');

            error.statusCode = 403;

            throw error; // will send us to catch block
        }

        // When the image url saved in images is not equal to the Skilled(put) url, the image has been replaced.
        if(imageUrl !== Skill.imageUrl){

            console.log(Skill.imageUrl);

            clearImage(Skill.imageUrl); // delete the old file that has been replaced in the Skill being updated.

        }

        // update Skill details
        Skill.title = title;
        Skill.content = content;
        Skill.imageUrl = imageUrl;

        return Skill.save(); // save to db

    })
    .then(result=>{
        res.status(200)
            .json({
                massage:"Skill updated successfully", 
                Skill:result // this is the Skill
            });
    })
    .catch(err =>{

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    });
};

exports.deleteSkill = (req, res, next) => {

    const SkillId = req.params.SkillId;

    Skill.findById(SkillId)
    .then(Skill=>{

        if(!Skill){
            const error = new Error('Could not find Skill!');

            error.statusCode = 404;

            throw error; // will send us to catch block
        }

        
        // check if the user trying to update the Skill is the logged in user
        if(Skill.owner.toString() !== req.userId){
            const error = new Error('Cannot delete Skill created by another user');

            error.statusCode = 403;

            throw error; // will send us to catch block
        }

        // checked logged in user
        clearImage(Skill.imageUrl);

        // delete Skill
        return Skill.findByIdAndRemove(SkillId);
    })
    .then(result => {
        return User.findById(req.userId); // find the specific user from db
    })
    .then(user =>{

        user.Skills.pull(SkillId); // remove the Skill with the matching id
        return user.save();
    })
    .then(result=>{
        res.status(200).json({massage:"Skill deleted successfully"});
    })
    .catch(err =>{

        if(!err.statusCode){ // give error a status code if it is not found 

            err.statusCode = 500;

        } // cannot throw error inside a promise, therefore we send it to next middleware

        next(err); // go to next middleware with err as an argument passed to it.
    });

}

// function for deleting an image in the server
const clearImage = filePath =>{

    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err=> console.log(err)); // deletes file in provided file path(images)
};