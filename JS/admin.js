var idDelete; // ID de l'élément à supprimer (module, promotion ou compte utilisateur)

// Au chargement de la page
$(document).ready(function() {
    
    // Vérification que l'utilisatur connecté est administrateur
    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "isAdmin"
        },
        success: function(oRep) {
            if(oRep.retour != null) {

                if (oRep.retour[0].isAdmin == 0) {
                   	window.location = "accueil.html";
                }

            } else {
                window.location = "../index.html";
            }
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });

});

// Chargement de l'onglet "Modules"
$("#frame_module").ready(function() {
    getModules();
});

// Chargement de l'onglet "Promotions"
$("#frame_promo").ready(function() {
    getPromos();
});

// Chargement de l'onglet "Comptes Utilisateurs"
$("#frame_account").ready(function() {
	getAccounts();
});

// Ajout d'un nouvel élément (module, promotion ou compte utilisateur)
$(document).on("click", "#addBtn", function ajouter() {
    
    $("#hideView").css("display", "block");

    switch ($("ul.tabs li.active a").text()) {
        case "Modules" : 				$("#addModuleView").css("display", "block");	break;
        case "Promotions" : 			$("#addPromoView").css("display", "block");		break;
        case "Comptes Utilisateurs" : 	$("#addCompteView").css("display", "block");	break;
    }

});

// Suppression d'un élément (promotion)
$(document).on("click", "#deleteBtn", function supprimer() {
	var selectedNode;

	if ($("ul.tabs li.active a").text() == "Promotions") {
		selectedNode = $("#promo_tree").jstree("get_selected", true);
		$("#elementToDelete").text("Promotion - '" + selectedNode[0].text + "'");
	}
	
	idDelete = selectedNode[0].id;
	
   	// Demande de confirmation de la suppression
    $("#hideView").css("display", "block");
    $("#deleteView").css("display", "block"); 
});

// Validation de la suppression d'un élément (module, promotion ou compte utilisateur)
$(document).on("click", "#validDeleteBtn", function deleteElement() {
    var param;
    var activeFrame;

    switch ($("ul.tabs li.active a").text()) {
        case "Modules" :
        	activeFrame = "modules";
            param = {
                action: "deleteModule",
                idModule: idDelete
            };
        break;

        case "Promotions" :
        	activeFrame = "promos";
            param = {
            	action: "deletePromo",
            	idPromo: idDelete
            }
        break;

        case "Comptes Utilisateurs" :
        	activeFrame = "accounts";
        	param = {
        		action: "deleteCompte",
        		idUser: idDelete
        	}
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

                switch (activeFrame) {
                	case "modules" : 	getModules();	break;
            		case "promos" : 	getPromos();	break;
            		case "accounts" : 	getAccounts();	break;
                }

            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
            }
        }, error: function(oRep) {
            window.location = "../index.html";
        }
    });
    
});

// Fermeture du pop-up
$(document).on("click", "#close", function fermerPopUp() {
    $("#hideView").css("display", "none");
    $("#addModuleView").css("display", "none");
    $("#addPromoView").css("display", "none");
    $("#addCompteView").css("display", "none");
    $("#deleteView").css("display", "none");
});

/***** MODULES *****/
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

// Ajout d'un nouveau module
$(document).on("click", "#addModule", function addModule() {
    var error = false;

    // Vérification du remplissage du champ "Nom"
    if($("#moduleName").val() == "") {
        $("#moduleName").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#moduleName").css("border-color", "red");
        error = true;
    } // Si le champs était en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
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

	                // Réinitialisation de tous les champs
	                $("#addModuleView > #moduleName").val("");

	                getModules();

	                // Fermeture de la popup
	                $("#hideView").css("display", "none");
	                $("#addModuleView").css("display", "none");

	                $("#success").html("Le module a été ajoutée");
	                $("#success").show();
	                setTimeout(function() { $("#success").hide(); }, 5000);

	            } else
	                window.location = "../index.html";
            }, error: function(oRep) {
                window.location = "../index.html";
            }
        });

        $("#hideView").css("display", "none");
        $("#addModuleView").css("display", "none");
    }
});

