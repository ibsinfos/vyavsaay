/**
 * xml attributes for read queries
 * comapre: more than,less than, not equal, equal
 * array: yes
 * exact: yes
 * sort: asc,desc
 * count: <integer>
 * start_index: <integer>
 */

/**
 * This function creates a new table in the local database
 * @param db_name name of the local database
 * @param func function to be executed on success
 */
function create_local_db(domain,func)
{
	//console.log("2.1");
	if("indexedDB" in window)
	{
		//console.log("2.2");
		var db_name="re_local_"+domain;
		ajax_with_custom_func("./db/db_schema.xml","",function(e)
		{
			//console.log("2.3");
			var request = indexedDB.open(db_name,2);
		
			request.onsuccess=function(e)
			{
				//console.log("2.4");
				db=e.target.result;
				db.close();
				func();
			};
			
			request.onerror=function(ev)
			{
				alert('Could not switch to offline mode. Please refresh your browser and try again.');
			};
				
			request.onupgradeneeded=function(ev)
			{
				//console.log("2.6");
				db=ev.target.result;
				var tables=e.responseXML.childNodes[0].childNodes;
				
				for(var k=0;k<tables.length;k++)
				{
					if(tables[k].nodeName!="" && tables[k].nodeName!="#text" && tables[k].nodeName!="#comment")
					{	
						table=db.createObjectStore(tables[k].nodeName,{keyPath:'id'});
					
						for(var i=0;i<tables[k].childNodes.length;i++)
						{	
							if(tables[k].childNodes[i].nodeName!="" && tables[k].childNodes[i].nodeName!="#text" && tables[k].childNodes[i].nodeName!="#comment")
							{	
								//console.log(tables[k].childNodes[i].nodeName);
								var indexing=tables[k].childNodes[i].getAttribute('index');
								if(indexing=='yes')
								{
									table.createIndex(tables[k].childNodes[i].nodeName,tables[k].childNodes[i].nodeName);
								}
							}		
						}
					}
				}			
			};
		});
	}
	else
	{
		alert('Offline mode is not supported in your browser. Please update your browser.');
	}
};


/**
 * This function executes a simple read access on local database
 * @param table table name that is to be accessed
 * @param column name of the column to be referenced
 * @param results data to be passed on to the callback function
 * @param callback function to be executed on successful access
 */
function local_read_single_column(columns,callback,results)
{
	//console.log(columns);
	localdb_open_requests+=1;
	var parser=new DOMParser();
	var data=parser.parseFromString(columns,"text/xml");
	var table=data.childNodes[0].nodeName;
	var cols=data.childNodes[0].childNodes;
	var count=0;
	if(data.childNodes[0].hasAttribute('count'))
	{
		count=parseInt(data.childNodes[0].getAttribute('count'));
	}
	var sort_index='id';
	var sort_order='desc';
	var filter=new Array();
	for(var j=0; j<cols.length;j++)
	{
		if(cols[j].innerHTML!=null && cols[j].hasAttribute('sort'))
		{
			sort_index=cols[j].nodeName;
			sort_order=cols[j].getAttribute('sort');
		}
		
		if(cols[j].innerHTML!=null && cols[j].innerHTML!="")
		{
			var fil=new Object();
			fil.name=cols[j].nodeName;
			if(cols[j].hasAttribute('compare'))
			{
				fil.value=parseInt(cols[j].innerHTML);
				fil.type=cols[j].getAttribute('compare');
			}
			else if(cols[j].hasAttribute('array'))
			{
				fil.value=cols[j].innerHTML;
				fil.type='array';
			}
			else if(cols[j].hasAttribute('exact'))
			{
				fil.value=cols[j].innerHTML;
				fil.type='exact';
			}
			else
			{
				fil.value=cols[j].innerHTML;
				fil.type='';
			}
			filter.push(fil);
		}
	}
	//console.log(filter);
	var domain=get_domain();
	var db_name="re_local_"+domain;
	sklad.open(db_name,{version:2},function (err,database)
	{
		var options={direction:sklad.DESC};
		database.get(table,options,function(err,records_object)
		{
			var records=[];
			for(var a in records_object)
			{
				records.push(records_object[a]);
			}
			if(sort_index!='id')
			{
				if(sort_order!='asc')
				{
					records.sort(function(a,b)
					{
						if(parseFloat(a[sort_index])<parseFloat(b[sort_index]))
							return 1;
						else
							return -1;
					});
				}
				else
				{
					records.sort(function(a,b)
					{
						if(parseFloat(a[sort_index])>parseFloat(b[sort_index]))
							return 1;
						else
							return -1;
					});
				}
			}

			for(var row=0;row<records.length;row++)
			{
				var match=true;
				for(var i=0;i<filter.length;i++)
				{
					var string=records[row][filter[i].name].toString().toLowerCase();
					var search=filter[i].value.toString().toLowerCase();
					var found=0;
					
					if(filter[i].type=='')
					{
						found=string.search(search);
					}
					else if(filter[i].type=='exact')
					{
						if(search!==string)
						{
							match=false;
							break;
						}
					}
					else if(filter[i].type=='array')
					{
						found=search.search("-"+string+"-");
					}
					if(filter[i].type=='less than') 
					{
						if(parseInt(records[row][filter[i].name])>=filter[i].value)
						{
							match=false;
							break;
						}
					}
					else if(filter[i].type=='more than') 
					{
						if(parseInt(records[row][filter[i].name])<=filter[i].value)
						{
							match=false;
							break;
						}
					}
					else if(filter[i].type=='equal') 
					{
						if(parseInt(records[row][filter[i].name])!=filter[i].value)
						{
							match=false;
							break;
						}
					}
					else if(filter[i].type=='not equal') 
					{
						if(parseInt(records[row][filter[i].name])==filter[i].value)
						{
							match=false;
							break;
						}
					}

					if(found===-1)
					{
						match=false;
						break;
					}
				}
				
				if(match===true)
				{
					results.push(records[row][cols[0].nodeName]);
					if(results.length==count)
					{
						break;
					}
				}
			}
			localdb_open_requests-=1;
			callback(results);
		});		
	});
};

