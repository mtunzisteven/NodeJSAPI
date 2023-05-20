const express = require('express');
const { body } = require('express-validator');


const skillController = require('../controllers/skill');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//GET /skills
router.get(
    '/skills', 
    isAuth, 
    skillController.getSkills
);

//skill /skill
router.post(
    '/skill', 
    isAuth,
    [ // validation middleware uses {check} above
        body('title')
            .trim()
            .isLength({min:5}),
        body('content')
            .trim()
            .isLength({min:5})
    ],
    skillController.createSkill
);

//GET /skill/:skillId
router.get(
    '/skill/:skillId',  
    isAuth,
    skillController.getSkill
    );

//PUT /skill/:skillId
router.put(
    '/skill/:skillId',   
    isAuth,  
    [ // validation middleware uses {check} above
        body('title')
            .trim()
            .isLength({min:5}),
        body('content')
            .trim()
            .isLength({min:5})
    ], 
    skillController.updateSkill
);


//GET /skill/:skillId
router.delete(
    '/skill/:skillId', 
    isAuth,
    skillController.deleteSkill
);

module.exports = router;