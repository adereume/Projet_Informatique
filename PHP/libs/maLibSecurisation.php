<?php

include_once "maLibUtils.php";	// Car on utilise la fonction valider()


/**
 * @file login.php
 * Fichier contenant des fonctions de vérification de logins
 */

/**
 * Cette fonction vérifie si le login/passe passés en paramètre sont légaux
 * Elle stocke le pseudo de la personne dans des variables de session : session_start doit avoir été appelé...
 * Elle enregistre aussi une information permettant de savoir si l'utilisateur qui se connecte est administrateur ou non
 * Elle enregistre l'état de la connexion dans une variable de session "connecte" = true
 * @pre login et passe ne doivent pas être vides
 * @param string $login
 * @param string $password
 * @return false ou true ; un effet de bord est la création de variables de session
 */
function verifUser($firstname, $lastname, $password) {
	$sql = "SELECT id, firstname, lastname FROM USER WHERE UPPER(firstname)='".strtoupper($firstname)."' AND UPPER(lastname)='".strtoupper($lastname)."' AND password=md5('$password') ";
	$rs = SQLSelect($sql);
	if ($rs) {
		// connexion acceptee
		$tab = array();

		$tabUsers = parcoursRs($rs);
		$dataUser = $tabUsers[0];
		$tab[0]["id"] = $dataUser["id"];

		$_SESSION["connecte"] = true;
		$_SESSION["firstname"] = $dataUser["firstname"];
		$_SESSION["lastname"] = $dataUser["lastname"];
		$_SESSION["idUser"] = $dataUser["id"];

		$sql = "SELECT * FROM STUDENT WHERE idUser = ".$dataUser["id"];
		$rs = SQLSelect($sql);
		if ($rs) {
			$tab[0]["role"] = "student";
		} else {
			$tab[0]["role"] = "teacher";
		}

		return $tab;//parcoursRs($tab);
	}
	else
	{
		session_destroy();
		return false;
	}
}

function verifUserWeb($firstname, $lastname, $password) {
	$sql = "SELECT id, firstname, lastname FROM USER WHERE UPPER(firstname)='".strtoupper($firstname)."' AND UPPER(lastname)='".strtoupper($lastname)."' AND password=md5('$password')";
	$rs = SQLSelect($sql);
	if ($rs) {
		// connexion acceptee
		$tab = array();

		$tabUsers = parcoursRs($rs);
		$dataUser = $tabUsers[0];

		$sql = "SELECT * FROM TEACHER WHERE idUser = ".$dataUser["id"];
		$rs = SQLSelect($sql);
		if ($rs) {
			$tab[0]["id"] = $dataUser["id"];
			$tab[0]["autorise"] = true;
		
			$_SESSION["connecte"] = true;
			$_SESSION["firstname"] = $dataUser["firstname"];
			$_SESSION["lastname"] = $dataUser["lastname"];
			$_SESSION["idUser"] = $dataUser["id"];
		} else {
			$tab[0]["autorise"] = false;
		}

		return $tab;
	}
	else
	{
		session_destroy();
		return false;
	}
}


function securiser($urlBad,$urlGood=false)
{
	// ou 	if (valider("connecte","SESSION") == false)
	if (valider("pseudo","SESSION") == false)
	{
		// intrus !
		
		// on redirige en envoyant un message!!
		header("Location:$urlBad?message=" .  urlencode("Hors d'ici !") );
		die("");	// arreter l'interprétation du code
		return;
	
	}
	
	// Utilisateur autorisé et urlGood n'est pas faux
	if ($urlGood)
	{
		// on redirige puisque urlGood n'est pas faux
		header("Location:$urlGood");
		die("");	// arreter l'interprétation du code
	
	}
}

?>
