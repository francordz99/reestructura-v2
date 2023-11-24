function loadInfo() {
    const productID = localStorage.getItem('productID');
    const url = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const productInfo = data;
            const infoContainer = document.getElementById('info-container');
            const infoList = document.createElement('div');
            infoList.classList.add("list-group");
            infoList.innerHTML = `
                <div>
                    <h1>${productInfo.name}</h1>
                </div>           
                <ul class="list-group w-75" style="margin: 0 auto;">
                    <li class="list-group-item">Precio: ${productInfo.cost} ${productInfo.currency}</li>
                    <li class="list-group-item">Descripción: ${productInfo.description}</li>
                    <li class="list-group-item">Categoría: ${productInfo.category}</li>
                    <li class="list-group-item">Cantidad de vendidos: ${productInfo.soldCount}</li>
                </ul>
                <div id="carouselExample" class="carousel slide w-100" data-ride="carousel">
                    <div class="carousel-inner">
                        ${productInfo.images.map((image, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="${image}" alt="Imagen ${index + 1}" class="d-block mt-5 w-100" style="margin:0 auto;">
                            </div>
                        `).join('')}
                    </div>
                    <a class="carousel-control-prev" href="#carouselExample" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Anterior</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselExample" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Siguiente</span>
                    </a>
                </div>
                <div>
                    <ul class="list-group d-none d-md-flex flex-row" id="imageThumbnails">
                        ${productInfo.images.map((image, index) => `
                            <li class="list-group-item list-group-horizontal abajo-carrusel">
                                <img src="${image}" alt="Imagen ${index + 1}" class="product-image cursor-active" data-target="#carouselExample" data-slide-to="${index}">
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
            infoContainer.appendChild(infoList);
            // Inicializa el carrusel de Bootstrap después de cargar el contenido
            $('#carouselExample').carousel();
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

//Productos relacionados

function loadRelatedProducts() {
    const productID = localStorage.getItem('productID');
    const url = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const relatedProducts = data.relatedProducts;
            const relatedContainer = document.getElementById('related-products-container');
            const relatedProductsList = document.createElement('div');
            relatedProductsList.classList.add("d-flex")
            // relatedProductsList.classList.add("related-products-cards")
            relatedProducts.forEach(relatedProduct => {
                const card = document.createElement('div');
                card.classList.add("card");
                card.id = "cardRelacionados";
                card.addEventListener('click', () => {
                    // Al hacer clic, almacena el ID del producto relacionado en localStorage
                    localStorage.setItem('productID', relatedProduct.id);
                    // Recarga la página para mostrar la información del producto relacionado
                    location.reload();
                });
                card.innerHTML = `
                    <img src="${relatedProduct.image}" class="card-img-top cursor-active" alt="related-product">
                    <p class="card-body">${relatedProduct.name}</p>
                `;
                relatedProductsList.appendChild(card);
            })
            relatedContainer.appendChild(relatedProductsList);
            window.scrollTo(0, 0);
        })
        .catch(error => {
            console.log('Error al cargar los productos:', error);
        });
}

function loadComments() {
    const productID = localStorage.getItem('productID');
    const url = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const comments = data;
            const commentContainer = document.getElementById('comment-list');
            const commentList = document.createElement('div');

            commentList.classList.add("list-group");
            commentContainer.appendChild(commentList);
            comments.forEach(comment => {

                const formattedUser = comment.user.replace(/_/g, ' ');
                const starHTML = Array(5).fill('').map((_, index) => `
                <span class="fa fa-star ${index < comment.score ? 'checked' : 'unchecked'}"></span>
                `).join('');
                const commentItem = document.createElement('div');
                commentItem.classList.add("list-group-item");
                commentItem.classList.add("commits");
                commentItem.innerHTML = `
                <p style="float: right;"> ${starHTML}</p>
                <p><strong>${formattedUser}</strong></p>
                <div><small style="float: right; margin: 0 auto;">${comment.dateTime}</small></div><br>
                <div><p>${comment.description}</p></div>
            `;
                commentList.appendChild(commentItem);
            });
        })
        .catch(error => {
            console.error('Error al cargar los comentarios:', error);
        });
}

function addComment(event) {
    event.preventDefault();

    const selectedStar = document.querySelector('.star-rating input[name="rating"]:checked');
    const score = 6 - parseInt(selectedStar.value); // Cambio aquí para invertir la puntuación
    const description = document.getElementById('comment-text').value;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const dateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const newComment = {
        score: score, // Utiliza la puntuación invertida
        description: description,
        dateTime: dateTime
    };
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));
    displayComment(newComment);
    document.getElementById('comment-text').value = '';
}

function displayComment(comment) {
    const commentContainer = document.getElementById('comment-list');
    const commentList = document.createElement('div');
    commentList.classList.add("list-group");
    commentContainer.appendChild(commentList);
    const commentItem = document.createElement('div');
    const storedValue = localStorage.getItem("username");
    commentItem.classList.add("list-group-item");
    commentItem.classList.add("commits");
    const starHTML = Array(5).fill('').map((_, index) => `
        <span class="fa fa-star ${index < comment.score ? 'checked' : 'unchecked'}"></span>
    `).join('');
    commentItem.innerHTML = `
        <p style="float: right;"> ${starHTML}</p>
        <p><strong>${storedValue}</strong></p>
        <div><small style="float: right; margin: 0 auto;">${comment.dateTime}</small></div><br>
        <div><p>${comment.description}</p></div>
    `;
    commentList.appendChild(commentItem);
}

document.addEventListener('DOMContentLoaded', () => {
    loadInfo();
    loadRelatedProducts();
    loadComments();

    const commentForm = document.getElementById('new-comment-form');
    commentForm.addEventListener('submit', addComment);
});


document.getElementById('saveButton').addEventListener('click', () => {
    // Obtén la información del producto desde localStorage
    const productID = localStorage.getItem('productID');
    const storedInfo = localStorage.getItem('productInfo');
    // Si no hay información almacenada previamente, crea un nuevo array vacío
    const savedInfoArray = storedInfo ? JSON.parse(storedInfo) : [];
    // Obtén la información actual del producto
    fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
        .then(response => response.json())
        .then(productInfo => {
            // Comprueba si el producto ya existe en el array
            const isProductInArray = savedInfoArray.some(item => item.id === productInfo.id);
            if (!isProductInArray) {
                // Verifica si el nombre del producto es "Peugeot 208"
                if (productInfo) {
                    productInfo.cartCount = 1;
                    savedInfoArray.push(productInfo);
                    // Guarda el array actualizado en localStorage
                    localStorage.setItem('productInfo', JSON.stringify(savedInfoArray));
                    // Puedes mostrar un mensaje de confirmación
                    Swal.fire({
                        title: '¡Producto agregado al carrito con exito!',
                        icon: 'success',
                    });
                }
            } else {
                // Muestra un mensaje de error si el producto ya está en el array
                Swal.fire({
                    title: '¡El producto ya se encuentra en el carrito!',
                    icon: 'error',
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar la información del producto:', error);
        });
});
