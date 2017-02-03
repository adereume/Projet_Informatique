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
function ajouterEtudiant($firstname, $lastname, $password, $idPromo) {
	$SQL = "INSERT INTO USER(firstName,lastName, password) VALUES ('$firstname','$lastname', MD5('$password'))";
	$idUser = SQLInsert($SQL);
	
	$SQL = "INSERT INTO STUDENT(idUser,idPromo) VALUES ('$idUser','$idPromo')";
	return SQLInsert($SQL);
}

function ajouterEnseignent($firstname, $lastname, $password) {
	$SQL = "INSERT INTO USER(firstName,lastName, password) VALUES ('$firstname','$lastname', MD5('$password'))";
	$idUser = SQLInsert($SQL);

	$SQL = "INSERT INTO TEACHER(idUser) VALUES ('$idUser')";
	return SQLInsert($SQL);
}

function getTeacherById($idTeacher) {
	$SQL = "SELECT * from USER WHERE id=$idTeacher";
	return parcoursRs(SQLSelect($SQL));
}

function isLost($idUser, $idSeance) {
	$SQL = "SELECT * from LOST_STUDENT WHERE idStudent=$idUser AND idSeance=$idSeance";
	return parcoursRs(SQLSelect($SQL));
}

function setLost($idUser, $idSeance) {
	$SQL = "INSERT INTO LOST_STUDENT (idStudent, idSeance) VALUES ($idUser, $idSeance)";
	return parcoursRs(SQLSelect($SQL));
}

function getModule() {
	$SQL = "SELECT * from MODULE";
	return parcoursRs(SQLSelect($SQL));
}

function getModuleById($idModule) {
	$SQL = "SELECT * from MODULE WHERE id=$idModule";
	return parcoursRs(SQLSelect($SQL));
}

function getPromo(){
	$SQL = "SELECT * from PROMO WHERE level=0 ORDER BY name ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getPromoById($idPromo) {
	$SQL = "SELECT * from PROMO WHERE id=$idPromo";
	return parcoursRs(SQLSelect($SQL));
}

function getTD($idPromo){
	$SQL = "SELECT * from PROMO WHERE level=1 AND idPromoParent = $idPromo ORDER BY name ASC";
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
	$SQL = "SELECT SEANCE.*, USER.firstName AS teacherFirstName, USER.lastName AS teacherLastName, PROMO.name AS promoName, MODULE.name as moduleName from SEANCE 
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
	$SQL = "SELECT SEANCE.*,  USER.firstName AS teacherFirstName, USER.lastName AS teacherLastName, PROMO.name AS promoName, MODULE.name as moduleName from SEANCE 
		LEFT JOIN USER ON SEANCE.idTeacher = USER.id 
		LEFT JOIN PROMO ON PROMO.id = SEANCE.idPromo 
		LEFT JOIN MODULE ON MODULE.id = SEANCE.idModule WHERE SEANCE.id = $idSeance";
	return parcoursRs(SQLSelect($SQL));
}

function getContentBySeance($idSeance) {
	$SQL = "SELECT * FROM (SELECT 'Question' AS type, description AS titre, isVisible, dateInsertion FROM QUESTION WHERE idSeance = $idSeance "
				." UNION ALL SELECT 'Tache' AS type, titre, isVisible, dateInsertion FROM TASK WHERE idSeance = $idSeance) s "
				." ORDER BY dateInsertion ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getContentBySeanceForStudent($idSeance, $idStudent) {
	$SQL = "SELECT * FROM (SELECT 'Question' AS type, description AS titre, '' AS realized, dateInsertion FROM QUESTION WHERE idSeance = $idSeance AND isVisible = 1"
				." UNION ALL SELECT 'Tache' AS type, titre, TASK_STUDENT.realized AS realized, dateInsertion FROM TASK "
				." LEFT JOIN TASK_STUDENT ON TASK_STUDENT.idTask = TASK.id "
				." WHERE TASK_STUDENT.idStudent = $idStudent AND idSeance = $idSeance AND isVisible = 1) s "
				." ORDER BY dateInsertion ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getHomeWorkBySeance($idSeance) {
	$SQL = "SELECT HOMEWORK.*, HOMEWORK_STUDENT.realized from HOMEWORK LEFT JOIN HOMEWORK_STUDENT ON HOMEWORK_STUDENT.idHomeWork = HOMEWORK.id "
				." WHERE idSeance=$idSeance";
	return parcoursRs(SQLSelect($SQL));
}

function getNoteBySeance($idUser, $idSeance) {
	$SQL = "SELECT * from NOTE WHERE idSeance=$idSeance AND idUser=$idUser";
	return parcoursRs(SQLSelect($SQL));
}

function getHomeWorkByUser($idUser) {
	$SQL = "SELECT HOMEWORK.*, MODULE.name AS moduleName, HOMEWORK_STUDENT.realized FROM HOMEWORK 
		LEFT OUTER JOIN HOMEWORK_STUDENT ON HOMEWORK_STUDENT.idHomeWork = HOMEWORK.id AND HOMEWORK_STUDENT.idStudent = 5
		LEFT JOIN SEANCE ON SEANCE.id = HOMEWORK.idSeance
		LEFT JOIN MODULE ON MODULE.id = SEANCE.idModule WHERE idSeance IN (SELECT SEANCE.id from SEANCE 
			LEFT JOIN USER ON SEANCE.idTeacher = USER.id 
			LEFT JOIN PROMO ON PROMO.id = SEANCE.idPromo 
			LEFT JOIN MODULE ON MODULE.id = SEANCE.idModule 
			WHERE idPromo IN (SELECT idPromo FROM STUDENT WHERE idUser=$idUser UNION ALL
	        	SELECT PROMO.idPromoParent AS idPromo FROM PROMO 
	        		LEFT JOIN STUDENT ON PROMO.id = STUDENT.idPromo WHERE idUser=$idUser
				UNION ALL SELECT promo.idPromoParent AS idPromo FROM PROMO td	
					LEFT JOIN STUDENT ON td.id = STUDENT.idPromo
    	        	LEFT JOIN PROMO promo ON td.idPromoParent = promo.id WHERE idUser=$idUser)) ORDER BY moduleName, dueDate ASC";
	return parcoursRs(SQLSelect($SQL));
}

