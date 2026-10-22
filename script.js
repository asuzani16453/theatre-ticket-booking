
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

sections.forEach(function(section) {
    const zone = document.createElement("span");

    zone.className = "zone " + section.name.toLowerCase();
    zone.textContent = section.name + " - " + section.price + " AZN";

    ticketZones.appendChild(zone);
});