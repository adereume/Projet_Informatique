var idUser;

$(document).ready(function() {
	getUser();
});

$(document).on("click", "input[type=submit]", function() {
	$("#error").css("display", "none");
	$('input[type=password]').attr("class", null);
	$("p#text-error").remove();

	var error = false;

	var oldPassword = $("#oldPassword").val();
	var newPassword = $("#newPassword").val();
	
	if($("#oldPassword").val() == "") {
		if($('#oldPassword').attr("class") != "input-error") {
			$('#oldPassword').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('#oldPassword').attr("class", "input-error");
		}		
		error = true;
	} 

	if($("#newPassword").val() == "") {
		if($('#newPassword').attr("class") != "input-error") {
			$('#newPassword').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('#newPassword').attr("class", "input-error");
		}		
		error = true;
	}

	if($("#confirmedPassword").val() == "") {
		if($('#confirmedPassword').attr("class") != "input-error") {
			$('#confirmedPassword').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('#confirmedPassword').attr("class", "input-error");
		}		
		error = true;
	}

	if($("#confirmedPassword").val() != $("#newPassword").val()) {
		if($('#confirmedPassword').attr("class") != "input-error") {
			$('#confirmedPassword').after("<p id='text-error'>Les mots de passe entrés sont différents</p>");
			$('#confirmedPassword').attr("class", "input-error");
		}		
		error = true;
	}

	if(! error) {
		updatePassword(oldPassword, newPassword);
	}
});

function getUser() {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "getTeacherById",
       		idTeacher: idUser
       	},
       	success: function(oRep) {
       		if(oRep.retour != null) {

       			$("#firstName").text(oRep.retour[0].firstName);
       			$("#lastName").text(oRep.retour[0].lastName);

       		} else {
       			window.location = "../index.html";
       		}
       	},
       	error: function(oRep) {
       		window.location = "../index.html";
       	}
    });

};

function updatePassword($oldPassword, $newPassword) {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "updatePassword",
       		oldPassword: $oldPassword,
       		newPassword: $newPassword
       	},
       	success: function(oRep) {
       		console.log(oRep.retour);
       		if(oRep.retour != null) {

       			if (oRep.retour == false) {
       				$("#error").html("Une erreur est survenue.");
       				$("#error").css("display", "block");
       			} else {
       				$("#success").html("Le mot de passe a été mise à jour.");
       				$("#success").css("display", "block");
       			}
       			
       		} else {
       			window.location = "../index.html";
       		}
       	},
       	error: function(oRep) {
       		window.location = "../index.html";
       	}
    });

};