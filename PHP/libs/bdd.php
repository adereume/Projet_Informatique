<?php

include_once("maLibSQL.pdo.php");

/**  USER  **/
function isUserExisting($firstname, $lastname) {
	$SQL = "SELECT * from USER WHERE UPPER(firstname)='".strtoupper($firstname)."' AND UPPER(lastname)='".strtoupper($lastname)."'";
	$rs = SQLSelect($SQL);
	if ($rs) 
		return true;
	return false;
}

function getTeachers() {
	$SQL = "SELECT * FROM USER 
		JOIN TEACHER ON USER.id = TEACHER.idUser WHERE USER.id != 27";
	return parcoursRs(SQLSelect($SQL));
}

function getStudents() {
	$SQL = "SELECT USER.*, PROMO.id AS idPromo, TD.id AS idTD, TP.id AS idTP, PROMO.name AS namePromo, TD.name AS nameTD, TP.name AS nameTP 
		FROM USER 
		JOIN STUDENT ON USER.id = STUDENT.idUser
		JOIN PROMO AS TP ON TP.id = STUDENT.idPromo
		JOIN PROMO AS TD ON TD.id = TP.idPromoParent
		JOIN PROMO ON PROMO.id = TD.idPromoParent";
	return parcoursRs(SQLSelect($SQL));
}

function ajouterEtudiant($firstname, $lastname, $password, $idPromo) {
	$SQL = "INSERT INTO USER(firstName,lastName, password) VALUES ('$firstname','$lastname', MD5('$password'))";
	$idUser = SQLInsert($SQL);
	
	$SQL = "INSERT INTO STUDENT(idUser,idPromo) VALUES ('$idUser','$idPromo')";
	SQLInsert($SQL);

	return $idUser;
}

function ajouterEnseignant($firstname, $lastname, $password, $isAdmin) {
	$SQL = "INSERT INTO USER(firstName,lastName, password) VALUES ('$firstname','$lastname', MD5('$password'))";
	$idUser = SQLInsert($SQL);

	$SQL = "INSERT INTO TEACHER(idUser, isAdmin) VALUES ('$idUser', $isAdmin)";
	SQLInsert($SQL);

	return $idUser;
}

function changePromo($idUser, $idPromo) {
	$SQL = "UPDATE STUDENT SET idPromo = $idPromo WHERE idUser = $idUser";
	return SQLUpdate($SQL);
}

function setAdmin($idUser, $isAdmin) {
	$SQL = "UPDATE TEACHER SET isAdmin = $isAdmin WHERE idUser = $idUser";
	return SQLUpdate($SQL);
}

function isAdmin($idUser) {
	$SQL = "SELECT isAdmin FROM TEACHER WHERE idUser = $idUser";
	return parcoursRs(SQLSelect($SQL));
}

function deleteCompte($idUser) {
	$SQL = "DELETE FROM USER WHERE id = $idUser";
	return SQLDelete($SQL);
}

function getTeacherById($idTeacher) {
	$SQL = "SELECT * from USER WHERE id=$idTeacher";
	return parcoursRs(SQLSelect($SQL));
}

function updatePassword($idUser, $oldPassword, $newPassword) {
	$SQL = "UPDATE USER SET password = MD5('$newPassword') WHERE id = $idUser AND password = MD5('$oldPassword')";
	return SQLUpdate($SQL);
}

function getAllLostStudent($idSeance) {
	$SQL = "CALL getAllLostStudent($idSeance)";
	return parcoursRs(SQLSelect($SQL));
}

function resetLostBySeance($idSeance) {
	$SQL = "DELETE FROM LOST_STUDENT WHERE idSeance = $idSeance";
	return SQLDelete($SQL);
}

function isLost($idUser, $idSeance) {
	$SQL = "SELECT * from LOST_STUDENT WHERE idStudent=$idUser AND idSeance=$idSeance";
	return parcoursRs(SQLSelect($SQL));
}

function setLost($idUser, $idSeance) {
	$SQL = "INSERT INTO LOST_STUDENT (idStudent, idSeance) VALUES ($idUser, $idSeance)";
	return parcoursRs(SQLSelect($SQL));
}

function isModuleExisting($idModule, $name) {
	if ($idModule == 0)
		$SQL = "SELECT * from MODULE WHERE UPPER(name)='".strtoupper($name)."'";
	else
		$SQL = "SELECT * from MODULE WHERE UPPER(name)='".strtoupper($name)."' AND id != $idModule";

	$rs = SQLSelect($SQL);
	if ($rs) 
		return true;
	return false;
}

function getModule() {
	$SQL = "SELECT * from MODULE WHERE id != 4";
	return parcoursRs(SQLSelect($SQL));
}

