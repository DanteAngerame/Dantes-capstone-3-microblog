/* auth.js provides LOGIN-related functions */

"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
// Backup server (mirror):   "https://microbloglite.onrender.com"

// NOTE: API documentation is available at /docs 
// For example: http://microbloglite.us-east-2.elasticbeanstalk.com/docs


// You can use this function to get the login data of the logged-in
// user (if any). It returns either an object including the username
// and token, or an empty object if the visitor is not logged in.
function getLoginData () {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}


// You can use this function to see whether the current visitor is
// logged in. It returns either `true` or `false`.
function isLoggedIn () {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}


// Function to display error message
function displayErrorMessage(message) {
    const errorDisplay = document.getElementById('errorDisplay');
    errorDisplay.textContent = message;
    errorDisplay.classList.remove('d-none'); // Remove the 'd-none' class to show the error message
}

// Function to clear error message
function clearErrorMessage() {
    const errorDisplay = document.getElementById('errorDisplay');
    errorDisplay.textContent = '';
    errorDisplay.classList.add('d-none'); // Add the 'd-none' class to hide the error message
}

// This function handles the login process, including error handling for invalid credentials.
function login(loginData) {
    // POST /auth/login
    const options = { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    };

    return fetch(apiBaseURL + "/auth/login", options)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            return response.json();
        })
        .then(loginData => {
            if (loginData.message === "Invalid username or password") {
                displayErrorMessage("Invalid username or password. Please try again."); // Display error message
                return null;
            }

            clearErrorMessage(); // Clear any previous error message
            window.localStorage.setItem("login-data", JSON.stringify(loginData));
            window.location.assign("/posts.html");  // Redirect to posts page on successful login

            return loginData;
        })
        .catch(error => {
            console.error('Error during login:', error);
            const errorMessage = "Username or Password was not recognized.<br>Please try again.";
            document.getElementById('errorDisplay').innerHTML = errorMessage;
            document.getElementById('errorDisplay').classList.remove('d-none'); // Make sure error message is visible
            return null; // Return null or handle as needed
        });
}

// This is the `logout()` function you will use for any logout button
// which you may include in various pages in your app.
function logout() {
    const loginData = getLoginData();

    // GET /auth/logout
    const options = { 
        method: "GET",
        headers: { 
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {
            window.localStorage.removeItem("login-data");
            window.location.assign("/index.html");
        });
}
/*
Example usage:
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        login({ username, password });
    });
});*/

