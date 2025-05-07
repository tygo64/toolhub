// Luister naar de verandering op het file input element
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    // Splits de inhoud in regels en verwijder eventuele lege regels
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
    const timestamps = [];

    // Doorloop de regels en zoek naar tijdstempels (beginnen met "YYYY-MM-DD hh:mm:ss")
    lines.forEach(line => {
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(line)) {
        // Haal de eerste 19 karakters op (datum en tijd)
        timestamps.push(line.substr(0, 19));
      }
    });

    const outputDiv = document.getElementById('output');
    if (timestamps.length < 2) {
      outputDiv.innerHTML = "<p>Nog niet genoeg tijdstempels gevonden.</p>";
      return;
    }

    // Bereken de tijdsverschillen tussen opeenvolgende hits en plaats de resultaten in een <ul> met klasse "tijd-list"
    let htmlOutput = "<h2>Tijdverschillen tussen de hits:</h2><ul class='tijd-list'>";
    for (let i = 1; i < timestamps.length; i++) {
      const prevTime = new Date(timestamps[i - 1]);
      const currTime = new Date(timestamps[i]);
      const diffInSeconds = Math.floor((currTime - prevTime) / 1000);

      // Bereken uren, minuten en seconden
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      htmlOutput += `<li>
        <strong>Hit ${i}</strong> (${timestamps[i - 1]}) tot 
        <strong>Hit ${i + 1}</strong> (${timestamps[i]}):<br>
        ${hours} uur, ${minutes} minuten, ${seconds} seconden
      </li>`;
    }
    htmlOutput += "</ul>";

    outputDiv.innerHTML = htmlOutput;
  };

  reader.readAsText(file);
});
