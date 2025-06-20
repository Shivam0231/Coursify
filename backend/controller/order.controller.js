import Order from "../model/order.model.js";
import Purchase from "../model/course.purchase.js";
export const confermorder=async(req,res)=>{
      console.log("order");
      try{
            const orderdata=req.body;
            await Order.create(orderdata);
            console.log(orderdata);
            res.status(201).json({message:"order Details",orderdata});
            if(orderdata){
                   await Purchase.create({userid:orderdata.userId,courseid:orderdata.courseId});
            }

      }catch(error){
         console.log("errror in order:",error);
         res.status(401).json({message:"error in order creation"});
      }

      
}