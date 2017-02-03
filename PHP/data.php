<?php
session_start();

	header('Access-Control-Allow-Origin: *');

	include_once "libs/maLibUtils.php";
	include_once "libs/maLibSQL.pdo.php";
	include_once "libs/maLibSecurisation.php"; 
	include_once "libs/bdd.php"; 

	$data["connecte"] = valider("connecte","SESSION");
	$data["action"] = valider("action");
	
	if (!$data["action"] || (!$data["connecte"] && $data["action"] != "connexion" 
		&& $data["action"] != "connexionWeb" && $data["action"] != "inscription")) {
		$data["feedback"] = "Entrez connexion(firstname,lastname,password)";
	}
	else {	
		switch($data["action"]) {
				case 'connexion' :
					if 	(($firstname = valider("firstname")) && ($lastname = valider("lastname")) && ($password = valider("password"))) {
						$data["retour"] = verifUser($firstname,$lastname,$password);
					} else {
						$data["feedback"] = "Entrez firstname,lastname,password";
					}
				break;

				case 'connexionWeb' :
					if 	(($firstname = valider("firstname")) && ($lastname = valider("lastname")) && ($password = valider("password"))) {
						$data["retour"] = verifUserWeb($firstname,$lastname,$password);
						$data["connecte"] = valider("connecte","SESSION");
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


				case 'inscription':
					if(!($type = valider("type")) || !($firstname = valider("firstname")) || !($lastname = valider("lastname"))
						 || !($password = valider("password"))) {
						// On verifie l'utilisateur, et on crée des variables de session si tout est OK
						$data["feedback"] = "Entrez firstname,lastname,password,type[STUDENT: idPromo, TEACHER]";
					} else {
						if(! isUserExisting($firstname, $lastname)) {
							if($type == "STUDENT") {
								if(!($idPromo = valider("idPromo"))) {
									$data["feedback"] = "Entrez firstname,lastname,password,type='STUDENT',idPromo";
								} else 
									$data["retour"] = ajouterEtudiant($firstname, $lastname, $password, $idPromo);
							} else if( $type == "TEACHER") {
								$data["retour"] = ajouterEnseignent($firstname, $lastname,$password);
							} else {
								$data["feedback"] = "Entrez le type entre STUDENT et TEACHER";
							}
						} else {
							$data["feedback"] = "Cette utilisateur existe déjà";
						}
						
					}
				break;

				case 'getTeacherById':
					if(($idTeacher = valider("idTeacher"))) {
						$result = isTeacher($idTeacher);
						if(sizeof($result) == 1) {
							$data["retour"] = getTeacherById($idTeacher);
						} else
							$data["feedback"] = "Cet utilisateur n'est pas un enseignant";						
					} else
						$data["feedback"] = "Entrez idTeacher";
				break;

				case 'isLost':
					if(($idUser = valider("idUser")) && ($idSeance = valider("idSeance"))) {
						$data["retour"] = isLost($idUser, $idSeance);
					} else
						$data["feedback"] = "Entrez idUser, idSeance";
				break;

				case 'setLost':
					if(($idUser = valider("idUser")) && ($idSeance = valider("idSeance"))) {
						$data["retour"] = setLost($idUser, $idSeance);
					} else
						$data["feedback"] = "Entrez idUser, idSeance";
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

				case 'getModule':
					$data["retour"] = getModule();
				break;


				case 'getModuleById':
					if(($idModule = valider("idModule"))) {
						$data["retour"] = getModuleById($idModule);
					} else
						$data["feedback"] = "Entrez idModule";
				break;

				case 'getTD' :
					if(($idPromo = valider("idPromo"))) {
						$data["retour"] = getTD($idPromo);
					} else
						$data["feedback"] = "Entrez idPromo";
					
				break;

				case 'getTP' :
					if(($idTD = valider("idTD"))) {
						$data["retour"] = getTP($idTD);
					} else
						$data["feedback"] = "Entrez idTD";
				break;

				//Action sur Séance
				case 'addSeance' :
					if(($idModule = valider("idModule")) && ($idTeacher = valider("idTeacher")) && ($idPromo = valider("idPromo")) 
							&& ($dayTime = valider("dayTime")) && ($room = valider("room"))) {
						$data["retour"] = ajouterSeance($idModule, $idTeacher, $idPromo, $dayTime, $room);
					} else
						$data["feedback"] = "Entrez idModule, idTeacher, idPromo, dayTime, room";
				break;

				case 'getAllSeance' : 
					if(($idUser = valider("idUser")))
						$data["seances"] = getAllSeance($idUser);
					else
						$data["feedback"] = "Entrez idUser";
				break;

				case 'getSeanceById' :
					if(($idUser = valider("idUser")) && ($idSeance = valider("idSeance"))) {
						$data["info"] = getInfoBySeance($idSeance);
						$result = isStudent($idUser);
						if(sizeof($result) == 1) {
							$data["seance"] = getContentBySeanceForStudent($idSeance, $idUser);
						} else
							$data["seance"] = getContentBySeance($idSeance);						
						$data["homework"] = getHomeWorkBySeance($idSeance);
						$data["note"] = getNoteBySeance($idUser, $idSeance);
					} else
						$data["feedback"] = "Entrez idUser, idSeance";
				break;

				case 'updateSeance': 
					if(($idSeance = valider("idSeance")) && ($idTeacher = valider("idTeacher")) && ($dayTime = valider("dayTime")) 
							&& ($room = valider("room"))) {
						$data["retour"] = updateSeance($idSeance, $idTeacher, $dayTime, $room);
					} else
						$data["feedback"] = "Entrez idSeance, idTeacher, dayTime, room";
				break;

				case 'deleteSeance': 
					if(($idSeance = valider("idSeance")) && ($idUser = valider("idUser"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							deleteSeance($idSeance, $idUser);
						} else
							$data["feedback"] = "Seule un enseignant peut supprimer une seance";
					} else
						$data["feedback"] = "Entrez idSeance, idUser";
				break;

				//Action sur les devoirs
				case 'getHomeWorkByUser' :
					if(($idUser = valider("idUser"))) {
						$result = isStudent($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = getHomeWorkByUser($idUser);
						} else {
							$data["feedback"] = "Seule un étudiant a des devoirs";
						}
					} else
						$data["feedback"] = "Entrez idUser";
				break;

				case 'getHomeWorkById' :
					if(($idHomeWork = valider("idHomeWork")) && ($idUser = valider("idUser"))) {
						$data["retour"] = getHomeWorkById($idHomeWork, $idUser);
					} else
						$data["feedback"] = "Entrez idHomeWork, idUser";
				break;
				
				

				//Action sur Tache
				case 'getTacheById':
					if(($idTache = valider("idTache"))) {
						$data["tache"] = getTacheById($idTache);
						$date["question"] = getQuestionFromTache($idTache);
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
					if(($idTache = valider("idTache")) && ($idUser = valider("idUser")) && ($titre = valider("titre")) && ($description = valider("description"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = updateTache($idTache, $titre, $description);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier une tache";
					} else
						$data["feedback"] = "Entrez idTache, idUser, titre, description";
				break;

				case 'deleteTache': 
					if(($idTache = valider("idTache")) && ($idUser = valider("idUser"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							deleteTache($idTache);
						} else
							$data["feedback"] = "Seule un enseignant peut supprimer une tache";
					} else
						$data["feedback"] = "Entrez idSeance, idUser";
				break;

				case 'realizedTache':
					if(($idTache = valider("idTache")) && ($idStudent = valider("idStudent")) && ($realized = valider("realized")) != NULL) {
						$result = isStudent($idStudent);
						if(sizeof($result) == 1) {
							$data["retour"] = validTache($idTache, $idStudent, $realized);
						} else
							$data["feedback"] = "Seule les étudiant peuvent valider une tâche";
					} else
						$data["feedback"] = "Entrez idTache, idStudent, realized";
				break;

				case 'setTacheVisible':
					if(($idUser = valider("idUser")) && ($idTache = valider("idTache")) && ($isVisible = valider("isVisible")) != NULL) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = setTacheVisible($idTache, $isVisible);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier la visibilite";
					} else
						$data["feedback"] = "Entrez idUser, idQuestion, isVisible";
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
					if(($idQuestion = valider("idQuestion")) && ($idUser = valider("idUser")) && ($answer = valider("answer"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = setAnswerToTacheQuestion($idQuestion, $answer);
						} else
							$data["feedback"] = "Seule un enseignant peuvent répondre";
					} else
						$data["feedback"] = "Entrez idUser, idQuestion";
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
					if(($idSeance = valider("idSeance")) && ($description = valider("description"))) {
						$data["retour"] = addQuestion($idSeance, $description);
					} else
						$data["feedback"] = "Entrez idSeance, description";
				break;

				case 'updateQuestion':
					if(($idQuestion = valider("idQuestion")) && ($idUser = valider("idUser")) && ($description = valider("description"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = updateQuestion($idQuestion, $description);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier une question";
					} else
						$data["feedback"] = "Entrez idQuestion, idUser, description";
				break;

				case 'deleteQuestion': 
					if(($idQuestion = valider("idQuestion")) && ($idUser = valider("idUser"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							deleteQuestion($idQuestion);
						} else
							$data["feedback"] = "Seule un enseignant peut supprimer une question";
					} else
						$data["feedback"] = "Entrez idQuestion, idUser";
				break;

				case 'answerQuestion':
					if(($idQuestion = valider("idQuestion")) && ($idUser = valider("idUser")) && ($answer = valider("answer"))) {
						$result = isStudent($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = addAnswerToQuestion($idUser, $idQuestion, $answer);
						} else
							$data["feedback"] = "Seule les étudiant peuvent répondre";
					} else
						$data["feedback"] = "Entrez idUser, idQuestion";
				break;

				case 'setQuestionVisible':
					if(($idUser = valider("idUser")) && ($idQuestion = valider("idQuestion")) && ($isVisible = valider("isVisible")) != NULL) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = setQuestionVisible($idQuestion, $isVisible);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier la visibilite";
					} else
						$data["feedback"] = "Entrez idUser, idQuestion, isVisible";
				break;

				//Action sur Devoir
				case 'addHomeWork':
					if(($idSeance = valider("idSeance")) && ($idUser = valider("idUser")) && ($titre = valider("titre")) 
							&& ($description = valider("description")) && ($dueDate = valider("dueDate")) ) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = addHomeWork($idSeance, $titre, $description, $dueDate);
						} else
							$data["feedback"] = "Seule un enseignant peut ajouter un devoir";
					} else
						$data["feedback"] = "Entrez idSeance, idUser, titre, description, dueDate";
				break;

				case 'updateHomeWork':
					if(($idHomeWork = valider("idHomeWork")) && ($idUser = valider("idUser")) && ($titre = valider("titre")) && ($description = valider("description"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = updateHomeWork($idHomeWork, $titre, $description);
						} else
							$data["feedback"] = "Seule un enseignant peut modifier un devoir";
					} else
						$data["feedback"] = "Entrez idHomeWork, idUser, titre, description";
				break;

				case 'deleteHomeWork': 
					if(($idHomeWork = valider("idHomeWork")) && ($idUser = valider("idUser"))) {
						$result = isTeacher($idUser);
						if(sizeof($result) == 1) {
							deleteHomeWork($idHomeWork);
						} else
							$data["feedback"] = "Seule un enseignant peut supprimer un devoir";
					} else
						$data["feedback"] = "Entrez idHomeWork, idUser";
				break;

				case 'realizedHomeWork':
					if(($idHomeWork = valider("idHomeWork")) && ($idUser = valider("idUser")) && ($realized = valider("realized")) != NULL) {
						$result = isStudent($idUser);
						if(sizeof($result) == 1) {
							$data["retour"] = validHomeWork($idHomeWork, $idUser, $realized);
						} else
							$data["feedback"] = "Seule un étudient peut réaliser un devoir";
					} else
						$data["feedback"] = "Entrez idHomeWork, idUser, realized";
				break;

				//Action sur Note
				case 'addNote':
					if(($idSeance = valider("idSeance")) && ($idUser = valider("idUser")) && ($description = valider("description")) != NULL) {
						$data["retour"] = addNote($idSeance, $idUser, $description);
					} else
						$data["feedback"] = "Entrez idSeance, idUser, description";
				break;

				case 'updateNote':
					if(($idNote = valider("idNote")) && ($idUser = valider("idUser")) && ($description = valider("description")) != NULL) {
						$data["retour"] = updateNote($idNote, $idUser, $description);
					} else
						$data["feedback"] = "Entrez idSeance, idUser, description";
				break;

				case 'deleteNote': 
					if(($idNote = valider("idNote")) && ($idUser = valider("idUser"))) {
						deleteNote($idNote, $idUser);
					} else
						$data["feedback"] = "Entrez idNote, idUser";
				break;

				default:
					$data["feedback"] = "Cette action n'existe pas";
				break;
		}
	
	}

	echo json_encode($data);
?>










