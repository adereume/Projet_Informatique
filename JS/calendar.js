var selectedStart;
var selectedEnd;
var idUser;

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

		/*$.ajax({
	       	dataType: 'json',
	       	url: 'http://localhost/projet_mobile/data.php', 
	       	type: 'GET',
	       	data: {
	       		action: "addSeance",
	       		// Recherche idModule module: $("input[name=module]").val(),       		
	       		// Recherche idPromo promo: $("input[name=groupe]").val(),
	       		idUser: idUser,
	       		dayTime: selectedStart,
	       		dayTimeEnd: selectedEnd
	       		room: $("input[name=room]").val()
	       	},
	       	success: function(oRep) {
	       		console.log("Success :");
	       		console.log(oRep);
	       		if(oRep.retour != null) {
	       			//window.location = "accueil.html?id="+oRep.retour[0].id;
	       		}
	       	},
	       	error: function(oRep) {
	       		//Erreur de recupération
	       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
	       		$("#error").css("display", "block");
	       	}
	    });*/

		var module = document.getElementById('module').value;
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
		}
		
		document.getElementById('hideCalendar').style.display='none';
		document.getElementById('addSeance').style.display='none';

		document.getElementById('module').value = "";
		document.getElementById('groupe').value = "";
		document.getElementById('salle').value = "";

		$('#calendar').fullCalendar('unselect');

		//getSeances();

	}
});

$(document).on("click", "input[type=button]", function() {
	document.getElementById('hideCalendar').style.display='none';
	document.getElementById('addSeance').style.display='none';
});

$(document).ready(function() {

	var parameters = location.search.substring(1).split("&");
	var temp = parameters[0].split("=");
	idUser = unescape(temp[1]);

	console.log(idUser);

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
			document.getElementById('hideCalendar').style.display='block';
			document.getElementById('addSeance').style.display='block';

			selectedStart = start;
			selectedEnd = end;

			$('#calendar').fullCalendar('unselect');
		},

		// Durée minimale d'une plage
		snapDuration: "00:15:00"
	});

	getSeances();
	
});

function getSeances() {

	$.ajax({
       	dataType: 'json',
       	url: 'http://projetmobile.alwaysdata.net/data.php', 
       	type: 'GET',
       	data: {
       		action: "getAllSeance",
       		idUser: 8
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

					$('#calendar').fullCalendar('renderEvent', eventData, true);
       			}
       		}
       	},
       	error: function(oRep) {
       		//Erreur de recupération
       		$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
       		$("#error").css("display", "block");
       	}
    });

}