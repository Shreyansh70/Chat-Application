import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userid, res) => {
    const token = jwt.sign({userid} , process.env.JWT_SECRET , {
        expiresIn: "15d"});

    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Set cookie expiration time to 15 days
        httpOnly: true, // Cookie cannot be accessed by client-side JavaScript
        samesite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });

};

export default generateTokenAndSetCookie;
