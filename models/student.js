const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    usn:{
        type: String,
        required: true,
        unique: true
    },
    sem:String,
    dob:String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: Number,
    college: String,
    address:String
});

module.exports = mongoose.model("students", studentSchema);