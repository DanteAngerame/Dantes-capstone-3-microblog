/* Posts Page JavaScript */

"use strict";

let offset = 0; // Initialize offset for pagination
const limit = 10; // Number of posts to fetch per request

window.onload = (e) => {
   grabAlleThePosts();
    document.getElementById('postForm').addEventListener('submit', createPost);
};

function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}

function grabAlleThePosts() {
    const loginData = getLoginData();
    const myHeaders = new Headers();
    myHeaders.append('accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${loginData.token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?limit=${limit}&offset=${offset}`, requestOptions)
        .then(response => response.json())
        .then(posts => {
            displayPost(posts);
            offset += limit; // Increment offset for next pagination
        })
        .catch(error => console.error('Error fetching posts:', error));
}

function displayPost(postData) {
    const postList = document.getElementById('postContainer');
    const loginData = getLoginData();

    postData.forEach(post => {
        const cardHtml = `
            <div class="col-12 mb-4">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">@${post.username}</h5>
                  <p class="card-text">${post.text}</p>
                  <p class="card-text"><small class="text-muted">${new Date(post.createdAt).toLocaleString()}</small></p>
                </div>
              </div>
            </div>
          `;
        const cardElement = document.createElement('div');
        cardElement.classList.add('col-12', 'mb-2');
        cardElement.innerHTML = cardHtml;

        // Add delete button only if the post is created by the logged-in user
        if (post.username === loginData.username) {
            const deleteButton = createDeleteButton(post.id);
            cardElement.querySelector('.card-body').appendChild(deleteButton);
        }

        postList.appendChild(cardElement);
    });

    const seeMoreButton = document.getElementById('seeMoreButton');
    if (seeMoreButton) {
        if (postData.length < limit) {
            seeMoreButton.style.display = 'none';
        } else {
            seeMoreButton.style.display = 'block';
        }
    }
}

const seeMoreButton = document.getElementById('seeMoreButton');
if (seeMoreButton) {
    seeMoreButton.addEventListener('click', () => {
        grabAlleThePosts();
    });
}

function createPost(event) {
    event.preventDefault();

    const loginData = getLoginData();
    const myHeaders = new Headers();
    myHeaders.append('accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${loginData.token}`);
    myHeaders.append('Content-Type', 'application/json');

    const postText = document.getElementById('postText').value;
    const postBody = JSON.stringify({ text: postText });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: postBody,
        redirect: 'follow'
    };

    fetch('http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts', requestOptions)
        .then(response => response.json())
        .then(post => {
            const postList = document.getElementById('postContainer');
            const cardHtml = `
                <div class="col-12 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">${post.username}</h5>
                      <p class="card-text">${post.text}</p>
                      <p class="card-text"><small class="text-muted">${new Date(post.createdAt).toLocaleString()}</small></p>
                    </div>
                  </div>
                </div>
              `;
              console.log(post);
            const cardElement = document.createElement('div');
            cardElement.classList.add('col-12', 'mb-4');
            cardElement.innerHTML = cardHtml;
            const deleteButton = createDeleteButton(post._id);
            cardElement.querySelector('.card-body').appendChild(deleteButton);
            postList.prepend(cardElement);
        })
        .catch(error => console.error('Error creating post:', error));
}

function createDeleteButton(data) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "deleteBtn");
  deleteButton.setAttribute("type", "button");
  deleteButton.innerHTML = 
    `<span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>
    </span> Delete`;

    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      fetch(apiBaseURL + `/api/posts/${data}`, {
          method: "DELETE",
          headers: {
              Authorization: `Bearer ${getLoginData().token}`,
          },
      })
      .then((response) => {
          if (!response.ok) {
              throw new Error(`Failed to delete post. Status: ${response.status}`);
          }
          return response.json();
      })
      .then((data) => {
          console.log(`Deleting your post in progress`);
          setTimeout(function () {
              location.reload();
          }, 1000);
      })
      .catch((err) => {
          console.error(err);
          // Handle the error here, you can display an error message to the user or take other actions as needed.
      });
  });


  return deleteButton;
}