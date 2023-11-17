
const button = document.getElementById('logoutButton');

button.addEventListener('click', async (event) => {
    event.preventDefault();
    const response = await fetch('/api/sessions/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const responseData = await response.json();
    console.log(responseData);
    window.location.replace('/login');
})