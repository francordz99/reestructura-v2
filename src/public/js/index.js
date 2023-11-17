socket = io();

socket.on('new-product', (data) => {

    console.log(data)

    let table = document.querySelector('table tbody')

    let tr = document.createElement('tr')

    tr.innerHTML = `
        <td>${data.title}</td>
        <td>${data.description}</td>
        <td>${data.price}</td>
        <td>${data.stock}</td>
    `
    table.appendChild(tr)
})

socket.on('deleted-product', (deletedProductId) => {

    const row = document.querySelector(`tr[data-id="${deletedProductId}"]`);
    if (row) {
        row.remove();
    }
})