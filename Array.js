const mongoose = require('mongoose');
const { Schema } = mongoose;
const ArraySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    education: {
        type: Array,
        required: true
    },
    skill: {
        type: Array,
        required: true
    },
    language: {
        type: Array,
        required: true
    },
    interest: {
        type: Array,
        required: true
    },
    experience: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Array', ArraySchema);