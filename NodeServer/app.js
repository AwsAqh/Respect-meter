const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  
const authRoutes = require('./routes/authRoutes')
const habitRoutes=require('./routes/habitRoutes')
const app = express();


app.use(cors());  


app.use(cors({
  origin: 'http://localhost:5173'  
}));


app.use(express.json());  

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/habit-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/habits',habitRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
