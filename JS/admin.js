var idDelete, _teachers_ = [], _students_ = [];

var tableT, tableS;
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

$(document).ready(function() {
    //Vérifie que l'utilisatur connecté est admin
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
            $("html").css("overflow-y","auto");
        break;

        case "Promotions" :
            console.log("Ajout promotion");
        break;

        case "Comptes Utilisateurs" :
            $("#hideView").css("display", "block");
            $("#addCompteView").css("display", "block");
            $("html").css("overflow-y","auto");
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
    $("#addCompteView").css("display", "none");
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
            if(oRep.teachers != null || oRep.students != null) {
                for (var i = 0; i < oRep.teachers.length; i++) {
                    var input = "";
                    if(oRep.teachers[i].isAdmin  == 1)
                        input = "<input id='setAdmin' class='"+oRep.teachers[i].id+"' type='checkbox' checked/>";
                    else 
                        input = "<input id='setAdmin' class='"+oRep.teachers[i].id+"' type='checkbox'/>";

                    var teacher = [ oRep.teachers[i].id, oRep.teachers[i].lastName.toUpperCase(), oRep.teachers[i].firstName.toLowerCase(), input
                    , "<img id='deleteUser' class='"+oRep.teachers[i].id+"' name='teacher' src='../IMG/delete-black.png'/>"];
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
                        , oRep.students[i].namePromo, oRep.students[i].nameTD, oRep.students[i].nameTP
                        , "<img id='changePromo' class='"+oRep.students[i].id+"' src='../IMG/edit-black.png'/> "
                            +"<img id='deleteUser' class='"+oRep.students[i].id+"' name='student' src='../IMG/delete-black.png'/>"];
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


/** AJOUT D'UN COMPTE **/
$(document).on("change", "#addCompteView>#type", function editModule() {
    //En fonction du rôle trouvé, on ajoute des champs
    switch ($(this).val()) {
        case '0':
            //Enlever les champs additionnels
            $("#additionelFields").empty();
            //Ajout une chackbox isAdmin
            $("#additionelFields").append("<input type='checkbox' id='isAdmin' name='isAdmin' /><label for='isAdmin'>Est un admin</label> ");
        break; 
        case '1':
            //Enlever les champs additionnels
            $("#additionelFields").empty();
            //Ajout le champ PROMO
            $("#additionelFields").append("<label>Promo</label><select id='selectPromo'></select>");        
            //Ajout le champ TD
            $("#additionelFields").append("<label>TD</label><select id='selectTd'></select>");   
            //Ajout le champ TP
            $("#additionelFields").append("<label>TP</label><select id='selectTp'></select>");   
            //Récupére toutes les promos
            getPromo();
        break; 
        default: 
            //Enlever les champs additionnels
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

$(document).on("click", "#addCompte", function addCompte() {
    var error = false;
    var param = null;

    $("p#text-error").remove();
    //Initialise de design du select rôle
    if($("#addCompteView>#type").css("border-color") == "rgb(255, 0, 0)") 
        $("#addCompteView>#type").css("border-color", "rgb(204, 204, 204)");
    error = checkUser();

    //Définie les paramétres à envoyer en fonction du rôle
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
                console.log("id: "+oRep.retour);
                //Ajout au tableau
                if($("#addCompteView>#type").val() == 0) {
                    var input = "";
                    if($("#isAdmin").is(":checked"))
                        input = "<input id='setAdmin' class='"+oRep.retour+"' type='checkbox' checked/>";
                    else 
                        input = "<input id='setAdmin' class='"+oRep.retour+"' type='checkbox'/>";

                    var teacher = [oRep.retour, $("#addCompteView > #lastname").val().toUpperCase(), 
                        $("#addCompteView > #firstname").val().toLowerCase(), input
                        , "<img id='deleteUser' class='"+oRep.retour+"' name='teacher' src='../IMG/delete-black.png'/>"];
                    _teachers_.push(teacher);
                    tableT.clear().rows.add(_teachers_).draw();
                } else {
                    var TP = $("#selectTp option[value='"+$("#selectTp").val()+"']").text();
                    var TD = $("#selectTd option[value='"+$("#selectTd").val()+"']").text();
                    var promo = $("#selectPromo option[value='"+$("#selectPromo").val()+"']").text();

                    var student = [oRep.retour, $("#addCompteView > #lastname").val().toUpperCase(), 
                        $("#addCompteView > #firstname").val().toLowerCase(), promo, TD, TP, 
                        "<img id='changePromo' class='"+oRep.retour+"' src='../IMG/edit-black.png'/>"
                            +"<img id='deleteUser' class='"+oRep.retour+"' name='student' src='../IMG/delete-black.png'/>"];
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

    //Si le champs est vide, on affiche une erreur
    if(!$("#addCompteView > #firstname").val().trim()) {
        $("#addCompteView > #firstname").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#addCompteView > #firstname").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#addCompteView > #firstname").css("border-color") == "rgb(255, 0, 0)") 
        $("#addCompteView > #firstname").css("border-color", "rgb(204, 204, 204)");
    
    if(!$("#addCompteView > #lastname").val().trim()) {
        $("#addCompteView > #lastname").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#addCompteView > #lastname").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#addCompteView > #lastname").css("border-color") == "rgb(255, 0, 0)") 
        $("#addCompteView > #lastname").css("border-color", "rgb(204, 204, 204)");

    if(!$("#addCompteView > #password").val().trim()) {
        $("#addCompteView > #password").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#addCompteView > #password").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#addCompteView > #password").css("border-color") == "rgb(255, 0, 0)") 
        $("#addCompteView > #password").css("border-color", "rgb(204, 204, 204)");

    return error;
}

function checkStudent(error) {
    //Si le champs est vide, on affiche une erreur
    if($("#selectPromo").val() == null || !$("#selectPromo").val().trim()) {
        $("#selectPromo").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#selectPromo").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#selectPromo").css("border-color") == "rgb(255, 0, 0)") 
        $("#selectPromo").css("border-color", "rgb(204, 204, 204)");

    //Si le champs est vide, on affiche une erreur
    if($("#selectTd").val() == null || !$("#selectTd").val().trim()) {
        $("#selectTd").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#selectTd").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#selectTd").css("border-color") == "rgb(255, 0, 0)") 
        $("#selectTd").css("border-color", "rgb(204, 204, 204)");

    //Si le champs est vide, on affiche une erreur
    if($("#selectTp").val() == null || !$("#selectTp").val().trim()) {
        $("#selectTp").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#selectTp").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#selectTp").css("border-color") == "rgb(255, 0, 0)") 
        $("#selectTp").css("border-color", "rgb(204, 204, 204)");

    return error;
}

/**
 * Récupére toutes les promos
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
 * Récupére les groupe TD déscendant de la promo en paramétre
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
 * Récupére les groupe TP déscendant du groupe TD en paramétre
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