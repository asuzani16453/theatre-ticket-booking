
const sections = [
    {
        name: "VIP",
        price: 50,
        rows: 3,
        seatsPerRow: 10
    },
    {
        name: "Standard",
        price: 30,
        rows: 5,
        seatsPerRow: 12
    },
    {
        name: "Economy",
        price: 15,
        rows: 6,
        seatsPerRow: 14
    }
];

const unavailableSeats = ["VIP-1-3", "VIP-2-6", "Standard-3-4", "Standard-5-9", "Economy-2-7", "Economy-4-11"];
const savedCart = JSON.parse(localStorage.getItem("velvetStageCart") || "[]");
const cart = savedCart;
let selectedSeat = null;

const ticketZones = document.getElementById("ticket-zones");

sections.forEach(function (section) {
    const zone = document.createElement("span");
    zone.className = "zone " + section.name.toLowerCase();
    zone.textContent = section.name + " - " + section.price + " AZN";
    ticketZones.appendChild(zone);
});

const seatMap = document.getElementById("seat-map");
const seatDetails = document.getElementById("seat-details");
const addToCartButton = document.getElementById("add-to-cart");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");

sections.forEach(function (section) {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "seating-section";

    const title = document.createElement("h3");
    title.textContent = section.name;
    sectionDiv.appendChild(title);

    for (let row = 1; row <= section.rows; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        for (let number = 1; number <= section.seatsPerRow; number++) {
            const seat = document.createElement("button");
            seat.type = "button";
            seat.className = "seat";
            seat.textContent = number;

            seat.dataset.section = section.name;
            seat.dataset.row = row;
            seat.dataset.number = number;
            seat.dataset.price = section.price;
            const seatId = section.name + "-" + row + "-" + number;

            if (unavailableSeats.includes(seatId)) {
                seat.classList.add("unavailable");
                seat.disabled = true;
            }

            const middle = (section.seatsPerRow + 1) / 2;
            const offset = number - middle;

            const curve = -(offset * offset * 1.0);
            const angle = - offset * 2.5;

            seat.style.setProperty("--curve", curve.toFixed(1) + "px");
            seat.style.setProperty("--angle", angle.toFixed(1) + "deg");

            seat.setAttribute(
                "aria-label",
                section.name + ", row " + row + ", seat " + number
            );

            if (number === Math.floor(section.seatsPerRow / 2) + 1) {
                seat.classList.add("aisle-start");
            }

            seat.addEventListener("click", function () {
                if (seat.classList.contains("in-cart")) {
                    return;
                }

                document.querySelectorAll(".seat.selected").forEach(function (selectedSeat) {
                    if (selectedSeat !== seat) {
                        selectedSeat.classList.remove("selected");
                    }
                });

                seat.classList.toggle("selected");

                const seatDetails = document.getElementById("seat-details");

                if (seat.classList.contains("selected")) {
                    seatDetails.innerHTML =
                        "<p><strong>Zone:</strong> " + section.name + "</p>" +
                        "<p><strong>Row:</strong> " + row + "</p>" +
                        "<p><strong>Seat:</strong> " + number + "</p>" +
                        "<p><strong>Price:</strong> " + section.price + " AZN</p>";

                    selectedSeat = seat;
                    addToCartButton.disabled = false;
                } else {
                    seatDetails.textContent = "Click a seat to view details.";
                    selectedSeat = null;
                    addToCartButton.disabled = true;
                }
            });
            rowDiv.appendChild(seat);
        }

        sectionDiv.appendChild(rowDiv);
    }

    seatMap.appendChild(sectionDiv);
});
cart.forEach(function (item) {
    const seat = document.querySelector(
        '.seat[data-section="' + item.section +
        '"][data-row="' + item.row +
        '"][data-number="' + item.number + '"]'
    );

    if (seat) {
        seat.classList.add("in-cart");
        seat.disabled = true;
    }
});

updateCart();
const totalSeats = sections.reduce(function (total, section) {
    return total + section.rows * section.seatsPerRow;
}, 0);

const availableCount = totalSeats - unavailableSeats.length;

document.getElementById("seat-availability").textContent =
    "Available: " + availableCount +
    " | Unavailable: " + unavailableSeats.length;

