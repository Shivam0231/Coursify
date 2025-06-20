import Admin from '../model/admin.model.js'; 
import bcrypt from 'bcryptjs'; // to hash passwords
import jwt from 'jsonwebtoken'; // to generate JWT tokens for user sessions and authorization
import {z} from 'zod'; // contains secret key for JWT tokens
export const signup = async (req, res) => {
    //signup logic here

    try {
    // Step 1: Validate first
    const schema = z.object({
        firstname: z.string().min(3, { message: 'First name should be at least 3 characters long' }),
        lastname: z.string().min(2, { message: 'Last name should be at least 2 characters long' }),
        email: z.string().email(),
        password: z.string().min(6, { message: 'Password should be at least 6 characters long' })
    });

    const validatedData = schema.parse(req.body); // ✅ this throws error if validation fails

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Step 3: Create user with hashed password
    const admin = new Admin({
        firstname: validatedData.firstname,
        lastname: validatedData.lastname,
        email: validatedData.email,
        password: hashedPassword // ✅ must match your Mongoose schema key
    });
    // check if user already exists
    const existingadmin = await Admin.findOne({ email: validatedData.email });
    if (existingadmin) {
        return res.status(400).json({ message: 'admin with this email already exists' });
    }
    await admin.save();

    res.status(201).json({ message: 'admin created successfully', admin });

} catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({
            errors: error.errors.map(err => err.message)
        });
    }

    res.status(500).json({ message: 'Server error ' });
}
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const admin = await Admin.findOne({ email });
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch  || !admin){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jwt.sign({ id: admin._id },process.env, { expiresIn: '1d' });
        const cookieoption = { 
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 1 hour
            httpOnly: true, // Cookie will only be sent over HTTP requests
            secure: process.env.NODE_ENV === 'production', // Cookie will only be sent over HTTPS requests if NODE_ENV is set to production
            sameSite: 'strict' // Cookie will only be sent over HTTP requests if it's from the same origin or a cross-origin request (Cross-Site Request Forgery (CSRF) protection)
         };  // Expires in 24 hours, cookie is only sent over HTTP requests, not included in HTTP responses.  // Cookie options: expires, httpOnly, secure, sameSite (default is 'lax')
        res.cookie('jwt',token,cookieoption);  // Set cookie with the token
        res.json({ message: 'Logged in successfully',admin,token });

    }catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}
export const logout = async (req, res) => {
    if(!req.cookies.jwt) return res.status(401).json({ message: 'admin is not logged in' })
    try{
        res.clearCookie('jwt');
        res.json({ message: 'Logged out successfully' });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}