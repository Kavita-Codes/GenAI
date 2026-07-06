import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "username is required to create account"],
        unique:[true , "username must be unique"]
    },
    email:{
        type:String,
        required:[true, "email is required to create account"],
        unique:[true, "email must be unique"]
    },
    password:{
        type:String,
        required:[true, 'password must be unique']
    }
}, {timestamps:true})

const User = mongoose.model("User", userSchema)

export default User