/**
 * this function save a row of record to local db
 * @param data_xml
 * @param activity_xml
 * @returns
 */
function local_update_row(data_xml,activity_xml)
{
	localdb_open_requests+=1;
	
	var parser=new DOMParser();
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;
	var data_id=data.childNodes[0].getElementsByTagName('id')[0].innerHTML;
	var cols=data.childNodes[0].childNodes;

	var activity=parser.parseFromString(activity_xml,"text/xml");
	var activity_data=activity.childNodes[0].childNodes;
	
	var domain=get_domain();
	var db_name="re_local_"+domain;
	
	sklad.open(db_name,{version:2},function(err,database)
	{
		//console.log("unique length is zero");
		database.get(table,{range: IDBKeyRange.only(data_id)},function(err,records)
		{
			var data_row=new Object();
			var type="";
			for(var i in records)
			{
				type='update';
				data_row=records[i];
				break;
			}
				
			for(var j=0;j<cols.length;j++)
			{
				data_row[cols[j].nodeName]=cols[j].innerHTML;
			}
			database.upsert(table,data_row,function(err,insertedkey)
			{
				var act_row={id:get_new_key(),
						type:type,
						status:'unsynced',
						data_xml:data_xml,
						user_display:'yes',
						last_updated:get_my_time()};

				//console.log(act_row);
				for(var k=0;k<activity_data.length;k++)
				{
					act_row[activity_data[k].nodeName]=activity_data[k].innerHTML;
				}
				//console.log(act_row);
				//console.log("activities length="+activity_data.length);
				database.upsert('activities',act_row,function(err,insertedkey)
				{
					localdb_open_requests-=1;
				});	
			});
		});			
	});
}

/**
 * this function save a row of record to local db
 * @param data_xml
 * @param activity_xml
 * @returns
 */
function local_update_simple(data_xml)
{
	localdb_open_requests+=1;
	var parser=new DOMParser();
	//data_xml=data_xml.replace(/[\x{0009}\x{000a}\x{000d}\x{0020}\x{D7FF}\x{E000}\x{FFFD}]/g," ");
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;
	var data_id=data.childNodes[0].getElementsByTagName('id')[0].innerHTML;
	var cols=data.childNodes[0].childNodes;
	
	var domain=get_domain();
	var db_name="re_local_"+domain;
	
	sklad.open(db_name,{version:2},function(err,database)
	{
		database.get(table,{range: IDBKeyRange.only(data_id)},function(err,records)
		{
			var data_row=new Object();
			var type="";
			for(var i in records)
			{
				type='update';
				data_row=records[i];
				break;
			}
			
			for(var j=0;j<cols.length;j++)
			{
				data_row[cols[j].nodeName]=cols[j].innerHTML;
			}
			database.upsert(table,data_row,function(err,insertedkey)
			{
				var act_row={id:get_new_key(),
						type:type,
						status:'unsynced',
						data_xml:data_xml,
						user_display:'no',
						data_id:data_row.id,
						tablename:table,
						link_to:'',
						last_updated:get_my_time()};
				database.upsert('activities',act_row,function(err,insertedkey)
				{
					localdb_open_requests-=1;
				});
			});
		});
	});
}

