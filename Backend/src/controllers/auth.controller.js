import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export async function registerController(req, res) {
  try {
      const { name, username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(401).json({
      message: "all field are required",
      success: false,
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(401).json({
      message: "user already exists",
    });
  }

  const hashPass = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    username,
    password: hashPass,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);

  return res.status(201).json({
    message: "account registered successfully",
    success:true,
    user:{
      id:user._id,
      username:user.username,
      email:user.email
    }
  });
}
   catch (error) {
     return res.status(500).json({
        message:error.message,
        success:false
    })
  }}

export async function loginController(req, res) {
 try {
     const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      message: "all field are required",
      success: false,
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "user not registered. Please register first!",
    });
  }

  const comparePass = await bcrypt.compare(password, user.password);

  if (!comparePass) {
    return res.status(401).json({
      message: "password did not match. Enter correct Password!",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token);

  return res.status(201).json({
    message: "user loggedIn successfully",
    success:true,
    user:{
      id:user._id,
      username:user.username,
      email:user.email
    }
  });
 } catch (error) {
    return res.status(500).json({
        message:error.message,
        success:false
    })
 }
}
export async function logoutController(req,res){
    try {
      res.clearCookie("token")
      
      return res.status(200).json({
        message:"user logout successfully",
        success:true
      })
    } catch (error) {
         return res.status(500).json({
        message:error.message,
        success:false
    })
    }
}

export async function getMeController(req,res){
  try {
    const user = await User.findById(req.user.userId).select("-password")

    return res.status(200).json({
        message:"user getting successfully",
       user
    })


  } catch (error) {
       return res.status(500).json({
        message:error.message,
        success:false
    })
    
  }
}