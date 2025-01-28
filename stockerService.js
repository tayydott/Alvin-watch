const API_BASE_URL = 'https://api.stocker.io/v1'; // URL de l'API de Stocker.io
const API_KEY = 'VOTRE_API_KEY_ICI'; // Remplacez par votre clé API Stocker.io

// Fonction générique pour envoyer des requêtes
async function stockerRequest(endpoint, method = 'GET', body = null) {
    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    };

    const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`Erreur: ${response.statusText}`);
    }
    return response.json();
}

// Exemple : Ajouter un fichier au stock
export async function uploadToStocker(fileData) {
    return stockerRequest('/files/upload', 'POST', fileData);
}

// Exemple : Obtenir tous les fichiers
export async function fetchAllFiles() {
    return stockerRequest('/files');
}

// Exemple : Supprimer un fichier
export async function deleteFile(fileId) {
    return stockerRequest(`/files/${fileId}`, 'DELETE');
}
