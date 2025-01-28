async function deleteVideo(videoId) {
    try {
        await deleteFile(videoId); // Appeler l'API pour supprimer
        document.querySelector(`[data-video-id="${videoId}"]`).remove();
        alert('Vidéo supprimée avec succès !');
    } catch (error) {
        console.error('Erreur lors de la suppression de la vidéo:', error);
    }
}
