const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

const secretKey = 'your_secret_key'; 


exports.register = async (req, res) => {
  const { userName, email, password } = req.body;
  console.log("inside register");

  try {
   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, secretKey, { expiresIn: '1h' });

    // Send response with token
    res.status(201).json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while registering user' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create a token
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

    // Send token back to user
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while logging in' });
  }
};

// Verify token function
exports.verifyToken = async (req, res) => {

  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secretKey);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.id).select('-password');  // Exclude password field

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

   
    res.json({ msg: 'Token is valid', user });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: 'Invalid token' });
  }
};
