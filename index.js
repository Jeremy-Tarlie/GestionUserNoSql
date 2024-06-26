const express = require('express');
const path = require('path');
const db = require('./models');
const { setUser, getUser, deleteUser, updateUser } = require('./services/redisService');

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

app.post('/deleteUser', async (req, res) => {
  const { id } = req.body;

  const deletedUser = await db.User.destroy({ where: { id } });

  if (deletedUser) {
    await deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/updateUser', async (req, res) => {
  try {
    const user = await db.User.findByPk(userId);

    res.render('updateUser', { user });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).send('Error retrieving user');
  }
});

app.post('/updateUser', async (req, res) => {
  const { id, name, email } = req.body;

  try {
    const updatedUser = await db.User.update(
      { name, email },
      { where: { id } }
    );

    if (updatedUser) {
      await updateUser(id, { name, email });
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
