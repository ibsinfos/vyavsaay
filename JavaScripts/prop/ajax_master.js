/**
 * json attributes for read queries
 * comapre: lowerbound,upperbound
 * array: yes
 * exact: yes
 * count: <integer>
 * batch_size: <integer>
 */

function server_read_json_rows_master(columns,callback)
{
	var domain=get_domain();
	var username=get_username();
	var re_access=get_session_var('re');
	
	if(typeof columns.batch_size!='undefined')
	{
		columns.count=columns.batch_size;
	}

	var string_columns=JSON.stringify(columns);
	ajax_json("./ajax_json/get_master_rows.php",{domain:domain,username:username,re:re_access,data:string_columns},function(response_object)
	{
		callback(response_object.rows);		
	});
}

function server_read_json_column_master(columns,callback)
{
	var domain=get_domain();
	var username=get_username();
	var re_access=get_session_var('re');
	var string_columns=JSON.stringify(columns);
	
	ajax_json("./ajax_json/get_master_single_column.php",{domain:domain,username:username,re:re_access,data:string_columns},function(response_object)
	{
		callback(response_object.rows);
	});
}

function server_read_json_count_master(columns,callback)
{
	var domain=get_domain();
	var username=get_username();
	var re_access=get_session_var('re');
	
	var string_columns=JSON.stringify(columns);
	ajax_json("./ajax_json/get_master_count.php",{domain:domain,username:username,re:re_access,data:string_columns},function(response_object)
	{
		callback(response_object.count);
	});
}

/**
 * this function delete a row of data from the server database
 * @param data_xml
 */
function server_delete_master(columns)
{
	var domain=get_domain();
	var username=get_username();
	var del_access=get_session_var('del');
	var string_columns=JSON.stringify(columns);
	ajax_json("./ajax_json/delete_master.php",{domain:domain,username:username,del:del_access,data:string_columns},function(response_object)
	{
		console.log(response_object.status);
	});
}

function server_create_master(columns)
{
	var domain=get_domain();
	var username=get_username();
	var cr_access=get_session_var('cr');
	var string_columns=JSON.stringify(columns);
	
	ajax_json("./ajax_json/create_master.php",{domain:domain,username:username,cr:cr_access,data:string_columns},function(response_object)
	{
		if(response_object.status=='duplicate record')
		{
			$("#modal5").dialog("open");
		}
	});
}

function server_update_master(columns)
{
	var domain=get_domain();
	var username=get_username();
	var up_access=get_session_var('up');
	var string_columns=JSON.stringify(columns);
	
	ajax_json("./ajax_json/update_master.php",{domain:domain,username:username,up:up_access,data:string_columns},function(response_object)
	{
		console.log(response_object.status);
	});
}
