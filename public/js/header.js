document.addEventListener("DOMContentLoaded", function () {
    const userInfo = document.getElementById("user-info");

    function updateUserInfo() {
        fetch("/auth/check", { credentials: "include" })
            .then((response) => response.json())
            .then((data) => {
                if (data.isAuthenticated) {
                    let adminLink = "";
                    if (data.role === "admin") {
                        adminLink =
                            '<a href="/admin" class="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Admin Panel</a>';
                    }
                    userInfo.innerHTML = `
                        <div class="relative group">
                            <span class="cursor-pointer">Welcome, ${data.username}</span>
                            <div class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 hidden group-hover:block transition-all duration-300 ease-in-out">
                                ${adminLink}
                                <a href="#" id="signout" class="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100">Sign out</a>
                            </div>
                        </div>
                    `;
                    document
                        .getElementById("signout")
                        .addEventListener("click", handleLogout);

                    // Add hover functionality with delay
                    const userDropdown = userInfo.querySelector(".group");
                    let timeoutId;

                    userDropdown.addEventListener("mouseenter", () => {
                        clearTimeout(timeoutId);
                        userDropdown.classList.add("active");
                    });

                    userDropdown.addEventListener("mouseleave", () => {
                        timeoutId = setTimeout(() => {
                            userDropdown.classList.remove("active");
                        }, 300); // 300ms delay before hiding
                    });
                } else {
                    throw new Error("Not authenticated");
                }
            })
            .catch((error) => {
                console.error("Authentication error:", error);
                userInfo.innerHTML =
                    '<a href="/auth/login" class="hover:text-gray-300">Login</a>';
            });
    }

    function handleLogout(e) {
        e.preventDefault();
        fetch("/auth/logout", {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                console.log("Logout response status:", response.status);
                return response.json().catch(() => ({}));
            })
            .then((data) => {
                console.log("Logout response data:", data);
                if (data.message === "Logged out successfully") {
                    window.location.href = "/";
                } else {
                    throw new Error("Logout failed");
                }
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    }

    updateUserInfo();
});
