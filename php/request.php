<?php
require_once('database.php');

$login = 'cir2'; // Login fixe (à améliorer)

// Connexion à la base de données
$db = dbConnect();
if (!$db) {
    header('HTTP/1.1 503 Service Unavailable');
    exit;
}

// Récupère la méthode HTTP
$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = substr($_SERVER["PATH_INFO"], 1);
$request = explode('/', $path);
$requestRessource = array_shift($request);

// Récupère l'ID s'il existe
$id = array_shift($request);
if ($id == '') $id = NULL;
$data = false;

// Gestion des requêtes sur les photos
if ($requestRessource == 'photos') {
    if ($id != NULL)
        $data = dbRequestPhoto($db, intval($id)); // Photo spécifique
    else
        $data = dbRequestPhotos($db); // Toutes les photos
}

// Gestion des requêtes sur les commentaires
if ($requestRessource == 'comments') {
    if($requestMethod == 'GET') {
        if(isset($_GET['id']))
            $data = dbRequestComments($db, $_GET['id']); // Récupère les commentaires
    }
    else if($requestMethod == 'POST') {
        if(isset($_POST['id']) && isset($_POST['comment']))
            // Ajoute un commentaire
            $data = dbAddComment($db, $login, $_POST['id'], strip_tags($_POST['comment']));
    }
    else if($requestMethod == 'PUT') {
        parse_str(file_get_contents('php://input'), $_PUT);
        if(isset($_PUT['comment']) && $id != '')
            // Modifie un commentaire
            $data = dbModifyComment($db, $login, $id, strip_tags($_PUT['comment']));
    }
    else if($requestMethod == 'DELETE') {
        if($id != '')
            // Supprime un commentaire
            $data = dbDeleteComment($db, $login, $id);
    }
}

// Retourne la réponse
header('Content-Type: application/json; charset=utf-8');
header('Cache-control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
if ($data !== false) {
    header('HTTP/1.1 200 OK');
    echo json_encode($data);
} else {
    header('HTTP/1.1 400 Bad Request');
}
exit;
?>