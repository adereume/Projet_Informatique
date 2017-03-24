$(document).ready(function() {

});

$("#frame_module").ready(function() {
    getModules();
});

$("#frame_promo").ready(function() {
    getPromos();
});

$("#frame_account").ready(function() {
	getAccounts();
});

$(document).on("click", "#openJSTree", function() {
    $("#promo_tree").jstree("open_all");
});

$(document).on("click", "#closeJSTree", function() {
    $("#promo_tree").jstree("close_all");
});

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
                var htmlContent = "";

                htmlContent += "<table>";
                htmlContent += "<thead><th>Nom du module</th></thead>";

                for (var i = 0; i < oRep.retour.length; i++) {
                    htmlContent += "<tr><td>" + oRep.retour[i].name + "</td></tr>";
                }

                htmlContent += "</table>";

                $("#frame_module").html(htmlContent);
            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
            }
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });

}

function getPromos() {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getAllPromos"
        },
        success: function(oRep) {

            if(oRep.retour != null) {
            	var mapAllPromos = new Map();
            	var mapAllTDs = new Map();
            	var mapAllTPs = new Map();

            	var mapPromos = new Map(); // [Promo, Map TD]
            	var mapTD = new Map(); // [TD, List TP]
            	var listTP = new Array();

            	for (var i = 0; i < oRep.retour.length; i++) {
            		mapTD = mapPromos.get(oRep.retour[i].idPromo);

            		if (!mapTD) {
						mapTD = new Map();
					}

        			listTP = mapTD.get(oRep.retour[i].idTD);

            		if (!listTP) {
            			listTP = new Array();
            		}

        			listTP.push(oRep.retour[i].idTP);
        			mapTD.set(oRep.retour[i].idTD, listTP);
        			mapPromos.set(oRep.retour[i].idPromo, mapTD);

        			mapAllPromos.set(oRep.retour[i].idPromo, oRep.retour[i].namePromo);
        			mapAllTDs.set(oRep.retour[i].idTD, oRep.retour[i].nameTD);
        			mapAllTPs.set(oRep.retour[i].idTP, oRep.retour[i].nameTP);
            	}

            	/*var htmlContent = "";

				htmlContent += "<table id='tablePromos'>";
                htmlContent += "<thead><th>Nom</th></thead>";

				for (var [promo, tdMap] of mapPromos) {
					htmlContent += "<tr>";
                    htmlContent += "<td>" + mapAllPromos.get(promo) + "</td>";
                    htmlContent += "</tr>";

                    for (var [td, tpList] of tdMap) {
                    	htmlContent += "<tr>";
                        htmlContent += "<th class='start1'>" + mapAllTDs.get(td) + "</th>";
                        htmlContent += "</tr>";

                        for (var tp of tpList) {
                        	htmlContent += "<tr>";
	                        htmlContent += "<th class='start2'>" + mapAllTPs.get(tp) + "</th>";
	                        htmlContent += "</tr>";
                        }
                    }
				}            	

				htmlContent += "</table>";*/

				var htmlContent = "";
                var buttonHtml = "";

                buttonHtml += "<input type='button' value='Ouvrir tout' id='openJSTree' />";
                buttonHtml += "<input type='button' value='Fermer tout' id='closeJSTree' />";
                buttonHtml += "<br/>";
                
                htmlContent += "<ul>";

				for (var [promo, tdMap] of mapPromos) {
                    htmlContent += "<li data-jstree='{\"icon\":\"https://jstree.com/tree.png\"}'>";
                    htmlContent += mapAllPromos.get(promo);
                    htmlContent += "<ul>"

                    for (var [td, tpList] of tdMap) {
                        htmlContent += "<li >";
                        htmlContent += mapAllTDs.get(td);
                        htmlContent += "<ul>";

                        for (var tp of tpList) {
	                        htmlContent += "<li>";
                            htmlContent += mapAllTPs.get(tp);
                            htmlContent += "</li>";
                        }

                        htmlContent += "</ul></li>";
                    }

                    htmlContent += "</ul></li>";
				}            	

				htmlContent += "</ul>";

                $("#frame_promo").html(buttonHtml + $("#frame_promo").html());
                $("#promo_tree").html(htmlContent);
				$('#promo_tree').jstree();

            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
            }
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });

}

function getAccounts() {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getAllUsers"
        },
        success: function(oRep) {
        	var htmlContent = "";

            if(oRep.teachers != null || oRep.students != null) {
                
                htmlContent += "<h3>Enseignants</h3>"
                htmlContent += "<table>";
                htmlContent += "<thead><th>Nom</th><th>Prénom</th><th>Admin ?</th></thead>";

                for (var i = 0; i < oRep.teachers.length; i++) {
                    htmlContent += "<tr id='" + oRep.teachers[i].id + "'>";
                    htmlContent += "<td>" + oRep.teachers[i].lastName + "</td>";
                    htmlContent += "<td>" + oRep.teachers[i].firstName + "</td>";
                    htmlContent += "<td>" + "<input type='checkbox' value='" + oRep.teachers[i].isAdmin + "'/>" + "</td>";
                    htmlContent += "</tr>";
                }

                htmlContent += "</table>";

                htmlContent += "<h3>Étudiants</h3>"
                htmlContent += "<table>";
                htmlContent += "<thead><th>Nom</th><th>Prénom</th><th>Promotion</th><th>Groupe TD</th><th>Groupe TP</th></thead>";

                for (var i = 0; i < oRep.students.length; i++) {
                    htmlContent += "<tr id='" + oRep.students[i].id + "'>";
                    htmlContent += "<td>" + oRep.students[i].lastName + "</td>";
                    htmlContent += "<td>" + oRep.students[i].firstName + "</td>";
                    htmlContent += "<td>" + oRep.students[i].namePromo + "</td>";
                    htmlContent += "<td>" + oRep.students[i].nameTD + "</td>";
                    htmlContent += "<td>" + oRep.students[i].nameTP + "</td>";
                    htmlContent += "</tr>";
                }

                htmlContent += "</table>";

                $("#frame_account").html(htmlContent);
                
            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
            }
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });

}