// Édition d'un module
$(document).on("click", "img.editModule", function editModule() {
    var line = $(this).parent().parent(); // Ligne contenant le nom du module et les boutons d'action
    var name = line.find(".moduleName"); // Cellule contenant le nom du module
    
    // Remplacement du texte par un champ texte éditable 
    $(name).replaceWith("<td class='moduleName'><input type=\"text\" id=\"" + $(line).attr("id") + "\" class=\"editInput\" value=\"" + $(name).html() + "\"/></td>");

    // Changement du bouton d'édition en bouton de validation
    $(this).removeClass("editModule");
    $(this).addClass("validModule");
});

// Validation de l'édiiton d'un module
$(document).on("click", "img.validModule", function validModule() {
    var line = $(this).parent().parent(); // Ligne contenant le nom du module et les boutons d'action
    var name = line.find(".moduleName"); // Cellule contenant le nom du module
    var input = line.find(".editInput"); // Champs texte modifié

    var error = false;

    // Vérification du remplissage du champ texte
    if($(input).val() == "") {
        $(input).after("<p id='text-error'>Ce champs est obligatoire</p>");
        $(input).css("border-color", "red");
        error = true;
    } // Si le champs était en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
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

                	// Remplacement du champ texte en texte non éditable
                    $(name).replaceWith("<td class='moduleName'>" + $(input).val() + "</td>");

                } else {
                    if(oRep.connecte == false)
                        window.location = "../index.html";
                }
            }, error: function(oRep) {
                window.location = "../index.html";
            }
        });

        // Changement du bouton de validation en bouton d'édition
        $(this).removeClass("validModule");
        $(this).addClass("editModule");
    }
});

// Suppression d'un module
$(document).on("click", "img.deleteModule", function validModule() {
    var line = $(this).parent().parent(); // Ligne contenant le nom du module et les boutons d'action
    var name = line.find(".moduleName"); // Cellule contenant le nom du module

    idDelete = line.attr("id"); // ID du module
    $("#elementToDelete").text("Module - '" + name.text() + "'");
   
   	// Demande de confirmation de la suppression
    $("#hideView").css("display", "block");
    $("#deleteView").css("display", "block"); 
});

