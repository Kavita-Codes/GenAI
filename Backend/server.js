import dotenv from "dotenv"
dotenv.config()
import express from "express"
import app from "./src/app.js"
import connectToDB from "./src/config/db.js"
import path from "path"

connectToDB()

const _dirname = path.resolve()

app.use(express.static(path.join(_dirname, "/Frontend/dist")))

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"))
})

app.listen(3000, ()=>{
    console.log("server is running")
})