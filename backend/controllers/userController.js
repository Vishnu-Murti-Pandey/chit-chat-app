const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const bcrypt = require('bcryptjs');


//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("User already Exits");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, pic });

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Failed to create user");
    }

});


//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw Error("Please enter all fields");
    }

    try {
        const user = await User.findOne({ email });

        //compare password with hash password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (user && isPasswordValid) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            });
        } else {
            res.status(400);
            throw new Error("Password is Invalid");
        }

    } catch (error) {
        res.status(400);
        throw new Error("User doesn't Exits");
    }

});

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

module.exports = { registerUser, authUser, allUsers };