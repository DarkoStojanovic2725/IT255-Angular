<?php
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Methods: GET');
	header("Content-type: application/json");
	include("functions.php");
	$return = getAllMembers();
	echo json_encode($return)
?>