addToCartButton.addEventListener("click", function () {
    if (!selectedSeat) {
        return;
    }

    const item = {
        section: selectedSeat.dataset.section,
        row: selectedSeat.dataset.row,
        number: selectedSeat.dataset.number,
        price: Number(selectedSeat.dataset.price)
    };

    cart.push(item);

    selectedSeat.classList.remove("selected");
    selectedSeat.classList.add("in-cart");
    selectedSeat.disabled = true;

    selectedSeat = null;
    addToCartButton.disabled = true;
    seatDetails.textContent = "Click a seat to view details.";

    updateCart();
});
function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(function (item) {
        const paragraph = document.createElement("p");

        paragraph.textContent =
            item.section +
            " | Row " + item.row +
            " | Seat " + item.number +
            " - " + item.price + " AZN";

        cartItems.appendChild(paragraph);
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            removeFromCart(item);
        });

        cartItems.appendChild(removeButton);
        total += item.price;
    });

    totalPrice.textContent = total;
    document.querySelectorAll(".booking h2")[1].textContent = "Your Cart (" + cart.length + ")";
    localStorage.setItem("velvetStageCart", JSON.stringify(cart));
}
function removeFromCart(item) {
    const index = cart.indexOf(item);

    if (index !== -1) {
        cart.splice(index, 1);
    }

    const seat = document.querySelector(
        '.seat[data-section="' + item.section +
        '"][data-row="' + item.row +
        '"][data-number="' + item.number + '"]'
    );

    if (seat) {
        seat.classList.remove("in-cart");
        seat.disabled = false;
    }

    updateCart();
}
const clearCartButton = document.getElementById("clear-cart");

clearCartButton.addEventListener("click", function () {
    cart.length = 0;

    document.querySelectorAll(".seat.in-cart").forEach(function (seat) {
        seat.classList.remove("in-cart");
        seat.disabled = false;
    });

    updateCart();
});
let zoomLevel = 1;
let moveX = 0;
let moveY = 0;

function updateMapZoom() {
    seatMap.style.transform =
        "translate(" + moveX + "px, " + moveY + "px) scale(" + zoomLevel + ")";
    seatMap.style.transformOrigin = "top center";
}

document.getElementById("zoom-in").addEventListener("click", function () {
    zoomLevel = Math.min(zoomLevel + 0.1, 1.5);
    updateMapZoom();
});

document.getElementById("zoom-out").addEventListener("click", function () {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.6);
    updateMapZoom();
});

document.getElementById("move-up").addEventListener("click", function () {
    moveY -= 20;
    updateMapZoom();
});

document.getElementById("move-down").addEventListener("click", function () {
    moveY += 20;
    updateMapZoom();
});

document.getElementById("move-left").addEventListener("click", function () {
    moveX -= 20;
    updateMapZoom();
});

document.getElementById("move-right").addEventListener("click", function () {
    moveX += 20;
    updateMapZoom();
});

document.getElementById("reset-view").addEventListener("click", function () {
    zoomLevel = 1;
    moveX = 0;
    moveY = 0;
    updateMapZoom();
});

seatMap.addEventListener("wheel", function (event) {
    event.preventDefault();

    if (event.deltaY < 0) {
        zoomLevel = Math.min(zoomLevel + 0.05, 1.5);
    } else {
        zoomLevel = Math.max(zoomLevel - 0.05, 0.6);
    }

    updateMapZoom();
}, { passive: false });

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

seatMap.addEventListener("pointerdown", function (event) {
    if (event.target.closest(".seat")) return;

    isDragging = true;
    dragStartX = event.clientX - moveX;
    dragStartY = event.clientY - moveY;
    seatMap.setPointerCapture(event.pointerId);
});

seatMap.addEventListener("pointermove", function (event) {
    if (!isDragging) return;

    moveX = event.clientX - dragStartX;
    moveY = event.clientY - dragStartY;
    updateMapZoom();
});

function stopDragging() {
    isDragging = false;
}

seatMap.addEventListener("pointerup", stopDragging);
seatMap.addEventListener("pointercancel", stopDragging);