function getModuleById($idModule) {
	$SQL = "SELECT * from MODULE WHERE id=$idModule";
	return parcoursRs(SQLSelect($SQL));
}

function addModule($name) {
	$SQL = "INSERT INTO MODULE(name) VALUES ('$name')";
	return SQLInsert($SQL);
}

function updateModule($id, $name) {
	$SQL = "UPDATE MODULE SET name = '$name' WHERE id = $id";
	return SQLUpdate($SQL);
}

function deleteModule($id) {
	$SQL = "DELETE FROM MODULE WHERE id = $id";
	return SQLDelete($SQL);
}

function getAllPromos() {
	$SQL = "SELECT promo.id AS idPromo, promo.name AS namePromo, td.id AS idTD, td.name AS nameTD, tp.id AS idTP, tp.name AS nameTP
		FROM PROMO AS promo
		LEFT JOIN PROMO AS td ON promo.id = td.idPromoParent 
		LEFT JOIN PROMO AS tp ON td.id = tp.idPromoParent
		WHERE promo.level = 0 AND promo.id != 41
		ORDER BY promo.name ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getPromo(){
	$SQL = "SELECT * from PROMO WHERE level=0 AND id != 41 ORDER BY name ASC";
	return parcoursRs(SQLSelect($SQL));
}

function isPromoExisting($idPromo, $name, $level) {
	if ($idPromo == 0)
		$SQL = "SELECT * from PROMO WHERE UPPER(name)='".strtoupper($name)."' AND level = $level";
	else
		$SQL = "SELECT * from PROMO WHERE UPPER(name)='".strtoupper($name)."' AND level = $level AND id != $idPromo";

	$rs = SQLSelect($SQL);
	if ($rs) 
		return true;
	return false;
}

function addPromo($name, $level, $idPromoParent) {
	if(strlen($idPromoParent) == 0)
		$SQL = "INSERT INTO PROMO(name, level) VALUES ('$name', $level)";
	else 
		$SQL = "INSERT INTO PROMO(name, level, idPromoParent) VALUES ('$name', $level, $idPromoParent)";
	return SQLInsert($SQL);
}

function updatePromo($id, $name) {
	$SQL = "UPDATE PROMO SET name = '$name' WHERE id = $id";
	return SQLUpdate($SQL);
}

function deletePromo($id) {
	$SQL = "CALL delete_promo($id)";
	return SQLDelete($SQL);
}

function getPromoById($idPromo) {
	$SQL = "SELECT * from PROMO WHERE id=$idPromo";
	return parcoursRs(SQLSelect($SQL));
}

function getAllTD() {
	$SQL = "SELECT * from PROMO WHERE level=1 ORDER BY name ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getTD($idPromo){
	$SQL = "SELECT * from PROMO WHERE level=1 AND idPromoParent = $idPromo ORDER BY name ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getAllTP() {
	$SQL = "SELECT * from PROMO WHERE level=2 ORDER BY name ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getTP($idTD){
	$SQL = "SELECT * from PROMO WHERE level=2 AND idPromoParent = $idTD ORDER BY name ASC";
	return parcoursRs(SQLSelect($SQL));
}

function isTeacher($idUser) {
	$SQL = "SELECT * from TEACHER WHERE idUser=$idUser";
	return parcoursRs(SQLSelect($SQL));
}

function isStudent($idUser) {
	$SQL = "SELECT * from STUDENT WHERE idUser=$idUser";
	return parcoursRs(SQLSelect($SQL));
}

/** SEANCE **/
function ajouterSeance($idModule, $idTeacher, $idPromo, $dayTime, $dayTimeEnd, $room) {
	$SQL = "INSERT INTO SEANCE (idModule, idTeacher, idPromo, dayTime, dayTimeEnd, room) VALUES ('$idModule', '$idTeacher', '$idPromo', '$dayTime', '$dayTimeEnd', '$room')";
	return SQLInsert($SQL);
}

function updateSeance($idSeance, $idTeacher, $dayTime, $dayTimeEnd, $room) {
	$SQL = "UPDATE SEANCE SET idTeacher = $idTeacher, dayTime = '$dayTime', dayTimeEnd = '$dayTimeEnd', room = '$room' WHERE id = $idSeance";
	return SQLUpdate($SQL);
}

function deleteSeance($idSeance, $idTeacher) {
	$SQL = "DELETE FROM SEANCE WHERE id = $idSeance AND idTeacher = $idTeacher";
	return SQLDelete($SQL);
}

function getAllSeance($idUser) {
	$SQL = "SELECT SEANCE.id, SEANCE.dayTime, SEANCE.dayTimeEnd, SEANCE.room, USER.firstName AS teacherFirstName, USER.lastName AS teacherLastName, 
				PROMO.name AS promoName, MODULE.name as moduleName 
			FROM SEANCE 
			LEFT JOIN USER ON SEANCE.idTeacher = USER.id 
			LEFT JOIN PROMO ON PROMO.id = SEANCE.idPromo 
			LEFT JOIN MODULE ON MODULE.id = SEANCE.idModule 
			WHERE idTeacher=$idUser OR idPromo IN (SELECT idPromo FROM STUDENT WHERE idUser=$idUser 
				UNION ALL
	    	    SELECT PROMO.idPromoParent AS idPromo FROM PROMO
					LEFT JOIN STUDENT ON PROMO.id = STUDENT.idPromo WHERE idUser=$idUser
				UNION ALL
	    	    SELECT promo.idPromoParent AS idPromo FROM PROMO td
					LEFT JOIN STUDENT ON td.id = STUDENT.idPromo
	        	    LEFT JOIN PROMO promo ON td.idPromoParent = promo.id WHERE idUser=$idUser) 
			ORDER BY dayTime ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getInfoBySeance($idSeance) {
	$SQL = "SELECT SEANCE.id, USER.firstName AS teacherFirstName, USER.lastName AS teacherLastName, PROMO.name AS promoName, MODULE.name as moduleName from SEANCE 
		LEFT JOIN USER ON SEANCE.idTeacher = USER.id 
		LEFT JOIN PROMO ON PROMO.id = SEANCE.idPromo 
		LEFT JOIN MODULE ON MODULE.id = SEANCE.idModule WHERE SEANCE.id = $idSeance";
	return parcoursRs(SQLSelect($SQL));
}

function getContentBySeance($idSeance) {
	$SQL = "SELECT * FROM (
				SELECT 'Question' AS type, id, IF(char_length(description) > 40 , CONCAT(SUBSTR(description, 1, 40), '...'), SUBSTR(description, 1, 40)) AS titre, isVisible, dateInsertion FROM QUESTION WHERE idSeance = $idSeance 
				UNION ALL SELECT 'Tache' AS type, id, IF(char_length(titre) > 40 , CONCAT(SUBSTR(titre, 1, 40), '...'), SUBSTR(titre, 1, 40)) AS titre, isVisible, dateInsertion FROM TASK WHERE idSeance = $idSeance
			) s 
			ORDER BY dateInsertion ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getHomeWorkBySeance($idSeance) {
	$SQL = "SELECT HOMEWORK.id, IF(char_length(HOMEWORK.titre) > 40 , CONCAT(SUBSTR(HOMEWORK.titre, 1, 40), '...'), SUBSTR(HOMEWORK.titre, 1, 40)) AS titre, HOMEWORK.dueDate, HOMEWORK.isVisible
		FROM HOMEWORK
		WHERE idSeance=$idSeance
		ORDER BY HOMEWORK.dueDate ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getNoteBySeance($idUser, $idSeance) {
	$SQL = "SELECT id, IF(char_length(description) > 40 , CONCAT(SUBSTR(description, 1, 40), '...'), SUBSTR(description, 1, 40)) AS description, private from NOTE WHERE idSeance=$idSeance AND idUser=$idUser";
	return parcoursRs(SQLSelect($SQL));
}

function addTache($idSeance, $titre, $description) {
	$SQL = "INSERT INTO TASK (idSeance, titre, description, dateInsertion) VALUES ($idSeance, '$titre', '".nl2br($description)."', NOW())";
	return SQLInsert($SQL);
}

function updateTache($idTache, $titre, $description) {
	$SQL = "UPDATE TASK SET titre = '$titre', description = '".nl2br($description)."' WHERE id = $idTache";
	return SQLUpdate($SQL);
}

function deleteTache($idTache) {
	$SQL = "DELETE FROM TASK WHERE id = $idTache";
	return SQLDelete($SQL);
}

function setTacheVisible($idTache, $isVisible) {
	$SQL = "UPDATE TASK SET isVisible = $isVisible WHERE id = $idTache";
	return SQLUpdate($SQL);
}

function getTacheById($idTache) {
	$SQL = "SELECT id, titre, description FROM TASK WHERE id = $idTache";
	return parcoursRs(SQLSelect($SQL));
}

function getQuestionFromTache($idTache) {
	$SQL = "SELECT id, question, answer FROM TASK_QUESTION WHERE idTask = $idTache";
	return parcoursRs(SQLSelect($SQL));
}

function getTacheQuestionById($idQuestion) {
	$SQL = "SELECT * FROM TASK_QUESTION WHERE id = $idQuestion";
	return parcoursRs(SQLSelect($SQL));
}

function setAnswerToTacheQuestion($idQuestion, $answer) {
	$SQL = "UPDATE TASK_QUESTION SET answer = '".nl2br($answer)."' WHERE id = $idQuestion";
	return SQLUpdate($SQL);
}

function addQuestion($idSeance, $description, $correct) {
	$SQL = "INSERT INTO QUESTION (idSeance, description, dateInsertion, correctAnswer) 
			VALUES ($idSeance,'".nl2br($description)."', NOW(), '$correct')";
	return SQLInsert($SQL);
}

function updateQuestion($idQuestion, $description, $correct) {
	$SQL = "UPDATE QUESTION SET description = '".nl2br($description)."' , correctAnswer = '$correct' WHERE id = $idQuestion";
	return SQLUpdate($SQL);
}

function deleteQuestion($idQuestion) {
	$SQL = "DELETE FROM QUESTION_ANSWER WHERE idQuestion = $idQuestion; DELETE FROM QUESTION WHERE id = $idQuestion";
	return SQLDelete($SQL);
}

function setQuestionVisible($idQuestion, $idVisible) {
	$SQL = "UPDATE QUESTION SET isVisible = $idVisible WHERE id = $idQuestion";
	return SQLUpdate($SQL);
}

function getQuestionById($idQuestion) {
	$SQL = "SELECT id, description, answerIsVisible, correctAnswer AS answer, 
				(SELECT COUNT(*) FROM QUESTION_ANSWER WHERE idQuestion = $idQuestion) AS nbAnswer 
			FROM QUESTION WHERE id = $idQuestion";
	return parcoursRs(SQLSelect($SQL));
}

function setCorrectionVisible($idQuestion, $isVisible) {
	$SQL = "UPDATE QUESTION SET answerIsVisible = $isVisible WHERE id = $idQuestion";
	return SQLUpdate($SQL);
}

function getAnswerFromQuestion($idQuestion) {	
	$SQL = "SELECT *, (SELECT COUNT(*) FROM QUESTION_ANSWER WHERE idQuestion = $idQuestion) Total 
			FROM (SELECT QUESTION_ANSWER.answer, COUNT(QUESTION_ANSWER.answer) Pourcentage FROM QUESTION_ANSWER 
			WHERE idQuestion = $idQuestion GROUP BY UPPER(QUESTION_ANSWER.answer) ASC) question";
	return parcoursRs(SQLSelect($SQL));
}

function validReponse($idReponse, $valid) {
	$SQL = "UPDATE QUESTION_ANSWER SET valid = $valid WHERE id = $idReponse";
	return SQLUpdate($SQL);
}

function getHomeworkById($idHomeWork) {
	$SQL = "SELECT id, titre, description, dueDate FROM HOMEWORK WHERE id = $idHomeWork";
	return parcoursRs(SQLSelect($SQL));
}

function addHomeWork($idSeance, $titre, $description, $dueDate) {
	$SQL = "INSERT INTO HOMEWORK (idSeance, titre, description, dueDate, isVisible) VALUES ($idSeance, '$titre', '".nl2br($description)."', '$dueDate', 0) ";
	return SQLInsert($SQL);
}

function updateHomeWork($idHomeWork, $titre, $description, $dueDate) {
	$SQL = "UPDATE HOMEWORK SET titre = '$titre', description = '".nl2br($description)."', dueDate='$dueDate' WHERE id = $idHomeWork";
	return SQLUpdate($SQL);
}

function setHomeWorkVisible($idHomeWork, $idVisible) {
	$SQL = "UPDATE HOMEWORK SET isVisible = $idVisible WHERE id = $idHomeWork";
	return SQLUpdate($SQL);
}

function deleteHomeWork($idHomeWork) {
	$SQL = "DELETE FROM HOMEWORK_STUDENT WHERE idHomeWork = $idHomeWork; DELETE FROM HOMEWORK WHERE id = $idHomeWork";
	return SQLDelete($SQL);
}

function getNoteById($idNote) {
	$SQL = "SELECT id, description FROM NOTE WHERE id = $idNote";
	return parcoursRs(SQLSelect($SQL));
}

function addNote($idSeance, $idUser, $description) {
	$SQL = "INSERT INTO NOTE (idSeance, idUser, description, private) VALUES ($idSeance, $idUser, '".nl2br($description)."', 1) ";
	return SQLInsert($SQL);
}

function updateNote($idNote, $idUser, $description) {
	$SQL = "UPDATE NOTE SET description = '".nl2br($description)."' WHERE id = $idNote AND idUser = $idUser";
	return SQLUpdate($SQL);
}

function deleteNote($idNote, $idUser) {
	$SQL = "DELETE FROM NOTE WHERE id = $idNote AND idUser = $idUser";
	return SQLDelete($SQL);
}