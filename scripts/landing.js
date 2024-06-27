/* Landing Page JavaScript */

"use strict";
// Selecting the login form correctly
const loginForm = document.getElementById("loginForm");

// Function to display error message
function displayErrorMessage(message) {
    const errorDisplay = document.getElementById('errorDisplay');
    errorDisplay.innerHTML = message;
    errorDisplay.classList.remove('d-none'); // Remove the 'd-none' class to show the error message
}

// Function to clear error message
function clearErrorMessage() {
    const errorDisplay = document.getElementById('errorDisplay');
    errorDisplay.innerHTML = '';
    errorDisplay.classList.add('d-none'); // Add the 'd-none' class to hide the error message
}

// Function to handle login form submission
loginForm.onsubmit = function (event) {
    // Prevent the form from refreshing the page
    event.preventDefault();

    // Disable the login button to prevent multiple submissions
    loginForm.loginButton.disabled = true;

    // Extract username and password from the form
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    // Prepare login data
    const loginData = {
        username: username,
        password: password,
    };

    // Call the login function with the login data
    login(loginData)
        .then(response => {
            // If login is successful, redirect to posts page
            window.location.assign("/posts.html");
        })
        .catch(error => {
            // If login fails, display error message
            console.error('Error during login:', error);
            displayErrorMessage("Username or Password was not recognized. Please try again.");
            loginForm.loginButton.disabled = false; // Re-enable login button
        });
};

// Function to handle sign-up section toggle
document.addEventListener("DOMContentLoaded", function() {
    const signupButton = document.getElementById('signupButton');
    const signupSection = document.getElementById('signupSection');
    const signupForm = document.getElementById('signupForm');

    signupButton.addEventListener('click', function() {
        signupSection.classList.toggle('d-none'); // Toggle visibility of signup section

        // Smooth scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (signupSection.classList.contains('d-none')) {
            // Reset signup form when hiding
            signupForm.reset();
        }
    });
});