const mongoose = require('mongoose');

const schema = mongoose.Schema;

const CategorySchema = new schema ({
    name : {
        type : String,
        required : true
    },
    photo : {
        type : String,
    }
}, {timestamps : true})

module.exports = mongoose.model('Category', CategorySchema);