/***** PROMOTIONS *****/

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
            	// L'élément de retour est composé d'une liste d'éléments construits de la manière suivante :
            	// 		{ idPromo, namePromo, idTD, nameTD, idTP, nameTP }
            	// Chaque promotion peut donc être reçue plusieurs fois, mais avec un groupe TD et/ou TP associé différent

            	var mapAllPromos = new Map(); // Contient l'ensemble des promotions {id -> name}
            	var mapAllTDs = new Map(); // Contient l'ensemble des groupes TD {id -> name}
            	var mapAllTPs = new Map(); // Contient l'ensemble des groupes TP {id -> name}

            	var mapPromos = new Map(); // {Promo -> Map TD}
            	var mapTD = new Map(); // {TD -> List TP}
            	var listTP = new Array();

            	// Parcours de l'ensemble des promotions, groupes TD & TP
            	for (var i = 0; i < oRep.retour.length; i++) {

            		// Récupération de la liste des groupes TD de la promotion si elle existe déjà
            		mapTD = mapPromos.get(oRep.retour[i].idPromo);

            		// Si elle n'existe pas, on instancie la liste des groupes TD de cette promotion
            		if (!mapTD) {
						mapTD = new Map();
					}

					if (oRep.retour[i].idTD != null) {
						// Récupération de la liste des groupes TP du groupe TD si elle existe déjà
	        			listTP = mapTD.get(oRep.retour[i].idTD);

	        			// Si elle n'existe pas, on instancie la liste des groupes TP de ce groupe TD
	            		if (!listTP) {
	            			listTP = new Array();
	            		}

	            		if (oRep.retour[i].idTP != null) {
	            			// Ajout du groupe TP dans la liste
	        				listTP.push(oRep.retour[i].idTP);
						}

        				// Association de la liste des groupes TP au groupe TD
    					mapTD.set(oRep.retour[i].idTD, listTP);
					}

        			// Association de la liste des groupes TD à la promotion
        			mapPromos.set(oRep.retour[i].idPromo, mapTD);

        			// Ajout de la promotion, du groupe TD et du groupe TP aux listes globales {id -> name}
        			mapAllPromos.set(oRep.retour[i].idPromo, oRep.retour[i].namePromo);
        			mapAllTDs.set(oRep.retour[i].idTD, oRep.retour[i].nameTD);
        			mapAllTPs.set(oRep.retour[i].idTP, oRep.retour[i].nameTP);
            	}

				var htmlContent = "";

                htmlContent += "<ul>";

                // Parcours des promotions
				for (var [promo, tdMap] of mapPromos) {
                    htmlContent += "<li data-jstree='{\"icon\":\"https://jstree.com/tree.png\"}' id='" + promo + "'>";
                    htmlContent += mapAllPromos.get(promo);
                    htmlContent += "<ul>"

                    // Parcours des groupes TD
                    for (var [td, tpList] of tdMap) {
                        htmlContent += "<li id='" + td + "'>";
                        htmlContent += mapAllTDs.get(td);
                        htmlContent += "<ul>";

						// Parcours des groupes TP
                        for (var tp of tpList) {
	                        htmlContent += "<li id='" + tp + "'>";
                            htmlContent += mapAllTPs.get(tp);
                            htmlContent += "</li>";
                        }

                        htmlContent += "</ul></li>";
                    }

                    htmlContent += "</ul></li>";
				}            	

				htmlContent += "</ul>";

				$("#promo_tree").jstree("destroy"); // Destruction de l'arbre (s'il existait déjà)
                $("#promo_tree").html(htmlContent);
				$("#promo_tree").jstree(); // Construction de l'arbre

				$("#deleteBtn").css("display", "none");

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

// Ouverture de toutes les feuilles de l'arbre
$(document).on("click", "#openJSTree", function() {
    $("#promo_tree").jstree("open_all");
});

// Fermeture de toutes les feuilles de l'arbre
$(document).on("click", "#closeJSTree", function() {
    $("#promo_tree").jstree("close_all");
});

// Sélection d'un noeud de l'arbre
$(document).on("click", "#promo_tree", function() {
	var selectedNode = $("#promo_tree").jstree("get_selected", true); // Noeud sélectionne
    var idNode;

    if (selectedNode.length > 0) {
    	idNode = selectedNode[0].id; // ID du noeud
    	$("#deleteBtn").css("display", "block");  
    }
});

// Changement du rôle (lors de l'ajout)
$(document).on("change", "#addPromoView>#type", function typePromo() {
    
    //En fonction du rôle trouvé, on ajoute des champs
    switch ($(this).val()) {
    	    case '0': // Promotion

            // Suppression des champs additionnels
            $("#additionelFields").empty();
        break; 

        case '1': // Groupe TD

            // Suppression des champs additionnels
            $("#additionelFields").empty();

            // Ajout du champ PROMO
            $("#additionelFields").append("<label>Promotion</label><select id='selectPromo'></select>");  
            
            // Récupération de toutes les promotions
            getPromo();
        break; 

        case '2': // Groupe TP

            // Suppression des champs additionnels
            $("#additionelFields").empty();

            // Ajout du champ PROMO
            $("#additionelFields").append("<label>Promotion</label><select id='selectPromo'></select>");        
            // Ajout du champ TD
            $("#additionelFields").append("<label>Groupe TD</label><select id='selectTd'></select>");   
            
            // Récupération de toutes les promotions
            getPromo();
        break; 

        default: 
            // Suppresion des champs additionnels
            $("#additionelFields").empty();
        break;
    }

});

