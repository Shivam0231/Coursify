import dotenv from 'dotenv';
dotenv.config(); // ✅ This line loads .env variables into process.env

const JWT_SECRET = process.env.JWT_SECRET; // ✅ Declare the variable properly
const admin_jwt_secret = process.env.ADMIN_JWT_SECRET; // ✅ Declare the variable properly
const stripe_SECRET_KEY =process.env.STRIPE_SECRET_KEY
export default {
    JWT_SECRET,
    admin_jwt_secret,
    stripe_SECRET_KEY
};
