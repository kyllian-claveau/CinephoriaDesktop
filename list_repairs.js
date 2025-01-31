const API_BASE_URL = 'https://cinephoria.ovh/api';

document.addEventListener('DOMContentLoaded', async () => {
    await loadRepairs();

    document.getElementById('reload-button').addEventListener('click', async () => {
        await loadRepairs();
    });

    document.getElementById('create-repair-button').addEventListener('click', () => {
        // Redirige vers la page de création de réparation
        window.location.href = 'create_repair.html';
    });
});

async function loadRepairs() {
    console.log('Loading repairs...');

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            document.body.innerHTML = '<div class="alert" role="alert">Erreur : Token d\'authentification manquant</div>';
            return;
        }

        console.log('Token found:', token);

        const response = await fetch(`${API_BASE_URL}/repairs`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des réparations');
        }

        const repairs = await response.json();
        console.log('Repairs data:', repairs);

        const repairsList = document.getElementById('repairs-list');
        repairsList.innerHTML = ''; // Clear the list before reloading

        if (repairs.length === 0) {
            repairsList.innerHTML = '<div class="alert" role="alert">Aucune réparation trouvée</div>';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Salle</th>
                    <th>Description</th>
                    <th>Statut</th>
                    <th>Date création</th>
                    <th>Date réparation</th>
                </tr>
            </thead>
            <tbody>
                ${repairs.map(repair => `
                    <tr>
                        <td>Salle ${repair.room.number}</td>
                        <td>${repair.description}</td>
                        <td>${repair.statut}</td>
                        <td>${repair.date_creation}</td>
                        <td>${repair.date_reparation || 'Non réparée'}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        repairsList.appendChild(table);
    } catch (error) {
        console.error('Error fetching repairs:', error);
        document.body.innerHTML = '<div class="alert" role="alert">Erreur lors du chargement des réparations : ' + error.message + '</div>';
    }
}