/**
 * @param data_xml
 * @param activity_xml
 * @returns
 */
function local_update_simple_func(data_xml,func)
{
	localdb_open_requests+=1;
	var parser=new DOMParser();
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;
	var data_id=data.childNodes[0].getElementsByTagName('id')[0].innerHTML;
	var cols=data.childNodes[0].childNodes;
	
	var domain=get_domain();
	var db_name="re_local_"+domain;
	
	sklad.open(db_name,{version:2},function(err,database)
	{
		database.get(table,{range: IDBKeyRange.only(data_id)},function(err,records)
		{
			var data_row=new Object();
			var type="";
			for(var i in records)
			{
				type='update';
				data_row=records[i];
				break;
			}
			
			for(var j=0;j<cols.length;j++)
			{
				data_row[cols[j].nodeName]=cols[j].innerHTML;
			}
			database.upsert(table,data_row,function(err,insertedkey)
			{
				var act_row={id:get_new_key(),
						type:type,
						status:'unsynced',
						data_xml:data_xml,
						user_display:'no',
						data_id:data_row.id,
						tablename:table,
						link_to:'',
						last_updated:get_my_time()};
					
				database.upsert('activities',act_row,function(err,insertedkey)
				{
					localdb_open_requests-=1;
					func();
				});
			});
		});
	});
}


/**
 * this function save a row of record to local db
 * @param data_xml
 * @param activity_xml
 * @returns
 */
function local_create_row(data_xml,activity_xml)
{
	localdb_open_requests+=1;
	show_loader();
	var parser=new DOMParser();
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;
	var data_id=data.childNodes[0].getElementsByTagName('id')[0].innerHTML;
	var cols=data.childNodes[0].childNodes;
	//console.log(cols);
	var unique=new Array();
	for(var j=0;j<cols.length;j++)
	{
		if(cols[j].innerHTML!=null && cols[j].innerHTML!="")
		{
			if(cols[j].hasAttribute('unique'))
			{
				var fil=new Object();
				fil.name=cols[j].nodeName;
				fil.value=cols[j].innerHTML;
				unique.push(fil);
			}
		}
	}
	//console.log("this is the unique array--"+unique);
	
	var activity=parser.parseFromString(activity_xml,"text/xml");
	var activity_data=activity.childNodes[0].childNodes;
	//console.log(activity_data);
	var domain=get_domain();
	var db_name="re_local_"+domain;
	
	sklad.open(db_name,{version:2},function(err,database)
	{
		if(unique.length===0)
		{
			//console.log("unique length is zero");
			var type='create';
			var data_row=new Object();
				
			for(var j=0;j<cols.length;j++)
			{
				data_row[cols[j].nodeName]=cols[j].innerHTML;
			}
			//console.log(data_row);
			database.upsert(table,data_row,function(err,insertedkey)
			{
				var act_row={id:get_new_key(),
						type:type,
						status:'unsynced',
						data_xml:data_xml,
						user_display:'yes',
						last_updated:get_my_time()};
				//console.log(act_row);
				for(var k=0;k<activity_data.length;k++)
				{
					act_row[activity_data[k].nodeName]=activity_data[k].innerHTML;
				}
				//console.log("activities length="+activity_data.length);
				database.upsert('activities',act_row,function(err,insertedkey)
				{
					localdb_open_requests-=1;
					hide_loader();
				});	
			});
		}
		else
		{
			//console.log("unique length is non-zero");
			database.get(table,{},function(err,records)
			{
				var unique_rec=true;
				var type='create';
				var data_row=new Object();
				
				for(var i in records)
				{	
					for(var k in unique)
					{
						if(records[i][unique[k].name]==unique[k].value)
						{
							unique_rec=false;
						}
					}	
				}
				
				if(unique_rec===true)
				{
					//console.log("didnt find any duplicate records");
					for(var j=0;j<cols.length;j++)
					{
						//console.log(j);
						//console.log(cols[j].nodeName);
						//console.log(cols[j].innerHTML);
						data_row[cols[j].nodeName]=cols[j].innerHTML;
					}
					//console.log(data_row);
					database.upsert(table,data_row,function(err,insertedkey)
					{
						var act_row={id:get_new_key(),
								type:type,
								status:'unsynced',
								data_xml:data_xml,
								user_display:'yes',
								last_updated:get_my_time()};
						console.log(act_row);
						for(var k=0;k<activity_data.length;k++)
						{
							act_row[activity_data[k].nodeName]=activity_data[k].innerHTML;
						}
						database.upsert('activities',act_row,function(err,insertedkey)
						{
							localdb_open_requests-=1;
							hide_loader();
						});
					});
				}
				else
				{
					localdb_open_requests-=1;
					$("#modal5").dialog("open");
				}
			});
		}
	});
}



