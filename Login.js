const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const { User } = require('./models');
const cors = require('cors');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());
app.use(cors()); // Add this line to enable CORS
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const User = require('./User.js')(sequelize, DataTypes);

sequelize.sync();

module.exports = {
  sequelize,
  User
};

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, profileCreated: user.profileCreated });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});


// Sign-up endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, username, password: hashedPassword });

    res.status(201).json({ message: 'Sign-up successful', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while signing up' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
