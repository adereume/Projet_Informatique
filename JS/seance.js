var idUser;
var idSeance;

$(document).ready(function() {

    // Récupération de l'ID de l'utilisateur passé en paramètres
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    idUser = unescape(temp[1]);
    var temp = parameters[1].split("=");
    idSeance = unescape(temp[1]);

    document.querySelector( "#oBascule" ).addEventListener( "click", function() {
        this.innerHTML = (this.innerHTML=='X') ? '≡':'X';
        document.querySelector('#oPanneau').classList.toggle('cBascule');
    });

    getSeance();
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
            console.log(oRep);
            
            if(oRep.info != null) {
                var seance = oRep.seance;
                
                for (var i = 0; i < seance.length; i++) {
                    $("#tasks").append("<div class='task'>" + seance[i].titre + "</div>");
                }

                var homework = oRep.homework;

                for (var i = 0; i < homework.length; i++) {
                    $("#homeworks").append("<div class='homework'>" + homework[i].titre + "</div>");
                }

                var note = oRep.note;

                for (var i = 0; i < note.length; i++) {
                    $("#notes").append("<div class='note'>" + note[i].description + "</div>");
                }
            } else {
                //window.location = "../index.html";
            }
        },
        error: function(oRep) {console.log(oRep);
            //window.location = "../index.html";
        }
    });

}
