<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale=1, maximum-scale=1" />
	<meta name="viewport" content="width=device-width" />
	<title>Subscribe</title>
</head>

<body>

<?php
	$email_to = "info@vyavsaay.com";
	$email = $_POST["input-email"];
	$text = "Email: $email";
	$headers = "MIME-Version: 1.0" . "\r\n"; 
	$headers .= "Content-type:text/html; charset=utf-8" . "\r\n"; 
	$headers .= "From: <$email>" . "\r\n";
	$mail_status=mail($email_to, "VyavsaayNewsLetter", $text, $headers);
?>

</body>
</html>