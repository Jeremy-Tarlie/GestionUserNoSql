const { createClient } = require('redis');

const client = createClient({
  password: 'zdJpqydDYaitGyHvA0nVs1mqm2sECjQU',
  socket: {
    host: 'redis-10528.c309.us-east-2-1.ec2.redns.redis-cloud.com',
    port: 10528
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
  await client.set(`user:${user.id}`, JSON.stringify(user));
};

module.exports = { setUser, getUser, deleteUser, updateUser, client };
