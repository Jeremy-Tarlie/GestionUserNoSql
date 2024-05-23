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

module.exports = { setUser, getUser, client };
