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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/createUser', (req, res) => {
  res.render('user');
});

app.get('/getUser', async (req, res) => {
  const users = await db.User.findAll();

  res.render('getUser', { users });
});


app.post('/user', async (req, res) => {
  const { name, email } = req.body;

  const createdUser = await db.User.create({ name, email });

  await setUser(createdUser);

  res.status(201).json(createdUser);
});

app.get('/user', async (req, res) => {
  const { id } = req.query;

  const user = await getUser(id);

  if (user) {
    res.json(user);
  } else {
    const userFromDb = await db.User.findByPk(id);
    if (userFromDb) {
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