function getHomeWorkById($idHomeWork, $idUser) {
	$SQL = "SELECT HOMEWORK.*, HOMEWORK_STUDENT.realized, MODULE.name AS moduleName FROM HOMEWORK 
		LEFT OUTER JOIN HOMEWORK_STUDENT ON HOMEWORK_STUDENT.idHomeWork = HOMEWORK.id AND HOMEWORK_STUDENT.idStudent = $idUser
   	 	LEFT JOIN SEANCE ON SEANCE.id = HOMEWORK.idSeance
		LEFT JOIN MODULE ON MODULE.id = SEANCE.idModule
	WHERE HOMEWORK.id = $idHomeWork";
	return parcoursRs(SQLSelect($SQL));
}

function addTache($idSeance, $titre, $description) {
	$SQL = "INSERT INTO TASK (idSeance, titre, description, dateInsertion) VALUES ($idSeance, '$titre', '$description', NOW())";
	return SQLInsert($SQL);
}

function updateTache($idTache, $titre, $description) {
	$SQL = "UPDATE TASK SET titre = '$titre', description = '$description' WHERE id = $idTache";
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
	$SQL = "SELECT * FROM TASK WHERE id = $idTache";
	return parcoursRs(SQLSelect($SQL));
}

function validTache($idTache, $idStudent, $isValid) {
	$SQL = "INSERT INTO TASK_STUDENT (idTask, idStudent, realized) VALUES ($idTache, $idStudent, $isValid) "
			." ON DUPLICATE KEY UPDATE realized = $isValid";
	return SQLInsertOrUpdate($SQL);
}

function getQuestionFromTache($idTache) {
	$SQL = "SELECT * FROM TASK_QUESTION WHERE idTask = $idTache";
	return parcoursRs(SQLSelect($SQL));
}

function getTacheQuestionById($idQuestion) {
	$SQL = "SELECT * FROM TASK_QUESTION WHERE id = $idQuestion";
	return parcoursRs(SQLSelect($SQL));
}

function addTacheQuestion($idTask, $question) {
	$SQL = "INSERT INTO TASK_QUESTION (idTask, question, answer) VALUES ($idTask, '$question', null);";
	return SQLInsert($SQL);
}

function setAnswerToTacheQuestion($idQuestion, $answer) {
	$SQL = "UPDATE TASK_QUESTION SET answer = '$answer' WHERE id = $idQuestion";
	return SQLUpdate($SQL);
}

function addQuestion($idSeance, $description) {
	$SQL = "INSERT INTO QUESTION (idSeance, description, dateInsertion) VALUES ($idSeance,'$description', NOW())";
	return SQLInsert($SQL);
}

function updateQuestion($idQuestion, $description) {
	$SQL = "UPDATE QUESTION SET description = '$description' WHERE id = $idQuestion";
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
	$SQL = "SELECT * FROM QUESTION WHERE id = $idQuestion";
	return parcoursRs(SQLSelect($SQL));
}

function addAnswerToQuestion($idUser, $idQuestion, $answer) {
	$SQL = "INSERT INTO QUESTION_ANSWER (idQuestion, idStudent, answer, valid) VALUES ($idQuestion, $idUser, '$answer', 0) ";
	return SQLInsert($SQL);
}

function getAnswerFromQuestion($idQuestion) {	
	$SQL = "SELECT * FROM QUESTION_ANSWER WHERE idQuestion = $idQuestion";
	return parcoursRs(SQLSelect($SQL));
}

function addHomeWork($idSeance, $titre, $description, $dueDate) {
	$SQL = "INSERT INTO HOMEWORK (idSeance, titre, description, dueDate) VALUES ($idSeance, '$titre', '$description', '$dueDate') ";
	return SQLInsert($SQL);
}

function updateHomeWork($idHomeWork, $titre, $description) {
	$SQL = "UPDATE HOMEWORK SET titre = '$titre', description = '$description' WHERE id = $idHomeWork";
	return SQLUpdate($SQL);
}

function deleteHomeWork($idHomeWork) {
	$SQL = "DELETE FROM HOMEWORK_STUDENT WHERE idHomeWork = $idHomeWork; DELETE FROM HOMEWORK WHERE id = $idHomeWork";
	return SQLDelete($SQL);
}

function validHomeWork($idHomeWork, $idStudent, $realized) {
	$SQL = "INSERT INTO HOMEWORK_STUDENT (idHomeWork, idStudent, realized) VALUES ($idHomeWork, $idStudent, $realized) "
			." ON DUPLICATE KEY UPDATE realized = $realized";
	return SQLInsertOrUpdate($SQL);
}

function addNote($idSeance, $idUser, $description) {
	$SQL = "INSERT INTO NOTE (idSeance, idUser, description, private) VALUES ($idSeance, $idUser, '$description', 1) ";
	return SQLInsert($SQL);
}

function updateNote($idNote, $idUser, $description) {
	$SQL = "UPDATE NOTE SET description = '$description' WHERE id = $idNote AND idUser = $idUser";
	return SQLUpdate($SQL);
}

function deleteNote($idNote, $idUser) {
	$SQL = "DELETE FROM NOTE WHERE id = $idNote AND idUser = $idUser";
	return SQLDelete($SQL);
}