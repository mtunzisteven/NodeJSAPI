const mongoose = require('mongoose'); //db connection
const Schema = mongoose.Schema; //mongoose schema require

const skillSchema = new Schema({

        skill: {
            type: String,
            required: true,
        },
        proficiency: {
            type: Number,
            required: true,
        },
        qualification: {
            type: String
        },
        institution: {
            type: String
        },
        creator: { // skill creator must be an admin at all times
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        CredentialsContainer: {
            type: Object,
            required: false,
        }
    },
    {timestamps: true}

);

module.exports = mongoose.model('Skill', skillSchema);
