document.addEventListener("DOMContentLoaded", () => {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");
    const searchForm = document.getElementById("searchForm");

    if (!userForm || !userList || !searchForm) {
        console.error("One or more required elements not found");
        return;
    }
    userForm.addEventListener("submit", handleUserFormSubmit);
    searchForm.addEventListener("submit", handleSearch);
    fetchAllUsers();
});

async function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById("searchInput").value.trim();

    try {
        let response;
        if (query.length === 0) {
            // If the search input is empty, fetch all users
            response = await fetch("/admin/users");
        } else {
            // If there's a search query, use the search endpoint
            response = await fetch(
                `/admin/search?query=${encodeURIComponent(query)}`
            );
        }
        console.log("Search response status:", response.status);
        if (response.ok) {
            const users = await response.json();
            console.log("Search results:", users);
            updateUserList(users);
        } else {
            const errorData = await response.json();
            console.error("Search error:", errorData);
            showMessage(errorData.message || "Error searching users", "error");
        }
    } catch (error) {
        console.error("Error searching users:", error);
        showMessage("Error searching users: " + error.message, "error");
    }
}

function updateUserList(users) {
    const userList = document.querySelector("#userList tbody");
    if (!userList) {
        console.error("User list table body not found");
        return;
    }
    userList.innerHTML = "";
    if (users.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML =
            '<td colspan="5" class="text-center">No users found</td>';
        userList.appendChild(row);
    } else {
        users.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="px-4 py-2 text-left">${user._id}</td>
                <td class="px-4 py-2 text-left">${user.username}</td>
                <td class="px-4 py-2 text-left">${user.role}</td>
                <td class="px-4 py-2 text-left">${new Date(user.createdAt).toLocaleDateString()}</td>
                <td class="px-4 py-2 text-left">
                    <button class="edit-user bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" data-id="${
                        user._id
                    }">
                        Edit
                    </button>
                    <button class="delete-user bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-id="${
                        user._id
                    }">
                        Delete
                    </button>
                </td>
            `;
            userList.appendChild(row);
        });
    }
}

async function handleUserFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/admin/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const result = await response.json();
            showMessage("User created successfully", "success");
            addUserToList(result.user);
            event.target.reset();
        } else {
            const error = await response.json();
            showMessage(error.message, "error");
        }
    } catch (error) {
        console.error("Error creating user:", error);
        showMessage("Error creating user", "error");
    }
}

async function handleUserAction(event) {
    if (event.target.classList.contains("edit-user")) {
        const userId = event.target.dataset.id;
        const userRow = event.target.closest("tr");
        const username = userRow.cells[0].textContent;
        const role = userRow.cells[1].textContent;
        openEditModal(userId, username, role);
    } else if (event.target.classList.contains("delete-user")) {
        const userId = event.target.dataset.id;
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`/admin/users/${userId}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    showMessage("User deleted successfully", "success");
                    removeUserFromList(userId);
                } else {
                    const error = await response.json();
                    showMessage(error.message, "error");
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                showMessage("Error deleting user", "error");
            }
        }
    }
}

function openEditModal(userId, username, role) {
    const modal = document.createElement("div");
    modal.className =
        "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full";
    modal.id = "editModal";

    modal.innerHTML = `
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3 text-center">
                <h3 class="text-lg leading-6 font-bold text-gray-900">Edit User</h3>
                <form id="editForm" class="mt-2 text-left">
                    <input type="hidden" id="editUserId" value="${userId}">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-md font-bold mb-2" for="editUsername">
                            Username
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="editUsername" type="text" value="${username}" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-md font-bold mb-2" for="editRole">
                            Role
                        </label>
                        <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="editRole">
                            <option value="user" ${
                                role === "user" ? "selected" : ""
                            }>User</option>
                            <option value="admin" ${
                                role === "admin" ? "selected" : ""
                            }>Admin</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-md font-bold mb-2" for="editPassword">
                            New Password (leave blank to keep current)
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="editPassword" type="password">
                    </div>
                    <div class="items-center px-4 py-3">
                        <button id="updateUserBtn" class="px-4 py-2 bg-blue-500 text-white text-base font-bold rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                            Update User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document
        .getElementById("updateUserBtn")
        .addEventListener("click", handleUpdateUser);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeEditModal();
        }
    });
}

function closeEditModal() {
    const modal = document.getElementById("editModal");
    if (modal) {
        modal.remove();
    }
}

function addUserToList(user) {
    const userList = document.querySelector("#userList tbody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td class="border px-4 py-2">${user.username}</td>
        <td class="border px-4 py-2">${user.role}</td>
        <td class="border px-4 py-2">${new Date(
            user.createdAt
        ).toLocaleDateString()}</td>
        <td class="border px-4 py-2">
            <button class="edit-user bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2" data-id="${
                user._id
            }">
                Edit
            </button>
            <button class="delete-user bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-id="${
                user._id
            }">
                Delete
            </button>
        </td>
    `;
    userList.appendChild(newRow);
}

function removeUserFromList(userId) {
    const userRow = document
        .querySelector(`button[data-id="${userId}"]`)
        .closest("tr");
    userRow.remove();
}

async function handleUpdateUser(event) {
    event.preventDefault();
    const userId = document.getElementById("editUserId").value;
    const username = document.getElementById("editUsername").value;
    const role = document.getElementById("editRole").value;
    const password = document.getElementById("editPassword").value;

    const userData = { username, role };
    if (password) {
        userData.password = password;
    }

    try {
        const response = await fetch(`/admin/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            const result = await response.json();
            showMessage("User updated successfully", "success");
            updateUserInList(result.user);
            closeEditModal();
        } else {
            const error = await response.json();
            showMessage(error.message, "error");
        }
    } catch (error) {
        console.error("Error updating user:", error);
        showMessage("Error updating user", "error");
    }
}

function updateUserInList(user) {
    const userRow = document
        .querySelector(`button[data-id="${user._id}"]`)
        .closest("tr");
    userRow.cells[0].textContent = user.username;
    userRow.cells[1].textContent = user.role;
    userRow.cells[2].textContent = new Date(
        user.createdAt
    ).toLocaleDateString();
}

function showMessage(message, type) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
    messageElement.className = `message ${type} mb-4 p-4 rounded`;
    if (type === "success") {
        messageElement.classList.add(
            "bg-green-100",
            "border",
            "border-green-400",
            "text-green-700"
        );
    } else {
        messageElement.classList.add(
            "bg-red-100",
            "border",
            "border-red-400",
            "text-red-700"
        );
    }
    messageElement.style.display = "block";
    setTimeout(() => {
        messageElement.style.display = "none";
    }, 3000);
}
async function fetchAllUsers() {
    try {
        const response = await fetch("/admin/users");
        if (response.ok) {
            const users = await response.json();
            updateUserList(users);
        } else {
            const errorData = await response.json();
            console.error("Error fetching users:", errorData);
            showMessage(errorData.message || "Error fetching users", "error");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        showMessage("Error fetching users: " + error.message, "error");
    }
}
