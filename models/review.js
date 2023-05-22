const mongoose = require('mongoose'); //db connection
const Schema = mongoose.Schema; //mongoose schema require

const reviewSchema = new Schema({

        rating: {
            type: Number,
            required: true,
        },
        review:{
            type: String,
            required: true,
        },
        creator: { // review creator 
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {timestamps: true}

);

module.exports = mongoose.model('Review', reviewSchema);
