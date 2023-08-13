const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

// Add user
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to register user.' });
      }
      res.status(201).json({ message: 'User registered successfully.' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Authenticate user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.status(200).json({ message: 'Authentication successful.' });
    } else {
      res.status(401).json({ error: 'Authentication failed.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Update user data based on email
app.post('/push', async (req, res) => {
  const { email, job_title, skill_level, age, height, weight } = req.body;

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.run(
      'UPDATE users SET job_title = ?, skill_level = ?, age = ?, height = ?, weight = ? WHERE email = ?',
      [job_title, skill_level, age, height, weight, email],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update user data.' });
        }
        res.status(200).json({ message: 'User data updated successfully.' });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get details of a specific user by email
app.get('/users/:email', async (req, res) => {
  const email = req.params.email;

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch user details.' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'User not found.' });
      }

      res.status(200).json(row);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
