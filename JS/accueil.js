var idUser;

$(document).ready(function() {
	// Récupération de toutes les séances de l'utilisateur
	// Affichage dans le calendrier
	getSeances();

	// Définition de l'élément calendrier
	$('#calendar').fullCalendar({
		// Header
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'agendaDay,agendaWeek,month,listWeek'
		},

		// Affiche 4, 5 ou 6 semaines en fonction du mois courant
		fixedWeekCount: false, 

		// Cache le Samedi & Dimanche
		weekends: false, 
		
		// Affiche les numéros de semaine
		weekNumbers: true, 
		
		// Numéros de semaine intégrés dans la case du Lundi (sinon, colonne à part)
		weekNumbersWithinDays: true, 
		
		// Hauteur du calendrier
		height: 600,

		// Vue par défaut au lancement
		defaultView: 'agendaWeek',

		// Date de début/fin affichées
		minTime: '08:00:00',
		maxTime: '21:00:00',

		// Semaines & Jours cliquables pour naviguer
		navLinks: true,

		// Événements éditables
		editable: true,

		// Clic sur une événement
		eventClick: function(event, jsEvent, view) {
			window.location = "seance.html?idUser=" + idUser + "&idSeance=" + event.idSeance;
		},

		// Lors du déplacement d'une séance
		eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
			moveSeance(event);
		},

		// Lien "Voir Plus" lorsqu'il y a trop d'évènements à afficher
		eventLimit: true,

		// Affichage d'un événement
		eventRender: function(event, element) {
	        element.find('.fc-title').append("<br/>" 
	        	+ "Groupe " + event.promo
	        	+ "<br/>"
	        	+ "<i> Salle " + event.room + "</i>"); 
	    },

	    // Redimensionnement d'un événement
	    eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) { 
	    	moveSeance(event);
	    },
		
		// Événements sélectionnables
		selectable: true,
		selectHelper: true,

		// Lors d'une sélection de plage (ou clic sur un jour)
		select: function(start, end) {					
			getModules();
			//getPromo();

			// Affichage de la pop-pup
			$("#hideCalendar").css("display","block");
			$("#addSeance").css("display","block");

			$("html").css("overflow-y","hidden");

			var date;
			
			// Date de début sélectionnée
			date = new Date(start);
			$("#dateStart").val(date.toJSON().slice(0,10) + " " + date.toJSON().slice(11,19));
			
			// Date de fin sélectionnée
			date = new Date(end);
			$("#dateEnd").val(date.toJSON().slice(0,10) + " " + date.toJSON().slice(11,19));

			// Déselection de la plage
			$("#calendar").fullCalendar('unselect');
		},

		// Durée minimale d'une plage
		snapDuration: "00:15:00"
	});
	
});

