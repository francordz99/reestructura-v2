const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortCategories(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }
    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products"
}

function showCategoriesList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let category = currentCategoriesArray[i];
        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {
            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-12 col-sm-12 col-md-8 col-lg-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                            <h5 class="mt-4 mb-4">${category.name}</h5>
                        <small>${category.productCount} artículos</small>
                        <p class="mb-1 mt-4">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;
    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray;
    }
    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);
    showCategoriesList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data
            showCategoriesList()
            //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });
    showCategoriesList();
});
