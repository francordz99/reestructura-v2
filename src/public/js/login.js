
const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));

    try {

        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || 'Error desconocido');
        }

        if (responseData.status === "success") {
            window.location.replace('/products');
        } else {
            alert("error, usuario o contraseña incorrectos");
        }
    } catch {
        console.error(error)
        alert("error, usuario o contraseña incorrectos");
    }

});