// Lorsque l'utilisateur valide l'ajout d'une séance (bouton 'Ajouter' de la pop-up)
$(document).on("click", "input[type=submit]", function() {
	//Réinitialise certain design
	$("#error").css("display", "none");
	$('input[type=text]').attr("class", null);
	$('input[type=datetime]').css("border", null);
	$('select').attr("class", null);
	$("p#text-error").remove();

	var error = false;

	// Vérification du champ 'Module'
	if($("#module").val() == "") {
		if($('#module').attr("class") != "input-error") {
			$('#module').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('#module').attr("class", "input-error");
		}		
		error = true;
	} 

	// Vérification du champ 'Type'
	if($("#type").val() == "") {
		if($('#type').attr("class") != "input-error") {
			$('#type').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('#type').attr("class", "input-error");
		}		
		error = true;
	} 
	
	// Vérification du champ 'Groupe'
	if($("#groupe").val() == "" || $("#groupe").val() == null) {
		if($('#groupe').attr("class") != "input-error") {
			$('#groupe').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('#groupe').attr("class", "input-error");
		}		
		error = true;
	}

	// Vérification du champ 'Salle'
	if($("input[name=salle]").val() == "") {
		if($('input[name=salle]').attr("class") != "input-error") {
			$('input[name=salle]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=salle]').attr("class", "input-error");
		}
		error = true;
	} 

	// Vérification du champ 'Date de début'
	if($("input[name=dateStart]").val() == "") {
		if($('input[name=dateStart]').attr("class") != "input-error") {
			$('input[name=dateStart]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=dateStart]').css("border", "1px solid red");
		}
		error = true;
	} 

	// Vérification du champ 'Date de fin'
	console.log($('input[name=dateEnd]').css("border"));
	if($("input[name=dateEnd]").val() == "") {
		if($('input[name=dateEnd]').attr("class") != "input-error") {
			$('input[name=dateEnd]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=dateEnd]').css("border", "1px solid red");
		}
		error = true;
	}  

	if(! error) {
		// Ajout de la séance en base
		addSeance();
		
		// Masquage de la pop-up
		$("#hideCalendar").css("display","none");
		$("#addSeance").css("display","none");

		$("html").css("overflow-y","auto");

		// Remise à zéro des valeurs des champs de la pop-up
		$("#error").css("display", "none");
		$('input[type=text]').attr("class", null);
		$('input[type=datetime]').css("border", null);
		$('select').attr("class", null);
		$("p#text-error").remove();

		$("#module").empty();
		$("#type").val("");
		$("#groupe").empty();
		$("#salle").val("");

		$("#calendar").fullCalendar('unselect');
	}
});

// Lorsque l'utilisateur change la sélection du champ 'Type' de la pop-up
$(document).on("change", "#type", function() {

	// Vidage de la liste des groupes
	$("#groupe").empty();

	// Récupération du type sélectionné (par convention : 0 = Promo, 1 = TD, 2 = TP)
	var level = $("#type").val();

	// Récupération de la liste des groupes en fonction du type sélectionné
	switch (level) {
		case '0':
			getPromo();
			break;
		case '1':
			getTD();
			break;
		case '2':
			getTP();
			break;
	}
});

// Lorsque l'utilisateur annule l'ajout d'une séance (croix rouge de la pop-up)
$(document).on("click", "#close", function() {

	// Masquage de la pop-up
	$("#hideCalendar").css("display","none");
	$("#addSeance").css("display","none");

	$("html").css("overflow-y","auto");

	// Remise à zéro des valeurs des champs de la pop-up
	$("#error").css("display", "none");
	$('input[type=text]').attr("class", null);
	$('input[type=datetime]').css("border", null);
	$('select').attr("class", null);
	$("p#text-error").remove();
	
	$("#module").empty();
	$("#type").val("");
	$("#groupe").empty();
	$("#salle").val("");

});

/**
 * La méthode getSeances() effectue une requête de récupération de la liste 
 * de l'ensemble des séances pour l'utilisateur courant. Elle ajoute toutes
 * les séances à la liste des événements du calendrier.
 */
