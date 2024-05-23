const express = require('express');
const path = require('path');
const db = require('./models');
const { setUser, getUser } = require('./services/redisService');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Root route serving the navigation page
app.get('/', (req, res) => {
  res.render('index');
});

// Route to render the user page with forms
app.get('/createUser', (req, res) => {
  res.render('user');
});

// Route to render the get user page with forms
app.get('/getUser', async (req, res) => {
  // Retrieve all users from SQL database
  const users = await db.User.findAll();

  // Render the getUser page and pass the users data to the template
  res.render('getUser', { users });
});


// Handle form submissions for creating a user
app.post('/user', async (req, res) => {
  const { name, email } = req.body;

  // Save user to SQL database
  const createdUser = await db.User.create({ name, email });

  // Save user to Redis
  await setUser(createdUser);

  res.status(201).json(createdUser);
});

// Handle form submissions for retrieving a user
app.get('/user', async (req, res) => {
  const { id } = req.query;

  // Retrieve user from Redis
  const user = await getUser(id);

  if (user) {
    res.json(user);
  } else {
    // Retrieve user from SQL database if not found in Redis
    const userFromDb = await db.User.findByPk(id);
    if (userFromDb) {
      // Save retrieved user to Redis for future requests
      await setUser(userFromDb);
      res.json(userFromDb);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
