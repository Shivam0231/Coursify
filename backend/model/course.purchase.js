import mongoose from "mongoose";

const purchaseschema = new mongoose.Schema({
  userid: {
    type: String, 
    required: true
  },
  courseid: {
    type: String,
    required: true
  },
});

const Purchase = mongoose.model("Purchase",purchaseschema);
export default Purchase;
