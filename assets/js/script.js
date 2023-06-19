let products = [];
let cartItems = [];

getProducts();
getFromLocal();


function updateLocal() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function getFromLocal() {
    let data = localStorage.getItem('cartItems');
    let items = JSON.parse(data);
    cartItems = Array.from(items);
    updateCart();
}

function showProducts(products) {
    let row = document.querySelector('.productsRow');
    let code = '';

    products.forEach(product => {
        code += `<div class="col-8 col-md-4 col-xl-3">
                    <div class="card shadow-lg border-success-subtle border-2"  style="height: 500px">
                        <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>
                        <img class="card-img-top h-50 object-fit-cover" src="${product.thumbnail}" alt="${product.title}"/>
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">${product.title}</h5>
                                <div class="d-flex justify-content-center small text-warning mb-2">
                                    ${showRate(product.rating)}
                                </div>
                                <span class="text-muted text-decoration-line-through">$${product.price}</span>
                                $${calcDiscountPrice(product.price, product.discountPercentage)}
                            </div>
                        </div>
                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div class="text-center"><button class="btn btn-outline-success mt-auto" onclick="addToList(${product.id})" id="liveToastBtn">Add to cart</a></div>
                        </div>
                    </div>
                </div>`

    })
    row.innerHTML = code;
}

function updateCart() {
    let list = document.querySelector('.itemsList');
    let count = document.querySelector('.itemsCount');

    let code = `<thead>
                    <tr class="text-center align-middle">
                        <th scope="col">#</th>
                        <th scope="col"></th>
                        <th scope="col">Product title</th>
                        <th scope="col">$</th>
                        <th scope="col">Count</th>
                        <th scope="col">Total $</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>`;

    for (let i = 0; i < cartItems.length; i++) {
        let p = cartItems[i];
        code += `<tr class="text-center align-middle">
                    <th scope="row">${i + 1}</th>
                    <td><img src="${p.thumbnail}" class="img-thumbnail" alt="${p.title}" style="width: 70px; height: 70px; object-fit: cover;"></td>
                    <td>${p.title}</td>
                    <td>${calcDiscountPrice(p.price, p.discountPercentage)}</td>
                    <td><button class="btn btn-sm" type="button" onclick="increaseCount(${i})"><i class="fa-solid fa-chevron-up fa-xxs"></i></button>
                    ${p.count}
                    <button class="btn btn-sm" type="button" onclick="decreaseCount(${i})"><i class="fa-solid fa-chevron-down fa-xxs"></i></button></td>
                    <td>${p.count * calcDiscountPrice(p.price, p.discountPercentage)}</td>
                    <td><button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteItem(${i})">X</button></td>
                </tr>`;
    }
    code += `</tbody>`;

    list.innerHTML = code;
    count.innerHTML = cartItems.length;
}

function addToList(id) {
    let index = cartItems.findIndex(item => item.id == id);
    if (index == -1 || cartItems.length === 0) {
        let new_product = Object.assign({}, products[id - 1]);
        new_product.count = 1;
        cartItems.push(new_product);
    } else {
        increaseCount(index);
    }

    const toastTrigger = document.getElementById('liveToastBtn');
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();

    updateCart();
    updateLocal();
}

function deleteItem(index) {
    cartItems.splice(index, 1);
    updateCart();
    updateLocal();
}

function increaseCount(index) {
    let product = cartItems[index];
    product.count++;
    updateCart();
    updateLocal();
}

function decreaseCount(index) {
    let product = cartItems[index];
    if (product.count > 1) {
        product.count--;
    } else {
        return;
    }
    updateCart();
    updateLocal();
}

function showRate(rate) {
    let filled = Math.round(rate);
    let empty = 5 - filled;
    let code = '';
    for (let i = 0; i < filled; i++) {
        code += `<div class="bi-star-fill"></div>`
    }
    for (let i = 0; i < empty; i++) {
        code += `<div class="bi-star"></div>`
    }
    return code;
}

function calcDiscountPrice(price, discountPercentage) {
    let discount = Math.ceil(price * discountPercentage / 100);
    return price - discount;
}

function displayCarousel() {
    let carousel = document.querySelector('.carousel-inner');

    let indexes = getRandomIndexes(5);

    let slides = '';
    for (let i = 0; i < indexes.length; i++) {
        let product = products[indexes[i]];
        slides += `<div class="carousel-item text-center ${i == 0 ? 'active' : ''}" data-bs-interval="5000" style="height: 60vh">     
                        <img src="${product.thumbnail}" class="d-block object-fit-cover h-100 m-auto" alt="${product.title}">
                        <div class="carousel-caption bg-light-subtle text-dark p-2 d-none d-md-block">
                            <h5>${product.title}</h5>
                            <p>${product.description}</p>
                        </div>      
                    </div>
                    `
    }
    carousel.innerHTML = slides;
}

function getRandomIndexes(indexCount) {
    let indexes = [];
    while (indexes.length != indexCount) {
        let index = getRandomInt(0, products.length);
        if (!indexes.includes(index)) {
            indexes.push(index);
        }
    }
    return indexes;
}

function getRandomInt(min, max) { // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min) + min);
}

async function getProducts() {
    let data = await fetchUrl('https://dummyjson.com/products');
    products = Array.from(data.products);
    displayCarousel();
    showProducts(products);
}

async function fetchUrl(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}
