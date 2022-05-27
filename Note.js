const mongoose = require('mongoose');
const { Schema } = mongoose;
const NoteSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'

    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        default:"Gernel"
    }
})

module.exports = mongoose.model('Notes', NoteSchema);