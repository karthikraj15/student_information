const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollSchema = new Schema({
    studentId:{
        type:Schema.Types.ObjectId,
        ref:'students'
    },
    courses:[{
        courseId:{
            type:Schema.Types.ObjectId,
            ref:'courses'
        },
        name:String,
        status: {
            type:Boolean,
            default:false
        }  
    }]
    
});

module.exports = mongoose.model("enroll", enrollSchema);