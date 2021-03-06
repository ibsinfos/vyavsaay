<?php
	
namespace RetailingEssentials;
include_once "../Classes/db.php";
use RetailingEssentials\db_connect;
use \DOMDocument;

class user_setup
{
	private $conn=null;
 	private $dbname="";
 	
	public function __construct($username)
	{
		$this->dbname="re_user_".$username;
		$this->conn=new db_connect(0);
		$this->create_database();
		unset($this->conn);
		$this->conn=new db_connect($this->dbname);
		$this->setup();
		$this->get_data_from_xml('master_db_data.xml');
		$this->get_data_from_xml('user_db_data.xml');
		$this->get_data_from_xml('user_demo_data.xml');
		$this->get_data_from_json('grids.json');
		$this->get_data_from_json('newsletter_components.json');
		$this->get_data_from_json('search.json');
		$this->get_data_from_js('grid_metrics.js','system_grid_metrics');
		$this->get_data_from_js('notifications.js','system_notifications');
		$this->get_data_from_js('static_modals.php','system_popboxes');
	}

	public function __destruct()
	{
		unset($this->conn);
	}
	
	private function create_database()
	{
		$sql_create_db="create database ".$this->dbname;
		
		try{
			$this->conn->conn->exec($sql_create_db);
		}catch(PDOException $ex)
		{
			echo "Could not create database ".$this->dbname." ". $ex->getMessage()."</br>";
		}
	}
	
	private function setup()
	{
		$db_schema_xml=new \DOMDocument();
		$db_schema_xml->load("../db/db_schema.xml");
		$db_schema=$db_schema_xml->documentElement;
		
		
		foreach($db_schema->childNodes as $table)
		{		
			$table_name=$table->nodeName;
			if($table_name!='#text')
			{
				$q_string="create table $table_name (";
				
				foreach($table->childNodes as $column)
				{
					if($column->nodeName!='#text' && $column->nodeName!='#comment')
						$q_string.=$column->nodeName." ".$column->getAttribute('type')." ,";
				}
				$q_string.="PRIMARY KEY (id));";
				
				try{
					$this->conn->conn->exec($q_string);
				}catch(PDOException $ex)
				{
					echo "Could not create table $table_name: " .$ex->getMessage() ."<br>";
				}
			}
		}
	}
	
	
	public function get_data_from_xml($filename)
	{
		$db_schema_xml=new \DOMDocument();
		$db_schema_xml->load("../db/".$filename);
		$db_schema=$db_schema_xml->documentElement;
		
		foreach($db_schema->childNodes as $table)
		{
			$table_name=$table->nodeName;
			if($table_name!='#text')
			{
				foreach($table->childNodes as $row)
				{
					$data_array=Array();
					$q_string="insert into $table_name(";
					
					if($row->nodeName!='#text')
					{		
						foreach($row->childNodes as $column)
						{
							if($column->nodeName!='#text' && $column->nodeName!='#comment')
							{
								$q_string.=$column->nodeName.",";
							}
						}
							
						$q_string=rtrim($q_string,",");
						$q_string.=") values(";
						foreach($row->childNodes as $column)
						{
							if($column->nodeName!='#text' && $column->nodeName!='#comment')
							{
								$q_string.="?,";
								$data_array[]=$column->nodeValue;
							}
						}
						$q_string=rtrim($q_string,",");
						$q_string.=");";
			
						try{
							$stmt=$this->conn->conn->prepare($q_string);
							$stmt->execute($data_array);
						}catch(PDOException $ex)
						{
							echo "Could not setup table $table_name: " .$ex->getMessage() ."</br>";
						}
						//echo "data added to master table";
					}
				}
			}
		}
	}
	
