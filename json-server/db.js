const fs = require('fs');
const path = require('path');

const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'users.json'), 'utf-8'));
// const posts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'posts.json'), 'utf-8'));
// const articles = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'articles.json'), 'utf-8'));

module.exports = {
  users,
  // posts,
  // articles
};
