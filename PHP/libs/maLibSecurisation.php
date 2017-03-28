<?php

include_once "maLibUtils.php";	// Car on utilise la fonction valider()

function verifUser($firstname, $lastname, $password) {
	$sql = "SELECT id, firstname, lastname FROM USER WHERE id != 27 AND UPPER(firstname)='".strtoupper($firstname)."' AND UPPER(lastname)='".strtoupper($lastname)."' AND password=md5('$password')";
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
