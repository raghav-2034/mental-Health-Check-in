// server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());

// Set the correct static file directory
app.use(express.static(path.join(__dirname, 'project_website-main', 'project_website-main', 'home')));

const USERS_FILE = path.join(__dirname, 'users.json');

// Move login route before the static file serving
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'login.html'));
});

// Routes for all pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'register.html'));
});

app.get('/meditation', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'meditation.html'));
});

app.get('/mood-tracker', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'mood-tracker.html'));
});

app.get('/quick-assessment', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'quick-assessment.html'));
});

app.get('/stress-indicator', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'stress-indicator.html'));
});

app.get('/community-support', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'community-support.html'));
});

app.get('/wellness-activities', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'wellness-activities.html'));
});

app.get('/resources', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'resources.html'));
});

app.get('/analyse-mood', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'analyse-mood.html'));
});

app.get('/mental-analysis', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'mental-analysis.html'));
});

app.get('/self-care-planner', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'self-care-planner.html'));
});

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        // Read existing users
        let users = [];
        try {
            const data = await fs.readFile(USERS_FILE, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            // File doesn't exist yet, that's ok
        }

        // Check if user already exists
        if (users.some(user => user.email === req.body.email)) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Store the password as-is since it's already encoded from frontend
        const newUser = {
            ...req.body,
            registeredAt: new Date().toISOString()
        };
        users.push(newUser);

        // Save updated users
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        res.json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Read users from JSON file
        const data = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(data);
        
        // Find user with matching email
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        // Compare the encoded passwords directly
        if (password !== user.password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        // Remove password from user object before sending
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({ 
            message: 'Login successful',
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'project_website-main', 'project_website-main', 'home', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});