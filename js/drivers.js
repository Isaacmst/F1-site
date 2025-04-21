async function fetchDriverStandings() {
    try {
      const response = await fetch('https://api.jolpi.ca/ergast/f1/2025/driverStandings.json');
      const data = await response.json();
      const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  
      const tbody = document.getElementById('drivers-list');
      tbody.innerHTML = '';
  
      standings.forEach(driver => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${driver.position}</td>
          <td>${driver.Driver.givenName} ${driver.Driver.familyName}</td>
          <td>${driver.points}</td>
          <td>${driver.Constructors[0].name}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('drivers-list').innerHTML = '<tr><td colspan="4">Error al cargar los datos.</td></tr>';
    }
  }
  
  fetchDriverStandings();