// Validation de l'ajout d'une promotion
$(document).on("click", "#addPromo", function addPromo() {
    var error = false;
    var param = null;

    $("p#text-error").remove();

    // Initialisation du design du select type
    if($("#addPromoView>#type").css("border-color") == "rgb(255, 0, 0)") 
        $("#addPromoView>#type").css("border-color", "rgb(204, 204, 204)");
    error = checkPromo();

    // Définition des paramètres à envoyer en fonction du rôle
    switch ($("#addPromoView>#type").val()) {
        case '0':
            param = {
                action: "addPromo",
                name: $("#addPromoView > #promoName").val(),
                level: 0,
                idPromoParent: null
            }
        break; 

        case '1':
        	error = checkTD();
            param = {
                action: "addPromo",
                name: $("#addPromoView > #promoName").val(),
                level: 1,
                idPromoParent: $("#selectPromo").val()
            }
        break; 

        case '2':
        	error = checkTP();
            param = {
                action: "addPromo",
                name: $("#addPromoView > #promoName").val(),
                level: 2,
                idPromoParent: $("#selectTd").val()
            }
        break; 

        default: 
            error = true;
            $("#addPromoView>#type").after("<p id='text-error'>Ce champs est obligatoire</p>");
            $("#addPromoView>#type").css("border-color", "red");
        break;
    }

    if(!error) {

        $.ajax({
	        dataType: 'json',
	        url: '../PHP/data.php', 
	        type: 'GET',
	        data: param,
	        success: function(oRep) {
	            if(oRep.retour != null) {

	                // Réinitialisation de tous les champs
	                $("#addPromoView > #promoName").val("");

	                getPromos();

	                // Fermeture de la popup
	                $("#hideView").css("display", "none");
	                $("#addPromoView").css("display", "none");

	                $("#success").html("La promotion a été ajoutée");
	                $("#success").show();
	                setTimeout(function() { $("#success").hide(); }, 5000);

	            } else if(oRep.connecte == true) {

	                if(oRep.feedback == "Cette promotion existe déjà") {
	                    $("#errorPopUp").html("La promotion existe déjà");
	                    $("#errorPopUp").show();
	                    setTimeout(function() { $("#errorPopUp").hide(); }, 5000);                    
	                }
	                
	            } else
	                window.location = "../index.html";
	        },
	        error: function(oRep) {
	            window.location = "../index.html";
	        }
	    });
    }

});

