var idDelete; // ID de l'élément à supprimer (module, promotion ou compte utilisateur)
var deleteType; //Utile pour différensier le delete student et teacher

var _teachers_ = [], _students_ = [], _modules_ = [];
var tableT, tableS, tableM;
var translation = {
    "lengthMenu":   "Afficher _MENU_ lignes par page",
    "zeroRecords":  "Aucun utilisateur trouvé",
    "info":         "Affichage de _START_ à _END_ sur _TOTAL_ lignes",
    "infoEmpty":    "Aucun utilisateur",
    "infoFiltered": "(Filtre sur les _MAX_ lignes)",
    "search":       "Recherche:",
     "paginate": {
        "first":    "Premier",
        "last":     "Dernier",
        "next":     "Suivant",
        "previous": "Précédent"
    }
}

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
                	case "modules" : 	
                        for(var i=0; i<_modules_.length;i++) {
                            if(_modules_[i][0] == idDelete) {
                                _modules_.splice(i, 1);
                                tableM.clear().rows.add(_modules_).draw();
                                break;
                            }
                        }
                    break;
            		case "promos" : 	getPromos();	break;
            		case "accounts" :
                        if(deleteType == "student") {
                            for(var i=0; i<_students_.length;i++) {
                                if(_students_[i][0] == idDelete) {
                                     _students_.splice(i, 1);
                                    tableS.clear().rows.add(_students_).draw();
                                    break;
                                }
                            }
                        } else {
                            for(var i=0; i<_teachers_.length;i++) {
                                if(_teachers_[i][0] == idDelete) {
                                    _teachers_.splice(i, 1);
                                    tableT.clear().rows.add(_teachers_).draw();
                                    break;
                                }
                            }
                        }    
                    	break;
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
                for (var i = 0; i < oRep.retour.length; i++) {
                    var module = [ oRep.retour[i].id, oRep.retour[i].name, 
                            "<img id='"+oRep.retour[i].id+"' class='editModule' src='../IMG/edit-black.png'/>"
                            +"<img id='"+oRep.retour[i].id+"' class='deleteModule' src='../IMG/delete-black.png'/>"];
                    _modules_.push(module);
                }

                tableM = $('#moduleTable').DataTable({
                    data: _modules_ ,
                    "columnDefs": [{
                        "targets": [ 0 ],
                        "visible": false,
                        "searchable": false
                    }],
                    "language": translation
                });
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
                    //Ajout le module au tableau
                    var module = [oRep.retour, $("#moduleName").val(), 
                        "<img id='"+oRep.retour+"' class='editModule' src='../IMG/edit-black.png'/>"
                            +"<img id='"+oRep.retour+"' class='deleteModule' src='../IMG/delete-black.png'/>"];
                    _modules_.push(module);
                    tableM.clear().rows.add(_modules_).draw();

                    // Réinitialisation de tous les champs
                    $("#addModuleView > #moduleName").val("");

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
    }
});

// Édition d'un module
$(document).on("click", "img.editModule", function editModule() {
    var line = $(this).parent().parent(); // Ligne contenant le nom du module et les boutons d'action
    var idModule = $(this).attr("id");

    for(var i=0; i<_modules_.length;i++) {
        if(_modules_[i][0] == idModule) {
            var name = _modules_[i][1];
            _modules_[i][1] = "<input type='text' id='"+ idModule +"' class='editInput' value='"+ name +"' />";
            _modules_[i][2] =  "<img id='"+idModule+"' class='validModule' src='../IMG/valid-black.png' />"
                +"<img id='"+idModule+"' class='deleteModule' src='../IMG/delete-black.png' />"
            tableM.clear().rows.add(_modules_).draw();
            break;
        }
    }
});

// Validation de l'éditon d'un module
$(document).on("click", "img.validModule", function validModule() {
    var line = $(this).parent().parent(); // Ligne contenant le nom du module et les boutons d'action
   // var name = line.find(".moduleName"); // Cellule contenant le nom du module
    var input = line.find(".editInput"); // Champs texte modifié
    var idModule = $(this).attr("id");

    $("p#text-error").remove();
    var error = false;

    // Vérification du remplissage du champ texte
    if(!$(input).val().trim()) {
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
                idModule: idModule,
                name: $(input).val()
            },
            success: function(oRep) {
                if(oRep.retour != null) {
                    for(var i=0; i<_modules_.length;i++) {
                        if(_modules_[i][0] == idModule) {
                            _modules_[i][1] = $(input).val();
                            _modules_[i][2] =  "<img id='"+idModule+"' class='editModule' src='../IMG/edit-black.png'/>"
                                +"<img id='"+idModule+"' class='deleteModule' src='../IMG/delete-black.png'/>"
                            tableM.clear().rows.add(_modules_).draw();
                            break;
                        }
                    }
                } else {
                    if(oRep.connecte == false)
                        window.location = "../index.html";
                }
            }, error: function(oRep) {
                window.location = "../index.html";
            }
        });
    }
});