function getSeances() {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "getAllSeance",
       		idUser: idUser
       	},
       	success: function(oRep) {
       		if(oRep.seances != null) {

       			// Suppression de tous les événements existants dans le calendrier
       			$("#calendar").fullCalendar('removeEvents');

       			// Parcours des séances récupérées
       			for (var i = 0; i < oRep.seances.length; i++) {
       				eventData = {
       					idSeance : oRep.seances[i].id,
       					idModule: oRep.seances[i].idModule,
						title: oRep.seances[i].moduleName,
						start: oRep.seances[i].dayTime,
						end: oRep.seances[i].dayTimeEnd,
						idPromo: oRep.seances[i].idPromo,
						promo: oRep.seances[i].promoName,
						idTeacher: oRep.seances[i].idTeacher,
						teacher: oRep.seances[i].teacherFirstName + " " + oRep.seances[i].teacherLastName,
						room: oRep.seances[i].room
					};

					// Ajout de la séance au calendrier
					$("#calendar").fullCalendar('renderEvent', eventData, true);
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

/**
 * La méthode getModules() effectue une requête de récupération de la liste 
 * de l'ensemble des modules existants. Elle ajoute tous les modules à la
 * liste des modules dans la pop-up d'ajout de séance.
 */
function getModules() {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "getModule"
       	},
       	success: function(oRep) {
       		if(oRep.retour != null) {
       			$("#module").append("<option value=''> Selectionner le module ...</option>");
       			for (var i = 0; i < oRep.retour.length; i++) {
       				$("#module").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");	
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

/**
 * La méthode getPromo() effectue une requête de récupération de la liste 
 * de l'ensemble des promotions existantes. Elle ajoute toutes les promos
 * à la liste des groupes dans la pop-up d'ajout de séance.
 */
function getPromo() {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "getPromo"
       	},
       	success: function(oRep) {
       		if(oRep.retour != null) {

       			$("#groupe").empty();
       			$("#groupe").append("<option value=''> Selectionner la promo ...</option>");
       			for (var i = 0; i < oRep.retour.length; i++) {
       				$("#groupe").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");	
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

/**
 * La méthode getTD() effectue une requête de récupération de la liste 
 * de l'ensemble des groupes TD existants. Elle ajoute tous les groupes
 * à la liste des groupes dans la pop-up d'ajout de séance.
 */
function getTD() {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "getAllTD"
       	},
       	success: function(oRep) {
       		if(oRep.retour != null) {

       			$("#groupe").empty();       			
       			$("#groupe").append("<option value=''> Selectionner le goupe TD ...</option>");
       			for (var i = 0; i < oRep.retour.length; i++) {
       				$("#groupe").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");	
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

/**
 * La méthode getTP() effectue une requête de récupération de la liste 
 * de l'ensemble des groupes TP existants. Elle ajoute tous les groupes
 * à la liste des groupes dans la pop-up d'ajout de séance.
 */
function getTP() {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "getAllTP"
       	},
       	success: function(oRep) {
       		if(oRep.retour != null) {

       			$("#groupe").empty();       			
       			$("#groupe").append("<option value=''> Selectionner le groupe TP ...</option>");
       			for (var i = 0; i < oRep.retour.length; i++) {
       				$("#groupe").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");	
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

/**
 * La méthode addSeance() effectue une requête d'ajout d'une séance.
 * Elle récupère ensuite la liste de toutes les séances.
 */
function addSeance() {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "addSeance",
       		idModule: $("#module").val(),
       		idPromo: $("#groupe").val(),
       		idTeacher: idUser,
       		dayTime: $("#dateStart").val(),
       		dayTimeEnd: $("#dateEnd").val(),
       		room: $("#salle").val()
       	},
       	success: function(oRep) {
       		if(oRep.retour != null) {
       			getSeances();
       		} else {
       			window.location = "../index.html";
       		}
       	},
       	error: function(oRep) {
       		window.location = "../index.html";
       	}
    });

};

/**
 * La méthode addSeance() effectue une requête de modification d'une séance.
 * Elle récupère ensuite la liste de toutes les séances.
 */
function moveSeance(event) {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "updateSeance",
       		idSeance: event.idSeance,
       		idTeacher: event.idTeacher,
       		dayTime: event.start.format(),
       		dayTimeEnd: event.end.format(),
       		room: event.room
       	},
       	success: function(oRep) {
       		if(oRep.retour != null) {
       			getSeances();
       		} else {
       			window.location = "../index.html";
       		}
       	},
       	error: function(oRep) {
       		window.location = "../index.html";
       	}
    });

};

$(document).on("click", "#compteBtn", function accederCompte() {
	window.location = "myaccount.html";
});

$(document).on("click", "#decoBtn", function accederCompte() {
	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "logout",
       	},
       	success: function(oRep) {
       		window.location = "../index.html";
       	},
       	error: function(oRep) {
       		window.location = "../index.html";
       	}
    });
});