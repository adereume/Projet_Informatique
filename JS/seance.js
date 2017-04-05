var idSeance;

//Variables de sauvegarde de la séance
var seances;
var homeworks;
var notes;
var _previous_answer;

var timer;
var timerLost;
var interval = 10000;

var pickerDate;
var picketTime;
var monthNames = ["", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

var activeView = "defaultView";

$(document).ready(function() {
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    idSeance = unescape(temp[1]);

    getSeance();

    $( "#progressbar" ).progressbar({
      value: 0
    });
    $( ".pourcentage").progressbar({
      value: 0
    });
});

/***** AJOUT D'UN NOUVEL ÉLÉMENT *****/

$(document).on("click", "#addBtn", function afficherPopUpAjout() {
    $("#hideView").css("display", "block");
    $("#addView").css("display", "block");
    clearInterval(timer);
});

// Nouvelle Tâche
$(document).on("click", "#addTask", function addTache() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");

    removeActiveView();

    $("#editTaskView").css("display", "block");
    activeView = "editTaskView";

    //Ajout du bouton valider
    $("#navbar").append("<img id='validAddBtn' src='../IMG/valid.png' />");

    //Initialisation des champs
    $("#editTaskView > #titre").val("");
    $("#editTaskView > #description").val("");

    clearInterval(timer);
});

// Nouvelle Question
$(document).on("click", "#addQuestion", function addQuestion() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");

    removeActiveView();

    $("#editQuestionView").css("display", "block");
    activeView = "editQuestionView";

    //Ajout du bouton valider
    $("#navbar").append("<img id='validAddBtn' src='../IMG/valid.png' />");

     //Initialisation des champs
    $("#editQuestionView > #titre").val("");
    $("#editQuestionView > #correction").val("");

    clearInterval(timer);
});

// Nouveau Devoir
$(document).on("click", "#addHomework", function addHomework() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");

    removeActiveView();

    $("#editHomeworkView").css("display", "block");
    activeView = "editHomeworkView";

    //Ajout du bouton valider
    $("#navbar").append("<img id='validAddBtn' src='../IMG/valid.png' />");

    //Initialisation des champs
    $("#editHomeworkView > #titre").val("");    
    $("#editHomeworkView > #description").val("");
    $("#editHomeworkView > #date").val("");

    var $input = $('#editHomeworkView > #date').pickadate({
        formatSubmit: 'yyyy-mm-dd',   
        hiddenName: true,
        min: true,
        selectYears: true,
        selectMonths: true
    });
    pickerDate = $input.pickadate('picker');

    $('#editHomeworkView > #time').pickatime({
        format: 'HH:i',
        interval: 15, 
        min: [8,00],
        max: [21,0],
        hiddenName: true
    });
    clearInterval(timer);
});

// Nouvelle Note
$(document).on("click", "#addNote", function addNote() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");

    removeActiveView();

    $("#editNoteView").css("display", "block");
    activeView = "editNoteView";

    //Ajout du bouton valider
    $("#navbar").append("<img id='validAddBtn' src='../IMG/valid.png' />");

    //Initialisation des champs
    $("#editNoteView > #description").val("");
    clearInterval(timer);
});

