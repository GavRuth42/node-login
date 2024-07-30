// Login.js

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const session = require('express-session');
const cors = require('cors');
// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Add this line
// Initialize Sequelize
const sequelize = new Sequelize('my_database', 'please2', 'Jaxon4266$', {
  host: 'ec2-3-215-102-128.compute-1.amazonaws.com',
  dialect: 'mysql'
});
// Define User model
const User = require('./models/User.js')(sequelize, DataTypes);

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
  
    const token = jwt.sign({ id: user.id }, 'your_secret_key', {
      expiresIn: '1h',
    });
  
    const profileCreated = user.profileCreated; // Assuming profileCreated is a field in the User model
  
    res.json({ token, profileCreated });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Sync database and start server
sequelize.sync().then(() => {
  app.listen(3001, '0.0.0.0',() => {
    console.log('Server is running on port 3001');
  });
});
