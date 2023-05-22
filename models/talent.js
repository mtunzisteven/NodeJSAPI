const mongoose = require('mongoose'); //db connection
const Schema = mongoose.Schema; //mongoose schema require

const talentSchema = new Schema({

        title: {
            type: String,
            required: true,
        },
        creator: { // talent creator must be an admin at all times
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        } 
    },
    {timestamps: true}

);

module.exports = mongoose.model('Talent', talentSchema);
