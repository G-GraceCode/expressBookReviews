const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let getUser = users.filter(user => user.username === username)
  if(getUser.length > 0) {
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let registeredUser = users.filter(user => { return (user.username === username && user.password === password)})
  if(registeredUser.length > 0) {
    return true
  } else{
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body

  if(username && password){
    if(authenticatedUser(username, password)){
      //generate token
      let accessToken = jwt.sign({
        data: password },
        "access",
        {expiresIn: 60 * 60}
      )
     //store token in session
      req.session.authorization = {
        accessToken, username
      }
      console.log('users', req.session.authorization['username'])
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(404).send("user not registered")
    }
  }
  return res.status(208).json({message: "Invalid username / password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {isbn} = req.params;
  const username = req.session.authorization['username'];
  const {review} = req.body

  let getBook = books[isbn]
  let getReview = getBook.reviews

  if(getBook){
    if(getReview[username]){
      if(review){
        getReview[username] = {"review": review}
      } 
      return res.status(200).json({message: "User review updated successfully!", [username]:{ 'review': review}})
    } else{
      getReview[username] = {"review": review}
      return res.status(200).json({message: "User review added, Successfully!",  [username]:{ 'review': review}})
    }
    
  }else{
    res.status(404).json({message: "ISBN book not found"})
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let {isbn} = req.params;
  let username = req.session.authorization['username']
  let getBook = books[isbn]
  let getUserReview = getBook.reviews[username]
  if(getUserReview){
    delete getUserReview
    return res.status(200).json({message: `${username} review deleted`})
  } else{
    return res.status(404).json({message: "User review not Found!"})
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
