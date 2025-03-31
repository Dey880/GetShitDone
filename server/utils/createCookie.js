require("dotenv").config();

async function createCookie(res, jwtToken) {
    res.cookie("jwt", jwtToken, {
        maxAge: 1000*60*60*24*5, // 5 days
        sameSite: "lax"
    });
}

module.exports = createCookie;