var idUser;

$(document).ready(function() {
  var parameters = location.search.substring(1).split("&");

  var temp = parameters[0].split("=");
  idUser = unescape(temp[1]);

  console.log(idUser);
});