/**
 * this function save a row of record to local db
 * @param data_xml
 * @param activity_xml
 * @returns
 */
function local_create_simple(data_xml)
{
	//console.log(data_xml);
	localdb_open_requests+=1;
	var parser=new DOMParser();
	//data_xml=data_xml.replace(/[\x{0009}\x{000a}\x{000d}\x{0020}\x{D7FF}\x{E000}\x{FFFD}]/g," ");
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;
	//console.log(table);
	//console.log(data.childNodes[0]);
	var data_id=data.childNodes[0].getElementsByTagName('id')[0].innerHTML;
	var cols=data.childNodes[0].childNodes;

	var unique=new Array();
	for(var j=0;j<cols.length;j++)
	{
		if(cols[j].innerHTML!=null && cols[j].innerHTML!="")
		{
			if(cols[j].hasAttribute('unique'))
			{
				var fil=new Object();
				fil.name=cols[j].nodeName;
				fil.value=cols[j].innerHTML;
				unique.push(fil);
			}
		}
	}
	
	var domain=get_domain();
	var db_name="re_local_"+domain;
	
	sklad.open(db_name,{version:2},function(err,database)
	{
		if(unique.length===0)
		{
			var type='create';
			var data_row=new Object();
			
			for(var j=0;j<cols.length;j++)
			{
				data_row[cols[j].nodeName]=cols[j].innerHTML;
			}
			database.upsert(table,data_row,function(err,insertedkey)
			{
				var act_row={id:get_new_key(),
						type:type,
						status:'unsynced',
						data_xml:data_xml,
						user_display:'no',
						data_id:data_row.id,
						tablename:table,
						link_to:'',
						last_updated:get_my_time()};
					
				database.upsert('activities',act_row,function(err,insertedkey)
				{
					localdb_open_requests-=1;
				});
			});
		}
		else
		{
			//console.log("unique length is non-zero");
			database.get(table,{},function(err,records)
			{
				var unique_rec=true;
				var type='create';
				var data_row=new Object();
				
				for(var i in records)
				{
					if(records[i].id==data_id)
					{
						type='update';
						data_row=records[i];
						unique_rec=true;
						break;
					}
					else 
					{	
						for(var k in unique)
						{
							if(records[i][unique[k].name]==unique[k].value)
							{
								unique_rec=false;
							}
						}
					}
				}
				
				//console.log(unique_rec);
				if(unique_rec===true)
				{
					//console.log("didnt find any duplicate records");
					for(var j=0;j<cols.length;j++)
					{
						data_row[cols[j].nodeName]=cols[j].innerHTML;
					}
					database.upsert(table,data_row,function(err,insertedkey)
					{
						var act_row={id:get_new_key(),
								type:type,
								status:'unsynced',
								data_xml:data_xml,
								user_display:'no',
								data_id:data_row.id,
								tablename:table,
								link_to:'',
								last_updated:get_my_time()};
						
						//console.log("activities data------"+act_row);
						database.upsert('activities',act_row,function(err,insertedkey)
						{
							localdb_open_requests-=1;
						});
					});
				}
				else
				{
					localdb_open_requests-=1;
					$("#modal5").dialog("open");
				}
			});
		}
	});
}