// Validation de l'ajout
$(document).on("click", "#validAddBtn", function add() {
    var param;

    $("#error").css("display", "none");
    $("p#text-error").remove();

    var error = false;

    // Vérifier la vue active
    switch(activeView) {
        case "editTaskView": 
            error = checkTask();
            if(!error) {
                param = {
                    action : "addTache",
                    idSeance : idSeance,
                    titre : $("#editTaskView > #titre").val(),
                    description : $("#editTaskView > #description").val()
                };
            }
            break;

        case "editQuestionView": 
            error = checkQuestion();
            if(!error) {
                param = {
                    action : "addQuestion",
                    idSeance : idSeance,
                    description : $("#editQuestionView > #titre").val(),
                    correct : $("#editQuestionView > #correction").val()
                };
            }
            break;

        case "editHomeworkView": 
        	error = checkHomework();
            if(!error) {
                param = {
                    action : "addHomeWork",
                    idSeance : idSeance,
                    titre : $("#editHomeworkView > #titre").val(),
                    description : $("#editHomeworkView > #description").val(),
                    dueDate : pickerDate.get('select', 'yyyy/mm/dd')+" "+$("#editHomeworkView > #time").val()
                };
            } 
            break;

        case "editNoteView": 
        	error = checkNote();
        	if(!error) {
	            param = {
	                action : "addNote",
	                idSeance : idSeance,
	                description : $("#editNoteView > #description").val()
	            };
	        }
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
                    switch(activeView) {
                        case "editTaskView": 
                            seances[seances.length] = {
                                id: oRep.retour,
                                type: "Tache",
                                titre: setTitle($("#editTaskView > #titre").val()),
                                isVisible: 0
                            }

                            $("#editTaskView > #titre").val("");
                            $("#editTaskView > #description").val("");
                            break;
                        case "editQuestionView": 
                            seances[seances.length] = {
                                id: oRep.retour,
                                type: "Question",
                                titre: setTitle($("#editQuestionView > #titre").val()),
                                isVisible: 0
                            }
                            $("#editQuestionView > #titre").val("");
                            $("#editQuestionView > #correction").val("");
                            break;
                        case "editHomeworkView": 
                            homeworks[homeworks.length] = {
                                id: oRep.retour,
                                titre: setTitle($("#editHomeworkView > #titre").val()),
                                isVisible: 0
                            }
                            $("#editHomeworkView > #titre").val("");
                            $("#editHomeworkView > #description").val("");
                            $("#editHomeworkView > #date").val("");
                            $("#editHomeworkView > #time").val("");
                            break;

                        case "editNoteView": 
                            notes[notes.length] = {
                                id: oRep.retour,
                                description: setTitle($("#editNoteView > #description").val())
                            }
                            $("#editNoteView > #description").val("");
                            break;
                    }

                    $("#navbar > #validAddBtn").remove();

                    removeActiveView();
                    $("#defaultView").css("display", "block");
                    activeView = "defaultView";

                    showSeance();
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

/***** SUPPRESSION D'UN ÉLÉMENT *****/

$(document).on("click", "#deleteBtn", function afficherPopUpDelete() {
    $("#hideView").css("display", "block");
    $("#deleteView").css("display", "block");
    clearInterval(timer);
});

// Confirmation de la suppression
$(document).on("click", "#validDeleteBtn", function deleteElement() {
	$("#hideView").css("display", "none");
	$("#deleteView").css("display", "none");

    var id = $("#" + activeView + " > #id").val();

    switch(activeView) {
        case "taskView": 
            param = {
                action : "deleteTache",
                idTache : id
            };

            for(var i=0; i<seances.length; i++) {
                if(seances[i].id == id && seances[i].type == "Tache") {
                    seances = jQuery.grep(seances, function(value) {
                      return value != seances[i];
                    });
                    break;
                }
            }

            break;

        case "questionView": 
            param = {
                action : "deleteQuestion",
                idQuestion : id
            };

            for(var i=0; i<seances.length; i++) {
                if(seances[i].id == id && seances[i].type == "Question") {
                    seances = jQuery.grep(seances, function(value) {
                      return value != seances[i];
                    });
                    break;
                }
            }
            break;

        case "homeworkView": 
            param = {
            	action : "deleteHomeWork",
            	idHomeWork : id
            };

            for(var i=0; i<homeworks.length; i++) {
                if(homeworks[i].id == id) {
                    homeworks = jQuery.grep(homeworks, function(value) {
                      return value != homeworks[i];
                    });
                    break;
                }
            }
            break;
        
        case "noteView": 
            param = {
            	action : "deleteNote",
            	idNote : id
            };

            for(var i=0; i<notes.length; i++) {
                if(notes[i].id == id) {
                    notes = jQuery.grep(notes, function(value) {
                      return value != notes[i];
                    });
                    break;
                }
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
                
                showSeance();
                removeActiveView();
                
                $("#defaultView").css("display", "block");
                activeView = "defaultView";
            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
            }
        }, error: function(oRep) {
            window.location = "../index.html";
        }
    });
    
});

// Fermeture du pop-up (ajout/suppression)
$(document).on("click", "#close", function fermerPopUpAjout() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");
    $("#deleteView").css("display", "none");
});

/***** MODIFICATION D'UN ÉLÉMENT *****/

$(document).on("click", "#editBtn", function setEditView() {
    var input = '#'+activeView+' > .editInput';
    var text = '#'+activeView+' > .editText';
    var date = "#"+activeView+">.editDate";

    //Vue Editable 
    $(input).replaceWith( "<input type=\"text\" id=\""+$(input).attr("id")+"\" class=\"editInput\" maxlength=\"50\" value=\""+$(input).html()+"\"/>" );
    if(activeView == "noteView") {
        var description = $(text).html().replace(/<br ?\/?>/g, "");
        $(text).replaceWith( "<textarea id='"+$(text).attr("id")+"' class='editText' maxlength='500'>"+description+"</textarea>" );
    } else if (activeView == "questionView") {
        var description = $(text+"#titre").html().replace(/<br ?\/?>/g, "");
        $(text+"#titre").replaceWith( "<textarea id='titre' class='editText' maxlength='255'>"+description+"</textarea>" );
    
        var description = $(text+"#correction").html().replace(/<br ?\/?>/g, "");
        $(text+"#correction").replaceWith( "<textarea id='correction' class='editText' maxlength='255'>"+description+"</textarea>" );
    } else {
        var description = $(text).html().replace(/<br ?\/?>/g, "");
        $(text).replaceWith( "<textarea id='"+$(text).attr("id")+"' class='editText' maxlength='255'>"+description+"</textarea>" );
    }

    if(activeView == "homeworkView") {
        //Récupérer les valeurs
        var dateVal = $(date).html().split("à")[0];
        var timeVal = $(date).html().split("à")[1];

        $(date).replaceWith("<div class='editDate'>"
                +"<input id='date' type='date' /> <input id='time' type='time'/>"
                +"</div>");

        var $input = $('#homeworkView>.editDate>#date').pickadate({
            min: true,
            selectYears: true,
            selectMonths: true
        });
        pickerDate = $input.pickadate('picker');
        var array = dateVal.split(" ");
        pickerDate.set('select', new Date(array[3], $.inArray(array[2], monthNames)- 1, array[1]));

        var $inputT = $('#homeworkView>.editDate>#time').pickatime({
            interval: 15, 
            min: [8,00],
            max: [21,0],
            format: 'HH:i'
        });
        pickerTime = $inputT.pickatime('picker');
        var array = timeVal.split("h");
        pickerTime.set("select", [array[0], array[1]]);
    }
    
    //Ajout du bouton valider
    $("#navbar").append("<img id='validEditBtn' src='../IMG/valid.png' />");
    $("#editBtn").remove();
    clearInterval(timer);
});

