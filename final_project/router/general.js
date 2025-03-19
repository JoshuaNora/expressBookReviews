const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
//Use {"username":"user2", "password":"password2"} as body parameters to test the output
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    //Write your code here
    new Promise((resolve, reject) => {
      resolve(books);
    })
      .then((bookList) => {
        res.send(JSON.stringify(bookList, null, 4));
      })
      .catch((err) => {
        res.status(500).json({ message: "Error retrieving book list" });
      });
  });   

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const ISBN = req.params.isbn;
    new Promise((resolve, reject) => {
      const book = books[ISBN];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    })
      .then((book) => res.send(book))
      .catch((err) => res.status(404).json({ message: err }));
  });
  
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const authorName = req.params.author;
    new Promise((resolve, reject) => {
      let filtered_books = Object.values(books).filter(
        (book) => book.author === authorName
      );
      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject("No books found for the given author");
      }
    })
      .then((filtered_books) => res.send(filtered_books))
      .catch((err) => res.status(404).json({ message: err }));
  });

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const bookTitle = req.params.title;
    new Promise((resolve, reject) => {
      let filtered_books = Object.values(books).filter(
        (book) => book.title === bookTitle
      );
      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject("No books found with the given title");
      }
    })
      .then((filtered_books) => res.send(filtered_books))
      .catch((err) => res.status(404).json({ message: err }));
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else{
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
