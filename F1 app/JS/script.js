let nextRace = null;

// Mapa de circuitos para imágenes
const circuitMaps = {
  'Jeddah Corniche Circuit': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Jeddah_Corniche_Circuit_2021.svg/800px-Jeddah_Corniche_Circuit_2021.svg.png',
  'Miami International Autodrome': '/images/miami-circuit.png'
  // Añade más circuitos según el calendario
};

// Récords de pista oficiales (fuente: F1 oficial y otras referencias)
const circuitRecords = {
  'Jeddah Corniche Circuit': '1:29.708 (Max Verstappen, 2023)', // Corregido el año
  'Miami International Autodrome': '1:29.708 (Max Verstappen, 2023)'
  // Añade más récords según necesites
};

// Obtener la próxima carrera y sus datos
async function fetchNextRace() {
  try {
    console.log('Fetching next race...');
    const response = await fetch('https://api.jolpi.ca/ergast/f1/2025.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response:', data);

    const races = data.MRData.RaceTable.Races;
    if (!races.length) {
      throw new Error('No hay carreras en el calendario 2025');
    }

    const now = new Date();
    nextRace = races.find(race => {
      const raceDate = new Date(`${race.date}T${race.time}`);
      return raceDate > now;
    });

    if (nextRace) {
      console.log('Next race found:', nextRace);
      const circuitName = nextRace.Circuit.circuitName;
      document.getElementById('circuit-name').innerText = circuitName;

      // Cargar imagen del circuito
      if (circuitMaps[circuitName]) {
        const mapImg = document.getElementById('circuit-map');
        mapImg.src = circuitMaps[circuitName];
        mapImg.style.display = 'block';
      }

      // Obtener datos dinámicos del año pasado (2024)
      const round = races.findIndex(race => race.Circuit.circuitId === nextRace.Circuit.circuitId) + 1;
      await fetchCircuitData(round, circuitName);
    } else {
      console.log('No upcoming races');
      document.getElementById('countdown').innerText = 'No hay carreras programadas.';
      document.getElementById('circuit-name').innerText = 'Sin circuito programado';
    }
  } catch (error) {
    console.error('Error fetching next race:', error);
    document.getElementById('countdown').innerText = 'Error al cargar los datos.';
    document.getElementById('circuit-name').innerText = 'Error';
  }
}

// Obtener datos dinámicos: ganador, poleman, récord de vuelta
async function fetchCircuitData(round, circuitName) {
  try {
    console.log('Fetching circuit data for round:', round);
    // Ganador 2024
    const resultsResponse = await fetch(`https://api.jolpi.ca/ergast/f1/2024/${round}/results.json`);
    const resultsData = await resultsResponse.json();
    const winner = resultsData.MRData.RaceTable.Races[0].Results[0];
    document.getElementById('last-winner').innerText = `${winner.Driver.givenName} ${winner.Driver.familyName} (${winner.Constructor.name})`;

    // Poleman 2024
    const qualiResponse = await fetch(`https://api.jolpi.ca/ergast/f1/2024/${round}/qualifying.json`);
    const qualiData = await qualiResponse.json();
    const poleman = qualiData.MRData.RaceTable.Races[0].QualifyingResults[0];
    document.getElementById('last-poleman').innerText = `${poleman.Driver.givenName} ${poleman.Driver.familyName} (${poleman.Constructor.name})`;

    // Récord de vuelta (de circuitRecords)
    document.getElementById('lap-record').innerText = circuitRecords[circuitName] || 'No disponible';
  } catch (error) {
    console.error('Error fetching circuit data:', error);
    document.getElementById('last-winner').innerText = 'Error';
    document.getElementById('last-poleman').innerText = 'Error';
    document.getElementById('lap-record').innerText = 'Error';
  }
}

// Actualizar temporizador
function updateCountdown() {
  if (nextRace) {
    console.log('Updating countdown...');
    const now = new Date();
    const raceDate = new Date(`${nextRace.date}T${nextRace.time}`);
    const diff = raceDate - now;

    if (diff <= 0) {
      document.getElementById('countdown').innerText = `¡${nextRace.raceName} ya comenzó!`;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerText = 
      `Faltan ${days} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos para ${nextRace.raceName}`;
  } else {
    console.log('No next race, countdown not updated');
  }
}

// Cargar datos iniciales y actualizar cada segundo
fetchNextRace().then(() => {
  console.log('Starting countdown interval');
  setInterval(updateCountdown, 1000);
  updateCountdown();
}).catch(error => {
  console.error('Error initializing countdown:', error);
  document.getElementById('countdown').innerText = 'Error al iniciar el temporizador.';
});