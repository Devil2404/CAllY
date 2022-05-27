const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProfileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    Name: {
        type: String,
        required: true
    },
    subname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    gmail: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    linkedin: {
        type: String
    }
})

module.exports = mongoose.model('Profile', ProfileSchema);