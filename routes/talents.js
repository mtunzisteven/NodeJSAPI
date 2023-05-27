const express = require('express');
const { body } = require('express-validator');


const talentController = require('../controllers/talent');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//GET /talent
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

//POST /talent/:talentId
router.post(
    '/:talentId', 
    isAuth,
    talentController.addTalent
);

//PATCH /talent/:talentId
router.patch(
    '/:talentId', 
    isAuth,
    talentController.removeUserTalent
);

//DELETE /talent/:talentId
router.delete(
    '/:talentId', 
    isAuth,
    talentController.deleteTalent
);

module.exports = router;