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

    const apiBaseURL = 'http://microbloglite.us-east-2.elasticbeanstalk.com'; // Replace with your actual API base URL
    const msg = document.getElementById('message'); // Ensure there's an element with id 'message' to show messages

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting the traditional way

        const username = document.getElementById("newUsername").value;
        const password = document.getElementById("newPassword").value;
        const fullName = document.getElementById("newfullName").value;

        // Clear any previous messages
        clearMsg();

        if (username && password) {
            console.log("All fields were successfully filled.");
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "username": username,
                "password": password,
                "fullName": fullName // Include the default fullName
            });

            console.log("Request payload:", raw); // Log the payload for debugging

            const options = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
            };

            fetch(apiBaseURL + "/api/users", options)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(`HTTP error! status: ${response.status} - ${err.message}`); });
                    }
                    return response.json();
                })
                .then(json => {
                    setTimeout(function() {
                        window.location.assign("index.html");
                    }, 5000);
                    msg.innerHTML = "User created successfully, Please wait...";
                })
                .catch(error => {
                    msg.innerHTML = "Something went wrong... check console.";
                    console.error("Error:", error.message); // Log the error message
                });

        } else {
            msg.innerHTML = "Please fill in all fields.";
            console.log("Check for blank fields");
        }
    });

    function clearMsg() {
        if (msg) {
            msg.innerHTML = "";
        }
    }
});

/* Original sign-up code
window.addEventListener('load', function () {
    this.document.getElementById("register").onclick = () => {
      // Values of Input Fields
      const username = document.getElementById("username").value;
      const pw = document.getElementById("psw").value;
      const confpw = document.getElementById("psw-repeat").value;
      const fullNameVal = this.document.getElementById("fullName").value;
      // TODO: CALL ON CLEAR MSG FUNCTION
      clearMsg();
  
      const isEmpty = (!(username && pw && confpw))
      if (!isEmpty && (pw === confpw)) {
        console.log("All fields were successfully filled.")
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        const raw = JSON.stringify({
          "username": username,
          "fullName": fullNameVal,
          "password": pw
        });
  
        const options = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        };
        fetch(apiBaseURL + "/api/users", options)
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json()
        })
        .then(json => {
            setTimeout(
                function () {
                    window.location.assign("index.html");
                }, 5000);
           msg.innerHTML = "User created successfully, Redirecting to Log In page"
  
        })
        .catch(error => {
          msg.innerHTML = "Something went wrong... check console."
            console.error("Error:", error);
        });
  
      } 
      else {
        msg.innerHTML = "Something went wrong... check console."
        if (isEmpty) {
          console.log("Check for blank fields")
        } else if (pw !== confpw) {
          console.log("Passwords don't match.")
        }
      }
    }
  })
*/