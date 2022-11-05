const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name : String,
    startDate : String,
    endDate : String,
    credit : Number,
    total_hours : Number,
    description : String
});

module.exports = mongoose.model("courses", courseSchema);