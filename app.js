const shop = document.querySelector(".info-shop");
const btnAdd = document.querySelectorAll(".add")
const statu = document.querySelectorAll(".statu");
const total = document.querySelector("#total-pagar");
const carrito = document.querySelector("#carrito");

const carBtn = document.querySelector(".carrito");
const main = document.querySelector("#main");
const closeBtn = document.querySelector("#close");

const arr = JSON.parse(localStorage.getItem("productos")) || [];

function guardar() {
    localStorage.setItem("productos", JSON.stringify(arr));
}

function addProduct(btn) {
    const obtenerItem = btn.closest(".item");
    const getImg = obtenerItem.querySelector(".img-producto").src;
    const getType = obtenerItem.querySelector(".product-type").textContent;
    const getName = obtenerItem.querySelector(".product-name").textContent;
    const getPrice = obtenerItem.querySelector(".product-price").textContent;

    arr.push({img: getImg, name: getName, precio: getPrice, type: getType})
    
    guardar();
    renderizar();
    renderizarTotal();
    cantidad();
    renderizarProductos();
}

function renderizar() {
    shop.className = carrito.childElementCount == 0 ? "info-shop": "display-none";

    shop.innerHTML = carrito.childElementCount == 0 ?
    `<div class="shop-message">
        <div class="center">
            <i class="fa-solid fa-bag-shopping bag"></i>
        </div>
        <h2 class="center title-lista">Tu carrito está vacío</h2>
        <p class="center text-lista2">Agrega algunos productos para comenzar tu compra</p>
        <label id="continue" class="center" for="my-shop">Continuar Comprando</label>
    </div>` : "";

    continuarTuCompra();
}

renderizar();

function renderizarTotal() {
    const totalPagar = document.querySelectorAll(".producto-precio");
    const cantidadProductos = document.querySelectorAll(".producto-cantidad");
    let sum = 0; envio = 8.99;
    
    totalPagar.forEach((precio, index) => {
        sum += parseFloat(precio.textContent.replace("S/ ", "")) * cantidadProductos[index].textContent; 
    });
    
    total.className = carrito.childElementCount > 0 ? "total" : "display-none";
    
    total.innerHTML = carrito.childElementCount > 0 ? 
    `<h2 class="title-total">Resumen del Pedido</h2>
    <div class="line">
        <p class="title-text">Subtotal</p>
        <p id="sub-total">S/ ${sum.toFixed(2)}</p>
    </div>
    <div class="line">
        <p class="title-text">Envío</p>
        ${(50 - sum).toFixed(2) <= 0 ? `<p class="free" id="envio">Gratis</p>` : `<p id="sub-total">S/ ${envio.toFixed(2)}</p>`}
    </div>
    ${sum < 50 ? `<p class="box-message">💡 Agrega S/ ${(50 - sum).toFixed(2)} más para envío gratis</p>` : ""}
    <div class="line">
        <h2 class="title-total">Total</h2>
        <p id="total">S/ ${sum >= 50 ? `${sum.toFixed(2)}` : `${(parseFloat(sum) + parseFloat(envio)).toFixed(2)}`}</p>
    </div>
    <div class="btns">
        <button id="proceder">Proceder Pago</button>
        <label id="continuar-comprando" for="my-shop" class="center">Continuar Comprando</label>
    </div>` : `<button id="proceder">Proceder Pago</button><label id="continuar-comprando" for="my-shop" class="center">Continuar Comprando</label>`;

    continuarComprando()
    finish();
}

// renderizarTotal();

carBtn.addEventListener("click", () => {
    main.classList.add("main");
    document.body.style.overflow = "hidden";
});

function continuarTuCompra() {
    const continueBtn = document.querySelector("#continue");
    const shop = document.querySelector("#my-shop");

    continueBtn?.addEventListener("click", () => {
        main.classList.remove("main");
        document.body.style.overflow = "scroll";
    });

    closeBtn.addEventListener("click", () => {
        shop.checked = false;
        main.classList.remove("main");
        document.body.style.overflow = "scroll";
    })
}   
function continuarComprando() {
    const continuar = document.querySelector("#continuar-comprando");
    
    continuar.addEventListener("click", () => {
        main.classList.remove("main");
        document.body.style.overflow = "scroll";
    });
}

function finish() {
    const proceder = document.querySelector("#proceder");
    const shop = document.querySelector("#my-shop");
    
    proceder.addEventListener("click", () => {
        proceder.textContent = "Procesando...";
        proceder.style.opacity = ".7";
        
        setTimeout(() => {
            alert("¡Gracias por tu compra! (Demo)");
            proceder.textContent = "Proceder Pago";
            proceder.style.opacity = "1";
            shop.checked = false;
            main.classList.remove("main");
            document.body.style.overflow = "scroll";
        }, 2000);
    })
}

function cantidad() {
    const contenido = document.querySelector(".text-lista");
    const counter = document.querySelector("#counter");
    const cantidadProductos = document.querySelectorAll(".producto-cantidad");
    
    let sum = 0;
    let number = carrito.childElementCount;
    
    cantidadProductos.forEach(ele => sum+= parseInt(ele.textContent));
    counter.textContent = sum == 0 ? "" : sum;
    counter.style.display = sum == 0 ? "none" : "grid";
    
    contenido.textContent = number == 0 ? "Tu carrito está vacio" : number <= 1 ? "1 producto en tu carrito" : `${number} productos en tu carrito`;
}

