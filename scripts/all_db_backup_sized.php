<?php

/**
* No parameters required
*/

	session_start();

	include_once "../Classes/S3.php";
	include_once '../Classes/config.php';
	require_once '../Classes/vUtil.php';
	include_once "../Classes/vDB.php";
	use RetailingEssentials\vDB;
	use RetailingEssentials\vUtil;
	use RetailingEssentials\config;

	if(vUtil::isMasterSession())
	{
		$config = config::getInstance();
		$dbhost = $config->get("host");
		$dbuser = $config->get("user");
		$dbpass = $config->get("password");
		$awsAccessKey=$config->get("backupAwsAccessKey");
		$awsSecretKey=$config->get("backupAwsSecretKey");

		$info_conn=new vDB('information_schema');
		$get_query="select distinct table_schema from information_schema.columns where table_schema like ?";
		$get_res=$info_conn->dbSelect($get_query,array('%re_user%'));

		$bucketName="vyavsaay-backup";
		$mime = "application/octet-stream";

		$s3 = new S3($awsAccessKey, $awsSecretKey);
		$time = time();

		for($i=0;$i<count($get_res);$i++)
		{
			$dbname=$get_res[$i]['table_schema'];

			$command = "mysqldump --opt -h $dbhost -u $dbuser -p$dbpass $dbname";

			$backup_command = "mysqldump --opt -h $dbhost -u $dbuser -p$dbpass $dbname > dummy/$dbname.sql";
            exec($backup_command);

            $split_command = "split -d -b 10m dummy/$dbname.sql dummy/$dbname";
            exec($split_command);

            $delete_command = "rm dummy/$dbname.sql";
            exec($delete_command);

            $files=scandir('dummy');
            foreach($files as $file)
            {
                if(preg_match("/".$dbname."/",$file))
                {
                    $file_data = file_get_contents("dummy/".$file);
                    if($s3->putObject($file_data,$bucketName,$time."_".$file,S3::ACL_PUBLIC_READ,array(),array('Content-Type' => $mime)))
                    {
                        echo "backed up ".$time."_".$file;
                    }
                    $file_delete_command = "rm dummy/$file";
                    exec($file_delete_command);
                }
            }
		}
	}
	else
	{
		echo "You don't have permissions to perform this operation.";
	}
?>
