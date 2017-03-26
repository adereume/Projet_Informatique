$(document).on("click", "#backBtn", function back() {
	window.location = "accueil.html"
});

$(document).on("click", "#compteBtn", function accederCompte() {
  window.location = "myaccount.html";
});

$(document).on("click", "#adminBtn", function admin() {
  window.location = "admin.html";
});

$(document).on("click", "#decoBtn", function deconnexion() {
       $.ajax({
              dataType: 'json',
              url: '../PHP/data.php', 
              type: 'GET',
              data: {
                     action: "logout",
              },
              success: function(oRep) {
                     window.location = "../index.html";
              },
              error: function(oRep) {
                     window.location = "../index.html";
              }
    });
});