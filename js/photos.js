'use strict';

// Charge les miniatures au chargement de la page
requestThumbnails();

// Récupère les miniatures depuis le serveur
async function requestThumbnails() {
    let response = await fetch('php/request.php/photos/');

    if (response.ok)
        displayThumbnails(await response.json()) // Affiche les miniatures
    else
        displayErrors(response.status); // Affiche les erreurs
}

// Récupère une photo spécifique
async function requestPhoto(event) { 
    let id = document.getElementById(event.target.id).getAttribute('photoid');
    const response = await fetch('php/request.php/photos/'+id);
    
    if (response.ok) {
        displayPhoto(await response.json()); // Affiche la photo
    } else {
        displayErrors(response.status); // Affiche les erreurs
    }
}

// Affiche toutes les miniatures
function displayThumbnails(photos) {
    for (let i=0;i<photos.length;i++) {
        document.getElementById('thumbnails').innerHTML += 
            `<div class="col-xs-2 col-md-2">
                <a href="#">
                    <img id="thumbnail-${photos[i].id}" photoid="${photos[i].id}" 
                         src="${photos[i].small}" class="img-thumbnail">
                </a>
            </div>`;
    }

    // Ajoute un écouteur pour le clic sur les miniatures
    document.getElementById('thumbnails').addEventListener('click', requestPhoto);
}

// Affiche les erreurs
function displayErrors(errorCode) {
    document.getElementById('errorMessage').innerHTML=
        `<div class="alert alert-primary" role="alert">
            <i class="fa-solid fa-triangle-exclamation"></i> Erreur : ${errorCode}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    document.getElementById('errors').style.display = 'block';

    // Masque l'erreur après 5 secondes
    setTimeout(() => {
        document.getElementById('errors').style.display = 'none';
    }, 5000);
}