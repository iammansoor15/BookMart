const mongoose = require('mongoose');
const validator = require('validator');;



const userSchema = new mongoose.Schema({
    firstname: {
        type:String,
        required:true
    },
    lastname: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    phone: {
        type:String,
        required:true,
        minlength:10,
        maxlength:10
    },
    password: {
        type:String,
        required:true,
        minlength:6
    },
    role: {
        type: String,
        enum: ['seeker', 'owner'],  
        default: 'user'
    },
    books : {
        type: Array,
        default: []
    }

})



module.exports = new mongoose.model("USER",userSchema);