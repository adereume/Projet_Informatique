var idSeance;

var interval;
var activeView = "defaultView";

$(document).ready(function() {

    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    idSeance = unescape(temp[1]);

    getSeance();
});

$(document).on("click", "#addBtn", function afficherPopUpAjout() {
    $("#hideView").css("display", "block");
    $("#addView").css("display", "block");
});

$(document).on("click", "#addTask", function addTache() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");

    removeActiveView();

    $("#editTaskView").css("display", "block");
    activeView = "editTaskView";

    //Ajout du bouton valider
    $("#navbar").append("<img id='validAddBtn' src='../IMG/valid.png' />");
});

$(document).on("click", "#addQuestion", function addQuestion() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");

    removeActiveView();

    $("#editQuestionView").css("display", "block");
    activeView = "editQuestionView";

    //Ajout du bouton valider
    $("#navbar").append("<img id='validAddBtn' src='../IMG/valid.png' />");

});

$(document).on("click", "#addHomework", function addHomework() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");

    removeActiveView();

    $("#homeworkView").css("display", "block");
    activeView = "homeworkView";

    //Ajout du bouton valider
    $("#navbar").append("<img id='validAddBtn' src='../IMG/valid.png' />");

});

$(document).on("click", "#addNote", function addNote() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");

    removeActiveView();

    $("#noteView").css("display", "block");
    activeView = "noteView";

    //Ajout du bouton valider
    $("#navbar").append("<img id='validAddBtn' src='../IMG/valid.png' />");

});

$(document).on("click", "#close", function fermerPopUpAjout() {
    $("#hideView").css("display", "none");
    $("#addView").css("display", "none");
});

