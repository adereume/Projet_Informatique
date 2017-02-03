var idUser;
var selectedStart;
var selectedEnd;

$(document).ready(function() {
	var parameters = location.search.substring(1).split("&");

	var temp = parameters[0].split("=");
	idUser = unescape(temp[1]);

	$('#calendar').fullCalendar({
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

		// Lien "Voir Plus" lorsqu'il y a trop d'évènements à afficher
		eventLimit: true,

		// Affichage d'un événement
		eventRender: function(event, element) {
	        element.find('.fc-title').append("<br/>" 
	        	+ "Groupe " + event.promo
	        	+ "<br/>"
	        	+ "<i> Salle " + event.room + "</i>"); 
	    },
		
		selectable: true,
		selectHelper: true,

		// Lors d'une sélection de plage (ou clic sur un jour)
		select: function(start, end) {					
			getModules();

			$("#hideCalendar").css("display","block");
			$("#addSeance").css("display","block");

			selectedStart = start;
			selectedEnd = end;

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

	if($("input[name=room]").val() == "") {
		if($('input[name=room]').attr("class") != "input-error") {
			$('input[name=room]').after("<p id='text-error'>Ce champs est obligatoire</p>");
			$('input[name=room]').attr("class", "input-error");
		}
		error = true;
	} 
	
	if(! error) {

		$.ajax({
	       	dataType: 'json',
	       	url: '../PHP/data.php', 
	       	type: 'GET',
	       	data: {
	       		action: "addSeance",
	       		module: $("#module").val(),
	       		promo: $("#groupe").val(),
	       		idUser: idUser,
	       		dayTime: selectedStart,
	       		dayTimeEnd: selectedEnd,
	       		room: $("#salle").val()
	       	},
	       	success: function(oRep) {
	       		if(oRep.retour != null) {
	       			//window.location = "accueil.html?id="+oRep.retour[0].id;
	       		}
	       	},
	       	error: function(oRep) {
	       		//Erreur de recupération
	       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
	       		$("#error").css("display", "block");
	       	}
	    });

		/*var module = document.getElementById('module').value;
		var promo = document.getElementById('groupe').value;
		var room = document.getElementById('salle').value;
		
		var eventData;
		
		if (module) {
			eventData = {
				title: module,
				start: selectedStart,
				end: selectedEnd,
				promo: promo,
				teacher: "",
				room: room
			};

			$('#calendar').fullCalendar('renderEvent', eventData, true);
		}*/
		
		$("#hideCalendar").css("display","none");
		$("#addSeance").css("display","none");

		$("#module").value = "";
		$("#groupe").value = "";
		$("#salle").value = "";

		$("#calendar").fullCalendar('unselect');

		getSeances();
	}
});

$(document).on("change", "#type", function() {
	getPromos();
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

       			for (var i = 0; i < oRep.seances.length; i++) {
       				eventData = {
						title: oRep.seances[i].moduleName,
						start: oRep.seances[i].dayTime,
						end: oRep.seances[i].dayTimeEnd,
						promo: oRep.seances[i].promoName,
						teacher: oRep.seances[i].teacherFirstName + " " + oRep.seances[i].teacherLastName,
						room: oRep.seances[i].room
					};

					$("#calendar").fullCalendar('renderEvent', eventData, true);
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

function getPromos() {

	$.ajax({
       	dataType: 'json',
       	url: '../PHP/data.php', 
       	type: 'GET',
       	data: {
       		action: "getPromo"
       	},
       	success: function(oRep) {
       		if(oRep.retour != null) {

       			var level = $("#type").value;

       			for (var i = 0; i < oRep.retour.length; i++) {
       				if (oRep.retour[i].level = level) {
       					$("#groupe").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");	
       				}
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