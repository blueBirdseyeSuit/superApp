const message = document.getElementById("message");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("register-username").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword =
            document.getElementById("confirm-password").value;
        if (password != confirmPassword) {
            message.textContent = "Passwords doesn't match";
            message.style.color = "red";
            throw new Error("Passwords doesn't match");
        }

        const response = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent =
                "Registration successful! Redirecting to login...";
            message.style.color = "green";
            setTimeout(() => {
                window.location.href = "/auth/login";
            }, 2000);
        } else {
            message.textContent = data.error || "Registration failed";
            message.style.color = "red";
        }
    });
}
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        const response = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include", // Sending cookies with the request
        });

        if (!response.ok) {
            console.error("Login error:", response.status);
            message.textContent = "Login failed";
            message.style.color = "red";
            return;
        }

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token); // Saving token
            console.log("Token saved:", data.token);
            message.textContent = "Login successful! Redirecting...";
            message.style.color = "green";
            setTimeout(() => {
                window.location.href = document.referrer; // Redirecting back to the previous page
            }, 2000);
        } else {
            message.textContent = data.error || "Login failed";
            message.style.color = "red";
        }
    });
}
