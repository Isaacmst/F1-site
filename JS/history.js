async function fetchChampions() {
    try {
      const response = await fetch('http://ergast.com/api/f1/driverStandings/1.json?limit=100');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      // Verificar si StandingsTable existe
      if (!data.MRData?.StandingsTable?.StandingsLists) {
        throw new Error('StandingsTable no encontrado en la respuesta de la API');
      }
  
      const standings = data.MRData.StandingsTable.StandingsLists;
      const tbody = document.getElementById('champions-list');
      tbody.innerHTML = '';
  
      standings.forEach(season => {
        const driver = season.DriverStandings[0];
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${season.season}</td>
          <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
          <td>${driver.Constructors[0].name}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('champions-list').innerHTML = '<tr><td colspan="3">Error al cargar los datos. Por favor, intenta de nuevo más tarde.</td></tr>';
    }
  }
  
  fetchChampions();