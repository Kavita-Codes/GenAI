import mongoose from "mongoose"

const technicalQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true, "question is required"]
    },
    intention:{
        type:String,
        required:[true, "intention is required"]
    },
    answer:{
        type:String,
        required:[true, "answer is required"]
    }
},{_id:false})

const behavioralQuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:[true, "question is required"]
    },
intention:{
        type:String,
        required:[true, "intention is required"]
    },

    answer:{
        type:String,
        required:[true, "answer is required"]
    }
},{_id:false})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type:String,
        required:[true, "skill is required"]
    },
     severity:{
        type:String,
        enum:["low", "medium", "high"],
    }
     },{_id:false})


  const preparationSchema = new mongoose.Schema({

    day:{
        type:Number,
        required:[true, "day is required"]
    },
    focusArea:{
        type:String,
        required:[true, "focus area is required"]
    },
    tasks:[{
        type:[String],
        required:[true, "tasks are required"]
    }]
  }

  )


const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true, "job description is required"]
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type:String,
    },
    matchScore:{
        type:Number,
        min:0,
        max:100
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        
    }
},{
    timestamps:true

})

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema)

export default InterviewReport