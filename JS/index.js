/**
 * Cette fonction permet de gérer le click sur le bouton submit
 * On vérifie si les champs sont vide
 * Puis on envoie une requête à la page qui nous retrouve l'idUser avec de rediriger vers la page d'accueil
 **/
$(document).on("click", "input[type=submit]", function() {
	//Réinitialise certain design
	$("#error").css("display", "none");
	$('input[type=text]').attr("class", null);
	$('input[type=password]').attr("class", null);
	$("p#text-error").remove();

	var error = false;

	//Si le champs Prénom est vide, on affiche une erreur
	if($("input[name=firstname]").val() == "") {
		if($('input[name=firstname]').attr("class") != "input-error") {
			$('input[name=firstname]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=firstname]').attr("class", "input-error");
		}		
		error = true;
	} //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
	else if($('input[name=firstname]').attr("class") == "input-error") 
		$('input[name=firstname]').attr("class", null);
	
	//Si le champs Nom est vide, on affiche une erreur
	if($("input[name=lastname]").val() == "") {
		if($('input[name=lastname]').attr("class") != "input-error") {
			$('input[name=lastname]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=lastname]').attr("class", "input-error");
		}		
		error = true;
	} else if($('input[name=lastname]').attr("class") == "input-error") 
		$('input[name=lastname]').attr("class", null);

	//Si le champs Mot de Passe est vide, on affiche une erreur
	if($("input[name=password]").val() == "") {
		if($('input[name=password]').attr("class") != "input-error") {
			$('input[name=password]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=password]').css("border", "1px solid red");
		}
		error = true;
	} else if($('input[name=password]').attr("class") == "input-error") 
		$('input[name=password]').css("border", "none");

	if(! error) {
		//Requête pour connecter l'utilisateur
		$.ajax({
	       	dataType: 'json',
	       	url: 'PHP/data.php', 
	       	type: 'GET',
	       	data: {
	       		action: "connexionWeb",
	       		firstname: $("input[name=firstname]").val(),       		
	       		lastname: $("input[name=lastname]").val(),
	       		password: $("input[name=password]").val()
	       	},
	       	success: function(oRep) {
	       		//On vérifie si on a un résultat, sinon l'utilisateur n'existe pas
	       		if(oRep.retour != false) {
	       			//On vérifie si l'utilisateur est autorisé à se connecté (Enseignant)
	       			if(oRep.retour[0].autorise)  {
	       				window.location = "HTML/accueil.html";
	       			 } else {
	       				$("#error").html("Seuls les enseignants ont accès à la platforme");
	       				$("#error").css("display", "block");
	       			}
	       		} else {
	       			$("#error").html("Cette utilisateur n'existe pas");
	       			$("#error").css("display", "block");
	       		}
	       	},
	       	error: function(oRep) {
	       		//Erreur de recupération
	       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
	       		$("#error").css("display", "block");
	       	}
	    });
	}
});