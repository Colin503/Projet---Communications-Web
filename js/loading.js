'use strict';

// Affiche une photo en grand
function displayPhoto(photo) {
    console.log(photo);

    document.getElementById('photo').innerHTML=
        `<div class="card col-xs-12 col-md-12">
            <div class="card-body">
                <h4 align="center">${photo.title}</h4>
                <img src="${photo.large}" class="img-thumbnail" 
                     photoid="${photo.id}" id="photo-large">
            </div>
        </div>`;
    
    // Charge les commentaires associés à la photo
    requestComments();
}