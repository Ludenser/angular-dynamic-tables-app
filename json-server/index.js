const fs = require('fs');
const jsonServer = require('json-server');
const db = require('./db.js');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(db);

server.use(jsonServer.defaults({}));
server.use(jsonServer.bodyParser);

server.use(async (req, res, next) => {
  await new Promise((res) => {
    setTimeout(res, 800);
  });
  next();
});

server.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    const userFromBd = db.users.find(user => user.username === username && user.password === password);

    if (userFromBd) {
      console.log(userFromBd);
      return res.json(userFromBd);
    }

    return res.status(403).json({ message: 'Incorrect Username or Password' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
});

server.post('/change-password', (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    const userIndex = db.users.findIndex(user => user.username === username && user.password === oldPassword);

    if (userIndex !== -1) {
      db.users[userIndex].password = newPassword;

      fs.writeFileSync(path.resolve(__dirname, 'users.json'), JSON.stringify(db.users, null, 2));

      return res.json({ message: 'Password successfully changed.' });
    } else {
      return res.status(403).json({ message: 'Invalid password.' });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
});

server.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: 'AUTH ERROR' });
  }

  next();
});

server.use(router);

server.listen(8000, () => {
  console.log('server is running on 8000 port');
});
