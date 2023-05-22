const express = require('express');
const { body } = require('express-validator');


const talentController = require('../controllers/talent');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

console.log("Talents Routing!");


//GET /talents
router.get(
    '/', 
    talentController.getTalents
);

//POST /talent
router.post(
    '/', 
    isAuth,
    [ // validation middleware uses {check} above
        body('title')
            .trim()
            .isLength({min:5})
    ],
    talentController.createTalent
);

//GET /talent/:talentId
router.get(
    '/:talentId',
    talentController.getTalent
    );

//PUT /talent/:talentId
router.put(
    '/:talentId',   
    isAuth,  
    [ // validation middleware uses {check} above
        body('title')
            .trim()
            .isLength({min:5})
    ], 
    talentController.updateTalent
);

//DELETE /talent/:talentId
router.delete(
    '/:talentId', 
    isAuth,
    talentController.deleteTalent
);

module.exports = router;