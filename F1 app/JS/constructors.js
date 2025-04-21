async function fetchConstructorStandings() {
    try {
      const response = await fetch('https://api.jolpi.ca/ergast/f1/2025/constructorStandings.json');
      const data = await response.json();
      const standings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
  
      const tbody = document.getElementById('constructors-list');
      tbody.innerHTML = '';
  
      standings.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${team.position}</td>
          <td>${team.Constructor.name}</td>
          <td>${team.points}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('constructors-list').innerHTML = '<tr><td colspan="3">Error al cargar los datos.</td></tr>';
    }
  }
  
  fetchConstructorStandings();