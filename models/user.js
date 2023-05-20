const mongoose = require('mongoose'); //db connection
const Schema = mongoose.Schema; //mongoose schema require

const userSchema = new Schema({

        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },        
        surname: {
            type: String,
            required: true,
        },
        memberId: {
            type: String,
            required: true,
        },
        ward: {
            type: String,
            required: true,
        },
        stake: {
            type: String,
            required: true,
        },
        age: {
            type: String,
            required: true,
        },
        whatsApp: {
            type: String,
            required: true,
        },
        admin: {
            type: Boolean,
            required: true,
            default: false
        },
        headline: {
            type: String,
        },
        skills: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Skill'
                }
            ]
    }

);

module.exports = mongoose.model('User', userSchema);