	public function get_data_from_json($filename)
	{
		$file_json=file_get_contents("../db/".$filename);
		$file = json_decode($file_json, true);
		$parent_json=$file['re_xml'];
		
		foreach ($parent_json as $table_name => $table)
	    {
			foreach ($table as $row_num => $row)
		    {
				$data_array=Array();
				$q_string="insert into $table_name(";
				
						
				foreach ($row as $column_name => $col_value)
	    		{
					$q_string.=$column_name.",";
				}
					
				$q_string=rtrim($q_string,",");
				$q_string.=") values(";
				foreach ($row as $column_name => $col_value)
	    		{
						$q_string.="?,";
						$data_array[]=$col_value;
				}
				$q_string=rtrim($q_string,",");
				$q_string.=");";
	
				try
				{
					$stmt=$this->conn->conn->prepare($q_string);
					$stmt->execute($data_array);
				}
				catch(PDOException $ex)
				{
					echo "Could not setup table $table_name: " .$ex->getMessage() ."</br>";
				}
			}
		}
	}
	
	function get_data_from_js($filename,$table_name)
	{
		$js_file=file_get_contents("../db/".$filename);
		$grids_array = explode('/***function limiter***/',$js_file);
		
		foreach($grids_array as $i => $grid_string)
	    {
	    	$grid_string=str_replace("\n","",$grid_string);
	    	$grid_string=str_replace("\t","",$grid_string);
	    	$grid_string=str_replace("/*","",$grid_string);
	    	$grid_string=str_replace("*/","",$grid_string);
	    	$grid_object_array=explode('*@*',$grid_string);

			$data_array=Array();
			$q_string="insert into ".$table_name."(";
					
			foreach ($grid_object_array as $x => $col_value)
    		{
    			$col_array=explode('*:*',$col_value);
				$q_string.=$col_array[0].",";
				$data_array[]=$col_array[1];
			}

			$q_string=rtrim($q_string,",");
			$q_string.=") values(";
			foreach ($grid_object_array as $x => $col_value)
    		{
					$q_string.="?,";
			}
			$q_string=rtrim($q_string,",");
			$q_string.=");";

			try
			{
				$stmt=$this->conn->conn->prepare($q_string);
				$stmt->execute($data_array);
			}
			catch(PDOException $ex)
			{
				echo "Could not setup table $table_name: " .$ex->getMessage() ."</br>";
			}
			
		}
	}	
}

class master_setup
{
	private $conn=null;
	 
	public function __construct()
	{
		$this->conn=new db_connect(0);
		$this->setup_json();
	}

	public function __destruct()
	{
		unset($this->conn);
	}

	private function setup_xml()
	{
		//////////reading xml schema of the database
		$db_schema_xml=new \DOMDocument();
		$db_schema_xml->load("../db/master_db_schema.xml");
		$db_schema=$db_schema_xml->documentElement;
		
		foreach($db_schema->childNodes as $table)
		{
			$table_name=$table->nodeName;
			if($table_name!='#text')
			{
				$q_string="create table $table_name (";
					
				foreach($table->childNodes as $column)
				{
					if($column->nodeName!='#text' && $column->nodeName!='#comment')
						$q_string.=$column->nodeName." ".$column->getAttribute('type')." ,";
				}
				$q_string.="PRIMARY KEY (id));";
					
				try{
					$this->conn->conn->exec($q_string);
				}catch(PDOException $ex)
				{
					echo "Could not create table $table_name: " .$ex->getMessage() ."</br>";
				}
				echo "Table $table_name created successfully</br>";
			}
		}
	}
	
	private function setup_json()
	{
		$file_json=file_get_contents("../db/master_db_schema.json");
		$file = json_decode($file_json, true);
		$parent_json=$file['re_xml'];
		
		foreach ($parent_json as $table_name => $table)
	    {
			$q_string="create table $table_name (";
				
			foreach ($table as $column_name => $column)
			{
				$q_string.=$column_name." ".$column['type']." ,";
			}
			$q_string.="PRIMARY KEY (id));";
				
			try{
				$this->conn->conn->exec($q_string);
			}catch(PDOException $ex)
			{
				echo "Could not create table $table_name: " .$ex->getMessage() ."</br>";
			}
			echo "Table $table_name created successfully</br>";			
		}
	}
}

?>