function local_create_simple_func(data_xml,func)
{
	localdb_open_requests+=1;
	var parser=new DOMParser();
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;
	var data_id=data.childNodes[0].getElementsByTagName('id')[0].innerHTML;
	var cols=data.childNodes[0].childNodes;

	var unique=new Array();
	for(var j=0;j<cols.length;j++)
	{
		if(cols[j].innerHTML!=null && cols[j].innerHTML!="")
		{
			if(cols[j].hasAttribute('unique'))
			{
				var fil=new Object();
				fil.name=cols[j].nodeName;
				fil.value=cols[j].innerHTML;
				unique.push(fil);
			}
		}
	}
	
	var domain=get_domain();
	var db_name="re_local_"+domain;
	
	sklad.open(db_name,{version:2},function(err,database)
	{
		//console.log(tables);
		if(unique.length===0)
		{
			var type='create';
			var data_row=new Object();
			
			for(var j=0;j<cols.length;j++)
			{
				data_row[cols[j].nodeName]=cols[j].innerHTML;
			}
			database.upsert(table,data_row,function(err,insertedkey)
			{
				var act_row={id:get_new_key(),
						type:type,
						status:'unsynced',
						data_xml:data_xml,
						user_display:'no',
						data_id:data_row.id,
						tablename:table,
						link_to:'',
						last_updated:get_my_time()};
					
				database.upsert('activities',act_row,function(err,insertedkey)
				{
					localdb_open_requests-=1;
					func();
				});
			});
		}
		else
		{
			//console.log("unique length is non-zero");
			database.get(table,{},function(err,records)
			{
				var unique_rec=true;
				var type='create';
				var data_row=new Object();
				
				for(var i in records)
				{
					if(records[i].id==data_id)
					{
						type='update';
						data_row=records[i];
						unique_rec=true;
						break;
					}
					else 
					{	
						for(var k in unique)
						{
							if(records[i][unique[k].name]==unique[k].value)
							{
								unique_rec=false;
							}
						}
					}
				}
				
				//console.log(unique_rec);
				if(unique_rec===true)
				{
					//console.log("didnt find any duplicate records");
					for(var j=0;j<cols.length;j++)
					{
						data_row[cols[j].nodeName]=cols[j].innerHTML;
					}
					database.upsert(table,data_row,function(err,insertedkey)
					{
						var act_row={id:get_new_key(),
								type:type,
								status:'unsynced',
								data_xml:data_xml,
								user_display:'no',
								data_id:data_row.id,
								tablename:table,
								link_to:'',
								last_updated:get_my_time()};
						
						//console.log("activities data------"+act_row);
						database.upsert('activities',act_row,function(err,insertedkey)
						{
							localdb_open_requests-=1;
							func();
						});
					});
				}
				else
				{
					localdb_open_requests-=1;
					$("#modal5").dialog("open");
				}
			});
		}
	});
}



/**
 * this function save a row of record to local db
 * @param data_xml
 * @param activity_xml
 * @returns
 */
function local_create_simple_no_warning(data_xml)
{
	localdb_open_requests+=1;
	var parser=new DOMParser();
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;
	var data_id=data.childNodes[0].getElementsByTagName('id')[0].innerHTML;
	var cols=data.childNodes[0].childNodes;

	var unique=new Array();
	for(var j=0;j<cols.length;j++)
	{
		if(cols[j].innerHTML!=null && cols[j].innerHTML!="")
		{
			if(cols[j].hasAttribute('unique'))
			{
				var fil=new Object();
				fil.name=cols[j].nodeName;
				fil.value=cols[j].innerHTML;
				unique.push(fil);
			}
		}
	}
	
	var domain=get_domain();
	var db_name="re_local_"+domain;
	
	sklad.open(db_name,{version:2},function(err,database)
	{
		if(unique.length===0)
		{
			var type='create';
			var data_row=new Object();
			
			for(var j=0;j<cols.length;j++)
			{
				data_row[cols[j].nodeName]=cols[j].innerHTML;
			}
			database.upsert(table,data_row,function(err,insertedkey)
			{
				var act_row={id:get_new_key(),
						type:type,
						status:'unsynced',
						data_xml:data_xml,
						user_display:'no',
						data_id:data_row.id,
						tablename:table,
						link_to:'',
						last_updated:get_my_time()};
					
				database.upsert('activities',act_row,function(err,insertedkey)
				{
					localdb_open_requests-=1;
				});
			});
		}
		else
		{
			//console.log("unique length is non-zero");
			database.get(table,{},function(err,records)
			{
				var unique_rec=true;
				var type='create';
				var data_row=new Object();
				
				for(var i in records)
				{
					if(records[i].id==data_id)
					{
						type='update';
						data_row=records[i];
						unique_rec=true;
						break;
					}
					else 
					{	
						for(var k in unique)
						{
							if(records[i][unique[k].name]==unique[k].value)
							{
								unique_rec=false;
							}
						}
					}
				}
				
				//console.log(unique_rec);
				if(unique_rec===true)
				{
					//console.log("didnt find any duplicate records");
					for(var j=0;j<cols.length;j++)
					{
						data_row[cols[j].nodeName]=cols[j].innerHTML;
					}
					database.upsert(table,data_row,function(err,insertedkey)
					{
						var act_row={id:get_new_key(),
								type:type,
								status:'unsynced',
								data_xml:data_xml,
								user_display:'no',
								data_id:data_row.id,
								tablename:table,
								link_to:'',
								last_updated:get_my_time()};
						
						//console.log("activities data------"+act_row);
						database.upsert('activities',act_row,function(err,insertedkey)
						{
							localdb_open_requests-=1;
						});
					});
				}
			});
		}
	});
}



