/**
 * Displays error messages on the page.
 * @param {string|string[]} messages - Error message or array of messages.
 * @param {Object} options - Additional settings.
 * @param {string} [options.containerId='errorMessageContainer'] - ID of the container for displaying errors.
 * @param {string} [options.className='error-message'] - CSS class for styling error messages.
 * @param {number} [options.timeout] - Time in milliseconds after which the message will disappear.
 */
function showErrors(messages, options = {}) {
    const {
        containerId = 'errorMessageContainer',
        className = 'error-message',
        timeout
    } = options;

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Error container with id "${containerId}" not found`);
        return;
    }

    container.className = className;

    const messageArray = Array.isArray(messages) ? messages : [messages];
    container.innerHTML = messageArray.map(msg => `<p class="text-red-500">${msg}</p>`).join('');
    container.style.display = 'block';

    if (timeout) {
        setTimeout(() => {
            container.style.display = 'none';
        }, timeout);
    }
}

// Export the function so it can be imported in other files
export { showErrors };