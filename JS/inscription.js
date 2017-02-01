$(document).on("click", "input[type=submit]", function() {
	var error = false;

	if($("input[name=firstname]").val() == "") {
		if($('input[name=firstname]').attr("class") != "input-error") {
			$('input[name=firstname]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=firstname]').attr("class", "input-error");
		}		
		error = true;
	}

	if($("input[name=lastname]").val() == "") {
		if($('input[name=lastname]').attr("class") != "input-error") {
			$('input[name=lastname]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=lastname]').attr("class", "input-error");
		}		
		error = true;
	} 

	if($("input[name=password]").val() == "") {
		if($('input[name=password]').attr("class") != "input-error") {
			$('input[name=password]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=password]').attr("class", "input-error");
		}
		error = true;
	} 

	if(! error) {
		$.ajax({
	       	dataType: 'json',
	       	url: 'http://projetmobile.alwaysdata.net/data.php', 
	       	type: 'GET',
	       	data: {
	       		action: "inscription",
	       		firstname: $("input[name=firstname]").val(),       		
	       		lastname: $("input[name=lastname]").val(),
	       		password: $("input[name=password]").val(),
	       		type: "TEACHER"
	       	},
	       	success: function(oRep) {
	       		console.log("Success :");
	       		console.log(oRep);
	       		if(oRep.retour != null) {
	       			window.location = "accueil.html?id="+oRep.retour[0].id;
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