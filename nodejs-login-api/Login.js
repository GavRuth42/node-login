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

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging in' });
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