// Suppression d'un module
$(document).on("click", "img.deleteModule", function validModule() {
    var name;
    var line = $(this).parent().parent(); // Ligne contenant le nom du module et les boutons d'action

    idDelete = $(this).attr("id"); // ID du module

    for(var i=0; i<_modules_.length;i++) {
        if(_modules_[i][0] == idDelete) {
            name = _modules_[i][1];
            break;
        }
    }

    $("#elementToDelete").text("Module - '" + name + "'");
   
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
            getAllPromo();
        break; 

        case '2': // Groupe TP

            // Suppression des champs additionnels
            $("#additionelFields").empty();

            // Ajout du champ PROMO
            $("#additionelFields").append("<label>Promotion</label><select id='selectPromo'></select>");        
            // Ajout du champ TD
            $("#additionelFields").append("<label>Groupe TD</label><select id='selectTd'></select>");   
            
            // Récupération de toutes les promotions
            getAllPromo();
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
            if(oRep.teachers != null || oRep.students != null) {
                for (var i = 0; i < oRep.teachers.length; i++) {
                    var input = "";
                    if(oRep.teachers[i].isAdmin  == 1)
                        input = "<input id='setAdmin' class='"+oRep.teachers[i].id+"' type='checkbox' checked/>";
                    else 
                        input = "<input id='setAdmin' class='"+oRep.teachers[i].id+"' type='checkbox'/>";

                    var teacher = [ oRep.teachers[i].id, oRep.teachers[i].lastName.toUpperCase(), oRep.teachers[i].firstName.toLowerCase(), input
                    , "<img class='deleteAccount' id='"+oRep.teachers[i].id+"' name='teacher' src='../IMG/delete-black.png'/>"];
                    _teachers_.push(teacher);
                }

                tableT = $('#teachersTable').DataTable({
                    data: _teachers_ ,
                    "columnDefs": [{
                        "targets": [ 0 ],
                        "visible": false,
                        "searchable": false
                    }],
                    "language": translation
                });

                var students = "";

                for (var i = 0; i < oRep.students.length; i++) {
                    var student = [ oRep.students[i].id, oRep.students[i].lastName.toUpperCase(), oRep.students[i].firstName.toLowerCase()
                        , "<span id='"+oRep.students[i].idPromo+"' >"+oRep.students[i].namePromo+"</span>"
                        , "<span id='"+oRep.students[i].idTD+"' >"+oRep.students[i].nameTD+"</span>"
                        , "<span id='"+oRep.students[i].idTP+"' >"+oRep.students[i].nameTP+"</span>"
                        , "<img class='editAccount' id='"+oRep.students[i].id+"' src='../IMG/edit-black.png'/> "
                            +"<img class='deleteAccount' id='"+oRep.students[i].id+"' name='student' src='../IMG/delete-black.png'/>"];
                    _students_.push(student);
                }

                tableS = $('#studentsTable').DataTable({
                    data: _students_,
                    "columnDefs": [{
                        "targets": [ 0 ],
                        "visible": false,
                        "searchable": false
                    }],
                    "language": translation
                });
                
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

/** AJOUT D'UN COMPTE **/
$(document).on("change", "#addCompteView>#type", function fieldForType() {
    console.log($(this).val());
    //En fonction du rôle trouvé, on ajoute des champs
    switch ($(this).val()) {
    	    case '0': // Enseignant

            // Suppression des champs additionnels
            $("#addCompteView>#additionelFields").empty();
            
            // Ajout d'une checkbox isAdmin
            $("#addCompteView>#additionelFields").append("<input type='checkbox' id='isAdmin' name='isAdmin' /><label for='isAdmin'>Est un admin</label> ");
        break; 

        case '1': // Étudiant

            // Suppression des champs additionnels
            $("#addCompteView>#additionelFields").empty();

            // Ajout du champ PROMO
            $("#addCompteView>#additionelFields").append("<label>Promo</label><select id='selectPromo'></select>");        
            // Ajout du champ TD
            $("#addCompteView>#additionelFields").append("<label>TD</label><select id='selectTd'></select>");   
            // Ajout du champ TP
            $("#addCompteView>#additionelFields").append("<label>TP</label><select id='selectTp'></select>");   
            
            // Récupération de toutes les promotions
            getAllPromo();
        break; 

        default: 
            // Suppresion des champs additionnels
            $("#additionelFields").empty();
        break;
    }

});

$(document).on("change", "#selectPromo", function promoChange() {
    //Rénittionalise la dernières listes
    $("#selectTp").empty();

    var idPromo = $(this).val();
    if(idPromo.trim()) 
        getTDByPromo(idPromo);
    else
        $("#selectTd").empty();
});

$(document).on("change", "#selectTd", function tdChange() {
    var idTD = $(this).val();
    if(idTD.trim()) 
        getTPByTD(idTD);   
    else
        $("#selectTp").empty();
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
                    //Ajout au tableau
                    if($("#addCompteView>#type").val() == 0) {
                        var input = "";
                        if($("#isAdmin").is(":checked"))
                            input = "<input id='setAdmin' class='"+oRep.retour+"' type='checkbox' checked/>";
                        else 
                            input = "<input id='setAdmin' class='"+oRep.retour+"' type='checkbox'/>";

                        var teacher = [oRep.retour, $("#addCompteView > #lastname").val().toUpperCase(), 
                            $("#addCompteView > #firstname").val().toLowerCase(), input
                            , "<img class='deleteAccount' id='"+oRep.retour+"' name='teacher' src='../IMG/delete-black.png'/>"];
                        _teachers_.push(teacher);
                        tableT.clear().rows.add(_teachers_).draw();
                    } else {
                        var TP = $("#selectTp option[value='"+$("#selectTp").val()+"']").text();
                        var TD = $("#selectTd option[value='"+$("#selectTd").val()+"']").text();
                        var promo = $("#selectPromo option[value='"+$("#selectPromo").val()+"']").text();

                        var student = [oRep.retour, $("#addCompteView > #lastname").val().toUpperCase(), 
                            $("#addCompteView > #firstname").val().toLowerCase()
                            ,"<span id='"+$("#selectPromo").val()+"' >"+promo+"</span>"
                            , "<span id='"+$("#selectTd").val()+"' >"+TD+"</span>"
                            , "<span id='"+$("#selectTp").val()+"' >"+TP+"</span>"
                            ,"<img class='editAccount' id='"+oRep.retour+"' src='../IMG/edit-black.png'/>"
                                +"<img class='deleteAccount' id='"+oRep.retour+"' name='student' src='../IMG/delete-black.png'/>"];
                        _students_.push(student);                    
                        tableS.clear().rows.add(_students_).draw();
                    }

                    //Réinitialiser touts les champs
                    $("#addCompteView > #firstname").val("");
                    $("#addCompteView > #lastname").val("");
                    $("#addCompteView > #password").val("");
                    $("#isAdmin").prop('checked', false);

                    //Fermer la popup
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
 * Récupére toutes les promos
 */
function getAllPromo(idPromo) {
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
                    $("#selectPromo").append("<option value='" + oRep.retour[i].id + "' "+
                        (idPromo == oRep.retour[i].id ? "selected" : "" )+">" + oRep.retour[i].name + "</option>");  
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
 * Récupére les groupe TD déscendant de la promo en paramétre
 */
function getTDByPromo(idPromo, idTD) {
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
                $("#selectTd").append("<option value=''> Selectionner le groupe TD ...</option>");
                for (var i = 0; i < oRep.retour.length; i++) {
                    $("#selectTd").append("<option value='" + oRep.retour[i].id + "' "+
                        (idTD == oRep.retour[i].id ? "selected" : "" )+">" + oRep.retour[i].name + "</option>");  
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
 * Récupére les groupe TP déscendant du groupe TD en paramétre
 */
function getTPByTD(idTD, idTP) {
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
                    $("#selectTp").append("<option value='" + oRep.retour[i].id + "' "+
                        (idTP == oRep.retour[i].id ? "selected" : "" )+" >" + oRep.retour[i].name + "</option>");  
                }
            } else 
                window.location = "../index.html";
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });

};

$(document).on("change", "#setAdmin", function setAdmin() {
    var isAdmin = ($(this).is(":checked") ? 1 : 0);
    var idTeacher = $(this).attr("class");

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "updateCompte",
            idUser: idTeacher, 
            isAdmin: isAdmin
        },
        success: function(oRep) {
            if(oRep.retour != null ) {
                $("#success").html("L'enseignant à étè mis à jour");
                $("#success").show();
                setTimeout(function() { $("#success").hide(); }, 5000);
            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
                else {
                    $("#error").html("L'enseignant n'a pas pu être modifié");
                    $("#error").show();
                    setTimeout(function() { $("#error").hide(); }, 5000);
                }
            }
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });
});

//Edition d'un éléve
$(document).on("click", "img.editAccount", function editUser() {
    var idUser = $(this).attr("id");
    var idPromo, idTD, idTP;

    for(var i=0; i<_students_.length;i++) {
        if(_students_[i][0] == idUser) {
            var idPromo = _students_[i][3].split('\'')[1];
            _students_[i][3] = "<select id='selectPromo' class='editInput'></select>";
            idTD = _students_[i][4].split('\'')[1];
            _students_[i][4] = "<select id='selectTd' class='editInput'></select>";
            idTP = _students_[i][5].split('\'')[1];
            _students_[i][5] = "<select id='selectTp' class='editInput'></select>";
            _students_[i][6] =  "<img id='"+idUser+"' class='validAccount' src='../IMG/valid-black.png' />"
                +"<img id='"+idUser+"' class='deleteAccount' name='student' src='../IMG/delete-black.png' />"
            tableS.clear().rows.add(_students_).draw();
            break;
        }
    }

    getAllPromo(idPromo);
    getTDByPromo(idPromo, idTD);
    getTPByTD(idTD, idTP);
});

// Validation de l'édiiton d'un module
$(document).on("click", "img.validAccount", function validAccount() {
    var idUser = $(this).attr("id");
    $("p#text-error").remove();

    var error = false;
    error = checkStudent(error);
    
    if (!error) {

        $.ajax({
            dataType: 'json',
            url: '../PHP/data.php', 
            type: 'GET',
            data: {
                action: "updateCompte",
                idUser: idUser,
                idPromo: $("#selectTp").val()
            },
            success: function(oRep) {
                if(oRep.retour != null) {
                    for(var i=0; i<_students_.length;i++) {
                        if(_students_[i][0] == idUser) {
                            var TP = $("#selectTp option[value='"+$("#selectTp").val()+"']").text();
                            var TD = $("#selectTd option[value='"+$("#selectTd").val()+"']").text();
                            var promo = $("#selectPromo option[value='"+$("#selectPromo").val()+"']").text();

                            _students_[i][3] = "<span id='"+$("#selectPromo").val()+"' >"+promo+"</span>";
                            _students_[i][4] = "<span id='"+$("#selectTd").val()+"' >"+TD+"</span>";
                            _students_[i][5] = "<span id='"+$("#selectTp").val()+"' >"+TP+"</span>";

                            _students_[i][6] =  "<img id='"+idUser+"' class='editAccount' src='../IMG/edit-black.png' />"
                                +"<img id='"+idUser+"' class='deleteAccount' name='student' src='../IMG/delete-black.png' />"
                            tableS.clear().rows.add(_students_).draw();
                            break;
                        }
                    }

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
    var firstname; // Cellule contenant le prénom
    var lastname; // Cellule contenant le nom

    idDelete = $(this).attr("id"); // ID du compte
    deleteType = $(this).attr("name"); //teacher ou student

    if(type == "student") {
        for(var i=0; i<_students_.length;i++) {
            if(_students_[i][0] == idDelete) {
                firstname = _students_[i][1];
                lastname = _students_[i][2];
                break;
            }
        }
    } else {
        for(var i=0; i<_teachers_.length;i++) {
            if(_teachers_[i][0] == idDelete) {
                firstname = _teachers_[i][1];
                lastname = _teachers_[i][2];
                break;
            }
        }
    }

    $("#elementToDelete").text("Compte - '" + firstname + " " + lastname + "'");
   
    // Demande de confirmation de la suppression
    $("#hideView").css("display", "block");
    $("#deleteView").css("display", "block");
});



$(document).on("click", "#deleteUser", function deleteUser() {
    var type = $(this).attr("name");
    var idUser = $(this).attr("class");
    
    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "deleteCompte",
            idUser: idUser
        },
        success: function(oRep) {
            if(oRep.retour != null) {
                if(type == "student") {
                    for(var i=0; i<_students_.length;i++) {
                        if(_students_[i][0] == idUser) {
                            _students_.splice(i, 1);
                            tableS.clear().rows.add(_students_).draw();
                            break;
                        }
                    }
                } else {
                    for(var i=0; i<_teachers_.length;i++) {
                        if(_teachers_[i][0] == idUser) {
                            _teachers_.splice(i, 1);
                            tableT.clear().rows.add(_teachers_).draw();
                            break;
                        }
                    }
                }                
            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
            }
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });
});
