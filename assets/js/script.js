let products = [];
fetchUrl('https://dummyjson.com/products');


function displayCarousel() {
    let carousel = document.querySelector('.carousel-inner');

    let indexes = getRandomIndexes(5);

    let slides = '';
    for (let i = 0; i < indexes.length; i++) {
        let product = products[indexes[i]];
        slides += `<div class="carousel-item height-80 ${i == 0 ? 'active' : ''}" data-bs-interval="10000">
                        <div class="card mb-3 border-0">
                            <div class="row g-0">
                                <div class="col-md-4 overflow-hidden">
                                    <img src="${product.thumbnail}" class="d-block object-fit-cover" alt="${product.title}">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <div class="carousel-caption bg-light-subtle text-dark p-2 d-none d-md-block shadow-lg">
                                            <h5>${product.title}</h5>
                                            <p>${product.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
async function fetchUrl(url) {
    let resp = await fetch(url);
    let data = await resp.json();
    products = data.products;
    displayCarousel();
}
