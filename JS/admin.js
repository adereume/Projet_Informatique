var idDelete;

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

$(document).on("click", "#addBtn", function ajouter() {
    
    switch ($("ul.tabs li.active a").text()) {
        case "Modules" :
            $("#hideView").css("display", "block");
            $("#addModuleView").css("display", "block");
        break;

        case "Promotions" :
            console.log("Ajout promotion");
        break;

        case "Comptes Utilisateurs" :
            console.log("Ajout compte");
        break;
    }

});

$(document).on("click", "#validDeleteBtn", function deleteElement() {
    var param;

    switch ($("ul.tabs li.active a").text()) {
        case "Modules" :
            param = {
                action: "deleteModule",
                idModule: idDelete
            };
        break;

        case "Promotions" :
            console.log("Suppression promotion");
        break;

        case "Comptes Utilisateurs" :
            console.log("Suppression compte");
        break;
    }

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: param,
        success: function(oRep) {
            if(oRep.retour != null) {
                $("#hideView").css("display", "none");
                $("#deleteView").css("display", "none");

                getModules();
            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
            }
        }, error: function(oRep) {
            window.location = "../index.html";
        }
    });
    
});

$(document).on("click", "#close", function fermerPopUp() {
    $("#hideView").css("display", "none");
    $("#addModuleView").css("display", "none");
    $("#deleteView").css("display", "none");
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

                htmlContent += "<table id='moduleTable'>";
                htmlContent += "<thead><th>Nom du module</th><th>Actions</th></thead>";

                for (var i = 0; i < oRep.retour.length; i++) {
                    htmlContent += "<tr id='" + oRep.retour[i].id + "'>";
                    htmlContent += "<td class='moduleName'>" + oRep.retour[i].name + "</td>";
                    htmlContent += "<td><img class='editModule' /><img class='deleteModule' /></td>"
                    htmlContent += "</tr>";
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

$(document).on("click", "#addModule", function addModule() {
    var error = false;

    if($("#moduleName").val() == "") {
        $("#moduleName").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#moduleName").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#moduleName").css("border-color") == "rgb(255, 0, 0)") 
        $("#moduleName").css("border-color", "rgb(204, 204, 204)");

    if(!error) {
        
        $.ajax({
            dataType: 'json',
            url: '../PHP/data.php', 
            type: 'GET',
            data: {
                action: "addModule",
                name: $("#moduleName").val()
            },
            success: function(oRep) {
                if(oRep.retour != null) {
                    $("#moduleName").val("");
                    getModules();
                } else {
                    if(oRep.connecte == false)
                        window.location = "../index.html";
                }
            }, error: function(oRep) {
                window.location = "../index.html";
            }
        });

        $("#hideView").css("display", "none");
        $("#addModuleView").css("display", "none");
    }
});

$(document).on("click", "img.editModule", function editModule() {
    var line = $(this).parent().parent();
    var name = line.find(".moduleName");
    
    $(name).replaceWith("<td class='moduleName'><input type=\"text\" id=\"" + $(line).attr("id") + "\" class=\"editInput\" value=\"" + $(name).html() + "\"/></td>");
    $(this).removeClass("editModule");
    $(this).addClass("validModule");
});

$(document).on("click", "img.validModule", function validModule() {
    var line = $(this).parent().parent();
    var name = line.find(".moduleName");
    var input = line.find(".editInput");

    var error = false;

    if($(input).val() == "") {
        $(input).after("<p id='text-error'>Ce champs est obligatoire</p>");
        $(input).css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($(input).css("border-color") == "rgb(255, 0, 0)") 
        $(input).css("border-color", "rgb(204, 204, 204)");

    if (!error) {

        $.ajax({
            dataType: 'json',
            url: '../PHP/data.php', 
            type: 'GET',
            data: {
                action: "updateModule",
                idModule: $(line).attr("id"),
                name: $(input).val()
            },
            success: function(oRep) {
                if(oRep.retour != null) {
                    $(name).replaceWith("<td class='moduleName'>" + $(input).val() + "</td>");
                } else {
                    if(oRep.connecte == false)
                        window.location = "../index.html";
                }
            }, error: function(oRep) {
                window.location = "../index.html";
            }
        });

        $(this).removeClass("validModule");
        $(this).addClass("editModule");
    }
});

$(document).on("click", "img.deleteModule", function validModule() {
    var line = $(this).parent().parent();
    idDelete = line.attr("id");
   
    $("#hideView").css("display", "block");
    $("#deleteView").css("display", "block"); 
});

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

$(document).on("click", "#openJSTree", function() {
    $("#promo_tree").jstree("open_all");
});

$(document).on("click", "#closeJSTree", function() {
    $("#promo_tree").jstree("close_all");
});

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