let currentSort = 'count';
let priceRangeMin = null;
let priceRangeMax = null;

function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info"
}

function loadProducts() {
  let catID = localStorage.getItem('catID');
  const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const products = data.products;
      const sortAscButton = document.getElementById('sortAsc');
      const sortDescButton = document.getElementById('sortDesc');
      const sortByCountButton = document.getElementById('sortByCount');
      const rangeFilterCountButton = document.getElementById('rangeFilterCount');
      const clearRangeFilterButton = document.getElementById('clearRangeFilter');
      const productNameInput = document.getElementById('inputBusqueda'); // Campo de entrada para el nombre del producto

      sortAscButton.addEventListener('click', () => {
        currentSort = 'asc';
        applyFiltersAndSort(products);
      });
      sortDescButton.addEventListener('click', () => {
        currentSort = 'desc';
        applyFiltersAndSort(products);
      });
      sortByCountButton.addEventListener('click', () => {
        currentSort = 'count';
        applyFiltersAndSort(products);
      });
      rangeFilterCountButton.addEventListener('click', () => {
        priceRangeMin = parseFloat(document.getElementById('rangeFilterCountMin').value) || 0;
        priceRangeMax = parseFloat(document.getElementById('rangeFilterCountMax').value) || Infinity;
        applyFiltersAndSort(products);
      });
      clearRangeFilterButton.addEventListener('click', () => {
        priceRangeMin = null;
        priceRangeMax = null;
        applyFiltersAndSort(products);
      });
      productNameInput.addEventListener('input', () => {
        applyFiltersAndSort(products);
      });
      applyFiltersAndSort(products);
    })
    .catch(error => {
      console.error('Error al cargar los productos:', error);
    });
}

function applyFiltersAndSort(products) {
  let filteredProducts = products.slice();
  const productNameInput = document.getElementById('inputBusqueda');
  const productNameSearch = normalizeString(productNameInput.value.trim().toLowerCase()); // Normaliza el término de búsqueda

  if (priceRangeMin !== null && priceRangeMax !== null) {
    filteredProducts = filteredProducts.filter(product => {
      return product.cost >= priceRangeMin && product.cost <= priceRangeMax;
    });
  }

  if (productNameSearch !== '') {
    filteredProducts = filteredProducts.filter(product => {
      const productName = normalizeString(product.name.toLowerCase()); // Normaliza el nombre del producto
      const productDescription = normalizeString(product.description.toLowerCase()); // Normaliza la descripción del producto
      return productName.includes(productNameSearch) || productDescription.includes(productNameSearch);
    });
  }

  switch (currentSort) {
    case 'asc':
      filteredProducts.sort((a, b) => a.cost - b.cost);
      break;
    case 'desc':
      filteredProducts.sort((a, b) => b.cost - a.cost);
      break;
    case 'count':
      filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
      break;
  }

  const productsContainer = document.getElementById('products-container');
  productsContainer.innerHTML = '';

  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('list-group-item', 'list-group-item-action', 'cursor-active');

    // Agrega un atributo personalizado con la ID del producto
    productCard.setAttribute('data-product-id', product.id);

    // Agrega una clase para identificar los elementos de producto
    productCard.classList.add('product-card');

    productCard.innerHTML = `
                <div id="tarjetasProducts" class="row cursor-active">
                    <div class="col-12 col-sm-12 col-md-8 col-lg-3">
                        <img src="${product.image}" alt="${product.name}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between mb-0">
                            <h4>${product.name}</h4>
                            <p class="text-muted">${product.cost} ${product.currency}</p>
                        </div>
                        <p class="card-text">${product.soldCount} vendidos</p>
                        <p class="mb-1">${product.description}</p>
                    </div>
                </div>
            </div>
    `;

    // Agrega un evento de clic para redirigir al usuario y guardar la ID del producto
    productCard.addEventListener('click', () => {
      const productId = productCard.getAttribute('data-product-id');
      setProductID(productId);
    });

    productsContainer.appendChild(productCard);
  });
}

function normalizeString(input) {
  // Reemplaza los caracteres con acentos por sus equivalentes sin acentos
  return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

document.addEventListener('DOMContentLoaded', loadProducts);