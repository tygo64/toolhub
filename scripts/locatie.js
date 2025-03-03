// Haversine formule om afstand tussen 2 coördinaten te berekenen
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Straal van de aarde in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Afstand in meters
}

// KML-bestand lezen en verwerken
function processKML() {
    const fileInput1 = document.getElementById("fileInput1");
    const fileInput2 = document.getElementById("fileInput2");

    if (fileInput1.files.length === 0 || fileInput2.files.length === 0) {
        alert("Upload beide KML-bestanden.");
        return;
    }

    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function(event1) {
        reader2.onload = function(event2) {
            const person1 = extractCoordinates(event1.target.result);
            const person2 = extractCoordinates(event2.target.result);
            compareCoordinates(person1, person2);
        };
        reader2.readAsText(fileInput2.files[0]);
    };

    reader1.readAsText(fileInput1.files[0]);
}

// Coördinaten en tijdstempels uit KML halen
function extractCoordinates(kmlData) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlData, "text/xml");
    const placemarks = xmlDoc.getElementsByTagName("Placemark");

    let coordinatesList = [];

    for (let i = 0; i < placemarks.length; i++) {
        const time = placemarks[i].getElementsByTagName("when")[0].textContent;
        const coords = placemarks[i].getElementsByTagName("coordinates")[0].textContent.trim().split(",");

        coordinatesList.push({ time, lon: parseFloat(coords[0]), lat: parseFloat(coords[1]) });
    }

    return coordinatesList;
}

// Vergelijk de coördinaten en bepaal wanneer ze samen of binnen 1 km waren
function compareCoordinates(person1, person2) {
    const exactMatchTable = document.getElementById("exactMatchTable");
    const closeMatchTable = document.getElementById("closeMatchTable");

    exactMatchTable.innerHTML = "<tr><th>Tijdstip</th></tr>";
    closeMatchTable.innerHTML = "<tr><th>Tijdstip</th><th>Afstand (m)</th></tr>";

    for (let i = 0; i < person1.length; i++) {
        for (let j = 0; j < person2.length; j++) {
            if (person1[i].time === person2[j].time) {
                const p1 = person1[i];
                const p2 = person2[j];

                const distance = haversine(p1.lat, p1.lon, p2.lat, p2.lon);

                if (distance === 0) {
                    // Exact dezelfde locatie
                    let row = exactMatchTable.insertRow();
                    let cell = row.insertCell(0);
                    cell.textContent = p1.time;
                }

                if (distance > 0 && distance <= 1000) {
                    // Binnen 1 km afstand
                    let row = closeMatchTable.insertRow();
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    cell1.textContent = p1.time;
                    cell2.textContent = Math.round(distance) + " m";
                }
            }
        }
    }
}
