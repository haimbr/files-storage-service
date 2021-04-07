
const handleError = (container, errors) => {
    console.log(container, errors);
    const emailError = container.querySelector(".email.error");
    const passwordError = container.querySelector(".password.error");

    // reset errors
    emailError.textContent = "";
    passwordError.textContent = "";

    emailError.textContent = errors.email;
    passwordError.textContent = errors.password;
};

export const logIn = async () => {
    const logInform = document.querySelector(".login-form");
    const email = logInform.email.value;
    const password = logInform.password.value;

    try {
        const res = await fetch("/users/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (data.errors) {
            handleError(logInform, data.errors);  
        } else {
            document.querySelector(".login-container").style.display = "none";
            location.reload();
        }
    } catch (e) {
        console.log(e);
    }
};






export const signUp = async () => {
    const signupForm = document.querySelector(".signup-form");
    const email = signupForm.email.value;
    const userName = signupForm.name.value;
    const password = signupForm.password.value;

    try {
        const res = await fetch("/users/signUp", {
            method: "POST",
            body: JSON.stringify({ userName, email, password }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.errors) {
            handleError(signupForm, data.errors);
        } else {
            document.querySelector(".signup-container").style.display = "none";
            location.reload();
        }
    } catch (e) {
        console.log("Sign up error:", e);
    }
};

export const logOut = async () => {
    try {
        await fetch("/users/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        location.reload();
    } catch (e) {
        console.log("login error:", e);
    }
};



