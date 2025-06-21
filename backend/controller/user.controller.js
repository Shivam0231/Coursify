import User from '../model/user.model.js';
import bcrypt from 'bcryptjs'; // to hash passwords
import jwt from 'jsonwebtoken'; // to generate JWT tokens for user sessions and authorization
import {z} from 'zod';
import cookie from 'cookie-parser';
import config from '../config.js';
 // contains secret key for JWT tokens
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
    const user = new User({
        firstname: validatedData.firstname,
        lastname: validatedData.lastname,
        email: validatedData.email,
        password: hashedPassword // ✅ must match your Mongoose schema key
    });
    // check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });

} catch (error) {
    if (error instanceof z.ZodError) {
    // Set the first validation message as the main error message
    const firstError = error.errors[0]?.message || "Validation failed";
    return res.status(400).json({ message: firstError });
  }

  res.status(500).json({ message: error.message || "Server error" });
}
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch  || !user){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1d' });
        const cookieoption = { 
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 1 d
            httpOnly: true, // Cookie will only be sent over HTTP requests
            secure: true, // Cookie will only be sent over HTTPS requests if NODE_ENV is set to production
            sameSite:"none"// Cookie will only be sent over HTTP requests if it's from the same origin or a cross-origin request (Cross-Site Request Forgery (CSRF) protection)
         };  // Expires in 24 hours, cookie is only sent over HTTP requests, not included in HTTP responses.  // Cookie options: expires, httpOnly, secure, sameSite (default is 'lax')
        res.cookie('jwt',token,cookieoption);  // Set cookie with the token
        res.json({ message: 'Logged in successfully', user,token });

    }catch (error) {
        console.error(error);
        res.status(500).json({ message:error.message});
    }
}
export const logout = async (req, res) => {
    if(!req.cookies.jwt) return res.status(401).json({ message: 'User is not logged in ' })
    try{
         res.clearCookie('jwt');
         return res.status(200).json({ message: 'Logged out successfully' });
    }catch(error){
        console.error(error);
        res.status(500).json({ message:error.message});
    }
}
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.userid;
  // Define Zod schema locally inside the function
  const updateSchema = z.object({
    firstname: z.string().min(3, "First name must be at least 3 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  try {
    if (id === "1") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    }

    const result = updateSchema.safeParse(req.body);
    if (!result.success) {
      const errorMsg = result.error.errors[0].message;
      return res.status(400).json({ message: errorMsg });
    }

    const { firstname, lastname, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "User updated successfully" });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

