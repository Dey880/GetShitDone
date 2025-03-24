const User = require('../models/UserSchema');
const bcrypt = require('bcrypt');
const createJwt = require('../utils/createJwt');
const createCookie = require('../utils/createCookie');

const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

const authController = {
    login: async (req, res) => {
        const { password } = req.body;
        try {
            const email = req.body.email.toLowerCase();
            const user = await User.findOne({ email:
                email });
            if (!user) {
                return res.status(404).send({ msg: 'User not found' });
            }
            const role = 'user';
            let hashedPassword = user.password;
            const isPassword = await bcrypt.compare(password, hashedPassword);
            if (isPassword) {
                const jwtToken = createJwt(email, role);
                createCookie(res, jwtToken);
                res.status(202).send({ msg: 'User found!', user: user });
            } else {
                res.status(404).send({ msg: 'User not found' });
            }
        } catch (error) {
            console.error(error);
        }
    },
    register: (req, res) => {
        const { displayname, password, repeatPassword } = req.body;
        try {
            const email = req.body.email.toLowerCase();
            const role = 'user';
            if (password === repeatPassword) {
                bcrypt.hash(password, saltRounds, async function(err, hash) {
                    if (err) console.error(err, 'error');
                    const user = new User({
                        displayname: displayname,
                        role: role,
                        email: email,
                        password: hash,
                    });
                    user.save();
                    const jwtToken = createJwt(email, role);
                    await createCookie(res, jwtToken);
                    res.status(201).send({ message: 'Registered successfully', user: user });
                }
                );
            }
            else {
                res.status(400).send({ message: 'Please check your signup' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal server error', error: error });
        }
    },
    logout: (req, res) => {
        res.cookie('jwt', '', {
            maxAge: 1,
            httpOnly: true,
        });
        res.status(200).send({ msg: 'Logged out' });
    },
    getUser: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).send({ msg: 'User not found' });
            }
            res.status(200).send({ user: user });
        } catch (error) {
            console.error(error);
        }
    },
    user: async (req, res) => {
        if (!req.user) {
            return res.status(401).send({ msg: 'No user in request - check JWT token' });
        }
        
        const { email } = req.user;
        const lowerEmail = email.toLowerCase();
        
        try {
            const user = await User.findOne({
                email: lowerEmail,
            });
            if (!user) {
                return res.status(404).send({ msg: 'User not found' });
            }
            res.status(200).send({ user: user });
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).send({ msg: 'Server error', error: error.message });
        }
    }
};

module.exports = authController;