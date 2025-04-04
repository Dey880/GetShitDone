require("dotenv").config();

async function createCookie(res, jwtToken) {
    res.cookie("jwt", jwtToken, {
        httpOnly: true,
        maxAge: 1000*60*60*24*5, // 5 days
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    });
}

module.exports = createCookie;