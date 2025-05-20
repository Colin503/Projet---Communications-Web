'use strict';

// Récupère les commentaires pour une photo
async function requestComments(){
    let id = document.getElementById('photo-large').getAttribute('photoid');
    const reponse = await fetch("php/request.php/comments/?id="+id);
    
    if(reponse.ok)
        displayComments(await reponse.json()); // Affiche les commentaires
    else
        displayErrors(reponse.status); // Affiche les erreurs
}

// Affiche les commentaires
function displayComments(rep){
    console.log(rep);
    document.getElementById('comments').innerHTML="";
    
    // Crée un élément pour chaque commentaire
    for(let i=0;i<rep.length;i++){
      document.getElementById('comments').innerHTML+=
        `<div>
            ${rep[i].comment}
            <button type="button" class="btn btn-light float-end mod" value="${rep[i].id}">
                <i class="fa fa-edit"></i>
            </button>
            <button type="button" class="btn btn-light float-end del" value="${rep[i].id}">
                <i class="fa fa-trash"></i>
            </button>
        </div><br>`;
    }
    
    // Ajoute les gestionnaires pour modifier/supprimer
    modifyComment();
    deleteComment();
}

// Envoie un nouveau commentaire
async function sendComment(event) {
    event.preventDefault();
    
    let id = document.getElementById('photo-large').getAttribute('photoid');
    let value = document.getElementById('comment').value;
    document.getElementById('comment').value = '';
    
    const response = await fetch('php/request.php/comments/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'id='+id+'&comment=' + value
    });
    
    if (!response.ok)
        displayErrors(response.status);
    else
        requestComments(); // Recharge les commentaires
}

// Écouteur pour le formulaire d'ajout
document.getElementById('add').addEventListener("submit", sendComment);

// Gère la modification d'un commentaire
function modifyComment() {
    const modifyButtons = document.querySelectorAll('.mod');
    modifyButtons.forEach(e => e.addEventListener('click', async (event) => {
        let id = event.target.closest('.mod').getAttribute('value');
        const newComment = prompt('Nouveau commentaire :');
        
        const response = await fetch('php/request.php/comments/' + id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'id=' + id + '&comment=' + newComment
        });
        
        if (!response.ok)
            displayErrors(response.status);
        else
            requestComments(); // Recharge les commentaires
    }));
}

// Gère la suppression d'un commentaire
function deleteComment() {
    const deleteButtons = document.querySelectorAll('.del');
    deleteButtons.forEach(e => e.addEventListener('click', async (event) => {
        let id = event.target.closest('.del').getAttribute('value');
        
        const response = await fetch('php/request.php/comments/' + id + '?id=' + id, {
            method: 'DELETE'
        });
        
        if (!response.ok)
            displayErrors(response.status);
        else
            requestComments(); // Recharge les commentaires
    }));
}