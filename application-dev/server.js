const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { connectToDatabase } = require('./db/app');

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/contact_us', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact_us.html'));
});

app.post('/login', async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    try {
        // Make a POST request to your authentication API
        const response = await axios.post('http://localhost:4000/login', {
            email: email,
            password: password
        });

        if (response.data.message === 'Authentication successful.') {
            // Redirect to the /about page on successful authentication
            return res.redirect('/about');
        } else {
            // Authentication failed
            return res.send('Authentication failed.');
        }
    } catch (error) {
        // Handle any errors from the API request
        console.error('Error:', error);
        return res.send('Error occurred during authentication.');
    }
});
connectToDatabase();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