function local_read_multi_column(columns,callback,results)
{
	localdb_open_requests+=1;
	//console.log(columns);
	var parser=new DOMParser();
	var data=parser.parseFromString(columns,"text/xml");
	var table=data.childNodes[0].nodeName;
	var cols=data.childNodes[0].childNodes;
	var count=0;
	var start_index=0;
	if(data.childNodes[0].hasAttribute('count'))
	{
		count=parseInt(data.childNodes[0].getAttribute('count'));
	}
	if(data.childNodes[0].hasAttribute('start_index'))
	{
		start_index=parseInt(data.childNodes[0].getAttribute('start_index'));
	}
	var filter=new Array();
	var sort_index='id';
	var sort_order='desc';
	
	for(var j=0;j<cols.length;j++)
	{
		if(cols[j].innerHTML!=null && cols[j].hasAttribute('sort'))
		{
			sort_index=cols[j].nodeName;
			sort_order=cols[j].getAttribute('sort');
		}
		
		if(cols[j].innerHTML!=null && cols[j].innerHTML!="")
		{
			var fil=new Object();
			fil.name=cols[j].nodeName;
			
			if(cols[j].hasAttribute('compare'))
			{
				fil.value=parseInt(cols[j].innerHTML);
				fil.type=cols[j].getAttribute('compare');
			}
			else if(cols[j].hasAttribute('array'))
			{
				fil.value=cols[j].innerHTML;
				fil.type='array';
			}
			else if(cols[j].hasAttribute('exact'))
			{
				fil.value=cols[j].innerHTML;
				fil.type='exact';
			}
			else
			{
				fil.value=cols[j].innerHTML;
				fil.type='';
			}
			filter.push(fil);
		}
	}
	var domain=get_domain();
	var db_name="re_local_"+domain;
	
	sklad.open(db_name,{version:2},function(err,database)
	{
		var options={direction:sklad.DESC};
		database.get(table,options,function(err,records_object)
		{
			var records=[];
			for(var a in records_object)
			{
				records.push(records_object[a]);
			}
			if(sort_index!='id')
			{
				if(sort_order!='asc')
				{
					records.sort(function(a,b)
					{
						if(parseFloat(a[sort_index])<parseFloat(b[sort_index]))
							return 1;
						else
							return -1;
					});
				}
				else
				{
					records.sort(function(a,b)
					{
						if(parseFloat(a[sort_index])>parseFloat(b[sort_index]))
							return 1;
						else
							return -1;
					});
				}
			}
			
			for(var row=0;row<records.length;row++)
			{
				var match=true;
				for(var i=0;i<filter.length;i++)
				{
					var string=records[row][filter[i].name].toString().toLowerCase();
					var search=filter[i].value.toString().toLowerCase();
					var found=0;
					
					if(filter[i].type=='')
					{
						found=string.search(search);
					}
					else if(filter[i].type=='exact')
					{
						if(search!==string)
						{
							match=false;
							break;
						}
					}
					else if(filter[i].type=='array')
					{
						found=search.search("-"+string+"-");
					}
					if(filter[i].type=='less than') 
					{
						if(parseInt(records[row][filter[i].name])>=filter[i].value)
						{
							match=false;
							break;
						}
					}
					else if(filter[i].type=='more than') 
					{
						if(parseFloat(records[row][filter[i].name])<=parseFloat(filter[i].value))
						{
							match=false;
							break;
						}
					}
					else if(filter[i].type=='equal') 
					{
						if(parseFloat(records[row][filter[i].name])!=parseFloat(filter[i].value))
						{
							match=false;
							break;
						}
					}
					else if(filter[i].type=='not equal') 
					{
						if(parseFloat(records[row][filter[i].name])==parseFloat(filter[i].value))
						{
							match=false;
							break;
						}
					}

					if(found===-1)
					{
						match=false;
						break;
					}
				}
				
				if(match===true)
				{
					if(start_index==0)
					{
						results.push(records[row]);
					}
					else
					{					
						start_index-=1;
					}
					if(results.length===count)
					{
						break;
					}
				}
			}
			localdb_open_requests-=1;
			callback(results);
		});		
	});
}



