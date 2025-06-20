import Course from "../model/course.model.js";
import purchase from "../model/course.purchase.js"
import { v2 as cloudinary } from 'cloudinary';
import config from "../config.js";
export const createcourse = async (req, res) => {
  const { title, description, price } = req.body;
  const adminid=req.adminid;
  // console.log(req.body);
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { image } = req.files;
    const imageFormats = ["image/jpeg", "image/png"];

    if (!imageFormats.includes(image.mimetype)) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    const uploadResult = await cloudinary.uploader.upload(image.tempFilePath);

    if (!uploadResult || uploadResult.error) {
      return res.status(500).json({ message: 'Failed to upload image' });
    }
    const db_temp = {
      title,
      description,
      price,
      image: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
      createrid:adminid
    };
//     console.log("Title:", db_temp.title);
// console.log("Description:", db_temp.description);
// console.log("Price:", db_temp.price);
// console.log("Image:", db_temp.image);
    if (!db_temp.title || !db_temp.description || !db_temp.price || !db_temp.image || !db_temp.createrid  || db_temp.createrid.length===0  ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const dbdata = await Course.create(db_temp);
    res.status(201).json({ message: "Course created successfully", data: dbdata });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updatecourse = async (req, res) => {
  try {
    const { courseid }=req.params;
    const adminid= req.adminid;
    const newData = req.body;
     const coursesearch = await Course.findOne({ _id: courseid,createrid:adminid });
     if (!coursesearch) {
      console.log("Course is created by another admin");
      return res.status(404).json({ message: "Course is created by another admin" });
    }
    // Make sure upsert is false — it should NOT create if not found
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseid,createrid:adminid },             // Match course by ID
      newData,                 // Update data
      { new: true, upsert: false, runValidators: true } // Don't insert, validate data
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated successfully", data: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deletecourse = async (req, res) => {
  console.log("deleting course");
  try{
      const { courseid }=req.params;
      const adminid = req.adminid;
      const deletedCourse = await Course.findOneAndDelete({_id:courseid,createrid:adminid  });
      if(!deletedCourse){
        return res.status(404).json({ message: "couse is created by another admin" });
      }
      res.json({ message: "Course deleted successfully", data: deletedCourse });
  }catch (error) {
    console.log("Error deleting course:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const getcourse = async (req, res) => {
  try {
    const courses = await Course.find({});

    // Optional: Log only if needed
    console.log("Courses:", courses);

    // Check if no courses found
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    // Send response
    res.status(200).json({ message: "Courses fetched successfully", data: courses });

  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getcoursedetail=async (req, res) => {
  console.log("Fetching course details 111");
    try{
        const { courseid } = req.params;
        const course = await Course.findById(courseid);
        if(!course){
            return res.status(404).json({ message: "Course not found" });
        }
        console.log("Course details:", course);
        res.json({ message: "Course fetched successfully", data: course });
    }catch (error) {
      console.log("Error fetching course details111:", error);
        res.status(500).json({ message: "Server error" });
    }
}

import Stripe from "stripe";  


const stripe=new Stripe(config. stripe_SECRET_KEY);
console.log(config.stripe_SECRET_KEY);
export const buycourse = async (req, res) => {
  try {
    const { courseid } = req.params;

    const iscourseavailable = await Course.findById(courseid);
    if (!iscourseavailable) {
        return res.status(404).json({ message: "Course not found" });
    }

    const userid = req.userid;

    // Use findOne to check if already purchased
    const alreadyPurchased = await purchase.findOne({ userid, courseid });
    if (alreadyPurchased) {
        return res.status(400).json({ message: "User already purchased this course" });
    }
     //schema to accept payments
     const amountInCents = Math.round(iscourseavailable.price* 100);
    const paymentIntent = await stripe.paymentIntents.create({
    amount:amountInCents,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    payment_method_types: ["card"],
  });

    res.json({ message: "Course purchased successfully",iscourseavailable,clientsecret:paymentIntent.client_secret });
} catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error"});
}
}
export const listpurchases = async (req, res) => {
try {
   console.log("Fetching purchases for user:");
    const userid = req.userid;
    
    const purchases = await purchase.find({ userid });
    
    const allcourseid = purchases.map((val) => val.courseid);

    // Fetch all course details in parallel
    const listcourse = await Promise.all(
        allcourseid.map((courseid) => Course.findById(courseid))
    );

    res.json({
        message: "Purchases fetched successfully",
        datas: {
            purchases,
            listcourse
        }
    });

} catch (error) {
    console.log("Error fetching purchases:", error);
    res.status(500).json({ message: "Server error" });
}
}

