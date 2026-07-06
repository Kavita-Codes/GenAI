import dotenv from "dotenv"
dotenv.config()
import app from "./src/app.js"
import connectToDB from "./src/config/db.js"

connectToDB()

app.listen(3000, ()=>{
    console.log("server is running")
})