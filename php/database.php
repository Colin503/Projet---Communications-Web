<?php
  require_once('constantes.php');

  //----------------------------------------------------------------------------
  // Connexion à la base de données
  function dbConnect() {
    try {
      $db = new PDO('mysql:host='.DB_SERVER.';dbname='.DB_NAME.';charset=utf8;port='.DB_PORT, 
                   DB_USER, DB_PASSWORD);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    } catch (PDOException $exception) {
      error_log('Connection error: '.$exception->getMessage());
      return false;
    }
    return $db;
  }

  //----------------------------------------------------------------------------
  // Récupère toutes les photos (miniatures)
  function dbRequestPhotos($db) {
    try {
      $request = 'SELECT id, small FROM photos';
      $statement = $db->prepare($request);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $exception) {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return $result;
  }
  
  //----------------------------------------------------------------------------
  // Récupère une photo spécifique
  function dbRequestPhoto($db, $id) {
    try {
      $request = 'SELECT id, title, large FROM photos WHERE id=:id';
      $statement = $db->prepare($request);
      $statement->bindParam(':id', $id, PDO::PARAM_INT);
      $statement->execute();
      $result = $statement->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $exception) {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return $result;
  }

  //----------------------------------------------------------------------------
  // Récupère les commentaires d'une photo
  function dbRequestComments($db, $photoId) {
    try {
      $request = 'SELECT id, comment, userLogin FROM comments WHERE photoId=:photoId';
      $statement = $db->prepare($request);
      $statement->bindParam(':photoId', $photoId, PDO::PARAM_INT);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $exception) {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return $result;
  }
  
  //----------------------------------------------------------------------------
  // Ajoute un commentaire
  function dbAddComment($db, $userLogin, $photoId, $comment) {
    try {
      $request = 'INSERT INTO comments (comment, photoId, userLogin) 
                 VALUES (:comment, :photoId, :userLogin)';
      $statement = $db->prepare($request);
      $statement->bindParam(':userLogin', $userLogin, PDO::PARAM_STR, 20);
      $statement->bindParam(':comment', $comment, PDO::PARAM_STR, 128);
      $statement->bindParam(':photoId', $photoId, PDO::PARAM_INT);
      $statement->execute();
    } catch (PDOException $exception) {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }

  //----------------------------------------------------------------------------
  // Modifie un commentaire
  function dbModifyComment($db, $userLogin, $id, $comment) {
    try {
      $request = 'UPDATE comments SET comment=:comment 
                 WHERE id=:id AND userLogin=:userLogin';
      $statement = $db->prepare($request);
      $statement->bindParam(':userLogin', $userLogin, PDO::PARAM_STR, 20);
      $statement->bindParam(':comment', $comment, PDO::PARAM_STR, 128);
      $statement->bindParam(':id', $id, PDO::PARAM_INT);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $exception) {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return $result;
  }

  //----------------------------------------------------------------------------
  // Supprime un commentaire
  function dbDeleteComment($db, $userLogin, $id) {
    try {
      $request = 'DELETE FROM comments WHERE id=:id AND userLogin=:userLogin';
      $statement = $db->prepare($request);
      $statement->bindParam(':userLogin', $userLogin, PDO::PARAM_STR, 20);
      $statement->bindParam(':id', $id, PDO::PARAM_INT);
      $statement->execute();
    } catch (PDOException $exception) {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return $result;
  }
?>