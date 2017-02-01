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
	       		module: $("input[name=module]").val(),       		
	       		promo: $("input[name=groupe]").val(),
	       		teacher: idUser,
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
	       		//$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
	       		//$("#error").css("display", "block");
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

	}
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

		selectable: true,
		selectHelper: true,

		select: function(start, end) {					
			document.getElementById('hideCalendar').style.display='block';
			document.getElementById('addSeance').style.display='block';

			selectedStart = start;
			selectedEnd = end;

			$('#calendar').fullCalendar('unselect');
		},

		eventRender: function(event, element) {
	        element.find('.fc-title').append("<br/>" 
	        	+ "Groupe " + event.promo
	        	+ "<br/>"
	        	+ "<i> Salle " + event.room + "</i>"); 
	    },
		
		events: [
			{
				title: 'Anglais',
				start: '2017-01-30T08:00:00',
				end: '2017-01-30T10:00:00',
				promo: 'LE1',
				teacher: 'A. Husson',
				room: 'IGSS04'
			},
			{
				title: 'Anglais',
				start: '2017-01-30T13:30:00',
				end: '2017-01-30T15:30:00',
				promo: 'LA2',
				teacher: 'A. Husson',
				room: 'IGSS04'
			},
			{
				title: 'Anglais',
				start: '2017-01-30T15:45:00',
				end: '2017-01-30T17:45:00',
				promo: 'LA1',
				teacher: 'A. Husson',
				room: 'IGSS04'
			},
			{
				title: 'Anglais',
				start: '2017-01-31T10:15:00',
				end: '2017-01-31T12:15:00',
				promo: 'LE1',
				teacher: 'A. Husson',
				room: 'IGSS04'
			},
			{
				title: 'Anglais',
				start: '2017-01-31T15:45:00',
				end: '2017-01-31T17:45:00',
				promo: 'LE1',
				teacher: 'A. Husson',
				room: 'IGSS04'
			}
		]
	});

	$.ajax({
       	dataType: 'json',
       	url: 'http://projetmobile.alwaysdata.net/data.php', 
       	type: 'GET',
       	data: {
       		action: "getAllSeance",
       		idUser: idUser
       	},
       	success: function(oRep) {
       		console.log("Success :");
       		console.log(oRep);
       		if(oRep.retour != null) {
       			
       			$('#calendar').fullCalendar('renderEvents', oRep.retour, true);

       		}
       	},
       	error: function(oRep) {
       		//Erreur de recupération
       		//$("#error").html("Une erreur est survenue, veuillez rééssayer plus tard.");
       		//$("#error").css("display", "block");
       	}
    });
	
});