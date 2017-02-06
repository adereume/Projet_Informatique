$(document).on("click", "input[type=submit]", function() {
	$("#error").css("display", "none");
	$('input[type=text]').attr("class", null);
	$('input[type=password]').attr("class", null);
	$("p#text-error").remove();

	var error = false;

	if($("input[name=firstname]").val() == "") {
		if($('input[name=firstname]').attr("class") != "input-error") {
			$('input[name=firstname]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=firstname]').attr("class", "input-error");
		}		
		error = true;
	} else if($('input[name=firstname]').attr("class") == "input-error") 
		$('input[name=firstname]').attr("class", null);

	if($("input[name=lastname]").val() == "") {
		if($('input[name=lastname]').attr("class") != "input-error") {
			$('input[name=lastname]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=lastname]').attr("class", "input-error");
		}		
		error = true;
	} else if($('input[name=lastname]').attr("class") == "input-error") 
		$('input[name=lastname]').attr("class", null);

	if($("input[name=password]").val() == "") {
		if($('input[name=password]').attr("class") != "input-error") {
			$('input[name=password]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=password]').attr("class", "input-error");
		}
		error = true;
	} else if($('input[name=password]').attr("class") == "input-error") 
		$('input[name=password]').attr("class", null);

	if(! error) {
		$.ajax({
	       	dataType: 'json',
	       	url: '../PHP/data.php', 
	       	type: 'GET',
	       	data: {
	       		action: "inscription",
	       		firstname: $("input[name=firstname]").val(),       		
	       		lastname: $("input[name=lastname]").val(),
	       		password: $("input[name=password]").val(),
	       		type: "TEACHER"
	       	},
	       	success: function(oRep) {
	       		console.log(oRep);
	       		if(oRep.retour != null) {
	       			if(oRep.retour[0].autorise)  {
	       				window.location = "HTML/accueil.html?id="+oRep.retour[0].id;
	       			 } else {
	       				$("#error").html("Seuls les enseignants ont accès à la platforme");
	       				$("#error").css("display", "block");
	       			}
	       		} else {
	       			$("#error").html(oRep.feedback);
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