// Validation de la modification
$(document).on("click", "#validEditBtn", function update() {
    var param;

    $("#error").css("display", "none");
    $("p#text-error").remove();

    var error = false;
    // Vérifier la vue active
    switch(activeView) {
        case "taskView": 
            error = checkTask();
            if(!error) {
                param = {
                    action : "updateTache",
                    titre : $("#taskView > #titre").val(),
                    description : $("#taskView > #description").val(), 
                    idTache : $("#taskView > #id").val()
                };

                //Mettre a jour dans le tableau
                for(var i=0; i < seances.length; i++) {
                    if(seances[i].id == $("#taskView > #id").val() && seances[i].type == "Tache") {
                        seances[i].titre = setTitle($("#taskView > #titre").val());
                        break;
                    }
                }
            }
            break;

        case "questionView": 
            error = checkQuestion();
            if(!error) {
                param = {
                    action : "updateQuestion",
                    idQuestion : $("#questionView > #id").val(),
                    description : $("#questionView > #titre").val(),
                    correct : $("#questionView > #correction").val()
                };

                //Mettre a jour dans le tableau
                for(var i=0; i < seances.length; i++) {
                    if(seances[i].id == $("#questionView > #id").val() && seances[i].type == "Question") {
                        seances[i].titre = setTitle($("#questionView > #titre").val());
                        break;
                    }
                }
            }            
            break;

        case "homeworkView":         
            error = checkHomework();
            if(!error) {
                param = {
                    action : "updateHomeWork",
                    idHomeWork : $("#homeworkView > #id").val(),
                    titre : $("#homeworkView > #titre").val(),
                    description : $("#homeworkView > #description").val(),
                    dueDate: pickerDate.get('select', 'yyyy/mm/dd')+" "+$("#homeworkView >.editDate> #time").val()
                };

                //Mettre a jour dans le tableau
                for(var i=0; i < homeworks.length; i++) {
                    if(homeworks[i].id == $("#homeworkView > #id").val()) {
                        homeworks[i].titre = setTitle($("#homeworkView > #titre").val());
                        break;
                    }
                }
            }
            break;
        
        case "noteView": 
            error = checkNote();
            if(!error) {
                param = {
                    action : "updateNote",
                    idNote : $("#noteView > #id").val(),
                    description : $("#noteView > #description").val()
                };

                //Mettre a jour dans le tableau
                for(var i=0; i < notes.length; i++) {
                    if(notes[i].id == $("#noteView > #id").val()) {
                        notes[i].description = setTitle($("#noteView > #description").val());
                        break;
                    }
                }
            }
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
                    var input = '#'+activeView+' > .editInput';
                    var text = '#'+activeView+' > .editText';
                    var date = "#"+activeView+" > .editDate";

                    $("#navbar > #validEditBtn").remove();    
                    //Ajout du bouton modifié  
                    $("#navbar").append("<img id='editBtn' src='../IMG/edit.png' />");
                    $("p#text-error").remove();

                    showSeance();

                    //Retour à la vue standard
                    if(activeView == "homeworkView")
                        $(date).replaceWith("<span id='echeance' class='editDate'>"
                            + displaySQLDate(pickerDate.get('select', 'yyyy-mm-dd')+" "+$("#homeworkView >.editDate> #time").val())
                            +"</span>");

                    $(input).replaceWith( "<span id='"+$(input).attr("id")+"' class='editInput'>"+$(input).val()+"</span>" );
                    
                    var description = $(text).val().replace(/\n/g, "<br/>");
                    $(text).replaceWith( "<span id='"+$(text).attr("id")+"' class='editText' >"+description+"</span>" );
                    
                    switch(activeView) {
                        case "taskView": 
                            $("div.task[value="+$("#taskView > #id").val()+"]").attr("id", "select");
                            break;

                        case "questionView": 
                            $("div.question[value="+$("#questionView > #id").val()+"]").attr("id", "select");
                            break;

                        case "homeworkView": 
                            $("div.homework[value="+$("#homeworkView > #id").val()+"]").attr("id", "select");
                            break;
                        
                        case "noteView": 
                            $("div.note[value="+$("#noteView > #id").val()+"]").attr("id", "select");
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
    }
});


function checkTask() {
    var error = false;

    //Si le champs est vide, on affiche une erreur
    if(!$("#"+activeView+" > #titre").val().trim()) {
        $("#"+activeView+" > #titre").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#"+activeView+" > #titre").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#"+activeView+" > #titre").css("border-color") == "rgb(255, 0, 0)") 
        $("#"+activeView+" > #titre").css("border-color", "rgb(204, 204, 204)");
    
    //Si le champs est vide, on affiche une erreur
    if(!$("#"+activeView+" > #description").val().trim()) {
        $("#"+activeView+" > #description").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#"+activeView+" > #description").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#"+activeView+" > #description").css("border-color") == "rgb(255, 0, 0)") 
        $("#"+activeView+" > #description").css("border-color", "rgb(204, 204, 204)");

    return error;
}

function checkQuestion() {
    var error = false;

    //Si le champs est vide, on affiche une erreur
    if(!$("#"+activeView+" > #titre").val().trim()) {
        $("#"+activeView+" > #titre").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#"+activeView+" > #titre").attr("class", "input-error");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#"+activeView+" > #titre").attr("class") == "input-error") 
        $("#"+activeView+" > #titre").attr("class", null);

    //Si le champs est vide, on affiche une erreur
    if(!$("#"+activeView+" > #correction").val().trim()) {
        $("#"+activeView+" > #correction").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#"+activeView+" > #correction").attr("class", "input-error");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#"+activeView+" > #correction").attr("class") == "input-error") 
        $("#"+activeView+" > #correction").attr("class", null);

    return error;
}

function checkHomework() {
    var error = false;

    //Si le champs est vide, on affiche une erreur
    if(!$("#"+activeView+" > #titre").val().trim()) {
        $("#"+activeView+" > #titre").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#"+activeView+" > #titre").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#"+activeView+" > #titre").css("border-color") == "rgb(255, 0, 0)") 
        $("#"+activeView+" > #titre").css("border-color", "rgb(204, 204, 204)");
    
    //Si le champs est vide, on affiche une erreur
    if(!$("#"+activeView+" > #description").val().trim()) {
        $("#"+activeView+" > #description").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#"+activeView+" > #description").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#"+activeView+" > #description").css("border-color") == "rgb(255, 0, 0)") 
        $("#"+activeView+" > #description").css("border-color", "rgb(204, 204, 204)");

    //Si le champs est vide, on affiche une erreur
    if(pickerDate.get('select', 'yyyy/mm/dd') == "" || $("#"+activeView+" > #time").val() == "") {
        if(pickerDate.get('select', 'yyyy/mm/dd').length == 0) {
            $("#"+activeView+" > #date").css("border-color", "red");
        } else if($("#"+activeView+" > #date").css("border-color") == "rgb(255, 0, 0)") 
            $("#"+activeView+" > #date").css("border-color", "rgb(204, 204, 204)");
        
        if($("#"+activeView+" > #time").val().length == 0) {
            $("#"+activeView+" > #time").css("border-color", "red");
        } else if($("#"+activeView+" > #time").css("border-color") == "rgb(255, 0, 0)") 
            $("#"+activeView+" > #time").css("border-color", "rgb(204, 204, 204)");
        
        $("#"+activeView+" > #time").after("<p id='text-error'>Ce champs est obligatoire</p>");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else {
        if($("#"+activeView+" > #date").css("border-color") == "rgb(255, 0, 0)") 
            $("#"+activeView+" > #date").css("border-color", "rgb(204, 204, 204)");
        if($("#"+activeView+" > #time").css("border-color") == "rgb(255, 0, 0)") 
            $("#"+activeView+" > #time").css("border-color", "rgb(204, 204, 204)");
    }
    
    return error;
}

function checkNote() {
    var error = false;

    //Si le champs est vide, on affiche une erreur
    if(!$("#"+activeView+" > #description").val().trim()) {
        $("#"+activeView+" > #description").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#"+activeView+" > #description").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#"+activeView+" > #description").css("border-color") == "rgb(255, 0, 0)") 
        $("#"+activeView+" > #description").css("border-color", "rgb(204, 204, 204)");

    return error;
}

/***** SÉLECTION D'UN ÉLÉMENT *****/

// Sélection d'une Tâche
$(document).on("click", "div.task", function clicTache() {
    var idTask = $(this).attr("value");
    $(".task").attr("id", null);
    $(".question").attr("id", null);
    $(".homework").attr("id", null);
    $(".note").attr("id", null);
    $(this).attr("id","select");

    $('#'+activeView+'> .editDate').replaceWith("<span id='echeance'  class='editDate'></span>");
    $('#'+activeView+'> .editInput').replaceWith( "<span id='"+$('#'+activeView+'> .editInput').attr("id")+"' class='editInput'></span>" );
    $('#'+activeView+'> .editText').replaceWith( "<span id='"+$('#'+activeView+'> .editText').attr("id")+"' class='editText' ></span>" )
    displayTask(idTask);

    //Afficher
    removeActiveView();
    $("#taskView").css("display", "block");
    activeView = "taskView";

    //Ajout du bouton supprimer
    $("#navbar").append("<img id='deleteBtn' src='../IMG/delete.png' />");
    //Ajout du bouton modifié  
    $("#navbar").append("<img id='editBtn' src='../IMG/edit.png' />");

    clearInterval(timer);
	timer = setInterval("displayTask(" + idTask + ")", interval);
});

// Sélection d'une Question
$(document).on("click", "div.question", function clicQuestion() {
    var idQuestion = $(this).attr("value");
    $(".task").attr("id", null);
    $(".question").attr("id", null);
    $(".homework").attr("id", null);
    $(".note").attr("id", null);
    $(this).attr("id","select");

    if(activeView == "questionView") {
        $("#"+activeView+"> .editText#titre").replaceWith("<span id='titre' class='editText' maxlength='255'></span>");
        
        $("#"+activeView+"> .editText#correction").replaceWith("<span id='correction' class='editText' maxlength='255'></span>");
    } else {
        $('#'+activeView+'> .editDate').replaceWith("<span id='echeance'  class='editDate'></span>");
        $('#'+activeView+'> .editInput').replaceWith( "<span id='"+$('#'+activeView+'> .editInput').attr("id")+"' class='editInput'></span>" );
        $('#'+activeView+'> .editText').replaceWith( "<span id='"+$('#'+activeView+'> .editText').attr("id")+"' class='editText' ></span>" );
    }
    displayQuestion(idQuestion);
    //Afficher
    removeActiveView();
    $("#questionView").css("display", "block");
    activeView = "questionView";

    //Ajout du bouton supprimer
    $("#navbar").append("<img id='deleteBtn' src='../IMG/delete.png' />");
    //Ajout du bouton modifié  
    $("#navbar").append("<img id='editBtn' src='../IMG/edit.png' />");

    clearInterval(timer);
    timer = setInterval("displayQuestion(" + idQuestion + ")", interval);
});

// Sélection d'un Devoir
$(document).on("click", "div.homework", function clicHomework() {
    var idHomework = $(this).attr("value");
    $(".task").attr("id", null);
    $(".question").attr("id", null);
    $(".homework").attr("id", null);
    $(".note").attr("id", null);
    $(this).attr("id","select");

    $('#'+activeView+'> .editDate').replaceWith("<span id='echeance'  class='editDate'></span>");
    $('#'+activeView+'> .editInput').replaceWith( "<span id='"+$('#'+activeView+'> .editInput').attr("id")+"' class='editInput'></span>" );
    $('#'+activeView+'> .editText').replaceWith( "<span id='"+$('#'+activeView+'> .editText').attr("id")+"' class='editText' ></span>" );
    displayHomework(idHomework);

    //Afficher
    removeActiveView();
    $("#homeworkView").css("display", "block");
    activeView = "homeworkView";

    //Ajout du bouton supprimer
    $("#navbar").append("<img id='deleteBtn' src='../IMG/delete.png' />");
    //Ajout du bouton modifié  
    $("#navbar").append("<img id='editBtn' src='../IMG/edit.png' />");

    clearInterval(timer);
});

// Sélection d'une Note
$(document).on("click", "div.note", function clicNote() {
    var idNote = $(this).attr("value");
    $(".task").attr("id", null);
    $(".question").attr("id", null);
    $(".homework").attr("id", null);
    $(".note").attr("id", null);
    $(this).attr("id","select");

    $('#'+activeView+'> .editDate').replaceWith("<span id='echeance'  class='editDate'></span>");
    $('#'+activeView+'> .editInput').replaceWith( "<span id='"+$('#'+activeView+'> .editInput').attr("id")+"' class='editInput'></span>" );
    $('#'+activeView+'> .editText').replaceWith( "<span id='"+$('#'+activeView+'> .editText').attr("id")+"' class='editText' ></span>" );
    displayNote(idNote);

    //Afficher
    removeActiveView();
    $("#noteView").css("display", "block");
    activeView = "noteView";

    //Ajout du bouton supprimer
    $("#navbar").append("<img id='deleteBtn' src='../IMG/delete.png' />");
    //Ajout du bouton modifié  
    $("#navbar").append("<img id='editBtn' src='../IMG/edit.png' />");

    clearInterval(timer);
});

// Clic sur l'oeil visible (rendre invisible)
$(document).on("click", "img.eye-active", function activeToInactive() {
    var param;
    var parent = $(this).parent();

    if (parent.hasClass("task")) {
        parent.addClass("notVisible");
        param = {
            action : "setTacheVisible",
            idTache : parent.attr("value"),
            isVisible: false
        };
        //Change la visibilité dans le tableau
        for (var i = 0; i < seances.length; i++) {
            if(seances[i].id == parent.attr("value") && seances[i].type == "Tache") {
                seances[i].isVisible = 0;
                break;
            }
        }
    }
    else if (parent.hasClass("question")) {
        parent.addClass("notVisible");
        param = {
            action : "setQuestionVisible",
            idQuestion : parent.attr("value"),
            isVisible: false
        };
        //Change la visibilité dans le tableau
        for (var i = 0; i < seances.length; i++) {
            if(seances[i].id == parent.attr("value") && seances[i].type == "Question") {
                seances[i].isVisible = 0;
                break;
            }
        }
    } else if (parent.hasClass("homework")) {
    	parent.addClass("notVisible");
        param = {
            action : "setHomeWorkVisible",
            idHomeWork : parent.attr("value"),
            isVisible: false
        };
        //Change la visibilité dans le tableau
        for (var i = 0; i < homeworks.length; i++) {
            if(homeworks[i].id == parent.attr("value")) {
                homeworks[i].isVisible = 0;
                break;
            }
        }
    }

    setVisibility(param, $(this));
});

// Clic sur l'oeil invisible (rendre visible)
$(document).on("click", "img.eye-inactive", function inactiveToActive() {
    var param;
    var parent = $(this).parent();

    if (parent.hasClass("task")) {
        parent.removeClass("notVisible");
        param = {
            action : "setTacheVisible",
            idTache : parent.attr("value"),
            isVisible: true
        };
        //Change la visibilité dans le tableau
        for (var i = 0; i < seances.length; i++) {
            if(seances[i].id == parent.attr("value") && seances[i].type == "Tache") {
                seances[i].isVisible = 1;
                break;
            }
        }
    }
    else if (parent.hasClass("question")) {
        parent.removeClass("notVisible");
        param = {
            action : "setQuestionVisible",
            idQuestion : parent.attr("value"),
            isVisible: true
        };
        //Change la visibilité dans le tableau
        for (var i = 0; i < seances.length; i++) {
            if(seances[i].id == parent.attr("value") && seances[i].type == "Question") {
                seances[i].isVisible = 1;
                break;
            }
        }
    } else if (parent.hasClass("homework")) {
        parent.removeClass("notVisible");
        param = {
            action : "setHomeWorkVisible",
            idHomeWork : parent.attr("value"),
            isVisible: true
        };
        //Change la visibilité dans le tableau
        for (var i = 0; i < seances.length; i++) {
            if(homeworks[i].id == parent.attr("value")) {
                homeworks[i].isVisible = 1;
                break;
            }
        }
    }

    setVisibility(param, $(this));
});

// Validation de la réponse d'un étudiant
$(document).on("click", "img.cancel-circle", function validateReponse() {
    var parent = $(this).parent();

    param = {
        action: "validReponse",
        idReponse: parent.attr("value"),
        valid: 1
    }

    checkReponse(param, $(this));
});

// Invalidation de la réponse d'un étudiant
$(document).on("click", "img.check-circle", function invalidateReponse() {
    var parent = $(this).parent();

    param = {
        action: "validReponse",
        idReponse: parent.attr("value"),
        valid: 0
    }

    checkReponse(param, $(this));
});

/*** Gestion des réponses aux questions sur une tâche donné ***/

$(document).on("click", "#repondre", function setEditAnswer() {
    //S'il y a un champs en édition
    console.log(_previous_answer);
    if(_previous_answer != null) {
        var textarea = "textarea";
        console.log("text :"+ $(textarea).html());
        var idQuestion = $(textarea).attr("class");
        console.log("idQ :"+ idQuestion);

        $(textarea).replaceWith("<div id='taskReponse' class='"+idQuestion+"''>"
            +_previous_answer+"</div>");

        //Réinitialise la valeur sauvegardée
        _previous_answer = null;

        //Changer le bouton et supprime le bouton cancel
        $("#validTaskAnswer."+idQuestion).replaceWith("<img style='width:40px;float:right;' class='"
            +idQuestion+"' id='repondre' src='../IMG/repondre.png'/>");
        $("#cancelTaskAnswer."+idQuestion).remove();
    }

    var champsReponse = "div#taskReponse."+$(this).attr("class");
    var answer = $(champsReponse).html().replace(/<br ?\/?>/g, "");
    //Enregistre la réponse actuel
    if($(champsReponse).html() == null)
        _previous_answer = "";
    else
        _previous_answer = $(champsReponse).html();

    //Modifie le champs en éditable
    $(champsReponse).replaceWith("<textarea id='taskReponse' maxlength='255' class='"+$(champsReponse).attr("class")+"'>"
        +answer+"</textarea>");

    //Changer le bouton
    $(this).before("<img style='width:40px;float:right;' id='cancelTaskAnswer' class='"+$(this).attr("class")+"' src='../IMG/cancel.png'/>");
    $(this).replaceWith("<img style='width:40px;float:right;' id='validTaskAnswer' class='"+$(this).attr("class")+"' src='../IMG/valid_black.png'/>");

    clearInterval(timer);
});

$(document).on("click", "#validTaskAnswer", function answerTaskQuestion() {
    var idQuestion = $(this).attr("class");
    var textarea = "textarea#taskReponse."+idQuestion;

    /*var error = false;
    $("p#text-error").remove();

     //Si le champs est vide, on affiche une erreur
    if(!$(textarea).val().trim()) {
        $(textarea).after("<p id='text-error'>Ce champs est obligatoire</p>");
        $(textarea).css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($(textarea).css("border-color") == "rgb(255, 0, 0)") 
        $(textarea).css("border-color", "rgb(204, 204, 204)");

    if(!error) {*/
        console.log(idQuestion);
        $.ajax({
            dataType: 'json',
            url: '../PHP/data.php', 
            type: 'GET',
            data: {
                action: "answerTacheQuestion",
                idQuestion: idQuestion,
                answer: $(textarea).val()
            },
            success: function(oRep) {
                if(oRep.retour != null) {
                    //Réinitialise la valeur sauvegardée
                    _previous_answer = null;

                    var answer = $(textarea).val().replace(/\n/g, "<br/>");
                    $(textarea).replaceWith("<div id='taskReponse' class='"+idQuestion+"''>"
                        +answer+"</div>");

                    //Changer le bouton et supprime le bouton cancel
                    $("#validTaskAnswer").replaceWith("<img style='width:40px;float:right;' class='"+idQuestion
                            +"' id='repondre' src='../IMG/repondre.png'/>");
                    $("#cancelTaskAnswer").remove();

                    timer = setInterval("displayTask(" + $("#"+activeView+"> #id").val() + ")", interval);
                } else {
                    if(oRep.connecte == false)
                        window.location = "../index.html";
                }
            },
            error: function(oRep) {
                window.location = "../index.html";
            }
        });
    //}
});

$(document).on("click", "#cancelTaskAnswer", function cancelTaskQuestion() {
    var idQuestion = $(this).attr("class");
    var textarea = "textarea#taskReponse."+idQuestion;

    $(textarea).replaceWith("<div id='taskReponse' class='"+idQuestion+"''>"
        +_previous_answer+"</div>");

    //Réinitialise la valeur sauvegardée
    _previous_answer = null;

    //Changer le bouton et supprime le bouton cancel
    $("#validTaskAnswer."+idQuestion).replaceWith("<img style='width:40px;float:right;' class='"
        +idQuestion+"' id='repondre' src='../IMG/repondre.png'/>");
    $("#cancelTaskAnswer."+idQuestion).remove();


    timer = setInterval("displayTask(" + $("#"+activeView+"> #id").val() + ")", interval);
});

/***** RÉCUPÉRATION DE LA SÉANCE *****/

function getSeance() {
	clearInterval(timer);

    displayLostStudents();
    timerLost = setInterval("displayLostStudents()", interval);

    $("#tasks").empty();
    $("#homeworks").empty();
    $("#notes").empty();

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getSeanceById",
            idSeance: idSeance
        },
        success: function(oRep) {
            if(oRep.info != null) {
                //Entête
                $("#navbar > div").html(oRep.info[0].moduleName+" - "+oRep.info[0].promoName);

                seances = oRep.seance;
                homeworks = oRep.homework;
                notes = oRep.note;
                showSeance();
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

function showSeance() {
    $("#tasks").empty();
    $("#homeworks").empty();
    $("#notes").empty();

    for (var i = 0; i < seances.length; i++) {
        switch (seances[i].type) {
            case "Tache" :
                $("#tasks").append("<div class='task"
                    + (seances[i].isVisible == 1 ? "" : " notVisible")
                    +"' value='" + seances[i].id + "'>"
                    + "<img id='type' src='../IMG/task.png'/>" 
                    + "<div style='display:inline-block;padding-top: 10px;width:165px'>"+seances[i].titre+"</div>"
                    + (seances[i].isVisible == 1 ? "<img class='eye-active'/>" : "<img class='eye-inactive'/>")
                    + "</div>");
                break;
            case "Question" :
                    $("#tasks").append("<div class='question"
                        + (seances[i].isVisible == 1 ? "" : " notVisible")
                        +"' value='" + seances[i].id + "'>" 
                        + "<img id='type' src='../IMG/question.png'/>" 
                        + "<div style='display:inline-block;padding-top: 10px;width:165px'>"+seances[i].titre+"</div>"
                        + (seances[i].isVisible == 1 ? "<img class='eye-active'/>" : "<img class='eye-inactive'/>")
                        + "</div>");
                    break;
        }
    }

    for (var i = 0; i < homeworks.length; i++) {
        $("#homeworks").append("<div class='homework"
            + (homeworks[i].isVisible == 1 ? "" : " notVisible")
            +"' value='" + homeworks[i].id + "'>" 
            + "<img id='type' src='../IMG/homework.png'/>" 
            + "<div style='display:inline-block;padding-top: 10px;width:165px'>"+homeworks[i].titre+"</div>"
            + (homeworks[i].isVisible == 1 ? "<img class='eye-active'/>" : "<img class='eye-inactive'/>") 
            + "</div>");
    }

    for (var i = 0; i < notes.length; i++) {
        $("#notes").append("<div class='note' value='" 
            + notes[i].id + "'>" 
            + "<img id='type' src='../IMG/note.png'/>" 
            + "<div style='display:inline-block;padding-top: 10px;width:165px'>"+notes[i].description+"</div>"
            + "</div>");
    }
}

// Affichage d'une Tâche
function displayTask(idTask) {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getTacheById",
            idTache: idTask
        },
        success: function(oRep) {
            if(oRep.tache != null) {
                $("#taskView > #id").val(oRep.tache[0].id);
                $("#taskView > #titre").text(oRep.tache[0].titre);
                $("#taskView > #description").html(oRep.tache[0].description);
                
                if (oRep.question != null) {
                	$("#taskView > #contenu").empty();

                    for (var i = 0; i < oRep.question.length; i++) {
                        affiche = "<div id='ques'> "
                            + oRep.question[i].question 
                            + "<img style='width:40px;float:right;' id='repondre' class='"+oRep.question[i].id+"' src='../IMG/repondre.png'/>";

                        //Prépare le champs de la réponse
                        affiche += "<div id='taskReponse' class='"+oRep.question[i].id+"'>";
                        //Affiche quelques chose dans la champs s'il est non null
                        if(oRep.question[i].answer != null)
                            affiche += oRep.question[i].answer;
                        affiche += "</div>";

                        affiche += "</div>";
                        $("#taskView > #contenu").append(affiche);
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

}

// Affichage d'une Question
function displayQuestion(idQuestion) {
    
    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getQuestionById",
            idQuestion: idQuestion
        },
        success: function(oRep) {
            if(oRep.question != null) {
                $("#questionView > #titre").html(oRep.question[0].description);
                $("#questionView > #id").val(oRep.question[0].id);
                $("#questionView > #correction").html(oRep.question[0].answer);

                if(oRep.question[0].nbAnswer == 0)
                    $("#questionView > #detail").html("aucun étudiant a répondu");
                else if(oRep.question[0].nbAnswer == 1)
                    $("#questionView > #detail").html(oRep.question[0].nbAnswer + " étudiant a répondu");
                else
                    $("#questionView > #detail").html(oRep.question[0].nbAnswer + " étudiant(s) ont répondu");

                if(oRep.question[0].answerIsVisible == 1) {
                    $("#questionView > #setVisible").css("background-image", "url(../IMG/eye-active.png)"); 
                    $("#questionView > #setVisible").attr("name", "1");
                    $("#questionView > #setVisible").attr("class", oRep.question[0].id);
                    $("#questionView > #setVisible").val("Faire Disparaitre");
                } else {
                    $("#questionView > #setVisible").css("background-image", "url(../IMG/eye-inactive.png)"); 
                    $("#questionView > #setVisible").attr("name", "0");
                    $("#questionView > #setVisible").attr("class", oRep.question[0].id);
                    $("#questionView > #setVisible").val("Afficher");
                }

                if (oRep.reponses != null) {
                	$("#questionView > #contenu").empty();

                    for (var i = 0; i < oRep.reponses.length; i++) {
                        //Si valid ou non, affichage différent 
                        $("#"+activeView+" > #contenu").append("<div id='reponse'>"
                            + "<div class='answer'>" + oRep.reponses[i].answer +"</div>"
                            + "<div id='pourcentage" + i + "' class='pourcentage'>"
                                +"<div id='pourcentage-label' class='pourcentage-label" + i + "'></div>"
                            + "</div>"
                            +"</div>");

                        var taux = oRep.reponses[i].Pourcentage / oRep.reponses[i].Total * 100;
                        var tauxTrunc = parseFloat(oRep.reponses[i].Pourcentage / oRep.reponses[i].Total * 100).toPrecision(2);
                        
                        $( "#pourcentage" + i).progressbar({
                            value: taux
                        });

                        $( ".pourcentage-label" + i).text(tauxTrunc + "%");
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

}

// Affichage d'un Devoir
function displayHomework(idHomework) {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getHomeworkById",
            idHomeWork: idHomework,
        },
        success: function(oRep) {
            if(oRep.homework != null) {
				$("#homeworkView > #id").val(oRep.homework[0].id);
            	$("#homeworkView > #titre").text(oRep.homework[0].titre);
        		$("#homeworkView > #description").html(oRep.homework[0].description);
        		$("#homeworkView > #echeance").text(displaySQLDate(oRep.homework[0].dueDate));
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

// Affichage d'une Note
function displayNote(idNote) {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getNoteById",
            idNote: idNote,
        },
        success: function(oRep) {
            if(oRep.note != null) {
				$("#noteView > #id").val(oRep.note[0].id);
        		$("#noteView > #description").html(oRep.note[0].description);
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

// Retour à la vue par défaut
function removeActiveView() {
    $("#"+activeView).css("display", "none");

    $('#editBtn').remove();
    $('#deleteBtn').remove();
    $('#validAddBtn').remove();
    $('#validEditBtn').remove();
}

// Changement de visibilité d'un élément
function setVisibility(param, element) {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: param,
        success: function(oRep) {
            if(oRep.retour != null) {
                if (param.isVisible) {
                    element.removeClass("eye-inactive");
                    element.addClass("eye-active");
                } else {
                    element.removeClass("eye-active");
                    element.addClass("eye-inactive");
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

}

// Validation/Invalidation d'une réponse
function checkReponse(param, element) {

    var parent = element.parent();

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: param,
        success: function(oRep) {
			if(oRep.retour != null) {
                if (param.valid == 1) {
                    element.removeClass("cancel-circle");
                    element.addClass("check-circle");

                    parent.removeClass("reponse-invalid");
                    parent.addClass("reponse-valid");
                } else {
                    element.removeClass("check-circle");
                    element.addClass("cancel-circle");

                    parent.removeClass("reponse-valid");
                    parent.addClass("reponse-invalid");
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

}

function displaySQLDate(sqlDate) {
	var dateArr = sqlDate.split(/[- :]/);
	var date = new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2], dateArr[3], dateArr[4]);

	return displayDate(date);
}

function displayDate(date) {
	var dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    
  	return dayNames[date.getDay()] + " " + date.getDate() + " " + monthNames[date.getMonth() + 1] + " " + date.getFullYear() + " à " + date.getHours() + "h" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
}

function setTitle(titre) {
    return titre.length > 40 ? titre.substring(0, 40) + "..." : titre;
}

function displayLostStudents() {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getAllLostBySeance",
            idSeance: idSeance
        },
        success: function(oRep) {
            if(oRep.retour != null) {
                var taux = oRep.retour[0].Perdu / oRep.retour[0].Total * 100;
                var truncateTaux = parseFloat(taux).toPrecision(2);
                
                $( "#progressbar" ).progressbar("option", {
                    value: taux
                });

                if (taux > 0) {
                    $(".progress-label").text(truncateTaux + "% d'étudiants perdus");

                    if (taux > 50) {
                        $("#progressbar > .ui-progressbar-value").css("background-color", "red");
                    } else {
                        $("#progressbar > .ui-progressbar-value").css("background-color", "orange");
                    }
	            } else {
	            	$(".progress-label").text("Aucun étudiant n'est perdu");
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

}

$(document).on("click", "#resetProgressBar", function resetLostStudents() {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "resetLostBySeance",
            idSeance: idSeance
        },
        success: function(oRep) {

            if(oRep.retour != null) {
                var taux = 0;
                
                $( "#progressbar" ).progressbar("option", {
                    value: taux
                });

                $( ".progress-label" ).text("Aucun étudiant n'est perdu");
      
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

$(document).on("click", "#setVisible", function changeVisibilityCorrecton() {
    //get name => visibilité actuel
    var visible = $(this).attr("name");
    if(visible == 0)
        visible = 1;
    else
        visible = 0;

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "setCorrectionVisible",
            idQuestion: $(this).attr("class"),
            isVisible: visible
        },
        success: function(oRep) {
            if(oRep.retour != null) {
                if(visible == 1) {
                    $("#questionView > #setVisible").css("background-image", "url(../IMG/eye-active.png)"); 
                    $("#questionView > #setVisible").attr("name", "1");
                    $("#questionView > #setVisible").attr("class",$(this).attr("class"));
                    $("#questionView > #setVisible").val("Faire Disparaitre");
                } else {
                    $("#questionView > #setVisible").css("background-image", "url(../IMG/eye-inactive.png)"); 
                    $("#questionView > #setVisible").attr("name", "0");
                    $("#questionView > #setVisible").attr("class", $(this).attr("class"));
                    $("#questionView > #setVisible").val("Afficher");
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