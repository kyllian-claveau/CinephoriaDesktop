const API_BASE_URL = 'https://cinephoria.ovh/api';

document.addEventListener('DOMContentLoaded', async () => {
    // Charger les salles disponibles à partir de l'API
    await loadRooms();

    // Gestion du formulaire de création de réparation
    document.getElementById('repair-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Token d\'authentification manquant');
            return;
        }

        const roomId = document.getElementById('room-select').value;
        const description = document.getElementById('description').value;
        const statut = document.getElementById('statut').value;

        // Envoi des données de la réparation à l'API
        try {
            const response = await fetch(`${API_BASE_URL}/repair`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    room_id: roomId,
                    description: description,
                    statut: statut,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                            alert('Réparation créée avec succès !');
                            // Redirection vers la page de listing des réparations
                            window.location.href = 'list_repairs.html'; // Modifier l'URL si nécessaire
                        } else {
                            alert(`Erreur: ${result.message}`);
                        }
        } catch (error) {
            console.error('Erreur lors de la création de la réparation:', error);
            alert('Erreur lors de la création de la réparation');
        }
    });
});

// Fonction pour charger les salles disponibles
async function loadRooms() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Token d\'authentification manquant');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/rooms`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des salles');
        }

        const rooms = await response.json();
        const roomSelect = document.getElementById('room-select');
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = `Salle ${room.number} - ${room.quality}`;
            roomSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des salles:', error);
        alert('Erreur lors du chargement des salles');
    }
}
