const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let {username, password} = req.body

  if(username && password){
    if(isValid(username)){
      return res.status(404).json({message: 'user Exist already!'})
    }else {
      users.push({username: username, password: password})
      return res.status(200).json({message: "User registered, Please login"})
    } 
  } 
  
  return res.status(404).json({message: "User not registed"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let allBooks = JSON.stringify(books)
  return res.status(200).json(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let {isbn} = req.params
  let getBook = books[isbn]
  return res.status(200).json(getBook);
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  let {author} = req.params;
  let listOfUnknownAuthors = []

  for(let book in books){
    if(books[book].author == author ){
      listOfUnknownAuthors.push(books[book]);
    }
  }
  return res.status(200).json(listOfUnknownAuthors)
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  let {title} = req.params
  for(let book in books){
    if(books[book].title == title) {
      return res.status(200).json(books[book]);
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let {isbn} = req.params
  let bookReviews = books[isbn].reviews
  return res.status(200).json({review: bookReviews});
});

module.exports.general = public_users;
