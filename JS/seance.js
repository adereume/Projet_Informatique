var idUser;
var idSeance;

$(document).ready(function() {

    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    idSeance = unescape(temp[1]);

    document.querySelector( "#oBascule" ).addEventListener( "click", function() {
        this.innerHTML = (this.innerHTML=='X') ? '≡':'X';
        document.querySelector('#oPanneau').classList.toggle('cBascule');
    });

    getSeance();
});

$(document).on("click", "div[class=task]", function() {
    $("#title").text("");
    $("#description").text("");

    displayTask($(this).attr("value"));
});

$(document).on("click", "div[class=question]", function() {
    $("#title").text("");
    $("#description").text("");

    displayQuestion($(this).attr("value"));
});

$(document).on("click", "div[class=homework]", function() {
    $("#title").text("");
    $("#description").text("");

    displayHomework($(this).attr("value"));
});

$(document).on("click", "div[class=note]", function() {
    $("#title").text("");
    $("#description").text("");

    //displayNote($(this).attr("value"));
});

function getSeance() {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getSeanceById",
            idUser: idUser,
            idSeance: idSeance
        },
        success: function(oRep) {

            if(oRep.info != null) {
                var seance = oRep.seance;
                
                for (var i = 0; i < seance.length; i++) {
                    switch (seance[i].type) {
                        case "Tache" :
                            $("#tasks").append("<div class='task' value='" + seance[i].id + "'>" + seance[i].titre + "</div>");
                            break;

                        case "Question" :
                            $("#tasks").append("<div class='question' value='" + seance[i].id + "'>" + seance[i].titre + "</div>");
                            break;
                    }
                }

                var homework = oRep.homework;

                for (var i = 0; i < homework.length; i++) {
                    $("#homeworks").append("<div class='homework' value='" + homework[i].id + "'>" + homework[i].titre + "</div>");
                }

                var note = oRep.note;

                for (var i = 0; i < note.length; i++) {
                    $("#notes").append("<div class='note' value='" + note[i].id + "'>" + note[i].description + "</div>");
                }
            } else {
                window.location = "../index.html";
            }
        },
        error: function(oRep) {console.log(oRep);
            window.location = "../index.html";
        }
    });

}

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
            console.log(oRep.tache);
            if(oRep.tache != null) {

                $("#title").text("Tâche - " + oRep.tache[0].titre);
                $("#description").text(oRep.tache[0].description);

            } else {
                window.location = "../index.html";
            }
        },
        error: function(oRep) {console.log(oRep);
            window.location = "../index.html";
        }
    });

}

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
            console.log(oRep.question);
            if(oRep.question != null) {

                $("#title").text("Question - " + oRep.question[0].description);

            } else {
                window.location = "../index.html";
            }
        },
        error: function(oRep) {console.log(oRep);
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
            idUser: idUser
        },
        success: function(oRep) {
            console.log(oRep);
            if(oRep.retour != null) {

                $("#title").text("Devoir - " + oRep.retour[0].titre);
                $("#description").text(oRep.retour[0].description);

            } else {
                //window.location = "../index.html";
            }
        },
        error: function(oRep) {console.log(oRep);
            //window.location = "../index.html";
        }
    });

}
