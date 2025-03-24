const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema.js");
require("dotenv").config();

async function verifyJwt(req, res, next) {
    const jsonwebtoken = req.cookies.jwt;
    if (!jsonwebtoken) {
        console.error('No JWT found in cookies');
        return res.status(401).send({ msg: 'No token provided' });
    }

    await jwt.verify(jsonwebtoken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).send({ msg: "User not authenticated" });
        }

        try {
            let email = decoded.email;
            req.user = decoded;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).send({ msg: "No user found" });
            }
            req.user.id = user._id;

            next();
        } catch (error) {
            console.error(error);
            return res.status(404).send({ msg: "No user found" });
        }
    });
};

module.exports = verifyJwt;