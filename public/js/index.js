import { logIn, signUp, logOut } from './utils/users.js';


const logInButton = document.querySelectorAll('.login-and-signup i')[0];
const signUpButton = document.querySelectorAll('.login-and-signup i')[1];
const loginContainer = document.querySelector('.login-container');
const signUpContainer = document.querySelector('.signup-container');
export const isUserLoggedIn = document.querySelector('.user-logged-in') != undefined;

// handle login and signup buttons
logInButton.addEventListener('click', () => {
    loginContainer.style.display = 'block';
})

signUpButton.addEventListener('click', () => {
    signUpContainer.style.display = 'block';

})

document.body.addEventListener('click', (event) => {
    if (!event.target.classList.contains('backdrop')) return;

    loginContainer.style.display = 'none';
    signUpContainer.style.display = 'none';
})



const logInform = document.querySelector('.login-form');
logInform.addEventListener('submit', async (e) => {
    e.preventDefault();
    logIn();
});

const signupForm = document.querySelector('.signup-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signUp();
});


// handle registered users icon and logout button
const registeredUserIcon = document.querySelector('.registered-user');
const logoutButton = document.querySelector('.logout-button');
const unregisteredUser = document.querySelector('.unregistered-user');

if (isUserLoggedIn) {
    unregisteredUser.style.display = 'none';
} else {
    registeredUserIcon.style.display = 'none';
}

registeredUserIcon.addEventListener('click', (event) => {
    if (logoutButton.style.display !== 'block') {
        logoutButton.style.display = 'block';
    } else {
        logoutButton.style.display = 'none';
    }
})

logoutButton.addEventListener('click', () => {
    logOut();
})


document.addEventListener('DOMContentLoaded', async () => {
    if (document.querySelector('.registered-user').style.display === 'none') return;
    try {
        const res = await fetch("/get/files");
        const data = await res.json();
        createFileElements(data);
    } catch (e) {
        console.log(e);
    }
})


function createFileElements(files) {
    files.forEach((file) => {
        const container = document.createElement('div');
        const aElement = document.createElement('a');
        const img = document.createElement('img');
        const deleteButton = document.createElement('button');
        const fileNameElement = document.createElement('p');
        fileNameElement.innerText = file.key.split('_')[2];
        aElement.href = `/get-file?key=${file.key}`;
        aElement.target = "_blank";    
        img.src = getFileSrc(file);
        img.id = file.key;
        deleteButton.innerText = "מחק קובץ";
        deleteButton.addEventListener('click', () => deleteFile(file.key));
        document.querySelector('.files-container').appendChild(container);
        container.appendChild(fileNameElement);
        container.appendChild(aElement);
        container.appendChild(deleteButton);
        aElement.appendChild(img);
    })
}


function getFileSrc(file) {
    let fileSrc;
    switch (file.key.split('.')[1].toLowerCase()) {
        case 'png':
        case 'jpg':
            fileSrc = `/get-file?key=${file.key}`;
            break;
        case 'pdf':
            fileSrc = './img/pdf-icon.jpg';
            break;
        case 'docx': 
            fileSrc = './img/docx-icon.jpg';
            break;
        default:
            fileSrc = './img/file-icon.jpg';
    }
    return fileSrc;
}






async function deleteFile(key) {
    try {
        await fetch(`/delete-file?key=${key}`, { method: "DELETE" });
        location.reload();
    } catch (e) {
        console.log(e);
    }
}