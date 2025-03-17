const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//Check if a user with the given username already exists
const isValid = (username)=>{
//Filter the Users array for any user with the same username
    let userwithsamename = users.filter((user) => {
        return user.username === username;
    });
//Return true if any user with the same username is found, otherwise false    
    if (userwithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

//Check if the user with the given username and password exist
const authenticatedUser = (username,password)=>{
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check to see if username or password  is missing
    if ( !username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    //Authenticate user
    if (authenticatedUser(username, password)) {
        //Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});

    //Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send('User successfully logged in');
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Extract books parameter form request URL
    const ISBN = req.params.books;
    let review = reviews[ISBN];  // Retrieve review object associated with ISBN
    if (review) {  // Check if review exists
        let Comment = req.body.Comment;
        // Add similarly for any other parameter
        // Update Comment if provided in request body
        if (Comment) {
            friend["Comment"] = Comment;
        }
        // Add similarly for any toher parameter
        reviews[ISBN] = review;  // Update review details in 'review' object
        res.send(`Books with the ISBN ${ISBN} updated.`);
    } else {
        // Respond if friend with specified email is not found
        res.send("Unable to find ISBN!");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
