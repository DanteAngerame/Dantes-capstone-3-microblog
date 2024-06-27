"use strict";

let offset = 0; // Initialize offset for pagination
const limit = 1000; // Number of posts to fetch per request
//const apiBaseURL = 'http://microbloglite.us-east-2.elasticbeanstalk.com';

window.onload = (e) => {
    getAllPostFromUser();
    console.log('test')
};

function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}

function getAllPostFromUser() {
    
    const loginData = getLoginData();
    console.log(loginData.username)
    const myHeaders = new Headers();
    myHeaders.append('accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${loginData.token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
console.log(loginData.username)
    fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?limit=${limit}&offset=${offset}&username=${loginData.username}`, requestOptions)
        .then(response => response.json())
        .then(posts => {
            const myPosts = posts.filter(post => post.username === loginData.username);
            displayPost(myPosts);
            offset += limit; // Increment offset for next pagination
        })
        .catch(error => console.error('Error fetching posts:', error));
}

function displayPost(postData) {
    const postList = document.getElementById('postContainer');

    postData.forEach(post => {
   
        const cardElement = document.createElement('div');
        cardElement.classList.add('col-12', 'mb-4');
        cardElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${post.username}</h5>
                    <p class="card-text">${post.text}</p>
                    <p class="card-text"><small class="text-muted">${new Date(post.createdAt).toLocaleString()}</small></p>
                    <button class="btn deleteBtn" data-id="${post._id}">
                    <span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>
    </span> Delete</button>
                </div>
            </div>
        `;
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

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', function() {
            deletePost(this.dataset.id);
        });
    });
}

const seeMoreButton = document.getElementById('seeMoreButton');
if (seeMoreButton) {
    seeMoreButton.addEventListener('click', () => {
        getAllPostFromUser();
        alert('hi')
    });
}

function deletePost(postId) {
    const loginData = getLoginData();
    fetch(`${apiBaseURL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to delete post. Status: ${response.status}`);
        }
        document.querySelector(`[data-id="${postId}"]`).parentElement.parentElement.remove();
    })
    .catch(error => console.error('Error deleting post:', error));
}