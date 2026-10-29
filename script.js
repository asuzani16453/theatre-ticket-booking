
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
    zone.textContent = section.name + " - " + section.price + " AZN";
    ticketZones.appendChild(zone);
});

const seatMap = document.getElementById("seat-map");

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

            const middle = (section.seatsPerRow + 1) / 2;
            const distance = Math.abs(number - middle);
            const curve = distance * distance * 0.35;
            const angle = (number - middle) * 1.5;

            seat.style.setProperty("--curve", curve + "px");
            seat.style.setProperty("--angle", angle + "deg");

            seat.setAttribute(
                "aria-label",
                section.name + ", row " + row + ", seat " + number
            );

            if (number === Math.floor(section.seatsPerRow / 2) + 1) {
                seat.classList.add("aisle-start");
            }

            seat.addEventListener("click", function () {
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
                } else {
                    seatDetails.textContent = "Click a seat to view details.";
                }
            });
            rowDiv.appendChild(seat);
        }

        sectionDiv.appendChild(rowDiv);
    }

    seatMap.appendChild(sectionDiv);
});
