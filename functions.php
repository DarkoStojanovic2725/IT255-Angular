<?php
include("config.php");
 
 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
     die();
}
 
function checkIfLoggedIn(){
    global $conn;
    if(isset($_SERVER['HTTP_TOKEN'])){
        $token = $_SERVER['HTTP_TOKEN'];
        $result = $conn->prepare("SELECT * FROM korisnik WHERE token=?");
        $result->bind_param("s",$token);
        $result->execute();
        $result->store_result();
        $num_rows = $result->num_rows;
        if($num_rows > 0)
        {
            return true;
        }
        else{   
            return false;
        }
    }
    else{
        return false;
    }
}
 
function login($username, $password){
    global $conn;
    $rarray = array();
    if(checkLogin($username,$password)){
        $id = sha1(uniqid());
        $result2 = $conn->prepare("UPDATE korisnik SET token=? WHERE username=?");
        $result2->bind_param("ss",$id,$username);
        $result2->execute();
        $rarray['token'] = $id;
    } else{
        header('HTTP/1.1 401 Unauthorized');
        $rarray['error'] = "Invalid username/password";
    }
    return json_encode($rarray);
}
 
function checkLogin($username, $password){
    global $conn;
    $password = md5($password);
    $result = $conn->prepare("SELECT * FROM korisnik WHERE username=? AND password=?");
    $result->bind_param("ss",$username,$password);
    $result->execute();
    $result->store_result();
    $num_rows = $result->num_rows;
    if($num_rows > 0)
    {
        return true;
    }
    else{   
        return false;
    }
}
 
function register($username, $password, $firstname, $lastname){
    global $conn;
    $rarray = array();
    $errors = "";
    if(checkIfUserExists($username)){
        $errors .= "Username already exists\r\n";
    }
    if(strlen($username) < 3 || $username == ""){
        $errors .= "Username must have at least 3 characters and cannot be empty\r\n";
    }
    if(strlen($password) < 3 || $password == ""){
        $errors .= "Password must have at least 3 characters and cannot be empty\r\n";
    }
    if(strlen($firstname) < 3 || $firstname == ""){
        $errors .= "First name must have at least 3 characters and cannot be empty\r\n";
    }
    if(strlen($lastname) < 3 || $lastname == ""){
        $errors .= "Last name must have at least 3 characters and cannot be empty\r\n";
    }
    if($errors == ""){
        $stmt = $conn->prepare("INSERT INTO korisnik (ime, prezime, username, password) VALUES (?, ?, ?, ?)");
        $password =md5($password);
        $stmt->bind_param("ssss", $firstname, $lastname, $username, $password);
        if($stmt->execute()){
            $id = sha1(uniqid());
            $result2 = $conn->prepare("UPDATE korisnik SET token=? WHERE username=?");
            $result2->bind_param("ss",$id,$username);
            $result2->execute();
            $rarray['token'] = $id;
        }else{
            header('HTTP/1.1 400 Bad request');
            $rarray['error'] = "Database connection error";
        }
    } else{
        header('HTTP/1.1 400 Bad request');
        $rarray['error'] = json_encode($errors);
    }
    
    return json_encode($rarray);
}
 
function checkIfUserExists($username){
    global $conn;
    $result = $conn->prepare("SELECT * FROM korisnik WHERE username=?");
    $result->bind_param("s",$username);
    $result->execute();
    $result->store_result();
    $num_rows = $result->num_rows;
    if($num_rows > 0)
    {
        return true;
    }
    else{   
        return false;
    }
}
function addMembers($ime, $prezime){
    global $conn;
    $rarray = array();
    if(checkIfLoggedIn()){
		$stmt = $conn->prepare("INSERT INTO members(ime, prezime)VALUES(?, ?)");
		$stmt->bind_param ("ss", $ime, $prezime);
        if($stmt->execute()){
            $rarray['success'] = "ok";
        }else{
            $rarray['error'] = "Database connection error";
       }
    } else{
        $rarray['error'] = "Please log in";
        header('HTTP/1.1 401 Unauthorized');
    }
    return json_encode($rarray);
}

function deleteMember($id){
    global $conn;
    $rarray = array();
    if(checkIfLoggedIn()){
        $result = $conn->prepare("DELETE FROM members WHERE id=?");
        $result->bind_param("i",$id);
        $result->execute();
        $rarray['success'] = "ok";
    } else{
        $rarray['error'] = "Please log in";
        header('HTTP/1.1 401 Unauthorized');
    }
    return json_encode($rarray);
}

function getAllMembers(){
	global $conn;
	$member = "SELECT * FROM members";
	if($stmt = $conn->prepare($member)){
    	$stmt->execute();
		if(!$stmt->execute()){ 
        	echo $stmt->error.' in query: '.$userinfo; 
		} else {
        	$parameters = array();
        	$result = $stmt->get_result();
        	while ($row = $result->fetch_assoc()) {
          		array_push($parameters,$row);
        	}
        	$stmt->close(); 
        	return $parameters;
    	}
    	$stmt->close();
  	}
}

function editMember($id, $ime,$prezime){
    global $conn;
    $rarray = array();
    if(checkIfLoggedIn()){
		$stmt = $conn->prepare("UPDATE members SET ime=?, prezime=? WHERE id=?");
		$stmt->bind_param("ssi", $ime, $prezime, $id);
        if($stmt->execute()){
            $rarray['success'] = "ok";
        }else{
            $rarray['error'] = "Database connection error";
        }
    } else{
        $rarray['error'] = "Please log in";
        header('HTTP/1.1 401 Unauthorized');
    }
    return json_encode($rarray);
}
?>