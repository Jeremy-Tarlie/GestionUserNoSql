const { createClient } = require('redis');

const client = createClient({
  password: '***',
  socket: {
    host: '***',
    port: ***
  }
});

client.connect().catch(console.error);

const setUser = async (user) => {
  await client.set(`user:${user.id}`, JSON.stringify(user));
};

const getUser = async (userId) => {
  const user = await client.get(`user:${userId}`);
  return JSON.parse(user);
};

const deleteUser = async (userId) => {
  await client.del(`user:${userId}`);
}

const updateUser = async (user) => {
  await setUser(user);
};

module.exports = { setUser, getUser, deleteUser, updateUser, client };
