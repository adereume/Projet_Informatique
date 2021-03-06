<?php
session_start();

	//header('Access-Control-Allow-Origin: *');

	include_once "libs/maLibUtils.php";
	include_once "libs/maLibSQL.pdo.php";
	include_once "libs/maLibSecurisation.php"; 
	include_once "libs/bdd.php"; 

	$data["connecte"] = valider("connecte","SESSION");
	$data["action"] = valider("action");
	
	if (!$data["action"] || (!$data["connecte"] && $data["action"] != "connexion" 
		&& $data["action"] != "connexion" && $data["action"] != "inscription")) {
		$data["feedback"] = "Entrez connexion(firstname,lastname,password)";
		$data["connecte"] = false;
	} else {
		if( $data["action"] != "connexion" ) {
			if(sizeof(isStudent(valider("idUser", "SESSION"))) == 1) 
				return;
		}		

		switch($data["action"]) {
				case 'connexion' :
					if 	(($firstname = valider("firstname")) && ($lastname = valider("lastname")) && ($password = valider("password"))) {
						if (isUserExisting($firstname, $lastname)) {
							$data["retour"] = verifUser($firstname,$lastname,$password);	
						} else {
							$data["retour"] = "Cet utilisateur n'existe pas"; 
						}
					} else {
						$data["feedback"] = "Entrez firstname,lastname,password";
					}
				break;

				case 'logout' :
					// On supprime juste la session 
					session_destroy();
					$data["feedback"] = "Entrez connexion(firstname,lastname,password)";
					$data["connecte"] = false;
				break;	

				//Action sur Compte
				case 'addCompte':
					if(!($type = valider("type")) || !($firstname = valider("firstname")) || !($lastname = valider("lastname"))
						 || !($password = valider("password"))) {
						// On verifie l'utilisateur, et on crée des variables de session si tout est OK
						$data["feedback"] = "Entrez firstname, lastname, password, type[STUDENT: idPromo, TEACHER]";
					} else {
						if(! isUserExisting($firstname, $lastname)) {
							if($type == "STUDENT") {
								if(!($idPromo = valider("idPromo"))) {
									$data["feedback"] = "Entrez firstname, lastname, password, type='STUDENT', idPromo";
								} else 
									$data["retour"] = ajouterEtudiant($firstname, $lastname, $password, $idPromo);
							} else if($type == "TEACHER") {
								if(($isAdmin = valider("isAdmin")) == NULL) {
									$data["feedback"] = "Entrez firstname, lastname, password, type='TEACHER', isAdmin";
								} else 
									$data["retour"] = ajouterEnseignant($firstname, $lastname, $password, $isAdmin);
							} else
								$data["feedback"] = "Entrez le type entre STUDENT et TEACHER";
						} else {
							$data["feedback"] = "Cette utilisateur existe déjà";
						}
					}
				break;

				case 'isAdmin':
					if(($idTeacher = valider("idUser", "SESSION"))) {
						$result = isTeacher($idTeacher);
						if(sizeof($result) == 1) {
							$data["retour"] = isAdmin($idTeacher);
						} else
							$data["feedback"] = "Cet utilisateur n'est pas un enseignant";						
					} else
						$data["feedback"] = "Vous n'êtes pas connecté";
				break;

				case 'updateCompte':
					if(($idUser = valider("idUser")) && (sizeof(isStudent(valider("idUser"))) == 1)) {
						if(($idPromo = valider("idPromo"))) {
							$data["retour"] = changePromo($idUser, $idPromo);
						} else {
							$data["feedback"] = "Entrez idUser, idPromo ";
						}
					} else if(($idUser = valider("idUser")) && (sizeof(isStudent(valider("idUser"))) == 0)) {
						if(($isAdmin = valider("isAdmin")) != NULL) {
							$data["retour"] = setAdmin($idUser, $isAdmin);
						} else {
							$data["feedback"] = "Entrez idUser, isAdmin";
						}
					}
				break;

				case 'deleteCompte': 
					if(($idUser = valider("idUser"))) {
						$data["retour"] = deleteCompte($idUser);
					} else
						$data["feedback"] = "Entrez idUser";
				break;

				case 'getAllUsers':
					$data["teachers"] = getTeachers();
					$data["students"] = getStudents();
				break;

				case 'getTeacherById':
					if(($idTeacher = valider("idUser", "SESSION"))) {
						$result = isTeacher($idTeacher);
						if(sizeof($result) == 1) {
							$data["retour"] = getTeacherById($idTeacher);
						} else
							$data["feedback"] = "Cet utilisateur n'est pas un enseignant";						
					} else
						$data["feedback"] = "Vous n'êtes pas connecté";
				break;

				case 'updatePassword': 
					if(($idUser = valider("idUser","SESSION")) && ($oldPassword = valider("oldPassword")) && ($newPassword = valider("newPassword"))) {
						$data["retour"] = updatePassword($idUser, $oldPassword, $newPassword);
					} else
						$data["feedback"] = "Entrez oldPassword, newPassword";
				break;

				case 'getAllLostBySeance':
					if(($idUser = valider("idUser","SESSION")) && ($idSeance = valider("idSeance"))) {
						$data["retour"] = getAllLostStudent($idSeance);
					} else
						$data["feedback"] = "Entrez idSeance";
				break;

				case 'resetLostBySeance':
					if(($idUser = valider("idUser","SESSION")) && ($idSeance = valider("idSeance"))) {
						$data["retour"] = resetLostBySeance($idSeance);
					} else
						$data["feedback"] = "Entrez idSeance";
				break;

				case 'isLost':
					if(($idUser = valider("idUser","SESSION")) && ($idSeance = valider("idSeance"))) {
						$data["retour"] = isLost($idUser, $idSeance);
					} else
						$data["feedback"] = "Entrez idSeance";
				break;

				case 'setLost':
					if(($idUser = valider("idUser","SESSION")) && ($idSeance = valider("idSeance"))) {
						$data["retour"] = setLost($idUser, $idSeance);
					} else
						$data["feedback"] = "Entrez idSeance";
				break;

				//Action sur les modules
				case 'getModule':
					$data["retour"] = getModule();
				break;

				case 'getModuleById':
					if(($idModule = valider("idModule"))) {
						$data["retour"] = getModuleById($idModule);
					} else
						$data["feedback"] = "Entrez idModule";
				break;
				
				case 'addModule':
					if( ! $name = valider("name") ) {
						$data["feedback"] = "Entrez name";
					} else if ( isModuleExisting(0, $name) ) {
						$data["feedback"] = "Ce module existe déjà";
					} else {
						$data["retour"] = addModule($name);
					}
				break;

				case 'updateModule':
					if( ! (($id = valider("idModule")) && ($name = valider("name"))) ) {
						$data["feedback"] = "Entrez idModule, name";
					} else if ( isModuleExisting($id, $name) ) {
						$data["feedback"] = "Ce module existe déjà";
					} else {
						$data["retour"] = updateModule($id, $name);
					}
				break;

				case 'deleteModule':
					if(($idModule = valider("idModule"))) {
						$data["retour"] = deleteModule($idModule);
					} else
						$data["feedback"] = "Entrez idModule";
				break;

				//Action sur PROMO
				case 'getAllPromos' :
					$data["retour"] = getAllPromos();
				break;

				case 'getPromo' :
					$data["retour"] = getPromo();
				break;

				case 'getPromoById' :
					if(($idPromo = valider("idPromo"))) {
						$data["retour"] = getPromoById($idPromo);
					} else
						$data["feedback"] = "Entrez idPromo";
				break;

				case 'addPromo' :
					if( ! ( ($name = valider("name")) && (($level = valider("level")) != NULL)) ) {
						$data["feedback"] = "Entrez name, level";
					} else if ( isPromoExisting(0, $name, $level) ) {
						$data["feedback"] = "Cette promotion existe déjà";
					} else {
						$idPromoParent = valider("idPromoParent");
						$data["retour"] = addPromo($name, $level, $idPromoParent);
					}
				break;

				case 'updatePromo' :
					if( ! ( ($idPromo = valider("idPromo")) && ($name = valider("name")) && ($level = valider("level")) != NULL) ) {
						$data["feedback"] = "Entrez idPromo, name, level ";
					} else if ( isPromoExisting($idPromo, $name, $level) ) {
						$data["feedback"] = "Cette promotion existe déjà";
					} else {
						$data["retour"] = updatePromo($idPromo, $name);
					}
				break;

				case 'deletePromo' :
					if(($idPromo = valider("idPromo"))) {
						$data["retour"] = deletePromo($idPromo);
					} else
						$data["feedback"] = "Entrez idPromo";
				break;

				
				case 'getTD' :
					if(($idPromo = valider("idPromo"))) {
						$data["retour"] = getTD($idPromo);
					} else
						$data["feedback"] = "Entrez idPromo";
					
				break;

				case 'getAllTD' :
					$data["retour"] = getAllTD();					
				break;

				case 'getTP' :
					if(($idTD = valider("idTD"))) {
						$data["retour"] = getTP($idTD);
					} else
						$data["feedback"] = "Entrez idTD";
				break; 

				case 'getAllTP' :
					$data["retour"] = getAllTP();
				break; 

				//Action sur Séance
				case 'addSeance' :
					if(($idModule = valider("idModule")) && ($idTeacher = valider("idUser","SESSION")) && ($idPromo = valider("idPromo")) 
							&& ($dayTime = valider("dayTime")) && ($room = valider("room")) 
							&& ($dayTimeEnd = valider("dayTimeEnd"))) {
						$data["retour"] = ajouterSeance($idModule, $idTeacher, $idPromo, $dayTime, $dayTimeEnd, $room);
					} else
						$data["feedback"] = "Entrez idModule, idTeacher, idPromo, dayTime, dayTimeEnd, room";
				break;

				case 'getAllSeance' : 
					if(($idUser = valider("idUser","SESSION")))
						$data["seances"] = getAllSeance($idUser);
					else
						$data["feedback"] = "Vous n'êtes pas connecté";
				break;

				case 'getSeanceById' :
					if(($idUser = valider("idUser","SESSION")) && ($idSeance = valider("idSeance"))) {
						$data["info"] = getInfoBySeance($idSeance);
						$data["seance"] = getContentBySeance($idSeance);						
						$data["homework"] = getHomeWorkBySeance($idSeance);
						$data["note"] = getNoteBySeance($idUser, $idSeance);
					} else
						$data["feedback"] = "Entrez idSeance";
				break;

				case 'updateSeance': 
					if(($idSeance = valider("idSeance")) && ($idTeacher = valider("idUser","SESSION")) && ($dayTime = valider("dayTime")) 
							&& ($room = valider("room"))
							&& ($dayTimeEnd = valider("dayTimeEnd"))) {
						$data["retour"] = updateSeance($idSeance, $idTeacher, $dayTime, $dayTimeEnd, $room);
					} else
						$data["feedback"] = "Entrez idSeance, dayTime, dayTimeEnd, room";
				break;

				case 'deleteSeance': 
					if(($idSeance = valider("idSeance")) && ($idUser = valider("idUser","SESSION"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = deleteSeance($idSeance, $idUser);
						} else
							$data["feedback"] = "Seule un enseignant peut supprimer une seance";
					} else
						$data["feedback"] = "Entrez idSeance";
				break;

				//Action sur Tache
				case 'getTacheById':
					if(($idTache = valider("idTache"))) {
						$data["tache"] = getTacheById($idTache);
						$data["question"] = getQuestionFromTache($idTache);
					}else
						$data["feedback"] = "Entrez idTache";
				break;

				case 'addTache':
					if(($idSeance = valider("idSeance")) && ($titre = valider("titre")) && ($description = valider("description"))) {
						$data["retour"] = addTache($idSeance, $titre, $description);
					} else
						$data["feedback"] = "Entrez idSeance, titre, description";
				break;

				case 'updateTache':
					if(($idTache = valider("idTache")) && ($idUser = valider("idUser","SESSION")) && ($titre = valider("titre")) && ($description = valider("description"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = updateTache($idTache, $titre, $description);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier une tache";
					} else
						$data["feedback"] = "Entrez idTache, titre, description";
				break;

				case 'deleteTache': 
					if(($idTache = valider("idTache")) && ($idUser = valider("idUser","SESSION"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = deleteTache($idTache);
						} else
							$data["feedback"] = "Seule un enseignant peut supprimer une tache";
					} else
						$data["feedback"] = "Entrez idSeance";
				break;

				case 'setTacheVisible':
					if(($idUser = valider("idUser","SESSION")) && ($idTache = valider("idTache")) && ($isVisible = valider("isVisible")) != NULL) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = setTacheVisible($idTache, $isVisible);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier la visibilite";
					} else
						$data["feedback"] = "Entrez idQuestion, isVisible";
				break;

				//Action sur Question-Tache
				case 'getQuestionTacheById':
					if(($idQuestion = valider("idQuestion"))) {
						$data["question"] = getTacheQuestionById($idQuestion);
					} else
						$data["feedback"] = "Entrez idQuestion";
				break;

				case 'addTacheQuestion':
					if(($idTache = valider("idTache")) && ($question = valider("question"))) {
						$data["retour"] = addTacheQuestion($idTache, $question);
					}else
						$data["feedback"] = "Entrez idTache, question";
				break;

				case 'answerTacheQuestion':
					if(($idQuestion = valider("idQuestion")) && ($idUser = valider("idUser","SESSION"))) {
						$result = isTeacher($idUser);
						$answer = valider("answer");
						if(sizeof($result) == 1) {
							$data["retour"] = setAnswerToTacheQuestion($idQuestion, $answer);
						} else
							$data["feedback"] = "Seule un enseignant peuvent répondre";
					} else {
						$data["feedback"] = "Entrez idQuestion";
					}
				break;

				//Action sur Question
				case 'getQuestionById':
					if(($idQuestion = valider("idQuestion"))) {
						$data["question"] = getQuestionById($idQuestion);
						$data["reponses"] = getAnswerFromQuestion($idQuestion);
					} else
						$data["feedback"] = "Entrez idQuestion";
				break;

				case 'addQuestion':
					if(($idSeance = valider("idSeance")) && ($description = valider("description")) && ($correct = valider("correct"))) {
						$data["retour"] = addQuestion($idSeance, $description, $correct);
					} else
						$data["feedback"] = "Entrez idSeance, description";
				break;

				case 'updateQuestion':
					if(($idQuestion = valider("idQuestion")) && ($idUser = valider("idUser","SESSION")) && ($description = valider("description")) 
						&& ($correct = valider("correct"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = updateQuestion($idQuestion, $description, $correct);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier une question";
					} else
						$data["feedback"] = "Entrez idQuestion, description";
				break;

				case 'deleteQuestion': 
					if(($idQuestion = valider("idQuestion")) && ($idUser = valider("idUser","SESSION"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = deleteQuestion($idQuestion);
						} else
							$data["feedback"] = "Seule un enseignant peut supprimer une question";
					} else
						$data["feedback"] = "Entrez idQuestion";
				break;

				case 'setQuestionVisible':
					if(($idUser = valider("idUser","SESSION")) && ($idQuestion = valider("idQuestion")) && ($isVisible = valider("isVisible")) != NULL) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = setQuestionVisible($idQuestion, $isVisible);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier la visibilite";
					} else
						$data["feedback"] = "Entrez idQuestion, isVisible";
				break;

				case 'setCorrectionVisible':
					if(($idQuestion = valider("idQuestion")) && ($isVisible = valider("isVisible")) != NULL) {
						$data["retour"] = setCorrectionVisible($idQuestion, $isVisible);
					} else
						$data["feedback"] = "Entrez idQuestion, isVisible";
				break;

				//Action response au question
				case 'validReponse': 
					if(($idReponse = valider("idReponse")) && ($valid = valider("valid")) != NULL) {
						$data["retour"] = validReponse($idReponse, $valid);
					} else
						$data["feedback"] = "Entrez idReponse, ";
				break;

				//Action sur Devoir
				case 'getHomeworkById':
					if(($idTache = valider("idHomeWork"))) {
						$data["homework"] = getHomeworkById($idTache);
					}else
						$data["feedback"] = "Entrez idHomeWork";
				break;

				case 'setHomeWorkVisible':
					if(($idHomeWork = valider("idHomeWork")) && ($isVisible = valider("isVisible")) != NULL) {
						$data["retour"] = setHomeWorkVisible($idHomeWork, $isVisible);
					} else
						$data["feedback"] = "Entrez idUser, idHomeWork, isVisible";
				break;

				case 'addHomeWork':
					if(($idSeance = valider("idSeance")) && ($idUser = valider("idUser","SESSION")) && ($titre = valider("titre")) 
							&& ($description = valider("description")) && ($dueDate = valider("dueDate")) ) {
						$data["retour"] = addHomeWork($idSeance, $titre, $description, $dueDate);
					} else
						$data["feedback"] = "Entrez idSeance, titre, description, dueDate";
				break;

				case 'updateHomeWork':
					if(($idHomeWork = valider("idHomeWork")) && ($idUser = valider("idUser","SESSION")) && ($titre = valider("titre")) && ($description = valider("description")) && ($dueDate = valider("dueDate"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = updateHomeWork($idHomeWork, $titre, $description, $dueDate);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier un devoir";
					} else
						$data["feedback"] = "Entrez idHomeWork, titre, description, dueDate";
				break;

				case 'deleteHomeWork': 
					if(($idHomeWork = valider("idHomeWork")) && ($idUser = valider("idUser","SESSION"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = deleteHomeWork($idHomeWork);
						} else
							$data["feedback"] = "Seule un enseignant peut supprimer un devoir";
					} else
						$data["feedback"] = "Entrez idHomeWork";
				break;

				//Action sur Note
				case 'getNoteById':
					if(($idNote = valider("idNote"))) {
						$data["note"] = getNoteById($idNote);
					}else
						$data["feedback"] = "Entrez idNote";
				break;

				case 'addNote':
					if(($idSeance = valider("idSeance")) && ($idUser = valider("idUser","SESSION")) && ($description = valider("description")) != NULL) {
						$data["retour"] = addNote($idSeance, $idUser, $description);
					} else
						$data["feedback"] = "Entrez idSeance, description";
				break;

				case 'updateNote':
					if(($idNote = valider("idNote")) && ($idUser = valider("idUser","SESSION")) && ($description = valider("description")) != NULL) {
						$data["retour"] = updateNote($idNote, $idUser, $description);
					} else
						$data["feedback"] = "Entrez idNote, description";
				break;

				case 'deleteNote': 
					if(($idNote = valider("idNote")) && ($idUser = valider("idUser","SESSION"))) {
						$data["retour"] = deleteNote($idNote, $idUser);
					} else
						$data["feedback"] = "Entrez idNote";
				break;

				default:
					$data["feedback"] = "Cette action n'existe pas";
				break;
		}
	
	}

	$data["connecte"] = valider("connecte","SESSION");

	echo json_encode($data);
?>










