<?php

	include_once "../Classes/db.php";
	use RetailingEssentials\db_connect;
	
	$status="failed_registration";
	
	$username=$_POST['userid'];
	$email=$_POST['email'];
	$name=$_POST['name'];
	$pass=$_POST['pass'];
	$industry=$_POST['industry'];
	$phone=$_POST['phone'];
	
	$salt=$username."1234567891234567891234";
	$salt_22=substr($salt,0,22);
	$pass_options=['salt'=> $salt_22];
	$pass_hash=password_hash($pass,PASSWORD_DEFAULT,$pass_options);
	
	$conn=new db_connect(0);
	
	$stmt=$conn->conn->prepare("insert into user_profile (username,email,name,phone,status,dbname,industry) values(?,?,?,?,?,?,?)");
	$stmt->execute(array($username,$email,$name,$phone,'active','re_user_'.$username,$industry));	
	$id_user=$conn->conn->lastInsertId();
	
	$status="successful";
	
	try
	{
		$conn2=new db_connect("re_user_".$username);

		set_user_preferences($conn2,$industry);
		set_user_profiles($conn2,$pass_hash,$name,$email,$phone);
		
	}catch(PDOException $ex)
	{
		$status="failed_registration";
		echo $ex->getMessage();
	}
			
	echo $status;

	function set_user_preferences($conn2,$industry)
	{
		$stmt1=$conn2->conn->prepare("insert into user_preferences (name,display_name,status,value,type,last_updated) values(?,?,?,?,?,?)");
		$stmt1->execute(array('industry','industry','active',$industry,'other',1000*time()));
	}
	
	function set_user_profiles($conn2,$pass_hash,$name,$email,$phone)
	{
		$stmt2=$conn2->conn->prepare("insert into staff (username,password,name,status,email,phone,acc_name,last_updated) values(?,?,?,?,?,?,?,?)");
		$stmt2->execute(array('master',$pass_hash,$name,'active',$email,$phone,$name." (".$phone.")",1000*time()));
	}

?>