/**
 * 
 * @param data_xml
 * @param activity_xml
 * @returns
 */
function local_delete_row(data_xml,activity_xml)
{
	localdb_open_requests+=1;
	//console.log(data_xml);
	var parser=new DOMParser();
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;
	
	var activity=parser.parseFromString(activity_xml,"text/xml");
	var activity_data=activity.childNodes[0].childNodes;
	
	var cols=data.childNodes[0].childNodes;
	var filter=new Array();
	for(var j=0;j<cols.length;j++)
	{
		if(cols[j].innerHTML!=null && cols[j].innerHTML!="")
		{
			fil=new Object();
			fil.name=cols[j].nodeName;
			fil.value=cols[j].innerHTML;
			filter.push(fil);
		}
	}
	
	var domain=get_domain();
	var db_name="re_local_"+domain;
	sklad.open(db_name,{version:2},function(err,database)
	{
		var options={};
		if(filter[0].name=='id')
		{
			options={range:IDBKeyRange.only(filter[0].value)};
		}
		database.get(table,options,function(err,records_object)
		{
			//console.log(records_object);
			var records=[];
			for(var row in records_object)
			{
				records.push(records_object[row]);
			}
			//console.log(records);
			
			records.forEach(function(record)
			{
				var match=true;
				for(var i=0;i<filter.length;i++)
				{
					var string=record[filter[i].name].toLowerCase();
					var search=filter[i].value.toLowerCase();
					if(string!=search)
					{
						match=false;
						break;
					}
				}
				if(match===true)
				{
					localdb_open_requests+=1;
					//console.log('deleting record');
					//console.log(record);
					database.delete(table,record.id,function(err)
					{
						var act_row={id:get_new_key(),
								type:'delete',
								status:'unsynced',
								user_display:'yes',
								data_xml:data_xml,
								last_updated:get_my_time()};
						
						for(var k=0;k<activity_data.length;k++)
						{
							act_row[activity_data[k].nodeName]=activity_data[k].innerHTML;
						}
						database.upsert('activities',act_row,function(err,insertedkey)
						{
							localdb_open_requests-=1;
						});
					});
				}
			});
			localdb_open_requests-=1;
			
		});
	});
};

/**
 * @param data_xml
 * @returns
 */
function local_delete_simple(data_xml)
{
	localdb_open_requests+=1;
	var parser=new DOMParser();
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;

	var cols=data.childNodes[0].childNodes;
	var filter=new Array();
	for(var j=0;j<cols.length;j++)
	{
		if(cols[j].innerHTML!=null && cols[j].innerHTML!="")
		{
			fil=new Object();
			fil.name=cols[j].nodeName;
			fil.value=cols[j].innerHTML;
			filter.push(fil);
		}
	}

	var domain=get_domain();
	var db_name="re_local_"+domain;
	sklad.open(db_name,{version:2},function(err,database)
	{
		var options={};
		if(filter[0].name=='id')
		{
			options={range:IDBKeyRange.only(filter[0].value)};
		}
		database.get(table,options,function(err,records_object)
		{
			var records=[];
			for(var row in records_object)
			{
				records.push(records_object[row]);
			}
			
			records.forEach(function(record)
			{
				var match=true;
				for(var i=0;i<filter.length;i++)
				{
					var string=record[filter[i].name].toLowerCase();
					var search=filter[i].value.toLowerCase();
					if(string!=search)
					{
						match=false;
						break;
					}
				}
				if(match===true)
				{
					localdb_open_requests+=1;
					database.delete(table,record.id,function(err)
					{
						var act_row={id:get_new_key(),
								type:'delete',
								data_id:record.id,
								data_xml:data_xml,
								tablename:table,
								status:'unsynced',
								user_display:'no',
								link_to:'',
								last_updated:get_my_time()};
						database.upsert('activities',act_row,function(err,insertedkey)
						{
							localdb_open_requests-=1;
						});
					});
				}
			});
			localdb_open_requests-=1;
		});
	});
};


