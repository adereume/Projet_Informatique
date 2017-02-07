var idUser;

$(document).ready(function() {
	var parameters = location.search.substring(1).split("&");

	var temp = parameters[0].split("=");
	idUser = unescape(temp[1]);

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

	    eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) { 
	    	moveSeance(event);
	    },
		
		selectable: true,
		selectHelper: true,

		// Lors d'une sélection de plage (ou clic sur un jour)
		select: function(start, end) {					
			getModules();
			getPromo();

			$("#hideCalendar").css("display","block");
			$("#addSeance").css("display","block");

			var date;
			
			date = new Date(start);
			$("#dateStart").val(date.toJSON().slice(0,10) + " " + date.toJSON().slice(11,19));
			
			date = new Date(end);
			$("#dateEnd").val(date.toJSON().slice(0,10) + " " + date.toJSON().slice(11,19));

			$("#calendar").fullCalendar('unselect');
		},

		// Durée minimale d'une plage
		snapDuration: "00:15:00"
	});

	getSeances();
});

$(document).on("click", "input[type=submit]", function() {

	var error = false;

	if($("input[name=module]").val() == "") {
		if($('input[name=module]').attr("class") != "input-error") {
			$('input[name=module]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=module]').attr("class", "input-error");
		}		
		error = true;
	}
	
	if($("input[name=groupe]").val() == "") {
		if($('input[name=groupe]').attr("class") != "input-error") {
			$('input[name=groupe]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=groupe]').attr("class", "input-error");
		}		
		error = true;
	} 

	if($("input[name=salle]").val() == "") {
		if($('input[name=salle]').attr("class") != "input-error") {
			$('input[name=salle]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=salle]').attr("class", "input-error");
		}
		error = true;
	} 

	if($("input[name=dateStart]").val() == "") {
		if($('input[name=dateStart]').attr("class") != "input-error") {
			$('input[name=dateStart]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=dateStart]').attr("class", "input-error");
		}
		error = true;
	} 

	if($("input[name=dateEnd]").val() == "") {
		if($('input[name=dateEnd]').attr("class") != "input-error") {
			$('input[name=dateEnd]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=dateEnd]').attr("class", "input-error");
		}
		error = true;
	} 

	if(! error) {
		addSeance();
		
		$("#hideCalendar").css("display","none");
		$("#addSeance").css("display","none");

		$("#module").value = "";
		$("#groupe").value = "";
		$("#salle").value = "";

		$("#calendar").fullCalendar('unselect');
	}
});

$(document).on("change", "#type", function() {
	$("#groupe").empty();
	var level = $("#type").val();

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

$(document).on("click", "input[type=button]", function() {
	$("#hideCalendar").css("display","none");
	$("#addSeance").css("display","none");
});

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
       			$("#calendar").fullCalendar('removeEvents');

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

					$("#calendar").fullCalendar('renderEvent', eventData, true);
       			}

       		} else {
       			window.location = "../index.html";
       		}
       	},
       	error: function(oRep) {
       		console.log(oRep);
       		window.location = "../index.html";
       	}
    });

};

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
       			for (var i = 0; i < oRep.retour.length; i++) {
       				$("#module").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");	
       			}
       		}
       	},
       	error: function(oRep) {
       		//Erreur de recupération
       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
       		$("#error").css("display", "block");
       	}
    });

};

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

       			for (var i = 0; i < oRep.retour.length; i++) {
       				$("#groupe").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");	
       			}

       		}
       	},
       	error: function(oRep) {
       		//Erreur de recupération
       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
       		$("#error").css("display", "block");
       	}
    });

};

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

       			for (var i = 0; i < oRep.retour.length; i++) {
       				$("#groupe").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");	
       			}

       		}
       	},
       	error: function(oRep) {
       		//Erreur de recupération
       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
       		$("#error").css("display", "block");
       	}
    });

};

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

       			for (var i = 0; i < oRep.retour.length; i++) {
       				$("#groupe").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");	
       			}

       		}
       	},
       	error: function(oRep) {
       		//Erreur de recupération
       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
       		$("#error").css("display", "block");
       	}
    });

};

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
       		}
       	},
       	error: function(oRep) {
       		//Erreur de recupération
       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
       		$("#error").css("display", "block");
       	}
    });

};

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
       		}
       	},
       	error: function(oRep) {
       		//Erreur de recupération
       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
       		$("#error").css("display", "block");
       	}
    });

};