var idUser;
var idSeance;

var interval

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
    var idTask = $(this).attr("value");

    clearInterval(interval);
    displayTask(idTask);
    
    interval = setInterval(function() { displayTask(idTask); }, 10000);
});

$(document).on("click", "div[class=question]", function() {
    var idQuestion = $(this).attr("value");

    clearInterval(interval);
    displayQuestion(idQuestion);

    interval = setInterval(function() { displayQuestion(idQuestion); }, 10000);
});

$(document).on("click", "div[class=homework]", function() {
    var idHomework = $(this).attr("value");

    clearInterval(interval);
    displayHomework(idHomework);

    interval = setInterval(function() { displayHomework(idHomework); }, 10000);
});

$(document).on("click", "div[class=note]", function() {
    var idNote = $(this).attr("value");

    clearInterval(interval);
    //displayNote(idNote);

    //interval = setInterval(function() { displayNote(idNote); }, 10000);
});

$(document).on("click", "img[class=eye-active]", function() {
    $(this).removeClass("eye-active");
    $(this).addClass("eye-inactive");
});

$(document).on("click", "img[class=eye-inactive]", function() {
    $(this).removeClass("eye-inactive");
    $(this).addClass("eye-active");
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
                            $("#tasks").append("<div class='task' value='" + seance[i].id + "'>" + seance[i].titre + "<img class='eye-active'/></div>");
                            break;

                        case "Question" :
                            $("#tasks").append("<div class='question' value='" + seance[i].id + "'>" + seance[i].titre + "<img class='eye-active'/></div>");
                            break;
                    }
                }

                var homework = oRep.homework;

                for (var i = 0; i < homework.length; i++) {
                    $("#homeworks").append("<div class='homework' value='" + homework[i].id + "'>" + homework[i].titre + "<img class='eye-active'/></div>");
                }

                var note = oRep.note;

                for (var i = 0; i < note.length; i++) {
                    $("#notes").append("<div class='note' value='" + note[i].id + "'>" + note[i].description + "<img class='eye-active'/></div>");
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
            console.log(oRep);
            if(oRep.tache != null) {

                $("#title").text("Tâche - " + oRep.tache[0].titre);
                $("#description").text(oRep.tache[0].description);
                $("#contenu").text("");

                // ça ça doit disparaître :)
                oRep.question = [ {question: "quoi ?", answer: "euh"}, {question: "où ?", answer: "ici"}];
                
                if (oRep.question != null) {
                    for (var i = 0; i < oRep.question.length; i++) {
                        $("#contenu").append("<br/> Q - " + oRep.question[i].question + "<br/> R - " + oRep.question[i].answer + "<br/>");
                    }
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
                $("#description").text("");
                $("#contenu").text("");

                // ça ça doit disparaître :)
                oRep.reponses = [ {answer: "euh"}, {answer: "ici"}];
                
                if (oRep.reponses != null) {
                    for (var i = 0; i < oRep.reponses.length; i++) {
                        $("#contenu").append("<br/> R - " + oRep.reponses[i].answer);
                    }
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
                $("#contenu").text("");

                $("#contenu").append("Echéance : " + oRep.retour[0].dueDate);

            } else {
                //window.location = "../index.html";
            }
        },
        error: function(oRep) {console.log(oRep);
            //window.location = "../index.html";
        }
    });

}
