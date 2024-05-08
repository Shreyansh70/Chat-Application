import bcrypt from 'bcrypt';
import User from "../models/user.model.js";
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
    
    console.log("signup controller called");
    
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Password's don't match" });
    }

    const user = await User.findOne({ username });

    if (user) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const transgenderProfilePic = 'https://i.ytimg.com/vi/cOsCtFVcBNY/hqdefault.jpg'

    console.log(req.body);

    const newUser = await User.create({
        username: username,
        fullName,
        password: hashedPassword,
        gender,
        profilePic: gender === 'male' ? boyProfilePic : gender === 'female' ? girlProfilePic : transgenderProfilePic 
    })

    if(newUser){        
        try {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            return res.status(201).json({ 
                _id: newUser.id,
                username: newUser.username,
                fullname: newUser.fullname,
                profilePic: newUser.profilePic
            });
        } catch (error) {
            console.log('Error in Signup controller: ' + error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    else{
        return res.status(400).json({error : "Invalid User Data"});
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{ maxAge:0 });
        res.status(200).json({message: "User logged out Successfully"});
    } catch (error) {
        console.log('Error in Logout controller: ' + error.message);
            return res.status(500).json({ error: "Internal Server Error" });
    }
}
export const login = async (req, res) => {
    try {
        const {username , password} = req.body;
        const ExistingUser = await User.findOne({username});
        
        if (!ExistingUser) {
            return res.status(400).json({ error: "User Doesn't Exists, Please Enter Valid Username!!!" });
        }
    
        const passwordMatch = await bcrypt.compare(password, ExistingUser.password);
    
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid password!!!" });
        }
    
        try {
            generateTokenAndSetCookie(ExistingUser._id, res);
            
            return res.status(200).json({
                _id: ExistingUser._id,
                username: ExistingUser.username,
                fullName: ExistingUser.fullName,
                profilePic: ExistingUser.profilePic,
            });
        } catch (error) {
            console.log('Error in Login controller: ' + error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } catch (error) {
        console.log('Error in Login controller: ' + error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }


}