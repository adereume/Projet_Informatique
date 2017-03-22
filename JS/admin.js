$(document).ready(function() {
	
});

$("#frame_module").ready(function() {
    //getModules();
});

$("#frame_promo").ready(function() {
    getPromos();
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
            action: "getPromo"
        },
        success: function(oRep) {
            console.log(oRep);

            if(oRep.retour != null) {
                var htmlContent = "";

                htmlContent += "<table>";
                htmlContent += "<thead><th>Nom</th></thead>";

                for (var i = 0; i < oRep.retour.length; i++) {
                    htmlContent += "<tr>";
                    htmlContent += "<td>" + oRep.retour[i].name + "</td>";
                    htmlContent += "</tr>";

                    var groupesTD = getTD(oRep.retour[i].id);

                    for (var j = 0; j < groupesTD.length; j++) {
                        htmlContent += "<tr>";
                        
                        if (j == 0)
                            htmlContent += "<th class='start1'>";
                        else if (j == groupesTD.length - 1)
                            htmlContent += "<th class='end1'>";
                        else
                            htmlContent += "<th>";
                        
                        htmlContent += groupesTD[j].name + "</th>";
                        htmlContent += "</tr>";

                        var groupesTP = getTP(groupesTD[j].id);

                        for (var k = 0; k < groupesTP.length; k++) {
                            htmlContent += "<tr>";
                        
                            if (k == 0)
                                htmlContent += "<th class='start2'>";
                            else if (k == groupesTP.length - 1)
                                htmlContent += "<th class='end2'>";
                            else
                                htmlContent += "<th>";
                            
                            htmlContent += groupesTP[k].name + "</th>";
                            htmlContent += "</tr>";
                        }
                    }
                }

                htmlContent += "</table>";

                $("#frame_promo").html(htmlContent);
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

function getParentPromoNameById(idPromo) {

    $.ajax({
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getPromoById",
            idPromo: idPromo
        },
        success: function(oRep) {
            if(oRep.retour != null) {
                return oRep.retour.name;
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

function getTD(idPromo) {

    var groupes;

    $.ajax({
        async: false,
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getTD",
            idPromo: idPromo
        },
        success: function(oRep) {
            if(oRep.retour != null) {
                groupes = oRep.retour;
            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
            }
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });

    return groupes;
}

function getTP(idTD) {

    var groupes;

    $.ajax({
        async: false,
        dataType: 'json',
        url: '../PHP/data.php', 
        type: 'GET',
        data: {
            action: "getTP",
            idTD: idTD
        },
        success: function(oRep) {
            if(oRep.retour != null) {
                groupes = oRep.retour;
            } else {
                if(oRep.connecte == false)
                    window.location = "../index.html";
            }
        },
        error: function(oRep) {
            window.location = "../index.html";
        }
    });

    return groupes;
}