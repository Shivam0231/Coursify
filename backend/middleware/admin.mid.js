import jwt from 'jsonwebtoken';
import config from '../config.js';
export const adminmiddleware=(req, res, next) => {
     // verify wheather the user is authenticated or not
     // verify the token with jwt
     try{ 
         console.log("admin middleware triggered 🚀");

     const authheader=req.headers.authorization;
     console.log('Authorization:', authheader);
     if(!authheader || !authheader.startsWith('Bearer ')){
         return res.status(401).json({message: 'No token, authorization denied'});
     }
     const token=authheader.split(' ')[1];
     console.log('Token:', token);
        const decoded = jwt.verify(token, config.admin_jwt_secret);
        req.adminid = decoded.id;  // store user ID in request
        next();
     }catch(error){
         return res.status(403).json({message: 'Token is not valid'});
     }     

}