/**
 * @param data_xml
 * @returns
 */
function local_delete_simple_func(data_xml,func)
{
	localdb_open_requests+=1;

	var parser=new DOMParser();
	var data=parser.parseFromString(data_xml,"text/xml");
	var table=data.childNodes[0].nodeName;

	var cols=data.childNodes[0].childNodes;
	var filter=new Array();
	for(var j=0;j<cols.length;j++)
	{
		if(cols[j].innerHTML!=null && cols[j].innerHTML!="")
		{
			fil=new Object();
			fil.name=cols[j].nodeName;
			fil.value=cols[j].innerHTML;
			filter.push(fil);
		}
	}

	var domain=get_domain();
	var db_name="re_local_"+domain;
	sklad.open(db_name,{version:2},function(err,database)
	{
		var options={};
		if(filter[0].name=='id')
		{
			options={range:IDBKeyRange.only(filter[0].value)};
		}
		database.get(table,options,function(err,records_object)
		{
			var records=[];
			for(var row in records_object)
			{
				records.push(records_object[row]);
			}
			
			records.forEach(function(record)
			{
				var match=true;
				for(var i=0;i<filter.length;i++)
				{
					var string=record[filter[i].name].toLowerCase();
					var search=filter[i].value.toLowerCase();
					if(string!=search)
					{
						match=false;
						break;
					}
				}
				if(match===true)
				{
					localdb_open_requests+=1;
					database.delete(table,record.id,function(err)
					{
						var act_row={id:get_new_key(),
								type:'delete',
								data_id:record.id,
								data_xml:data_xml,
								tablename:table,
								status:'unsynced',
								user_display:'no',
								link_to:'',
								last_updated:get_my_time()};
						database.upsert('activities',act_row,function(err,insertedkey)
						{
							localdb_open_requests-=1;
							func();
						});
					});
				}
			});
			localdb_open_requests-=1;
		});
	});
};


function local_get_inventory(product,batch,callback)
{
	//console.log(filter);
	var domain=get_domain();
	var db_name="re_local_"+domain;
	sklad.open(db_name,{version:2},function(err,database)
	{
		var result=0;
		
		database.get('bill_items',{},function(err,bi_records)
		{
			for(var row in bi_records)
			{
				if((bi_records[row]['batch']==batch || batch==='' || batch===null) && bi_records[row]['item_name']==product)
				{
					result-=parseFloat(bi_records[row]['quantity']);
				}	
			}
			
			database.get('supplier_bill_items',{},function(err,si_records)
			{
				for(var row in si_records)
				{
					if((si_records[row]['batch']==batch || batch==='' || batch===null) && si_records[row]['product_name']==product)
					{
						result+=parseFloat(si_records[row]['quantity']);
					}	
				}
				
				database.get('supplier_return_items',{},function(err,sr_records)
				{
					for(var row in sr_records)
					{
						if((sr_records[row]['batch']==batch || batch==='' || batch===null) && sr_records[row]['item_name']==product)
						{
							result-=parseFloat(sr_records[row]['quantity']);
						}	
					}
					
					database.get('inventory_adjust',{},function(err,ia_records)
					{
						for(var row in ia_records)
						{
							if((ia_records[row]['batch']==batch || batch==='' || batch===null) && ia_records[row]['product_name']==product)
							{
								result+=parseFloat(ia_records[row]['quantity']);
							}	
						}
						database.get('customer_return_items',{},function(err,cr_records)
						{
							for(var row in cr_records)
							{
								if(cr_records[row]['item_name']==product)
								{
									if(cr_records[row]['batch']==batch || batch==='' || batch===null)
									{
										result+=parseFloat(cr_records[row]['quantity']);
									}
									if(cr_records[row]['exchange_batch']==batch || batch==='' || batch===null)
									{
										result-=parseFloat(cr_records[row]['quantity']);
									}
								}
							}

							database.get('discarded',{},function(err,di_records)
							{
								for(var row in di_records)
								{
									if((di_records[row]['batch']==batch || batch==='' || batch===null) && di_records[row]['product_name']==product)
									{
										result-=parseFloat(di_records[row]['quantity']);
									}
								}

								callback(result);
							});
						});
					});
				});			
			});
		});		
	});
}