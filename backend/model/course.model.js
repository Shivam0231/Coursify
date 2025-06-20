import mongoose from "mongoose";
const courseschema=new mongoose.Schema({
     title:{
        type:'string',
        required:true
     },
     description:{
        type:'string',
        required:true
     },
     price:{
         type:'number',
         required:true
     },
     image:{
        public_id:{
            type:'string',
            required:true
        },
        url:{
            type:'string',
            required:true
        }

     },
     createrid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
     }

})

const Course = mongoose.model("Course",courseschema);
export default Course;