$(document).on("click", "#editBtn", function setEditView() {
    var input = '#'+activeView+' > .editInput';
    var text = '#'+activeView+' > .editText';
    //Vue Editable 
    $(input).replaceWith( "<input type='text' id='"+$(input).attr("id")+"' class='editInput' value='"+$(input).html()+"'/>" );
    $(text).replaceWith( "<textarea id='"+$(text).attr("id")+"' class='editText' >"+$(text).html()+"</textarea>" );

    //Ajout du bouton valider
    $("#navbar").append("<img id='validEditBtn' src='../IMG/valid.png' />");
    $("#editBtn").remove();
});

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
            }
            break;

        case "questionView": 
            error = checkQuestion();
            if(!error) {
                param = {
                    action : "updateQuestion",
                    idQuestion : $("#questionView > #id").val(),
                    description : $("#questionView > #titre").val()
                };
            }
            
            break;

        case "homeworkView": 
            if($("#taskView > #titre").val() != "" && $("#taskView > #description").val() != "" && $("#taskView > #dueDate").val() != "") {
                param = {
                    action : "updateHomeWork",
                    idSeance : idSeance,
                    titre : $("#taskView > #titre").val(),
                    description : $("#taskView > #description").val(),
                    dueDate : $("#taskView > #dueDate").val()
                };
            } else
                return;
            
            break;
        
        case "noteView": 
            param = {
                action : "updateNote",
                idSeance : idSeance,
                description : $("#taskView > #description").val()
            };
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
                    $("#navbar > #validEditBtn").remove();

                    getSeance();
                    removeActiveView();
                    $("#defaultView").css("display", "block");
                    activeView = "defaultView";
                    /*$('.editInput').replaceWith( "<span id='"+$('.editInput').attr("id")+"' class='editInput'>"+$('.editInput').val()+"</span>" );
                    $('.editText').replaceWith( "<span id='"+$('.editText').attr("id")+"' class='editText' >"+$('.editText').val()+"</span>" );
                    

                    switch(activeView) {
                        case "taskView": 
                            $("div.task[value="+$("#taskView > #id").val()+"]").addClass("select");
                            console.log("div.task[value="+$("#taskView > #id").val()+"]");
                            console.log($(".task[value="+$("#taskView > #id").val()+"]").val());
                            break;

                        case "questionView": 
                            $("div.question[value="+$("#questionView > #id").val()+"]").addClass("select");
                            break;

                        case "homeworkView": 
                            $("div.homework[value="+$("#homeworkView > #id").val()+"]").addClass("select");
                            break;
                        
                        case "noteView": 
                            $("div.note[value="+$("#noteView > #id").val()+"]").addClass("select");
                            break;
                    }*/
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

                $("#editTaskView > #titre").val("");
                $("#editTaskView > #description").val("");
            }
            break;

        case "editQuestionView": 
            error = checkQuestion();
            if(!error) {
                param = {
                    action : "addQuestion",
                    idSeance : idSeance,
                    description : $("#editQuestionView > #titre").val()
                };
            }
            
            $("#editQuestionView > #titre").val("");
            break;

        case "homeworkView": 
            if($("#taskView > #titre").val() != "" && $("#taskView > #description").val() != "" && $("#taskView > #dueDate").val() != "") {
                param = {
                    action : "addHomeWork",
                    idSeance : idSeance,
                    titre : $("#taskView > #titre").val(),
                    description : $("#taskView > #description").val(),
                    dueDate : $("#taskView > #dueDate").val()
                };
            } 
            
            break;

        case "noteView": 
            param = {
                action : "addNote",
                idSeance : idSeance,
                description : $("#taskView > #description").val()
            };
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
                    $("#navbar > #validAddBtn").remove();

                    removeActiveView();
                    $("#defaultView").css("display", "block");
                    activeView = "defaultView";

                    getSeance();
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
    if($("#"+activeView+" > #titre").val() == "") {
        $("#"+activeView+" > #titre").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#"+activeView+" > #titre").css("border-color", "red");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#"+activeView+" > #titre").css("border-color") == "rgb(255, 0, 0)") 
        $("#"+activeView+" > #titre").css("border-color", "rgb(204, 204, 204)");
    
    //Si le champs est vide, on affiche une erreur
    if($("#"+activeView+" > #description").val() == "") {
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
    if($("#"+activeView+" > #titre").val() == "") {
        $("#"+activeView+" > #titre").after("<p id='text-error'>Ce champs est obligatoire</p>");
        $("#"+activeView+" > #titre").attr("class", "input-error");
        error = true;
    } //Si le champs été en erreur mais qu'il n'est plus vide, on retire l'affichage de l'erreur
    else if($("#"+activeView+" > #titre").attr("class") == "input-error") 
        $("#"+activeView+" > #titre").attr("class", null);

    return error;
}

$(document).on("click", "div.task", function() {
    var idTask = $(this).attr("value");
    $(".task").removeClass("select");
    $(".question").removeClass("select");
    $(".homework").removeClass("select");
    $(".note").removeClass( "select" );
    $(this).addClass("select");

    $('.editInput').replaceWith( "<span id='"+$('.editInput').attr("id")+"' class='editInput'></span>" );
    $('.editText').replaceWith( "<span id='"+$('.editText').attr("id")+"' class='editText' ></span>" )
    displayTask(idTask);

    //Afficher
    removeActiveView();
    $("#taskView").css("display", "block");
    activeView = "taskView";

    //Ajout du bouton modifié  
    $("#navbar").append("<img id='editBtn' src='../IMG/edit.png' />");

});

$(document).on("click", "div.question", function() {
    var idQuestion = $(this).attr("value");
    $(".task").removeClass("select");
    $(".question").removeClass("select");
    $(".homework").removeClass("select");
    $(".note").removeClass( "select" );
    $(this).addClass("select");

    $('.editInput').replaceWith( "<span id='"+$('.editInput').attr("id")+"' class='editInput'></span>" );
    $('.editText').replaceWith( "<span id='"+$('.editText').attr("id")+"' class='editText' ></span>" );
    displayQuestion(idQuestion);

    //Afficher
    removeActiveView();
    $("#questionView").css("display", "block");
    activeView = "questionView";

    //Ajout du bouton modifié  
    $("#navbar").append("<img id='editBtn' src='../IMG/edit.png' />");
});

$(document).on("click", "div.homework", function() {
    var idHomework = $(this).attr("value");
    $(".task").removeClass("select");
    $(".question").removeClass("select");
    $(".homework").removeClass("select");
    $(".note").removeClass( "select" );
    $(this).addClass("select");    

    $('.editInput').replaceWith( "<span id='"+$('.editInput').attr("id")+"' class='editInput'></span>" );
    $('.editText').replaceWith( "<span id='"+$('.editText').attr("id")+"' class='editText' ></span>" );
});

$(document).on("click", "div.note", function() {
    var idNote = $(this).attr("value");
    $(".task").removeClass("select");
    $(".question").removeClass("select");
    $(".homework").removeClass("select");
    $(".note").removeClass( "select" );
    $(this).addClass("select");
    
    $('.editInput').replaceWith( "<span id='"+$('.editInput').attr("id")+"' class='editInput'></span>" );
    $('.editText').replaceWith( "<span id='"+$('.editText').attr("id")+"' class='editText' ></span>" );
});

$(document).on("click", "img.eye-active", function() {
    var param;
    var parent = $(this).parent();

    if (parent.hasClass("task")) {
        parent.addClass("notVisible");
        param = {
            action : "setTacheVisible",
            idTache : parent.attr("value"),
            isVisible: false
        };
    }
    else if (parent.hasClass("question")) {
        parent.addClass("notVisible");
        param = {
            action : "setQuestionVisible",
            idQuestion : parent.attr("value"),
            isVisible: false
        };
    } else if (parent.hasClass("homework")) {
        parent.addClass("notVisible");

    } else if (parent.hasClass("note")) {
        parent.addClass("notVisible");

    }

    console.log(param);
    setVisibility(param, $(this));
});

$(document).on("click", "img.eye-inactive", function() {
    var param;
    var parent = $(this).parent();

    if (parent.hasClass("task")) {
        parent.removeClass("notVisible");
        param = {
            action : "setTacheVisible",
            idTache : parent.attr("value"),
            isVisible: true
        };
    }
    else if (parent.hasClass("question")) {
        parent.removeClass("notVisible");
        param = {
            action : "setQuestionVisible",
            idQuestion : parent.attr("value"),
            isVisible: true
        };
    } else if (parent.hasClass("homework")) {
        parent.removeClass("notVisible");

    } else if (parent.hasClass("note")) {
        parent.removeClass("notVisible");

    }

    console.log(param);
    setVisibility(param, $(this));
});

function getSeance() {
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
                var seance = oRep.seance;
                for (var i = 0; i < seance.length; i++) {
                    switch (seance[i].type) {
                        case "Tache" :
                            $("#tasks").append("<div class='task"
                                + (seance[i].isVisible == 1 ? "" : " notVisible")
                                +"' value='" 
                                + seance[i].id + "'>" 
                                + seance[i].titre 
                                + (seance[i].isVisible == 1 ? "<img class='eye-active'/>" : "<img class='eye-inactive'/>")
                                + "</div>");
                            break;
                        case "Question" :
                            $("#tasks").append("<div class='question"
                                + (seance[i].isVisible == 1 ? "" : " notVisible")
                                +"' value='" 
                                + seance[i].id + "'>" 
                                + seance[i].titre 
                                + (seance[i].isVisible == 1 ? "<img class='eye-active'/>" : "<img class='eye-inactive'/>")
                                + "</div>");
                            break;
                    }
                }

                var homework = oRep.homework;
                for (var i = 0; i < homework.length; i++) {
                    $("#homeworks").append("<div class='homework' value='" 
                        + homework[i].id + "'>" 
                        + homework[i].titre 
                        + (homework[i].isVisible == 1 ? "<img class='eye-active'/>" : "<img class='eye-inactive'/>") 
                        + "</div>");
                }

                var note = oRep.note;
                for (var i = 0; i < note.length; i++) {
                    $("#notes").append("<div class='note' value='" 
                        + note[i].id + "'>" 
                        + note[i].description 
                        + (note[i].isVisible == 1 ? "<img class='eye-active'/>" : "<img class='eye-inactive'/>")
                        + "</div>");
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

function displayTask(idTask) {
    $("#taskView > #contenu").empty();

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
                $("#taskView > #description").text(oRep.tache[0].description);
                
                if (oRep.question != null) {
                    for (var i = 0; i < oRep.question.length; i++) {
                        affiche = "<div id='ques'> "
                            +"<input type='hidden' id='id' value='"+oRep.question[i].id+"' />" 
                            + oRep.question[i].question 
                            + "<img style='width:40px;float:right;' src='../IMG/question.png'/>";

                        if(oRep.question[i].answer != null)
                            affiche += "<div>" + oRep.question[i].answer+" </div>";
                        //Esle : bouton pour répondre

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

function displayQuestion(idQuestion) {
    $("#questionView > #contenu").empty();
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
                $("#questionView > #titre").text(oRep.question[0].description);
                $("#questionView > #id").val(oRep.question[0].id);
                
                if (oRep.reponses != null) {
                    for (var i = 0; i < oRep.reponses.length; i++) {
                        //Si valid ou non, affichage différent 
                        $("#"+activeView+">#contenu").append("<div id='reponse'>"+oRep.reponses[i].firstname.toUpperCase()+" "+ oRep.reponses[i].lastname.toUpperCase()
                                +" : "+ oRep.reponses[i].answer+"</div>");

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

function displayHomework(idHomework) {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getHomeWorkById",
            idHomeWork: idHomework,
        },
        success: function(oRep) {
            if(oRep.retour != null) {
                $("#title").text("Devoir - " + oRep.retour[0].titre);
                $("#description").text(oRep.retour[0].description);
                $("#contenu").text("");

                $("#contenu").append("Echéance : " + oRep.retour[0].dueDate);
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

function removeActiveView() {
    $("#"+activeView).css("display", "none");

    $('#editBtn').remove();
    $('#validAddBtn').remove();
    $('#validEditBtn').remove();
}

function setVisibility(param, element) {
console.log(param);
    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: param,
        success: function(oRep) {
            console.log(oRep);

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