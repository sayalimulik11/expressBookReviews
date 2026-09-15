const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required"});
  }

  if (users.some(user => user.username === username)) {
    return res.status(404).json({message: "Username already exists"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filtered = {};
  for (let isbn in books) {
    if (books[isbn].author === author) {
      filtered[isbn] = books[isbn];
    }
  }
  res.send(JSON.stringify(filtered, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filtered = {};
  for (let isbn in books) {
    if (books[isbn].title === title) {
      filtered[isbn] = books[isbn];
    }
  }
  res.send(JSON.stringify(filtered, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

// Task 10: Get all books using Promise callbacks
function getAllBooksPromise() {
  axios.get('http://localhost:5000/')
    .then(response => {
      console.log("All books (Promise):", response.data);
    })
    .catch(error => {
      console.log("Error:", error.message);
    });
}

// Task 11: Get book by ISBN using Promise callbacks
function getBookByISBNPromise(isbn) {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      console.log("Book by ISBN (Promise):", response.data);
    })
    .catch(error => {
      console.log("Error:", error.message);
    });
}

// Task 12: Get books by author using async/await
async function getBooksByAuthorAsync(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log("Books by Author (Async/Await):", response.data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

// Task 13: Get books by title using async/await
async function getBooksByTitleAsync(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log("Books by Title (Async/Await):", response.data);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

module.exports.general = public_users;