function renderizarProductos() {
    carrito.innerHTML = "";
    
    arr.sort((a, b) => a.name.localeCompare(b.name));
    
    let productos = {}
    
    for(let a of Object.values(arr)) {
        if(!productos[a.name]) {
            productos[a.name] = {img: a.img, name: a.name, precio: a.precio, type: a.type, cantidad: 1};
        } else {
            productos[a.name].cantidad += 1;
        }
    }
    
    // Object Entries crea una matriz a partir de un objeto (clave y valor)
    Object.entries(productos).forEach(([key, value], index) => {
        let element = document.createElement("li");
        element.className = "my-item";
        element.dataset.index = index;
        element.innerHTML = `
        <img src="${value.img}" alt="${key}" class="producto-img">
        <div class="producto-info">
            <div class="producto-header">
                <p class="producto-name">${key}</p>
                <button class="delete"><i class="fa-solid fa-trash-can"></i></button>
            </div>
                <p class="producto-type">${value.type}</p>
            <div class="producto-footer">
                <p class="producto-precio">${value.precio}</p>
                <div class="producto-cantidad-container">
                    <button id="minus"><i class="fa-solid fa-minus"></i></button>
                    <p class="producto-cantidad">${value.cantidad}</p>
                    <button id="plus"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
        </div>`
        
        carrito.appendChild(element);
    })
    
    renderizar();
    renderizarTotal();
    cantidad();
    deleteProduct(arr, productos);
    containerProducto(arr, productos);
}

renderizarProductos();

function deleteProduct(arr, productos) {
    const btnDelete = document.querySelectorAll(".delete");

    btnDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            const obtenerMyItem = btn.closest(".my-item");
            const obtenerId = obtenerMyItem.dataset.index;

            Object.entries(productos).forEach(([key, value], index) => {
                if(index == obtenerId) {
                    for(let i = 0; i < value.cantidad; i++) {
                        arr.splice(arr.findIndex(p => p.name === key), 1);
                    }
                }
            })

            guardar();
            cantidad();
            renderizar();
            renderizarProductos();
            deleteMsg();
        });
    });
}

deleteMsg = () => {
    const alert = document.querySelector("#alert");
    const element = document.createElement("li");
    element.className = "alert-item";
    element.innerHTML = 
    `<h3>Producto eliminado</h3>
    <p>El producto se eliminó del carrito</p>`;
    alert.appendChild(element);
    alert.style.display = alert.childElementCount > 0 ? "grid" : "none";

    setTimeout(() => {
        alert.removeChild(element);
        alert.style.display = alert.childElementCount > 0 ? "grid" : "none";
    }, 2000);
};

function containerProducto(arr, productos) {
    const plus = document.querySelectorAll("#plus");
    const minus = document.querySelectorAll("#minus");
    
    plus.forEach(btn => {
        btn.addEventListener("click", () => {
            const myItem = btn.closest(".my-item");
            const obtenerImg = myItem.querySelector(".producto-img").src;
            const obtenerName = myItem.querySelector(".producto-name").textContent;
            const obtenerType = myItem.querySelector(".producto-type").textContent;
            const obtenerPrecio = myItem.querySelector(".producto-precio").textContent;

            arr.push({img: obtenerImg, name: obtenerName, precio: obtenerPrecio, type: obtenerType});

            guardar();
            renderizar();
            renderizarTotal();
            renderizarProductos();
        })
    })

    minus.forEach(btn => {
        btn.addEventListener("click", () => {
            const myItem = btn.closest(".my-item");
            const obtenerId = myItem.dataset.index;
            const cantidad = myItem.querySelector(".producto-cantidad").textContent;

            Object.entries(productos).forEach(([key], index) => {
                if(index == obtenerId && cantidad > 1) {
                    arr.splice(arr.findIndex(p => p.name === key), 1);
                }
            })

            guardar();
            renderizar();
            renderizarTotal();
            renderizarProductos();
        })
    })

}

btnAdd.forEach(btn => {
    btn.addEventListener("click", () => {
        const item = btn.closest(".item");
        const btnName = item.querySelector(".text-cart");

        btnName.textContent = "Agregando...";
        btn.style.opacity = ".7";

        setTimeout(() => {
            btnName.textContent = "Agregar";
            btn.style.opacity = "1";
            addProduct(btn);
            emergeMsg(item);
        }, 1000);
    });
});

emergeMsg = (item) => {
    const name = item.querySelector(".product-name").textContent;
    const alert = document.querySelector("#alert");
    const element = document.createElement("li");
    element.className = "alert-item";
    element.innerHTML = 
    `<h3>Producto Agregado</h3>
    <p>${name} se agregó al carrito</p>`;
    alert.appendChild(element);
    alert.style.display = alert.childElementCount > 0 ? "grid" : "none";

    setTimeout(() => {
        alert.removeChild(element);
        alert.style.display = alert.childElementCount > 0 ? "grid" : "none";
    }, 2000);
};

statu.forEach(state => {
    const btn = state.closest(".item")?.querySelector(".add");

    if(state.textContent === "Agotados") {
        btn.disabled = true;
        state.classList.add("agotado");
    } else {
        btn.disabled = false;
        state.classList.add("stock");
    }
})

const myBurger = document.querySelector("#my-burger");
const burger = document.querySelector("#burger");
const enlaces = document.querySelectorAll(".enla");

myBurger.addEventListener("click", () => {
    if(!burger.checked) {
        myBurger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        myBurger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
});

enlaces.forEach(ele => {
    ele.addEventListener("click",() => {
        burger.checked = false;
        if(!burger.checked) {
            myBurger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        } else {
            myBurger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }
    })
})

