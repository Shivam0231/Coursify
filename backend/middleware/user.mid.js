import jwt from 'jsonwebtoken';
import config from '../config.js';
export const usermiddleware=(req, res, next) => {
     // verify wheather the user is authenticated or not
     // verify the token with jwt
     try{ 
         console.log("User middleware triggered 🚀");

     const authheader=req.headers.authorization;
     console.log('Authorization:', authheader);
     if(!authheader || !authheader.startsWith('Bearer ')){
         return res.status(401).json({message: 'No token, authorization denied'});
     }
     const token=authheader.split(' ')[1];
     console.log('Token:', token);
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.userid = decoded.id;  // store user ID in request
        next();
     }catch(error){
          console.log('Error:', error);
         return res.status(403).json({message: 'Token is not valid'});
     }     

}