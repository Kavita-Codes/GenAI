import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    username:{
        type:String,
        required:[true, "username is required to create account"],
        unique:[true , "username must be unique"],
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:[true, "email is required to create account"],
        unique:[true, "email must be unique"],
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true, 'password is required']
    }
}, {timestamps:true})

const User = mongoose.model("User", userSchema)

export default User
