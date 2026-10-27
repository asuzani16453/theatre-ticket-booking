
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

const ticketZones = document.getElementById("ticket-zones");

sections.forEach(function (section) {
    const zone = document.createElement("span");

    zone.className = "zone " + section.name.toLowerCase();
    if (section.name === "Balcony") {
        zone.textContent = "Balcony - 15 / 25 AZN";
    } else {
        zone.textContent = section.name + " - " + section.price + " AZN";
    }

    ticketZones.appendChild(zone);
});

const seatMap = document.getElementById("seat-map");

sections.forEach(function (section) {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "seating-section";
    sectionDiv.dataset.floor = section.name === "Balcony" ? "balcony" : "main";

    const title = document.createElement("h3");
    title.textContent = section.name;
    sectionDiv.appendChild(title);

    for (let row = 1; row <= section.rows; row++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "seat-row";

        for (let number = 1; number <= section.seatsPerRow; number++) {
            const seat = document.createElement("button");
            seat.className = "seat";
            seat.textContent = number;
            seat.dataset.section = section.name;
            seat.dataset.row = row;
            seat.dataset.number = number;

            seat.dataset.price = section.price;

            if (number === Math.floor(section.seatsPerRow / 2) + 1) {
                seat.classList.add("aisle-start");
            }
            rowDiv.appendChild(seat);
        }

        sectionDiv.appendChild(rowDiv);
    }

    seatMap.appendChild(sectionDiv);
});

