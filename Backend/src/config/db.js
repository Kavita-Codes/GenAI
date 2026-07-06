import mongoose from "mongoose"

async function connectToDB(){
      try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('database connected')
      } catch (error) {
        console.log(error.message)
      }
}

export default connectToDB