<?php


/*
Ce fichier d�finit diverses fonctions permettant de faciliter la production de mises en formes complexes : 
tableaux, formulaires, ...
*/
// Exemple d'appel :  mkLigneEntete($data,array('pseudo', 'couleur', 'connecte'));
function mkLigneEntete($tabAsso,$listeChamps=false)
{
	// Fonction appel�e dans mkTable, produit une ligne d'ent�te
	// contenant les noms des champs � afficher dans mkTable
	// Les champs � afficher sont d�finis � partir de la liste listeChamps 
	// si elle est fournie ou du tableau tabAsso

	if (!$listeChamps)	// listeChamps est faux  : on utilise le not : '!'
	{
		// tabAsso est un tableau associatif dont on affiche TOUTES LES CLES
		echo "\t<tr>\n";
		foreach ($tabAsso as $cle => $val)	
		{
			echo "\t\t<td>$cle</td>\n";
		}
		echo "\t</tr>\n";
	}
	else		// Les noms des champs sont dans $listeChamps 	
	{
		echo "\t<tr>\n";
		foreach ($listeChamps as $nomChamp)	
		{
			echo "\t\t<td>$nomChamp</td>\n";
		}
		echo "\t</tr>\n";
	}
}

function mkLigne($tabAsso,$listeChamps=false)
{
	// Fonction appel�e dans mkTable, produit une ligne 	
	// contenant les valeurs des champs � afficher dans mkTable
	// Les champs � afficher sont d�finis � partir de la liste listeChamps 
	// si elle est fournie ou du tableau tabAsso

	if (!$listeChamps)	// listeChamps est faux  : on utilise le not : '!'
	{
		// tabAsso est un tableau associatif
		echo "\t<tr>\n";
		foreach ($tabAsso as $cle => $val)	
		{
			echo "\t\t<td>$val</td>\n";
		}
		echo "\t</tr>\n";
	}
	else	// les champs � afficher sont dans $listeChamps
	{
		echo "\t<tr>\n";
		foreach ($listeChamps as $nomChamp)	
		{
			echo "\t\t<td>$tabAsso[$nomChamp]</td>\n";
		}
		echo "\t</tr>\n";
	}
}

// Exemple d'appel :  mkTable($users,array('pseudo', 'couleur', 'connecte'));	
function mkTable($tabData,$listeChamps=false)
{

	// Attention : le tableau peut etre vide 
	// On produit un code ROBUSTE, donc on teste la taille du tableau
	if (count($tabData) == 0) return;

	echo "<table border=\"1\">\n";
	// afficher une ligne d'entete avec le nom des champs
	mkLigneEntete($tabData[0],$listeChamps);

	//tabData est un tableau indic� par des entier
	foreach ($tabData as $data)	
	{
		// afficher une ligne de donn�es avec les valeurs, � chaque it�ration
		mkLigne($data,$listeChamps);
	}
	echo "</table>\n";

	// Produit un tableau affichant les donn�es pass�es en param�tre
	// Si listeChamps est vide, on affiche toutes les donn�es de $tabData
	// S'il est d�fini, on affiche uniquement les champs list�s dans ce tableau, 
	// dans l'ordre du tableau
	
}
// exemple d'appel : 
// $users = listerUtilisateurs("both");
// mkSelect("idUser",$users,"id","pseudo");
// TESTER AVEC mkSelect("idUser",$users,"id","pseudo",2,"couleur");

function mkSelect($nomChampSelect, $tabData,$champValue, $champLabel,$selected=false,$champLabel2=false)
{

	echo "<select name=\"$nomChampSelect\">\n";
	foreach ($tabData as $data)
	{
		$sel = "";	// par d�faut, aucune option n'est pr�selectionn�e 
		// MAIS SI le champ selected est fourni
		// on teste s'il est �gal � l'identifiant de l'�l�ment en cours d'affichage
		// cet identifiant est celui qui est affich� dans le champ value des options
		// i.e. $data[$champValue]
		if ( ($selected) && ($selected == $data[$champValue]) )
			$sel = "selected=\"selected\"";

		echo "<option $sel value=\"$data[$champValue]\">\n";
		echo  $data[$champLabel] . "\n";
		if ($champLabel2) 	// SI on demande d'afficher un second label
			echo  " ($data[$champLabel2])\n";
		echo "</option>\n";
	}
	echo "</select>\n";

	// Produit un menu d�roulant portant l'attribut name = $nomChampSelect
	// TNE: Si cette variable se termine par '[]', il faudra affecter l'attribut multiple � la balise select

	// Produire les options d'un menu d�roulant � partir des donn�es pass�es en premier param�tre
	// $champValue est le nom des cases contenant la valeur � envoyer au serveur
	// $champLabel est le nom des cases contenant les labels � afficher dans les options
	// $selected contient l'identifiant de l'option � s�lectionner par d�faut
	// si $champLabel2 est d�fini, il indique le nom d'une autre case du tableau 
	// servant � produire les labels des options
}

function mkForm($action="",$method="get")
{
	// Produit une balise de formulaire NB : penser � la balise fermante !!
	echo "<form action=\"$action\" method=\"$method\" >\n";
}
function endForm()
{
	// produit la balise fermante
	echo "</form>\n";
}

function mkInput($type,$name,$value="")
{
	// Produit un champ formulaire
	echo "<input type=\"$type\" name=\"$name\" value=\"$value\"/>\n";
}

function mkRadioCb($type,$name,$value,$checked=false)
{
	// Produit un champ formulaire de type radio ou checkbox
	// Et s�lectionne cet �l�ment si le quatri�me argument est vrai
	$selectionne = "";	
	if ($checked) 
		$selectionne = "checked=\"checked\"";
	echo "<input type=\"$type\" name=\"$name\" value=\"$value\"  $selectionne />\n";
}

function mkLien($url,$label, $qs="")
{
	echo "<a href=\"$url?$qs\">$label</a>\n";
}

function mkLiens($tabData,$champLabel, $champCible, $parQS=false,$urlBase="index.php")
{
	// produit une liste de liens (plus facile � styliser)
	// A partir de donn�es fournies dans un tableau associatif
	
	// Chaque lien pointe vers une url d�finie par le champ $champCible
	
	// SI parQS n'est pas false, il contient une url de base 
	// (avec un point d'interrogation) � laquelle on ajoute le champ cible 
	// dans la cha�ne de requ�te apr�s un '&' et le name contenu dans $parQS

	// Est-ce qu'on peut avoir url?&par=truc ??

	// Exemples d'appels : 
	// mkLiens($conversations,"theme","theme");
	// mkLiens($conversations,"theme","id","idConv","index.php?view=chat");
	
	echo "<ul>\n";
	foreach ($tabData as $data)
	{
		echo "\n<li>";
		if ($parQS === false)
			echo "<a href=\"" . $data[$champCible] . "\" >";
		else 
			echo "<a href=\"" . $urlBase . "&$parQS=" . $data[$champCible] . "\" >";

		echo $data[$champLabel] ;
		echo "</a>";
		echo "</li>\n";
	}
	echo "</ul>\n";
}
?>

