function checkPromo() {
    var error = false;

    // Vérification du remplissage du champ "Nom"
    if(!$("#addPromoView > #promoName").val().trim()) {
        $("#addPromoView > #promoName").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#addPromoView > #promoName").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#addPromoView > #promoName").css("border-color") == "rgb(255, 0, 0)") 
        $("#addPromoView > #promoName").css("border-color", "rgb(204, 204, 204)");
    
    return error;
}

function checkTD() {
    var error = false;

    // Vérification du remplissage du champ "Promotion"
    if($("#selectPromo").val() == null || !$("#selectPromo").val().trim()) {
        $("#selectPromo").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#selectPromo").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#selectPromo").css("border-color") == "rgb(255, 0, 0)") 
        $("#selectPromo").css("border-color", "rgb(204, 204, 204)");

    return error;
}

function checkTP() {
    var error = false;

    // Vérification du remplissage du champ "Promotion"
    if($("#selectPromo").val() == null || !$("#selectPromo").val().trim()) {
        $("#selectPromo").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#selectPromo").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#selectPromo").css("border-color") == "rgb(255, 0, 0)") 
        $("#selectPromo").css("border-color", "rgb(204, 204, 204)");

    // Vérification du remplissage du champ "Groupe TD"
    if($("#selectTd").val() == null || !$("#selectTd").val().trim()) {
        $("#selectTd").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#selectTd").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#selectTd").css("border-color") == "rgb(255, 0, 0)") 
        $("#selectTd").css("border-color", "rgb(204, 204, 204)");
    
    return error;
}

/***** COMPTES UTILISATEURS *****/

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
                htmlContent += "<thead><th>Nom</th><th>Prénom</th><th>Admin ?</th><th>Actions</th></thead>";

                // Parcours de la liste des enseignants
                for (var i = 0; i < oRep.teachers.length; i++) {
                    htmlContent += "<tr id='" + oRep.teachers[i].id + "'>";
                    htmlContent += "<td class='lastname'>" + oRep.teachers[i].lastName + "</td>";
                    htmlContent += "<td class='firstname'>" + oRep.teachers[i].firstName + "</td>";
                    htmlContent += "<td>" + "<input type='checkbox' value='" + oRep.teachers[i].isAdmin + "'/>" + "</td>";
                    htmlContent += "<td><img class='editAccount' /><img class='deleteAccount' /></td>"
                    htmlContent += "</tr>";
                }

                htmlContent += "</table>";

                htmlContent += "<h3>Étudiants</h3>"
                htmlContent += "<table>";
                htmlContent += "<thead><th>Nom</th><th>Prénom</th><th>Promotion</th><th>Groupe TD</th><th>Groupe TP</th><th>Actions</th></thead>";

                // Parcours de la liste des étudiants
                for (var i = 0; i < oRep.students.length; i++) {
                    htmlContent += "<tr id='" + oRep.students[i].id + "'>";
                    htmlContent += "<td class='lastname'>" + oRep.students[i].lastName + "</td>";
                    htmlContent += "<td class='firstname'>" + oRep.students[i].firstName + "</td>";
                    htmlContent += "<td>" + oRep.students[i].namePromo + "</td>";
                    htmlContent += "<td>" + oRep.students[i].nameTD + "</td>";
                    htmlContent += "<td>" + oRep.students[i].nameTP + "</td>";
                    htmlContent += "<td><img class='editAccount' /><img class='deleteAccount' /></td>"
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

// Changement du rôle (lors de l'ajout)
$(document).on("change", "#addCompteView>#type", function editModule() {
    
    //En fonction du rôle trouvé, on ajoute des champs
    switch ($(this).val()) {
    	    case '0': // Enseignant

            // Suppression des champs additionnels
            $("#additionelFields").empty();
            
            // Ajout d'une checkbox isAdmin
            $("#additionelFields").append("<input type='checkbox' id='isAdmin' name='isAdmin' /><label for='isAdmin'>Est un admin</label> ");
        break; 

        case '1': // Étudiant

            // Suppression des champs additionnels
            $("#additionelFields").empty();

            // Ajout du champ PROMO
            $("#additionelFields").append("<label>Promo</label><select id='selectPromo'></select>");        
            // Ajout du champ TD
            $("#additionelFields").append("<label>TD</label><select id='selectTd'></select>");   
            // Ajout du champ TP
            $("#additionelFields").append("<label>TP</label><select id='selectTp'></select>");   
            
            // Récupération de toutes les promotions
            getPromo();
        break; 

        default: 
            // Suppresion des champs additionnels
            $("#additionelFields").empty();
        break;
    }

});

// Validation de l'ajout d'un compte utilisateur
$(document).on("click", "#addCompte", function addCompte() {
    var error = false;
    var param = null;

    $("p#text-error").remove();

    // Initialisation du design du select rôle
    if($("#addCompteView>#type").css("border-color") == "rgb(255, 0, 0)") 
        $("#addCompteView>#type").css("border-color", "rgb(204, 204, 204)");
    error = checkUser();

    // Définition des paramètres à envoyer en fonction du rôle
    switch ($("#addCompteView>#type").val()) {
        case '0':
            param = {
                action: "addCompte",
                type: "TEACHER",
                firstname: $("#addCompteView > #firstname").val(),
                lastname: $("#addCompteView > #lastname").val(),
                password: $("#addCompteView > #password").val(),
                isAdmin: ($("#isAdmin").is(":checked") ? 1 : 0)
            }
        break; 

        case '1':
            error = checkStudent(error);
            param = {
                action: "addCompte",
                type: "STUDENT",
                firstname: $("#addCompteView > #firstname").val(),
                lastname: $("#addCompteView > #lastname").val(),
                password: $("#addCompteView > #password").val(),
                idPromo: $("#selectTp").val()
            }
        break; 

        default: 
            error = true;
            $("#addCompteView>#type").after("<p id='text-error'>Ce champs est obligatoire</p>");
            $("#addCompteView>#type").css("border-color", "red");
        break;
    }

    if(!error) {

        $.ajax({
	        dataType: 'json',
	        url: '../PHP/data.php', 
	        type: 'GET',
	        data: param,
	        success: function(oRep) {
	            if(oRep.retour != null) {

	                // Réinitialisation de tous les champs
	                $("#addCompteView > #firstname").val("");
	                $("#addCompteView > #lastname").val("");
	                $("#addCompteView > #password").val("");
	                $("#isAdmin").prop('checked', false);

	                // Fermeture de la popup
	                $("#hideView").css("display", "none");
	                $("#addCompteView").css("display", "none");

	                $("#success").html("L'utilisateur a étè ajouté");
	                $("#success").show();
	                setTimeout(function() { $("#success").hide(); }, 5000);

	            } else if(oRep.connecte == true) {

	                if(oRep.feedback == "Cette utilisateur existe déjà") {
	                    $("#errorPopUp").html("L'utilisateur existe déjà");
	                    $("#errorPopUp").show();
	                    setTimeout(function() { $("#errorPopUp").hide(); }, 5000);                    
	                }
	                
	            } else
	                window.location = "../index.html";
	        },
	        error: function(oRep) {
	            window.location = "../index.html";
	        }
	    });
    }

});

function checkUser() {
    var error = false;

    // Vérification du remplissage du champ "Prénom"
    if(!$("#addCompteView > #firstname").val().trim()) {
        $("#addCompteView > #firstname").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#addCompteView > #firstname").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#addCompteView > #firstname").css("border-color") == "rgb(255, 0, 0)") 
        $("#addCompteView > #firstname").css("border-color", "rgb(204, 204, 204)");
    
    // Vérification du remplissage du champ "Nom"
    if(!$("#addCompteView > #lastname").val().trim()) {
        $("#addCompteView > #lastname").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#addCompteView > #lastname").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#addCompteView > #lastname").css("border-color") == "rgb(255, 0, 0)") 
        $("#addCompteView > #lastname").css("border-color", "rgb(204, 204, 204)");

	// Vérification du remplissage du champ "Mot de passe"
    if(!$("#addCompteView > #password").val().trim()) {
        $("#addCompteView > #password").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#addCompteView > #password").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#addCompteView > #password").css("border-color") == "rgb(255, 0, 0)") 
        $("#addCompteView > #password").css("border-color", "rgb(204, 204, 204)");

    return error;
}

function checkStudent(error) {
	var error = false;

    // Vérification du remplissage du champ "Promotion"
    if($("#selectPromo").val() == null || !$("#selectPromo").val().trim()) {
        $("#selectPromo").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#selectPromo").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#selectPromo").css("border-color") == "rgb(255, 0, 0)") 
        $("#selectPromo").css("border-color", "rgb(204, 204, 204)");

    // Vérification du remplissage du champ "Groupe TD"
    if($("#selectTd").val() == null || !$("#selectTd").val().trim()) {
        $("#selectTd").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#selectTd").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#selectTd").css("border-color") == "rgb(255, 0, 0)") 
        $("#selectTd").css("border-color", "rgb(204, 204, 204)");

    // Vérification du remplissage du champ "Groupe TP"
    if($("#selectTp").val() == null || !$("#selectTp").val().trim()) {
        $("#selectTp").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#selectTp").css("border-color", "red");
        error = true;
    } // Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#selectTp").css("border-color") == "rgb(255, 0, 0)") 
        $("#selectTp").css("border-color", "rgb(204, 204, 204)");

    return error;
}

// Sélection de la promotion (lors de l'ajout)
$(document).on("change", "#selectPromo", function promoChange() {
    $("#selectTp").empty(); // Réinitialise la dernière liste

    var idPromo = $(this).val();

    if(idPromo.trim()) 
        getTDByPromo(idPromo); // Remplissage de la liste des groupes TD
    else
        $("#selectTd").empty();
});

// Sélection du groupe TD (lors de l'ajout)
$(document).on("change", "#selectTd", function tdChange() {
    var idTD = $(this).val();

    if(idTD.trim())
        getTPByTD(idTD); // Remplissage de la liste des groupes TP
    else
        $("#selectTp").empty();
});

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
                $("#selectPromo").empty();
                $("#selectPromo").append("<option value=''> Selectionner la promo ...</option>");
                for (var i = 0; i < oRep.retour.length; i++) {
                    $("#selectPromo").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");  
                }
            } else 
                window.location = "../index.html";
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
function getTDByPromo(idPromo) {
    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getTD",
            idPromo : idPromo
        },
        success: function(oRep) {
            if(oRep.retour != null) {
                $("#selectTd").empty();                   
                $("#selectTd").append("<option value=''> Selectionner le goupe TD ...</option>");
                for (var i = 0; i < oRep.retour.length; i++) {
                    $("#selectTd").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");  
                }
            } else 
                window.location = "../index.html";
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
function getTPByTD(idTD) {
    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getTP",
            idTD: idTD
        },
        success: function(oRep) {
            if(oRep.retour != null) {
                $("#selectTp").empty();                   
                $("#selectTp").append("<option value=''> Selectionner le groupe TP ...</option>");
                for (var i = 0; i < oRep.retour.length; i++) {
                    $("#selectTp").append("<option value='" + oRep.retour[i].id + "'>" + oRep.retour[i].name + "</option>");  
                }
            } else 
                window.location = "../index.html";
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });

};

// Édition d'un module
$(document).on("click", "img.editAccount", function editAccount() {
    
    // A DEVELOPPER

    // Changement du bouton d'édition en bouton de validation
    $(this).removeClass("editAccount");
    $(this).addClass("validAccount");
});

// Validation de l'édiiton d'un module
$(document).on("click", "img.validAccount", function validAccount() {
    
    var error = false;

    // A DEVELOPPER
    
    if (!error) {

        $.ajax({
            dataType: 'json',
            url: '../PHP/data.php', 
            type: 'GET',
            data: {
                action: "updateAccount",
                //idModule: $(line).attr("id"),
                //name: $(input).val()
            },
            success: function(oRep) {
                if(oRep.retour != null) {

                    // A DEVELOPPER

                } else {
                    if(oRep.connecte == false)
                        window.location = "../index.html";
                }
            }, error: function(oRep) {
                window.location = "../index.html";
            }
        });

        // Changement du bouton de validation en bouton d'édition
        $(this).removeClass("validAccount");
        $(this).addClass("editAccount");
    }

});

// Suppression d'un module
$(document).on("click", "img.deleteAccount", function deleteAccount() {
    var line = $(this).parent().parent(); // Ligne contenant les informations du compte
    var firstname = line.find(".firstname"); // Cellule contenant le prénom
    var lastname = line.find(".lastname"); // Cellule contenant le nom

    idDelete = line.attr("id"); // ID du module
    $("#elementToDelete").text("Compte - '" + firstname.text() + " " + lastname.text() + "'");
   
   	// Demande de confirmation de la suppression
    $("#hideView").css("display", "block");
    $("#deleteView").css("display", "block"); 
});