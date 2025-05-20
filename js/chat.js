"use strict"

let websocket;
let login = "colin"; // Login fixe pour le chat (à améliorer)

// Initialise le WebSocket
createWebSocket();

function createWebSocket() {
    // Écouteur pour l'envoi de message
    document.getElementById('chat-send').addEventListener('submit', sendMessage);

    // Crée la connexion WebSocket
    websocket = new WebSocket('ws://10.20.40.130:12345');
    
    // Gestionnaire d'ouverture de connexion
    websocket.onopen = (event) => {
        console.log('Connexion établie.');
    }
    
    // Gestionnaire de réception de message
    websocket.onmessage = (event) => {
        console.log('Message reçu : ' + event.data);
        document.getElementById('chat-room').value += event.data + "\n";
        // Fait défiler vers le bas
        document.getElementById('chat-room').scrollTop = 
            document.getElementById('chat-room').scrollHeight;
    }
    
    // Gestionnaire de fermeture de connexion
    websocket.onclose = (event) => {
        console.log('Communication terminée.');
    }
}

// Envoie un message via WebSocket
function sendMessage(event) {
    event.preventDefault();
    let text = document.getElementById('chat-message').value;
    websocket.send(text);
    document.getElementById('chat-message').value = ''; // Vide le champ
}