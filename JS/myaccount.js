var idUser;

$(document).ready(function() {

	// Récupération de l'ID de l'utilisateur passé en paramètres
	var parameters = location.search.substring(1).split("&");
	var temp = parameters[0].split("=");
	idUser = unescape(temp[1]);

	getUser();
});

$(document).on("click", "input[type=submit]", function() {
	var oldPassword = $("#oldPassword").val();
	var newPassword = $("#newPassword").val();
	var confirmedPassword = $("#confirmedPassword").val();

	if (oldPassword != null && oldPassword != "") {
		//updatePassword(oldPassword, newPassword);
	} else {
		$("#error").val("Les mots de passe ne sont pas identiques.");
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
       		idUser: idUser,
       		oldPassword: $oldPassword,
       		newPassword: $newPassword
       	},
       	success: function(oRep) {
       		if(oRep.retour != null) {

       		} else {
       			//window.location = "../index.html";
       		}
       	},
       	error: function(oRep) {
       		//window.location = "../index.html";
       	}
    });

};