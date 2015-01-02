/**
 * @form Update Inventory
 * @formNo 1
 * @Loading heavy
 */
function form1_ini()
{
	show_loader();
	var fid=$("#form1_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form1_header');
	
	var fname=filter_fields.elements[0].value;
	var fbatch=filter_fields.elements[1].value;

	////indexing///
	var index_element=document.getElementById('form1_index');
	var prev_element=document.getElementById('form1_prev');
	var next_element=document.getElementById('form1_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////
	
	var columns="<product_instances count='25' start_index='"+start_index+"'>" +
		"<id>"+fid+"</id>" +
		"<batch>"+fbatch+"</batch>" +
		"<product_name>"+fname+"</product_name>" +
		"<cost_price></cost_price>" +
		"<sale_price></sale_price>" +
		"<expiry></expiry>" +
		"<last_updated sort='desc'></last_updated>" +
		"</product_instances>";

	$('#form1_body').html("");
	
	fetch_requested_data('form1',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form1_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form1_"+result.id+"'>"+result.product_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Batch'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form1_"+result.id+"' value='"+result.batch+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Cost price'>";
						rowsHTML+="<input type='number' step='any' readonly='readonly' form='form1_"+result.id+"' class='dblclick_editable' value='"+result.cost_price+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Sale price'>";
						rowsHTML+="<input type='number' step='any' readonly='readonly' form='form1_"+result.id+"' value='"+result.sale_price+"'>";
						rowsHTML+="<img src='./images/edit.png' class='edit_icon' onclick=\"modal38_action('"+result.id+"');\">";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Expiry'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form1_"+result.id+"' class='dblclick_editable' value='"+get_my_past_date(result.expiry)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Quantity'>";
						rowsHTML+="System: <input type='number' step='any' readonly='readonly' form='form1_"+result.id+"' value=''>";
						rowsHTML+="</br>Actual: <input type='number' step='any' readonly='readonly' form='form1_"+result.id+"' value='' class='dblclick_editable' >";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form1_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' title='Update and adjust' form='form1_"+result.id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' title='Delete' form='form1_"+result.id+"' onclick='form1_delete_item($(this));'>";
						rowsHTML+="<input type='button' class='generic_icon' value='Purchase' form='form1_"+result.id+"' onclick=\"modal27_action('"+result.product_name+"');\">";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form1_body').append(rowsHTML);
			var fields=document.getElementById("form1_"+result.id);
			var sys_inventory=fields.elements[5];
			var actual_inventory=fields.elements[6];
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form1_update_item(fields);
			});
			
			get_inventory(result.product_name,result.batch,function(inventory)
			{
				sys_inventory.value=inventory;
				actual_inventory.value=inventory;
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		
		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();

		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'inventory');
		});
		
		hide_loader();
	});
};

/**
 * @form Create Pamphlet
 * @formNo 2
 * @Loading light
 */
function form2_ini()
{
	var pamphlet_id=$("#form2_link").attr('data_id');
	if(pamphlet_id==null)
		pamphlet_id="";	
	$('#form2_body').html("");
	//console.log(pamphlet_id);
	if(pamphlet_id!="")
	{
		show_loader();
		var pamphlet_columns="<pamphlets>" +
				"<id>"+pamphlet_id+"</id>" +
				"<name></name>" +
				"</pamphlets>";
		var pamphlet_item_columns="<pamphlet_items>" +
				"<id></id>" +
				"<pamphlet_id>"+pamphlet_id+"</pamphlet_id>" +
				"<item_name></item_name>" +
				"<offer_name></offer_name>" +
				"<offer></offer>" +
				"</pamphlet_items>";
	
		////separate fetch function to get bill details like customer name, total etc.
		fetch_requested_data('',pamphlet_columns,function(pamphlet_results)
		{
			for (var i in pamphlet_results)
			{
				var filter_fields=document.getElementById('form2_master');
				filter_fields.elements[1].value=pamphlet_results[i].name;
				filter_fields.elements[2].value=pamphlet_results[i].id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form2_update_form();
				});
				break;
			}
		});
		/////////////////////////////////////////////////////////////////////////
		
		fetch_requested_data('',pamphlet_item_columns,function(results)
		{
			results.forEach(function(result)
			{
				var rowsHTML="";
				var id=result.id;
				rowsHTML+="<tr>";
				rowsHTML+="<form id='form2_"+id+"'></form>";
					rowsHTML+="<td data-th='Item Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form2_"+id+"' value='"+result.item_name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Offer Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form2_"+id+"' value='"+result.offer_name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Offer Details'>";
						rowsHTML+="<textarea readonly='readonly' form='form2_"+id+"'>"+result.offer+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form2_"+id+"' value='"+id+"'>";
						rowsHTML+="<input type='submit' class='submit_hidden' form='form2_"+id+"' id='save_form2_"+id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form2_"+id+"' id='delete_form2_"+id+"' onclick='form2_delete_item($(this));'>";
					rowsHTML+="</td>";			
				rowsHTML+="</tr>";
			
				$('#form2_body').append(rowsHTML);
				
				var fields=document.getElementById("form2_"+id);
				$(fields).on("submit", function(event)
				{
					event.preventDefault();
				});
			});
			hide_loader();
		});
	}
}


/**
 * @form Manage Assets
 * @formNo 5
 * @Loading light
 */
function form5_ini()
{
	show_loader();
	var fid=$("#form5_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form5_header');
		
	var fasset=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form5_index');
	var prev_element=document.getElementById('form5_prev');
	var next_element=document.getElementById('form5_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////
	
	var columns="<assets count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fasset+"</name>" +
			"<type>"+ftype+"</type>" +
			"<description></description>" +
			"</assets>";
	
	$('#form5_body').html("");

	fetch_requested_data('form5',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form5_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form5_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form5_"+result.id+"' class='dblclick_editable' value='"+result.type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Details'>";
						rowsHTML+="<textarea readonly='readonly' form='form5_"+result.id+"' class='dblclick_editable'>"+result.description+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form5_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form5_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form5_"+result.id+"' title='Delete' onclick='form5_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form5_body').append(rowsHTML);
			
			var fields=document.getElementById("form5_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form5_update_item(fields);
			});
		});
		
		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		
		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();

		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'assets');
		});
		hide_loader();
	});
};



/**
 * @form Attendance
 * @formNo 7
 * @Loading light
 */
function form7_ini()
{
	show_loader();
	var fid=$("#form7_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var master_fields=document.getElementById('form7_master');
	var fdate=master_fields.elements[1].value;
	
	var filter_fields=document.getElementById('form7_header');
	var fstaff=filter_fields.elements[0].value;
	var fattendance=filter_fields.elements[1].value;
	
	var columns="<attendance>" +
			"<id>"+fid+"</id>" +
			"<date>"+get_raw_time(fdate)+"</date>" +
			"<acc_name>"+fstaff+"</acc_name>" +
			"<presence>"+fattendance+"</presence>" +
			"<hours_worked></hours_worked>" +
			"</attendance>";

	$('#form7_body').html("");

	fetch_requested_data('form7',columns,function(results)
	{
		if(results.length===0)
		{
			var staff_columns="<staff>" +
					"<acc_name></acc_name>" +
					"<status>active</status>" +
					"</staff>";
			fetch_requested_data('form7',staff_columns,function(staff_names)
			{
				staff_names.forEach(function(staff_name)
				{
					var rowsHTML="";
					var data_id=get_new_key();
					rowsHTML+="<tr>";
						rowsHTML+="<form id='form7_"+data_id+"'></form>";
							rowsHTML+="<td data-th='Staff Name'>";
								rowsHTML+="<input type='text' readonly='readonly' form='form7_"+data_id+"' value='"+staff_name.acc_name+"'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Attendance'>";
								rowsHTML+="<input type='text' form='form7_"+data_id+"' value='present' class='dblclick_editable'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Hours Worked'>";
								rowsHTML+="<input type='number' form='form7_"+data_id+"' value='8' class='dblclick_editable'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Action'>";
								rowsHTML+="<input type='hidden' form='form7_"+data_id+"' value='"+data_id+"'>";
								rowsHTML+="<input type='submit' class='save_icon' id='save_form7_"+data_id+"' form='form7_"+data_id+"' value='saved'>";
								rowsHTML+="<input type='hidden' form='form7_"+data_id+"' value='"+get_raw_time(fdate)+"'>";
							rowsHTML+="</td>";			
					rowsHTML+="</tr>";
					
					$('#form7_body').prepend(rowsHTML);
					
					var fields=document.getElementById("form7_"+data_id);
					var attendance_filter=fields.elements[1];
					set_static_value_list('attendance','presence',attendance_filter);

					$(fields).on("submit", function(event)
					{
						event.preventDefault();
						form7_create_item(fields);
					});
				});
				
				longPressEditable($('.dblclick_editable'));
				hide_loader();
			});
		}
		else
		{
			results.forEach(function(result)
			{
				var rowsHTML="";
				rowsHTML+="<tr>";
					rowsHTML+="<form id='form7_"+result.id+"'></form>";
						rowsHTML+="<td data-th='Name'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form7_"+result.id+"' value='"+result.acc_name+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Name'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form7_"+result.id+"' value='"+result.presence+"' class='dblclick_editable'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Name'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form7_"+result.id+"' value='"+result.hours_worked+"' class='dblclick_editable'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Name'>";
							rowsHTML+="<input type='hidden' form='form7_"+result.id+"' value='"+result.id+"'>";
							rowsHTML+="<input type='submit' class='save_icon' id='save_form7_"+result.id+"' form='form7_"+result.id+"' value='saved'>";
							rowsHTML+="<input type='hidden' form='form7_"+result.id+"' value='"+result.date+"'>";
						rowsHTML+="</td>";			
				rowsHTML+="</tr>";
				
				$('#form7_body').prepend(rowsHTML);
				
				var fields=document.getElementById("form7_"+result.id);
				var attendance_filter=fields.elements[1];
				set_static_value_list('attendance','presence',attendance_filter);
				
				$(fields).on("submit", function(event)
				{
					event.preventDefault();
					form7_update_item(fields);
				});
			});
			
			longPressEditable($('.dblclick_editable'));
			hide_loader();
		}
	});
};


/**
 * @form Manage Staff
 * @formNo 8
 */
function form8_ini()
{
	show_loader();
	var fid=$("#form8_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form8_header');
	
	var fname=filter_fields.elements[0].value;
	var fcontact=filter_fields.elements[1].value;
	var femail=filter_fields.elements[2].value;
	var fstatus=filter_fields.elements[3].value;
	
	////indexing///
	var index_element=document.getElementById('form8_index');
	var prev_element=document.getElementById('form8_prev');
	var next_element=document.getElementById('form8_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<staff count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fname+"</name>" +
			"<phone>"+fcontact+"</phone>" +
			"<email>"+femail+"</email>" +
			"<status>"+fstatus+"</status>" +
			"<acc_name></acc_name>" +
			"<address></address>" +
			"<pincode></pincode>" +
			"<city></city>" +
			"<state></state>" +
			"<country></country>" +
			"<address_status></address_status>" +
			"</staff>";

	$('#form8_body').html("");

	fetch_requested_data('form8',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="<tr>";
				rowsHTML+="<form id='form8_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form8_"+result.id+"'>"+result.name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Phone'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form8_"+result.id+"' value='"+result.phone+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Email'>";
						rowsHTML+="<textarea readonly='readonly' form='form8_"+result.id+"' class='dblclick_editable'>"+result.email+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Address'>";
						rowsHTML+="<textarea wrap='soft' readonly='readonly' form='form8_"+result.id+"'>"+result.address+", "+result.pincode+", "+result.city+", "+result.state+", "+result.country+"</textarea>";
						rowsHTML+="<img class='edit_icon' wrap='virtual' src='images/edit.png' form='form8_"+result.id+"' onclick='modal17_action($(this));'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form8_"+result.id+"' class='dblclick_editable' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form8_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form8_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form8_"+result.id+"' value='saved' onclick='form8_delete_item($(this));'>";
						rowsHTML+="<input type='hidden' form='form8_"+result.id+"' value='"+result.address+"'>";
						rowsHTML+="<input type='hidden' form='form8_"+result.id+"' value='"+result.pincode+"'>";
						rowsHTML+="<input type='hidden' form='form8_"+result.id+"' value='"+result.city+"'>";
						rowsHTML+="<input type='hidden' form='form8_"+result.id+"' value='"+result.state+"'>";
						rowsHTML+="<input type='hidden' form='form8_"+result.id+"' value='"+result.country+"'>";
						rowsHTML+="<input type='hidden' form='form8_"+result.id+"' value='"+result.address_status+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form8_body').append(rowsHTML);
			
			var fields=document.getElementById("form8_"+result.id);
			var fstatus=fields.elements[5];
			
			set_static_value_list('staff','status',fstatus);
			
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form8_update_item(fields);
			});
		});
		
		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();

		var export_button=filter_fields.elements[5];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'staff');
		});
		hide_loader();
	});
};


/**
 * @form New Service Bill
 * @formNo 10
 * @Loading light
 */
function form10_ini()
{
	var bill_id=$("#form10_link").attr('data_id');
	if(bill_id==null)
		bill_id="";	
	$('#form10_body').html("");

	if(bill_id!="")
	{
		show_loader();
		var bill_columns="<bills>" +
				"<id>"+bill_id+"</id>" +
				"<customer_name></customer_name>" +
				"<total></total>" +
				"<bill_date></bill_date>" +
				"<amount></amount>" +
				"<discount></discount>" +
				"<tax></tax>" +
				"<offer></offer>" +
				"<type>service</type>" +
				"<transaction_id></transaction_id>" +
				"</bills>";
		var bill_items_column="<bill_items>" +
				"<id></id>" +
				"<item_name></item_name>" +
				"<unit_price></unit_price>" +
				"<staff></staff>" +
				"<notes></notes>" +
				"<amount></amount>" +
				"<total></total>" +
				"<discount></discount>" +
				"<offer></offer>" +
				"<type></type>" +
				"<bill_id>"+bill_id+"</bill_id>" +
				"<tax></tax>" +
				"</bill_items>";
	
		////separate fetch function to get bill details like customer name, total etc.
		fetch_requested_data('',bill_columns,function(bill_results)
		{
			var filter_fields=document.getElementById('form10_master');
			
			for (var i in bill_results)
			{
				filter_fields.elements[1].value=bill_results[i].customer_name;
				filter_fields.elements[2].value=get_my_past_date(bill_results[i].bill_date);
				filter_fields.elements[3].value=bill_results[i].amount;
				filter_fields.elements[4].value=bill_results[i].discount;
				filter_fields.elements[5].value=bill_results[i].tax;
				filter_fields.elements[6].value=bill_results[i].total;
				filter_fields.elements[7].value=bill_id;
				filter_fields.elements[8].value=bill_results[i].offer;
				filter_fields.elements[9].value=bill_results[i].transaction_id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form10_update_form();
				});
				break;
			}
		
		/////////////////////////////////////////////////////////////////////////
				
			fetch_requested_data('',bill_items_column,function(results)
			{
				var message_string="Bill from: "+get_session_var('title')+"\nAddress: "+get_session_var('address');
				
				results.forEach(function(result)
				{
					message_string+="\nItem: "+result.item_name;
					message_string+=" Price: "+result.unit_price;
					
					var rowsHTML="";
					var id=result.id;
					rowsHTML+="<tr>";
					rowsHTML+="<form id='form10_"+id+"'></form>";
						rowsHTML+="<td data-th='Service Name'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form10_"+id+"' value='"+result.item_name+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Person'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form10_"+id+"' value='"+result.staff+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Additional Notes'>";
							rowsHTML+="<textarea readonly='readonly' form='form10_"+id+"'>"+result.notes+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Price'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form10_"+id+"' value='"+result.unit_price+"' step='any'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form10_"+id+"' value='"+result.total+"'>";
							rowsHTML+="<input type='hidden' form='form10_"+id+"' value='"+result.amount+"'>";
							rowsHTML+="<input type='hidden' form='form10_"+id+"' value='"+result.discount+"'>";
							rowsHTML+="<input type='hidden' form='form10_"+id+"' value='"+result.tax+"'>";
							rowsHTML+="<input type='hidden' form='form10_"+id+"' value='"+result.offer+"'>";
							rowsHTML+="<input type='hidden' form='form10_"+id+"' value='"+id+"'>";
							rowsHTML+="<input type='submit' class='submit_hidden' form='form10_"+id+"' id='save_form10_"+id+"'>";
							rowsHTML+="<input type='button' class='delete_icon' form='form10_"+id+"' id='delete_form10_"+id+"' onclick='form10_delete_item($(this));'>";
							rowsHTML+="<input type='hidden' form='form10_"+id+"'>";
						rowsHTML+="</td>";			
					rowsHTML+="</tr>";
				
					$('#form10_body').append(rowsHTML);
					
					var fields=document.getElementById("form10_"+id);
					$(fields).on("submit", function(event)
					{
						event.preventDefault();
					});
				});
				
				message_string+="\nAmount: "+filter_fields.elements[3].value;
				message_string+="\ndiscount: "+filter_fields.elements[4].value;
				message_string+="\nTax: "+filter_fields.elements[5].value;
				message_string+="\nTotal: "+filter_fields.elements[6].value;
				
				var subject="Bill from "+get_session_var('title');
				$('#form10_share').show();
				$('#form10_share').click(function()
				{
					modal44_action(filter_fields.elements[1].value,subject,message_string);
				});
				hide_loader();
			});
		});
	}
}


/**
 * @form Manage Payments
 * @formNo 11
 * @Loading light
 */
function form11_ini()
{
	show_loader();
	var fid=$("#form11_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form11_header');
	
	var ftype=filter_fields.elements[0].value;
	var faccount=filter_fields.elements[1].value;
	var fstatus=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form11_index');
	var prev_element=document.getElementById('form11_prev');
	var next_element=document.getElementById('form11_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<payments count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<type>"+ftype+"</type>" +
			"<total_amount></total_amount>" +
			"<paid_amount></paid_amount>" +
			"<acc_name>"+faccount+"</acc_name>" +
			"<due_date></due_date>" +
			"<status>"+fstatus+"</status>" +
			"<date></date>" +
			"<mode></mode>" +
			"<bill_id></bill_id>" +
			"<notes></notes>" +
			"<last_updated sort='desc'></last_updated>" +
			"</payments>";

	$('#form11_body').html("");

	fetch_requested_data('form11',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var message_string="";
			if(result.type=='paid')
			{
				message_string="Payment of Rs: "+result.paid_amount+" paid on "+get_my_past_date(result.date)+".\n The status of this payment is "+result.status;
			}
			else
			{
				message_string="Payment of Rs: "+result.paid_amount+" received on "+get_my_past_date(result.date)+".\n The status of this payment is "+result.status;
			}
			var subject="Payment Receipt from "+get_session_var('title');
			
			var detail_string="Bill Id: " +result.bill_id+
					"\nMode of payment: " +result.mode+
					"\nDue Date: "+get_my_past_date(result.due_date)+
					"\nDate: "+get_my_past_date(result.date)+
					"\nClosing Notes: "+result.notes;
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form11_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form11_"+result.id+"' value='"+result.type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Account'>";
						rowsHTML+="<textarea readonly='readonly' form='form11_"+result.id+"'>"+result.acc_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Total Amount'>";
						rowsHTML+="<input type='number' step='any' readonly='readonly' form='form11_"+result.id+"' value='"+result.total_amount+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Paid Amount'>";
						rowsHTML+="<input type='number' step='any' readonly='readonly' form='form11_"+result.id+"' class='dblclick_editable' value='"+result.paid_amount+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form11_"+result.id+"' class='dblclick_editable' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Details'>";
						rowsHTML+="<textarea readonly='readonly' form='form11_"+result.id+"'>"+detail_string+"</textarea>";
						rowsHTML+="<img class='edit_icon' src='images/edit.png' form='form11_"+result.id+"' onclick='modal29_action($(this));'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form11_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='hidden' form='form11_"+result.id+"' value='"+result.mode+"'>";
						rowsHTML+="<input type='hidden' form='form11_"+result.id+"' value='"+result.date+"'>";
						rowsHTML+="<input type='hidden' form='form11_"+result.id+"' value='"+result.due_date+"'>";
						rowsHTML+="<input type='hidden' form='form11_"+result.id+"' value='"+result.bill_id+"'>";
						rowsHTML+="<input type='hidden' form='form11_"+result.id+"' value='"+result.notes+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form11_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='hidden' form='form11_"+result.id+"' value='"+message_string+"'>";
						rowsHTML+="<input type='button' form='form11_"+result.id+"' title='Share' class='share_icon'>"; //onclick=\"modal44_action('"+result.acc_name+"','"+subject+"','"+message_string+"');\">";
					rowsHTML+="</td>";
			rowsHTML+="</tr>";
			
			$('#form11_body').append(rowsHTML);
			
			var fields=document.getElementById("form11_"+result.id);
			var status_filter=fields.elements[4];
			var share_message=fields.elements[13];
			var share_button=fields.elements[14];
			
			set_static_value_list('payments','status',status_filter);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form11_update_item(fields);
			});
			
			$(share_button).on("click", function(event)
			{
				event.preventDefault();
				modal44_action(result.acc_name,subject,share_message.value);
			});
	
			longPressEditable($('.dblclick_editable'));
			$('textarea').autosize();
		});
		
		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'payments');
		});
		hide_loader();
	});
};


/**
 * @form New Products Bill
 * @formNo 12
 * @Loading light
 */
function form12_ini()
{
	var bill_id=$("#form12_link").attr('data_id');
	if(bill_id==null)
		bill_id="";	
	
	$('#form12_body').html("");

	if(bill_id!="")
	{
		show_loader();
		var bill_columns="<bills>" +
				"<id>"+bill_id+"</id>" +
				"<customer_name></customer_name>" +
				"<total></total>" +
				"<bill_date></bill_date>" +
				"<amount></amount>" +
				"<discount></discount>" +
				"<tax></tax>" +
				"<offer></offer>" +
				"<type>product</type>" +
				"<transaction_id></transaction_id>" +
				"</bills>";
		var bill_items_column="<bill_items>" +
				"<id></id>" +
				"<item_name></item_name>" +
				"<batch></batch>" +
				"<unit_price></unit_price>" +
				"<quantity></quantity>" +
				"<amount></amount>" +
				"<total></total>" +
				"<discount></discount>" +
				"<offer></offer>" +
				"<type></type>" +
				"<bill_id>"+bill_id+"</bill_id>" +
				"<tax></tax>" +
				"<free_with></free_with>" +
				"</bill_items>";
	
		////separate fetch function to get bill details like customer name, total etc.
		fetch_requested_data('',bill_columns,function(bill_results)
		{
			var filter_fields=document.getElementById('form12_master');
			
			for (var i in bill_results)
			{
				filter_fields.elements[1].value=bill_results[i].customer_name;
				filter_fields.elements[2].value=get_my_past_date(bill_results[i].bill_date);
				filter_fields.elements[3].value=bill_results[i].amount;
				filter_fields.elements[4].value=bill_results[i].discount;
				filter_fields.elements[5].value=bill_results[i].tax;
				filter_fields.elements[6].value=bill_results[i].total;
				filter_fields.elements[7].value=bill_id;
				filter_fields.elements[8].value=bill_results[i].offer;
				filter_fields.elements[9].value=bill_results[i].transaction_id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form12_update_form();
				});
				break;
			}
		
		
			fetch_requested_data('',bill_items_column,function(results)
			{
				var message_string="Bill from:"+encodeURIComponent(get_session_var('title'))+"\nAddress: "+get_session_var('address');
				
				results.forEach(function(result)
				{
					message_string+="\nItem: "+result.item_name;
					message_string+=" Quantity: "+result.quantity;
					message_string+=" Total: "+result.total;
					
					var rowsHTML="";
					var id=result.id;
					rowsHTML+="<tr>";
					rowsHTML+="<form id='form12_"+id+"'></form>";
						rowsHTML+="<td data-th='Product Name'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form12_"+id+"' value='"+result.item_name+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Batch'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form12_"+id+"' value='"+result.batch+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Quantity'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form12_"+id+"' value='"+result.quantity+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Unit Price'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form12_"+id+"' value='"+result.unit_price+"' step='any'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Total'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form12_"+id+"' value='"+result.total+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form12_"+id+"' value='"+result.amount+"'>";
							rowsHTML+="<input type='hidden' form='form12_"+id+"' value='"+result.discount+"'>";
							rowsHTML+="<input type='hidden' form='form12_"+id+"' value='"+result.tax+"'>";
							rowsHTML+="<input type='hidden' form='form12_"+id+"' value='"+result.offer+"'>";
							rowsHTML+="<input type='hidden' form='form12_"+id+"' value='"+id+"'>";
							rowsHTML+="<input type='submit' class='submit_hidden' form='form12_"+id+"' id='save_form12_"+id+"'>";
							rowsHTML+="<input type='button' class='delete_icon' form='form12_"+id+"' id='delete_form12_"+id+"' onclick='form12_delete_item($(this));'>";
							rowsHTML+="<input type='hidden' form='form12_"+id+"'>";
							rowsHTML+="<input type='hidden' form='form12_"+id+"'>";
						rowsHTML+="</td>";			
					rowsHTML+="</tr>";
				
					$('#form12_body').append(rowsHTML);
					
					var fields=document.getElementById("form12_"+id);
					$(fields).on("submit", function(event)
					{
						event.preventDefault();
					});
				});
				
				message_string+="\nAmount: "+filter_fields.elements[3].value;
				message_string+="\ndiscount: "+filter_fields.elements[4].value;
				message_string+="\nTax: "+filter_fields.elements[5].value;
				message_string+="\nTotal: "+filter_fields.elements[6].value;
				
				var subject="Bill from "+get_session_var('title');
				$('#form12_share').show();
				$('#form12_share').click(function()
				{
					modal44_action(filter_fields.elements[1].value,subject,message_string);
				});
				
				hide_loader();
			});
		});
	}
}


/**
 * @form Manage Tasks
 * @formNo 14
 * @Loading heavy
 */
function form14_ini()
{
	show_loader();
	var fid=$("#form14_link").attr('data_id');
	if(fid==null)
		fid="";
	
	var filter_fields=document.getElementById('form14_header');
	
	//populating form 
	var ftype=filter_fields.elements[0].value;
	var fassignee=filter_fields.elements[1].value;
	var fstatus=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form14_index');
	var prev_element=document.getElementById('form14_prev');
	var next_element=document.getElementById('form14_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<task_instances count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+ftype+"</name>" +
			"<description></description>" +
			"<assignee>"+fassignee+"</assignee>" +
			"<t_due></t_due>" +
			"<t_initiated></t_initiated>" +
			"<task_hours></task_hours>" +
			"<status>"+fstatus+"</status>" +
			"<last_updated sort='desc'></last_updated>" +
			"</task_instances>";

	$('#form14_body').html("");

	fetch_requested_data('form14',columns,function(results)
	{
		results.forEach(function(result)
		{
			result.t_due=get_my_datetime(result.t_due);
			result.t_initiated=get_my_datetime(result.t_initiated);
			var message_string="Due time: "+result.t_due+"\nTask: "+result.name+"\nAssignee:"+result.assignee;
			message_string=encodeURIComponent(message_string);
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form14_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Task Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form14_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Assignee'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form14_"+result.id+"' class='dblclick_editable' value='"+result.assignee+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Due Time'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form14_"+result.id+"' class='dblclick_editable' value='"+result.t_due+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form14_"+result.id+"' class='dblclick_editable' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' readonly='readonly' form='form14_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form14_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form14_"+result.id+"' title='Delete' onclick='form14_delete_item($(this));'>";
						rowsHTML+="<a id='form14_whatsapp_"+result.id+"' href='whatsapp://send?text="+message_string+"' target='_blank'><img style='width:25px;height:25px;' src='./images/whatsapp.jpeg' form='form14_"+result.id+"' title='Send details through WhatsApp'></a>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form14_body').append(rowsHTML);
			var fields=document.getElementById("form14_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form14_update_item(fields);
			});
			
			var name_filter=fields.elements[0];
			var assignee_filter=fields.elements[1];
			var due_filter=fields.elements[2];
			var status_filter=fields.elements[3];
						
			var staff_data="<staff>" +
					"<acc_name></acc_name>" +
					"</staff>";
			set_my_value_list(staff_data,assignee_filter);
			
			set_static_value_list('task_instances','status',status_filter);
			$(due_filter).datetimepicker();
		});
		
		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		

		longPressEditable($('.dblclick_editable'));
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'tasks');
		});
		hide_loader();
	});
};

/**
 * @form Enter Customer Returns
 * @formNo 15
 * @Loading light
 */
function form15_ini()
{
	var data_id=$("#form15_link").attr('data_id');
	if(data_id==null)
		data_id="";	
	
	$('#form15_body').html("");

	if(data_id!="")
	{
		show_loader();
		var return_columns="<customer_returns>" +
				"<id>"+data_id+"</id>" +
				"<customer></customer>" +
				"<total></total>" +
				"<return_date></return_date>" +
				"<tax></tax>" +
				"<type>product</type>" +
				"<transaction_id></transaction_id>" +
				"</customer_returns>";
		var return_items_column="<customer_return_items>" +
				"<id></id>" +
				"<return_id>"+data_id+"</return_id>" +
				"<item_name></item_name>" +
				"<batch></batch>" +
				"<notes></notes>" +
				"<quantity></quantity>" +
				"<type></type>" +
				"<refund_amount></refund_amount>" +
				"<exchange_batch></exchange_batch>" +
				"<saleable></saleable>" +
				"<tax></tax>" +
				"</customer_return_items>";
	
		////separate fetch function to get bill details like customer name, total etc.
		fetch_requested_data('',return_columns,function(return_results)
		{
			var filter_fields=document.getElementById('form15_master');
			
			for (var i in return_results)
			{
				filter_fields.elements[1].value=return_results[i].customer;
				filter_fields.elements[2].value=get_my_past_date(return_results[i].return_date);
				filter_fields.elements[3].value=return_results[i].total;
				filter_fields.elements[4].value=data_id;
				filter_fields.elements[5].value=return_results[i].transaction_id;
				filter_fields.elements[6].value=return_results[i].tax;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form15_update_form();
				});
				break;
			}
		
			fetch_requested_data('',return_items_column,function(results)
			{
				var message_string="Returns Bill from:"+encodeURIComponent(get_session_var('title'))+"\nAddress: "+get_session_var('address');
				
				results.forEach(function(result)
				{
					message_string+="\nItem: "+result.item_name;
					message_string+=" Quantity: "+result.quantity;
					
					var rowsHTML="";
					var id=result.id;
					rowsHTML+="<tr>";
					rowsHTML+="<form id='form15_"+id+"'></form>";
						rowsHTML+="<td data-th='Product Name'>";
							rowsHTML+="<textarea readonly='readonly' form='form15_"+id+"'>"+result.item_name+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Batch'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form15_"+id+"' value='"+result.batch+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Notes'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form15_"+id+"' value='"+result.notes+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Quantity'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form15_"+id+"' value='"+result.quantity+"' step='any'>";
							rowsHTML+="</br>Saleable: <input type='checkbox' readonly='readonly' form='form15_"+id+"' "+result.saleable+">";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Type'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form15_"+id+"' value='"+result.type+"'></br>";
							if(result.type=='refund')
							{
								rowsHTML+="Amount <input type='number' readonly='readonly' step='any' form='form15_"+id+"' value='"+result.refund_amount+"'>";
								message_string+=" Refund Rs: "+result.refund_amount;
								mail_string+=" Refund Rs: "+result.refund_amount;

							}
							else
							{
								rowsHTML+="Batch <input type='text' readonly='readonly' form='form15_"+id+"' value='"+result.exhange_batch+"'>";
								message_string+=" Exchanged";
								mail_string+=" Exchanged";
							}
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form15_"+id+"' value='"+result.tax+"'>";
							rowsHTML+="<input type='hidden' form='form15_"+id+"' value='"+id+"'>";
							rowsHTML+="<input type='submit' class='submit_hidden' form='form15_"+id+"' id='save_form15_"+id+"'>";
							rowsHTML+="<input type='button' class='delete_icon' form='form15_"+id+"' id='delete_form15_"+id+"' onclick='form15_delete_item($(this));'>";
						rowsHTML+="</td>";			
					rowsHTML+="</tr>";
				
					$('#form15_body').append(rowsHTML);
					
					var fields=document.getElementById("form15_"+id);
					$(fields).on("submit", function(event)
					{
						event.preventDefault();
					});
				});
				
				
				message_string+="\nTotal: "+filter_fields.elements[3].value;
				message_string=encodeURIComponent(message_string);
				
				var subject="Returns Bill from "+get_session_var('title');
				$('#form15_share').show();
				$('#form15_share').click(function()
				{
					modal44_action(filter_fields.elements[1].value,subject,message_string);
				});
				
				hide_loader();
			});
		});
	}
}

/**
 * @form Manage customer returns
 * @formNo 16
 * @Loading light
 */
function form16_ini()
{
	show_loader();
	var fid=$("#form16_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form16_header');
	
	//populating form 
	if(fid==="")
		fid=filter_fields.elements[0].value;
	var fname=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form16_index');
	var prev_element=document.getElementById('form16_prev');
	var next_element=document.getElementById('form16_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<customer_returns count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<customer>"+fname+"</customer>" +
			"<return_date></return_date>" +
			"<total></total>" +
			"<type></type>" +
			"<tax></tax>" +
			"<transaction_id></transaction_id>" +
			"</customer_returns>";

	$('#form16_body').html("");

	fetch_requested_data('form16',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form16_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Return Id'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form16_"+result.id+"' value='"+result.id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Customer'>";
						rowsHTML+="<textarea readonly='readonly' form='form16_"+result.id+"'>"+result.customer+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Return Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form16_"+result.id+"' value='"+get_my_past_date(result.return_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Return Amount'>";
						rowsHTML+="<input type='number' readonly='readonly' form='form16_"+result.id+"' value='"+result.total+"' step='any'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='button' class='edit_icon' form='form16_"+result.id+"' title='Edit Return'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form16_"+result.id+"' title='Delete Return' onclick='form16_delete_item($(this));'>";
						rowsHTML+="<input type='hidden' form='form16_"+result.id+"' value='"+result.transaction_id+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form16_body').append(rowsHTML);
			var fields=document.getElementById("form16_"+result.id);
			var edit_button=fields.elements[4];
			$(edit_button).on("click", function(event)
			{
				event.preventDefault();
				if(result.type=='product')
					element_display(result.id,'form15');
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		

		longPressEditable($('.dblclick_editable'));
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'customer_returns');
		});
		hide_loader();
	});
}

/**
 * @form Manage supplier returns
 * @formNo 17
 * @Loading light
 */
function form17_ini()
{
	show_loader();
	var fid=$("#form17_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form17_header');
	
	//populating form 
	if(fid==="")
		fid=filter_fields.elements[0].value;
	var fname=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form17_index');
	var prev_element=document.getElementById('form17_prev');
	var next_element=document.getElementById('form17_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<supplier_returns count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<supplier>"+fname+"</supplier>" +
			"<return_date></return_date>" +
			"<total></total>" +
			"<type></type>" +
			"<transaction_id></transaction_id>" +
			"</supplier_returns>";

	$('#form17_body').html("");

	fetch_requested_data('form17',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form17_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Return Id'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form17_"+result.id+"' value='"+result.id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Supplier'>";
						rowsHTML+="<textarea readonly='readonly' form='form17_"+result.id+"'>"+result.supplier+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Return Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form17_"+result.id+"' value='"+get_my_past_date(result.return_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Return Amount'>";
						rowsHTML+="<input type='number' readonly='readonly' form='form17_"+result.id+"' value='"+result.total+"' step='any'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='button' class='edit_icon' form='form17_"+result.id+"' title='Edit Return'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form17_"+result.id+"' title='Delete Return' onclick='form17_delete_item($(this));'>";
						rowsHTML+="<input type='hidden' form='form17_"+result.id+"' value='"+result.transaction_id+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form17_body').append(rowsHTML);
			var fields=document.getElementById("form17_"+result.id);
			var edit_button=fields.elements[4];
			$(edit_button).on("click", function(event)
			{
				event.preventDefault();
				if(result.type=='product')
					element_display(result.id,'form19');
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'supplier_returns');
		});
		hide_loader();
	});
}

/**
 * @form Enter Supplier Returns
 * @formNo 19
 * @Loading light
 */
function form19_ini()
{
	var data_id=$("#form19_link").attr('data_id');
	if(data_id==null)
		data_id="";	
	
	$('#form19_body').html("");

	if(data_id!="")
	{
		show_loader();
		var return_columns="<supplier_returns>" +
				"<id>"+data_id+"</id>" +
				"<supplier></supplier>" +
				"<total></total>" +
				"<tax></tax>" +
				"<return_date></return_date>" +
				"<type>product</type>" +
				"<transaction_id></transaction_id>" +
				"</supplier_returns>";
		var return_items_column="<supplier_return_items>" +
				"<id></id>" +
				"<return_id>"+data_id+"</return_id>" +
				"<item_name></item_name>" +
				"<batch></batch>" +
				"<notes></notes>" +
				"<quantity></quantity>" +
				"<refund_amount></refund_amount>" +
				"<tax></tax>" +
				"<saleable></saleable>" +
				"</supplier_return_items>";
	
		////separate fetch function to get bill details like customer name, total etc.
		fetch_requested_data('',return_columns,function(return_results)
		{
			for (var i in return_results)
			{
				var filter_fields=document.getElementById('form19_master');
				filter_fields.elements[1].value=return_results[i].supplier;
				filter_fields.elements[2].value=get_my_past_date(return_results[i].return_date);
				filter_fields.elements[3].value=return_results[i].total;
				filter_fields.elements[4].value=data_id;
				filter_fields.elements[5].value=return_results[i].transaction_id;
				filter_fields.elements[6].value=return_results[i].tax;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form19_update_form();
				});
				break;
			}
			
			
			fetch_requested_data('',return_items_column,function(results)
			{
				var message_string="Returns from:"+get_session_var('title')+"\nAddress: "+get_session_var('address');
				
				results.forEach(function(result)
				{
					message_string+="\nItem: "+result.item_name;
					message_string+=" Quantity: "+result.quantity;
					message_string+=" Amount: "+result.refund_amount;
					
					var rowsHTML="";
					var id=result.id;
					rowsHTML+="<tr>";
					rowsHTML+="<form id='form19_"+id+"'></form>";
						rowsHTML+="<td data-th='Product Name'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form19_"+id+"' value='"+result.item_name+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Batch'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form19_"+id+"' value='"+result.batch+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Notes'>";
							rowsHTML+="<textarea readonly='readonly' form='form19_"+id+"'>"+result.notes+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Quantity'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form19_"+id+"' value='"+result.quantity+"' step='any'>";
							rowsHTML+="</br>Saleable: <input type='checkbox' readonly='readonly' form='form19_"+id+"' "+result.saleable+">";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Return Amount'>";
							rowsHTML+="<input type='number' readonly='readonly' step='any' form='form19_"+id+"' value='"+result.refund_amount+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form19_"+id+"' value='"+result.tax+"'>";
							rowsHTML+="<input type='hidden' form='form19_"+id+"' value='"+id+"'>";
							rowsHTML+="<input type='submit' class='submit_hidden' form='form19_"+id+"' id='save_form19_"+id+"'>";
							rowsHTML+="<input type='button' class='delete_icon' form='form19_"+id+"' id='delete_form19_"+id+"' onclick='form19_delete_item($(this));'>";
						rowsHTML+="</td>";			
					rowsHTML+="</tr>";
				
					$('#form19_body').append(rowsHTML);
					
					var fields=document.getElementById("form19_"+id);
					$(fields).on("submit", function(event)
					{
						event.preventDefault();
					});
				});

				message_string+="\nTotal Refund: "+filter_fields.elements[3].value;
				message_string=encodeURIComponent(message_string);
				
				var subject="Returns from "+get_session_var('title');
				$('#form19_share').show();
				$('#form19_share').click(function()
				{
					modal44_action(filter_fields.elements[1].value,subject,message_string);
				});
				
				hide_loader();
			});
		});
	}
}


/**
 * @form New Supplier Bill
 * @formNo 21
 * @Loading light
 */
function form21_ini()
{
	var bill_id=$("#form21_link").attr('data_id');
	if(bill_id==null)
		bill_id="";	
	
	$('#form21_body').html("");

	if(bill_id!="")
	{
		show_loader();
		var bill_columns="<supplier_bills>" +
				"<id exact='yes'>"+bill_id+"</id>" +
				"<bill_id></bill_id>" +
				"<supplier></supplier>" +
				"<total></total>" +
				"<amount></amount>" +
				"<discount></discount>" +
				"<tax></tax>" +
				"<bill_date></bill_date>" +
				"<entry_date></entry_date>" +
				"<notes></notes>" +
				"<transaction_id></transaction_id>" +
				"</supplier_bills>";
		
		////separate fetch function to get bill details like customer name, total etc.
		fetch_requested_data('',bill_columns,function(bill_results)
		{
			for (var i in bill_results)
			{
				var filter_fields=document.getElementById('form21_master');
				filter_fields.elements[1].value=bill_results[i].supplier;
				filter_fields.elements[2].value=bill_results[i].bill_id;
				filter_fields.elements[3].value=get_my_past_date(bill_results[i].bill_date);
				filter_fields.elements[4].value=get_my_past_date(bill_results[i].entry_date);
				filter_fields.elements[5].value=bill_results[i].amount;
				filter_fields.elements[6].value=bill_results[i].discount;
				filter_fields.elements[7].value=bill_results[i].tax;
				filter_fields.elements[8].value=bill_results[i].total;
				filter_fields.elements[9].value=bill_results[i].notes;
				filter_fields.elements[10].value=bill_id;
				filter_fields.elements[11].value=bill_results[i].transaction_id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form21_update_form();
				});
				
				break;
			}
		});
		
		var bill_items_column="<supplier_bill_items>" +
				"<id></id>" +
				"<product_name></product_name>" +
				"<batch></batch>" +
				"<amount></amount>" +
				"<tax></tax>" +
				"<total></total>" +
				"<unit_price></unit_price>" +
				"<quantity></quantity>" +
				"<storage></storage>" +
				"<bill_id exact='yes'>"+bill_id+"</bill_id>" +
				"</supplier_bill_items>";
		
		fetch_requested_data('',bill_items_column,function(results)
		{
			results.forEach(function(result)
			{
				var rowsHTML="";
				var id=result.id;
				rowsHTML+="<tr>";
				rowsHTML+="<form id='form21_"+id+"'></form>";
					rowsHTML+="<td data-th='Product Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form21_"+id+"'>"+result.product_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Quantity'>";
						rowsHTML+="<input type='number' readonly='readonly' form='form21_"+id+"' value='"+result.quantity+"' step='any'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Amount'>";
						rowsHTML+="Total: <input type='number' readonly='readonly' form='form21_"+id+"' value='"+result.total+"' step='any'></br>";
						rowsHTML+="Tax: <input type='number' readonly='readonly' form='form21_"+id+"' value='"+result.tax+"' step='any'></br>";
						rowsHTML+="Amount: <input type='number' readonly='readonly' form='form21_"+id+"' value='"+result.amount+"' step='any'></br>";
						rowsHTML+="Unit Price: <input type='number' readonly='readonly' form='form21_"+id+"' value='"+result.unit_price+"' step='any'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Batch'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form21_"+id+"' value='"+result.batch+"'>";
						rowsHTML+="<input type='hidden' form='form21_"+id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Storage Area'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form21_"+id+"' value='"+result.storage+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form21_"+id+"' value='"+id+"'>";
						rowsHTML+="<input type='submit' class='submit_hidden' form='form21_"+id+"' id='save_form21_"+id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form21_"+id+"' id='delete_form21_"+id+"' onclick='form21_delete_item($(this));'>";
					rowsHTML+="</td>";			
				rowsHTML+="</tr>";
			
				$('#form21_body').append(rowsHTML);
				
				var fields=document.getElementById("form21_"+id);
				$(fields).on("submit", function(event)
				{
					event.preventDefault();
				});
			});
			hide_loader();
		});
	}
}



/**
 * @form New Purchase order
 * @formNo 24
 * @Loading light
 */
function form24_ini()
{
	var order_id=$("#form24_link").attr('data_id');
	if(order_id==null)
		order_id="";	
	
	$('#form24_body').html("");
	$('#form24_whatsapp').hide();
	if(order_id!="")
	{
		show_loader();
		var order_columns="<purchase_orders>" +
				"<id>"+order_id+"</id>" +
				"<supplier></supplier>" +
				"<order_date></order_date>" +
				"<status></status>" +
				"<notes></notes>" +
				"</purchase_orders>";
		var order_items_column="<purchase_order_items>" +
				"<id></id>" +
				"<product_name></product_name>" +
				"<quantity></quantity>" +
				"<order_id>"+order_id+"</order_id>" +
				"<make></make>" +
				"<price></price>" +
				"</purchase_order_items>";
	
		////separate fetch function to get order details like customer name, total etc.
		fetch_requested_data('',order_columns,function(order_results)
		{
			var filter_fields=document.getElementById('form24_master');
			
			for(var i in order_results)
			{
				filter_fields.elements[1].value=order_results[i].supplier;
				filter_fields.elements[2].value=get_my_past_date(order_results[i].order_date);
				filter_fields.elements[3].value=order_results[i].notes;
				filter_fields.elements[4].value=order_results[i].status;
				filter_fields.elements[5].value=order_id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form24_update_form();
				});
				break;
			}
		
			fetch_requested_data('',order_items_column,function(results)
			{
				var message_string="Order from: "+get_session_var('title')+"\nAddress: "+get_session_var('address');
				
				results.forEach(function(result)
				{
					message_string+="\nProduct: "+result.product_name;
					message_string+="Quantity: "+result.quantity;
					
					var rowsHTML="";
					var id=result.id;
					rowsHTML+="<tr>";
					rowsHTML+="<form id='form24_"+id+"'></form>";
						rowsHTML+="<td data-th='Product Name'>";
							rowsHTML+="<textarea readonly='readonly' required form='form24_"+id+"'>"+result.product_name+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Quantity'>";
							rowsHTML+="<input type='number' class='dblclick_editable' readonly='readonly' required form='form24_"+id+"' value='"+result.quantity+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Make'>";
							rowsHTML+="<textarea readonly='readonly' required form='form24_"+id+"'>"+result.make+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Price'>";
							rowsHTML+="<input type='number'readonly='readonly' required form='form24_"+id+"' value='"+result.price+"' step='any'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form24_"+id+"' value='"+id+"'>";
							rowsHTML+="<input type='submit' class='submit_hidden' form='form24_"+id+"' id='save_form24_"+id+"'>";
							rowsHTML+="<input type='button' class='delete_icon' form='form24_"+id+"' id='delete_form24_"+id+"' onclick='form24_delete_item($(this));'>";
						rowsHTML+="</td>";			
					rowsHTML+="</tr>";
				
					$('#form24_body').append(rowsHTML);
					
					var fields=document.getElementById("form24_"+id);
					var name_filter=fields.elements[0];
					
					$(fields).on("submit", function(event)
					{
						event.preventDefault();
						form24_update_item(fields);
					});
				});
				
				message_string+="\nOrder Date: "+filter_fields.elements[2].value;
				message_string+="\nNotes: "+filter_fields.elements[3].value;
				
				var subject="Purchase Order from: "+get_session_var('title');
				$('#form24_share').show();
				$('#form24_share').click(function()
				{
					modal44_action(filter_fields.elements[1].value,subject,message_string);
				});
				
				hide_loader();
			});
		});
	}
}



/**
 * @form Manage Customers
 * @formNo 30
 * @Loading light
 */
function form30_ini()
{
	show_loader();
	var fid=$("#form30_link").attr('data_id');
	if(fid==null)
		fid="";	
		
	var filter_fields=document.getElementById('form30_header');
	
	var fname=filter_fields.elements[0].value;
	var fcontact=filter_fields.elements[1].value;
	var femail=filter_fields.elements[2].value;
	var fstatus=filter_fields.elements[3].value;
	
	////indexing///
	var index_element=document.getElementById('form30_index');
	var prev_element=document.getElementById('form30_prev');
	var next_element=document.getElementById('form30_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<customers count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fname+"</name>" +
			"<phone>"+fcontact+"</phone>" +
			"<email>"+femail+"</email>" +
			"<status>"+fstatus+"</status>" +
			"<acc_name></acc_name>" +
			"<notes></notes>" +
			"<address></address>" +
			"<pincode></pincode>" +
			"<city></city>" +
			"<state></state>" +
			"<country></country>" +
			"<address_status></address_status>" +
			"<last_updated sort='desc'></last_updated>" +
			"</customers>";

	$('#form30_body').html("");

	fetch_requested_data('form30',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form30_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<textarea readonly='readonly' required form='form30_"+result.id+"'>"+result.name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Phone'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form30_"+result.id+"' value='"+result.phone+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Email'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form30_"+result.id+"' class='dblclick_editable' value='"+result.email+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Address'>";
						rowsHTML+="<textarea readonly='readonly' form='form30_"+result.id+"'>"+result.address+", "+result.pincode+", "+result.city+", "+result.state+", "+result.country+"</textarea>";
						rowsHTML+="<img class='edit_icon' src='images/edit.png' form='form30_"+result.id+"' onclick='modal24_action($(this));'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form30_"+result.id+"' class='dblclick_editable' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form30_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form30_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form30_"+result.id+"' value='saved' onclick='form30_delete_item($(this));'>";
						rowsHTML+="<input type='hidden' form='form30_"+result.id+"' value='"+result.address+"'>";
						rowsHTML+="<input type='hidden' form='form30_"+result.id+"' value='"+result.pincode+"'>";
						rowsHTML+="<input type='hidden' form='form30_"+result.id+"' value='"+result.city+"'>";
						rowsHTML+="<input type='hidden' form='form30_"+result.id+"' value='"+result.state+"'>";
						rowsHTML+="<input type='hidden' form='form30_"+result.id+"' value='"+result.country+"'>";
						rowsHTML+="<input type='hidden' form='form30_"+result.id+"' value='"+result.address_status+"'>";
					rowsHTML+="</td>";
			rowsHTML+="</tr>";
			
			$('#form30_body').append(rowsHTML);
			var fields=document.getElementById("form30_"+result.id);
			var fstatus=fields.elements[4];
			
			set_static_value_list('customers','status',fstatus);
			
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form30_update_item(fields);
			});
		});
		
		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[5];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'customers');
		});
		hide_loader();
	});
};


/**
 * @form Manage Offers
 * @formNo 35
 * @Loading light
 */
function form35_ini()
{
	show_loader();
	var fid=$("#form35_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form35_header');
	
	var fname=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	var fstatus=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form35_index');
	var prev_element=document.getElementById('form35_prev');
	var next_element=document.getElementById('form35_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<offers count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<offer_name>"+fname+"</offer_name>" +
			"<offer_type>"+ftype+"</offer_type>" +
			"<end_date></end_date>" +
			"<offer_detail></offer_detail>" +
			"<status>"+fstatus+"</status>" +
			"<product_name></product_name>" +
			"<batch></batch>" +
			"<service></service>" +
			"<criteria_type></criteria_type>" +
			"<criteria_amount></criteria_amount>" +
			"<criteria_quantity></criteria_quantity>" +
			"<result_type></result_type>" +
			"<discount_percent></discount_percent>" +
			"<discount_amount></discount_amount>" +
			"<quantity_add_percent></quantity_add_percent>" +
			"<quantity_add_amount></quantity_add_amount>" +
			"<free_product_name></free_product_name>" +
			"<free_product_quantity></free_product_quantity>" +
			"<last_updated sort='desc'></last_updated>" +
			"</offers>";

	$('#form35_body').html("");

	fetch_requested_data('form35',columns,function(results)
	{
		results.forEach(function(result)
		{
			var message_string="Exciting Offer\n"+result.offer_detail+"\nAvail at:"+encodeURIComponent(get_session_var('title'))+"\nVisit us at:"+get_session_var('address');
			message_string=encodeURIComponent(message_string);
			
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form35_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Offer Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form35_"+result.id+"'>"+result.offer_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Offer Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form35_"+result.id+"' value='"+result.offer_type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='End Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form35_"+result.id+"' class='dblclick_editable' value='"+get_my_past_date(result.end_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Offer Detail'>";
						rowsHTML+="<textarea readonly='readonly' form='form35_"+result.id+"'>"+result.offer_detail+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form35_"+result.id+"' class='dblclick_editable' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form35_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form35_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form35_"+result.id+"' value='saved' onclick='form35_delete_item($(this));'>";
						rowsHTML+="<a id='form35_whatsapp_"+result.id+"' href='whatsapp://send?text="+message_string+"' target='_blank'><img style='width:25px;height:25px;' src='./images/whatsapp.jpeg' form='form35_"+result.id+"' title='Send details through WhatsApp'></a>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form35_body').append(rowsHTML);
			var fields=document.getElementById("form35_"+result.id);
			var end_filter=fields.elements[2];
			var status_filter=fields.elements[4];
			
			$(end_filter).datepicker();
			set_static_value_list('offers','status',status_filter);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form35_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'offers');
		});
		hide_loader();
	});
};


/**
 * @form Store Placement
 * @formNo 38
 * @Loading light
 */
function form38_ini()
{
	show_loader();
	var fid=$("#form38_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form38_header');
	
	var fname=filter_fields.elements[0].value;
	var fbatch=filter_fields.elements[1].value;
	var farea=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form38_index');
	var prev_element=document.getElementById('form38_prev');
	var next_element=document.getElementById('form38_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<area_utilization count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<batch>"+fbatch+"</batch>" +
			"<item_name>"+fname+"</item_name>" +
			"<name>"+farea+"</name>" +
			"<last_updated sort='desc'></last_updated>" +
			"</area_utilization>";

	$('#form38_body').html("");

	fetch_requested_data('form38',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form38_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Item Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form38_"+result.id+"' value='"+result.item_name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Batch'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form38_"+result.id+"' value='"+result.batch+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Store Area'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form38_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form38_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form38_"+result.id+"' title='Delete' onclick='form38_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form38_body').append(rowsHTML);
			var fields=document.getElementById("form38_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'store_placement');
		});
		hide_loader();
	});
};


/**
 * @form Manage Products
 * @formNo 39
 * @Loading heavy
 */
function form39_ini()
{
	show_loader();
	var fid=$("#form39_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form39_header');
	
	var fname=filter_fields.elements[0].value;
	var fmakes=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form39_index');
	var prev_element=document.getElementById('form39_prev');
	var next_element=document.getElementById('form39_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<product_master count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fname+"</name>" +
			"<make>"+fmakes+"</make>" +
			"<description></description>" +
			"<bar_code></bar_code>" +
			"<tax></tax>" +
			"<last_updated sort='desc'></last_updated>" +
			"</product_master>";

	$('#form39_body').html("");

	fetch_requested_data('form39',columns,function(results)
	{
		results.forEach(function(result)
		{
			var picture_column="<documents>" +
					"<id></id>" +
					"<url></url>" +
					"<doc_type>product_master</doc_type>" +
					"<target_id>"+result.id+"</target_id>" +
					"</documents>";
			fetch_requested_data('form39',picture_column,function(pic_results)
			{
				var pic_results_url="";
				var pic_results_id="";
				for (var j in pic_results)
				{
					pic_results_id=pic_results[j].id;
					pic_results_url=pic_results[j].url;
				}
				if(pic_results.length===0)
				{
					pic_results_id=get_new_key();
					pic_results_url="";
				}
				
				updated_url=pic_results_url.replace(/ /g,"+");
				var rowsHTML="";
				rowsHTML+="<tr>";
					rowsHTML+="<form id='form39_"+result.id+"'></form>";
						rowsHTML+="<td data-th='Name'>";
							rowsHTML+="<textarea readonly='readonly' form='form39_"+result.id+"'>"+result.name+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Make'>";
							rowsHTML+="<textarea readonly='readonly' form='form39_"+result.id+"' class='dblclick_editable'>"+result.make+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Description'>";
							rowsHTML+="<textarea readonly='readonly' form='form39_"+result.id+"' class='dblclick_editable'>"+result.description+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Picture'>";
							rowsHTML+="<output form='form39_"+result.id+"'><div class='figure' name='"+pic_results_id+"'><img id='img_form39_"+result.id+"' src='"+updated_url+"'></div></output>";
							rowsHTML+="<input type='file' form='form39_"+result.id+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Tax'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form39_"+result.id+"' class='dblclick_editable' value='"+result.tax+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form39_"+result.id+"' value='"+result.id+"'>";
							rowsHTML+="<input type='submit' class='save_icon' form='form39_"+result.id+"' value='saved'>";
							rowsHTML+="<input type='button' class='copy_icon' form='form39_"+result.id+"' value='saved' onclick='modal19_action($(this));'>";
							rowsHTML+="<input type='button' class='delete_icon' form='form39_"+result.id+"' value='saved' onclick='form39_delete_item($(this));'>";	
						rowsHTML+="</td>";			
				rowsHTML+="</tr>";
			
				$('#form39_body').append(rowsHTML);
	
				var fields=document.getElementById("form39_"+result.id);
				var pictureinfo=fields.elements[3];
				var picture=fields.elements[4];

				$(fields).on("submit",function(event)
				{
					event.preventDefault();
					form39_update_item(fields);
				});
				
				picture.addEventListener('change',function(evt)
				{
					select_picture(evt,pictureinfo,function(dataURL)
					{
						pictureinfo.innerHTML="<div class='figure' name='"+pic_results_id+"'><img id='img_form39_"+result.id+"' src='"+dataURL+"'></div>";			
					});
				},false);
				
				longPressEditable($('.dblclick_editable'));
				
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'products');
		});
		hide_loader();
	});	
};


/**
 * @form Manage suppliers
 * @formNo 40
 * @Loading light
 */
function form40_ini()
{
	show_loader();
	var fid=$("#form40_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form40_header');

	var fname=filter_fields.elements[0].value;
	var fcontact=filter_fields.elements[1].value;
	var femail=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form40_index');
	var prev_element=document.getElementById('form40_prev');
	var next_element=document.getElementById('form40_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<suppliers count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<notes></notes>" +
			"<name>"+fname+"</name>" +
			"<phone>"+fcontact+"</phone>" +
			"<email>"+femail+"</email>" +
			"<acc_name></acc_name>" +
			"<address></address>" +
			"<pincode></pincode>" +
			"<city></city>" +
			"<state></state>" +
			"<country></country>" +
			"<address_status></address_status>" +
			"<last_updated sort='desc'></last_updated>" +
			"</suppliers>";

	$('#form40_body').html("");

	fetch_requested_data('form40',columns,function(results)
	{	
		results.forEach(function(result)
		{		
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form40_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<textarea readonly='readonly' required form='form40_"+result.id+"'>"+result.name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Phone'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form40_"+result.id+"' class='dblclick_editable' value='"+result.phone+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Email'>";
						rowsHTML+="<textarea readonly='readonly' form='form40_"+result.id+"' class='dblclick_editable'>"+result.email+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Address'>";
						rowsHTML+="<textarea readonly='readonly' form='form40_"+result.id+"'>"+result.address+", "+result.pincode+", "+result.city+", "+result.state+", "+result.country+"</textarea>";
						rowsHTML+="<img class='edit_icon' src='images/edit.png' form='form40_"+result.id+"' onclick='modal25_action($(this));'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Notes'>";
						rowsHTML+="<textarea readonly='readonly' form='form40_"+result.id+"' class='dblclick_editable'>"+result.notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form40_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form40_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form40_"+result.id+"' value='saved' onclick='form40_delete_item($(this));'>";
						rowsHTML+="<input type='hidden' form='form40_"+result.id+"' value='"+result.address+"'>";
						rowsHTML+="<input type='hidden' form='form40_"+result.id+"' value='"+result.pincode+"'>";
						rowsHTML+="<input type='hidden' form='form40_"+result.id+"' value='"+result.city+"'>";
						rowsHTML+="<input type='hidden' form='form40_"+result.id+"' value='"+result.state+"'>";
						rowsHTML+="<input type='hidden' form='form40_"+result.id+"' value='"+result.country+"'>";
						rowsHTML+="<input type='hidden' form='form40_"+result.id+"' value='"+result.address_status+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form40_body').append(rowsHTML);
			var fields=document.getElementById("form40_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form40_update_item(fields);
			});
		});
		
		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'suppliers');
		});
		hide_loader();
	});
};

/**
 * @form Verify Customer geo-location
 * @formNo 41
 */
function form41_ini()
{
	show_loader();

	if(is_online())
	{
		var domain=get_domain();
		var username=get_username();
		var re_access=get_session_var('re');
		ajax_with_custom_func("./ajax/geoCode.php","domain="+domain+"&username="+username+"&type=customers&re="+re_access,function(e)
		{
			console.log(e.responseText);

			$('#form41_header').html("");
		
			var lat=get_session_var('lat');
			var lng=get_session_var('lng');
			var title=get_session_var('title');
			
			if(typeof map41 != 'undefined')
				map41.remove();
		
			map41 = L.map('form41_map',{
				center: [lat,lng], 
				zoom: 10
			});
		
			L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
		        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenstreetMap</a>',
		        subdomains:'1234'
		    }).addTo(map41);
			
			//////////changeable master coordinates/////////
			
			var mlatlng=L.latLng(lat,lng);
			var mmarker=L.marker(mlatlng,{draggable:true}).addTo(map41).bindPopup(title);
			mmarker.on('dragend',function(event){
				var m=event.target;
				var latlng=m.getLatLng();
				var form=document.getElementById('form41_master');
				form.elements[1].value=latlng.lat;
				form.elements[2].value=latlng.lng;
				var save_button=form.elements[3];
				$(save_button).show();
			});
			
			var rowsHTML="<div class='customers_content_item'>" +
					"<form id='form41_master'>" +
					"Name: <textarea style='height:40px;width:100px' readonly='readonly'>"+title+"</textarea></br>" +
					"Latitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+lat+"</textarea></br>" +
					"Longitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+lng+"</textarea></br>" +
					"<input type='button' class='export_icon' value='Confirm' style='display:none;' form='form41_master'>" +
					"</form>" +
					"</div>";
			
			$('#form41_header').append(rowsHTML);
			var fields=document.getElementById("form41_master");
			var save_button=fields.elements[3];
			$(save_button).on("click", function(event)
			{
				event.preventDefault();
				form41_update_master(fields);
			});
			$(fields).parent().on('click',function(event)
			{
				//console.log('clicked on master');
				mmarker.openPopup();
			});
		
			/////////////////////////////////////////////////
			
			var customers_data="<customers>" +
					"<id></id>" +
					"<name></name>" +
					"<lat></lat>" +
					"<lng></lng>" +
					"<acc_name></acc_name>" +
					"<address_status>unconfirmed</address_status>" +
					"<address></address>" +
					"<pincode></pincode>" +
					"<city></city>" +
					"<state></state>" +
					"<country></country>" +
					"</customers>";
			fetch_requested_data('form41',customers_data,function(customers)
			{
				customers.forEach(function(customer)
				{
					//console.log('fetched customer');
					if(customer.lat=='')
					{
						customer.lat=lat;
					}
					if(customer.lng=='')
					{
						customer.lng=lng;
					}
					var latlng=L.latLng(customer.lat,customer.lng);
					var marker=L.marker(latlng,{draggable:true}).addTo(map41).bindPopup(customer.name);
					marker.on('dragend',function(event){
						var m=event.target;
						var latlng=m.getLatLng();
						var form=document.getElementById('form41_'+customer.id);
						form.elements[1].value=latlng.lat;
						form.elements[2].value=latlng.lng;
						var save_button=form.elements[4];
						$(save_button).show();
					});
					
					var rowsHTML="<div class='customers_content_item'>" +
							"<form id='form41_"+customer.id+"'>" +
							"Name: <textarea style='height:40px;width:100px' readonly='readonly'>"+customer.acc_name+"</textarea></br>" +
							"Latitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+customer.lat+"</textarea></br>" +
							"Longitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+customer.lng+"</textarea></br>" +
							"<input type='hidden' value='"+customer.id+"'>" +
							"<input type='button' class='export_icon' value='Confirm' form='form41_"+customer.id+"'>" +
							"</form>" +
							"</div>";
					
					$('#form41_header').append(rowsHTML);
					var fields=document.getElementById("form41_"+customer.id);
					var save_button=fields.elements[4];
					$(save_button).on("click", function(event)
					{
						event.preventDefault();
						form41_update_item(fields);
					});
					$(fields).parent().on('click',function(event)
					{
						//console.log('clicked on customer');
						marker.openPopup();
					});
				});
				
				var scrollPane=$(".customers_pane");
				var scrollContent=$(".customers_content");
				scrollContent.css('width',(Math.round(225*customers.length)+225)+"px");
				$(".customers_bar").slider({
					slide: function(event,ui) {
						if (scrollContent.width()>scrollPane.width()){
							scrollContent.css( "margin-left", Math.round(ui.value/100*(scrollPane.width()-scrollContent.width()))+"px");
						} 
						else{
							scrollContent.css("margin-left",0);
						}
					}
				});
		
				scrollPane.css("overflow","hidden");			
			
				hide_loader();
			});
		});
	}
	else
	{
		$("#modal6").dialog("open");
	}
}


/**
 * @form Manage Bills
 * @formNo 42
 * @Loading light
 */
function form42_ini()
{
	show_loader();
	var fid=$("#form42_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form42_header');
	
	//populating form 
	if(fid==="")
		fid=filter_fields.elements[0].value;
	var fname=filter_fields.elements[1].value;

	////indexing///
	var index_element=document.getElementById('form42_index');
	var prev_element=document.getElementById('form42_prev');
	var next_element=document.getElementById('form42_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<bills count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<customer_name>"+fname+"</customer_name>" +
			"<bill_date></bill_date>" +
			"<total></total>" +
			"<type></type>" +
			"<transaction_id></transaction_id>" +
			"<last_updated sort='desc'></last_updated>" +
			"</bills>";

	$('#form42_body').html("");

	fetch_requested_data('form42',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form42_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Bill No.'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form42_"+result.id+"' value='"+result.id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Customer'>";
						rowsHTML+="<textarea readonly='readonly' form='form42_"+result.id+"'>"+result.customer_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Bill Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form42_"+result.id+"' value='"+get_my_past_date(result.bill_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Bill Amount'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form42_"+result.id+"' value='"+result.total+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='button' class='edit_icon' form='form42_"+result.id+"' title='Edit Bill'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form42_"+result.id+"' title='Delete Bill' onclick='form42_delete_item($(this));'>";
						rowsHTML+="<input type='hidden' form='form42_"+result.id+"' value='"+result.transaction_id+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form42_body').append(rowsHTML);
			var fields=document.getElementById("form42_"+result.id);
			var edit_button=fields.elements[4];
			$(edit_button).on("click", function(event)
			{
				event.preventDefault();
				if(result.type=='product')
					element_display(result.id,'form12');
				else if(result.type=='service')
					element_display(result.id,'form10');
				else if(result.type=='both')
					element_display(result.id,'form72');
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'bills');
		});
		hide_loader();
	});
}


/**
 * @form Manage Purchase orders
 * @formNo 43
 * @Loading light
 */
function form43_ini()
{
	show_loader();
	var fid=$("#form43_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form43_header');
	
	//populating form 
	if(fid==="")
		fid=filter_fields.elements[0].value;
	var fname=filter_fields.elements[1].value;
	var fstatus=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form43_index');
	var prev_element=document.getElementById('form43_prev');
	var next_element=document.getElementById('form43_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<purchase_orders count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<supplier>"+fname+"</supplier>" +
			"<order_date></order_date>" +
			"<status>"+fstatus+"</status>" +
			"<notes></notes>" +
			"<last_updated sort='desc'></last_updated>" +
			"</purchase_orders>";

	$('#form43_body').html("");

	fetch_requested_data('form43',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form43_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Order No.'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form43_"+result.id+"' value='"+result.id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Supplier'>";
						rowsHTML+="<textarea readonly='readonly' form='form43_"+result.id+"'>"+result.supplier+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Order Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form43_"+result.id+"' value='"+get_my_past_date(result.order_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Notes'>";
						rowsHTML+="<textarea readonly='readonly' class='dblclick_editable' form='form43_"+result.id+"'>"+result.notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form43_"+result.id+"' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='button' class='edit_icon' form='form43_"+result.id+"' title='Edit order' onclick=\"element_display('"+result.id+"','form24');\">";
						rowsHTML+="<input type='submit' class='save_icon' form='form43_"+result.id+"' title='Save order'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form43_"+result.id+"' title='Delete order' onclick='form43_delete_item($(this));'>";
					rowsHTML+="</td>";
			rowsHTML+="</tr>";
			
			$('#form43_body').append(rowsHTML);
			var fields=document.getElementById("form43_"+result.id);
			var status_filter=fields.elements[3];
			
			set_static_value_list('purchase_orders','status',status_filter);
			
			$(fields).on("submit",function(event)
			{
				event.preventDefault();
				form43_update_item(fields);
			});
						
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'purchase_orders');
		});
		hide_loader();
	});
};


/**
 * @form Manage Pamphlets
 * @formNo 44
 * @Loading light
 */
function form44_ini()
{
	show_loader();
	var fid=$("#form44_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form44_header');
	
	//populating form 
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form44_index');
	var prev_element=document.getElementById('form44_prev');
	var next_element=document.getElementById('form44_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<pamphlets count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fname+"</name>" +
			"<count_items></count_items>" +
			"<last_updated sort='desc'></last_updated>" +
			"</pamphlets>";

	$('#form44_body').html("");

	fetch_requested_data('form44',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form44_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Pamphlet Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form44_"+result.id+"'>"+result.name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' readonly='readonly' form='form44_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='button' class='edit_icon' form='form44_"+result.id+"' title='Edit' onclick=\"element_display('"+result.id+"','form2');\">";
						rowsHTML+="<input type='button' class='delete_icon' form='form44_"+result.id+"' title='Delete' onclick='form44_delete_item($(this));'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form44_body').append(rowsHTML);
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}

		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'pamphlets');
		});
		hide_loader();
	});
};


/**
 * @form Set Defaults
 * @formNo 46
 * @Loading light
 */
function form46_ini()
{
	show_loader();
	var fid=$("#form46_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form46_header');
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form46_index');
	var prev_element=document.getElementById('form46_prev');
	var next_element=document.getElementById('form46_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<user_preferences count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name></name>" +
			"<display_name>"+fname+"</display_name>" +
			"<value></value>" +
			"<status>active</status>" +
			"<type>other</type>" +
			"</user_preferences>";

	$('#form46_body').html("");

	fetch_requested_data('form46',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form46_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Setting'>";
						rowsHTML+="<textarea readonly='readonly' form='form46_"+result.id+"' data-i18n='form."+result.display_name+"'></textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Value'>";
						rowsHTML+="<textarea readonly='readonly' class='dblclick_editable' form='form46_"+result.id+"'>"+result.value+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form46_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='hidden' form='form46_"+result.id+"' value='"+result.name+"'>";
						rowsHTML+="<input type='submit' class='save_icon' id='save_form46_"+result.id+"' form='form46_"+result.id+"' title='Save'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form46_body').append(rowsHTML);
			
			var fields=document.getElementById("form46_"+result.id);
			$(fields).on("submit",function(event)
			{
				event.preventDefault();
				form46_update_item(fields);
			});
		});
		
		$('#form46_body').find('textarea').i18n();

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		
		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'system_defaults');
		});
		hide_loader();
	});
};


/**
 * @form Select Reports
 * @formNo 48
 * @Loading light
 */
function form48_ini()
{
	show_loader();
	var fid=$("#form48_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form48_header');
	
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form48_index');
	var prev_element=document.getElementById('form48_prev');
	var next_element=document.getElementById('form48_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<user_preferences count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name></name>" +
			"<display_name>"+fname+"</display_name>" +
			"<value></value>" +
			"<status>active</status>" +
			"<type>report</type>" +
			"</user_preferences>";

	$('#form48_body').html("");

	fetch_requested_data('form48',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form48_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Report'>";
						rowsHTML+="<textarea readonly='readonly' form='form48_"+result.id+"' data-i18n='form."+result.display_name+"'></textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Selection'>";
						rowsHTML+="<input type='checkbox' form='form48_"+result.id+"' "+result.value+">";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form48_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='hidden' form='form48_"+result.id+"' value='"+result.name+"'>";
						rowsHTML+="<input type='submit' class='save_icon' id='save_form48_"+result.id+"' form='form48_"+result.id+"' value='saved'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form48_body').append(rowsHTML);
			var fields=document.getElementById("form48_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form48_update_item(fields);
			});
		});
		
		$('#form48_body').find('textarea').i18n();

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'reports');
		});
		hide_loader();
	});
};

/**
 * @form Select Forms
 * @formNo 49
 * @Loading light
 */
function form49_ini()
{
	show_loader();
	var fid=$("#form49_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form49_header');
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form49_index');
	var prev_element=document.getElementById('form49_prev');
	var next_element=document.getElementById('form49_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<user_preferences count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name></name>" +
			"<display_name>"+fname+"</display_name>" +
			"<value></value>" +
			"<status>active</status>" +
			"<type>form</type>" +
			"</user_preferences>";

	$('#form49_body').html("");

	fetch_requested_data('form49',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form49_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Form'>";
						rowsHTML+="<textarea readonly='readonly' form='form49_"+result.id+"' data-i18n='form."+result.display_name+"'></textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Selection'>";
						rowsHTML+="<input type='checkbox' form='form49_"+result.id+"' "+result.value+">";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form49_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='hidden' form='form49_"+result.id+"' value='"+result.name+"'>";
						rowsHTML+="<input type='submit' class='save_icon' id='save_form49_"+result.id+"' form='form49_"+result.id+"' value='saved'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form49_body').append(rowsHTML);
			var fields=document.getElementById("form49_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form49_update_item(fields);
			});
		});
		
		$('#form49_body').find('textarea').i18n();
		

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'forms');
		});
		hide_loader();
	});
};


/**
 * @form Set Accounting Defaults
 * @formNo 50
 * @Loading light
 */
function form50_ini()
{
	show_loader();
	var fid=$("#form50_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form50_header');
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form50_index');
	var prev_element=document.getElementById('form50_prev');
	var next_element=document.getElementById('form50_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<user_preferences count='25' start_index='"+start_index+"'>" +
		"<id>"+fid+"</id>" +
		"<name></name>" +
		"<display_name>"+fname+"</display_name>" +
		"<value></value>" +
		"<status>active</status>" +
		"<type>accounting</type>" +
		"</user_preferences>";

	$('#form50_body').html("");

	fetch_requested_data('form50',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form50_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form50_"+result.id+"'>"+result.display_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Value'>";
						rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form50_"+result.id+"' value='"+result.value+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form50_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='hidden' form='form50_"+result.id+"' value='"+result.name+"'>";
						rowsHTML+="<input type='submit' class='save_icon' id='save_form50_"+result.id+"' form='form50_"+result.id+"'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form50_body').append(rowsHTML);
			var fields=document.getElementById("form50_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form50_update_item(fields);
			});
		});
		
		$('#form50_body').find('textarea').i18n();

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		
		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'accounting');
		});
		hide_loader();
	});
};

/**
 * @form Access Control
 * @formNo 51
 * @Loading light
 */
function form51_ini()
{
	var header_fields=document.getElementById('form51_master');
	header_fields.elements[2].value="";
	header_fields.elements[3].value='';
	header_fields.elements[4].value="";
	
	$('#form51_body').html("");

	var	fuser=header_fields.elements[1].value;
	if(fuser!="")
	{
		show_loader();
		var user_name_columns="<staff>" +
				"<id></id>" +
				"<name></name>" +
				"<username exact='yes'>"+fuser+"</username>" +
				"</staff>";
		fetch_requested_data('form51',user_name_columns,function(user_results)
		{
			for(var i in user_results)
			{
				header_fields.elements[2].value=user_results[i].name;
				header_fields.elements[3].value='';
				header_fields.elements[4].value=user_results[i].id;
				break;
			}
		});
		var columns="<access_control>" +
				"<id></id>" +
				"<username exact='yes'>"+fuser+"</username>" +
				"<element_id></element_id>" +
				"<element_name></element_name>" +
				"<status>active</status>" +
				"<re></re>" +
				"<cr></cr>" +
				"<up></up>" +
				"<del></del>" +
				"</access_control>";
		
		fetch_requested_data('form51',columns,function(results)
		{
			if(results.length==0)
			{
				//console.log('new user');
				var elements_name="<access_control>" +
							"<id></id>" +
							"<username exact='yes'>master</username>"+
							"<element_id></element_id>"+
							"<element_name></element_name>"+
							"<status>active</status>"+
							"</access_control>";
				
				fetch_requested_data('form51',elements_name,function(elements)
				{
					//console.log('elements found for new user');
					elements.forEach(function(element)
					{
						var data_id=get_new_key();
						var rowsHTML="";
						rowsHTML+="<tr>";
							rowsHTML+="<form id='form51_"+data_id+"'></form>";
								rowsHTML+="<td data-th='Name'>";
									rowsHTML+="<textarea readonly='readonly' form='form51_"+data_id+"' data-i18n='form."+element.element_name+"'></textarea>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Read'>";
									rowsHTML+="<input type='checkbox' form='form51_"+data_id+"'>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Create'>";
								rowsHTML+="<input type='checkbox' form='form51_"+data_id+"'>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Update'>";
									rowsHTML+="<input type='checkbox' form='form51_"+data_id+"'>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Delete'>";
									rowsHTML+="<input type='checkbox' form='form51_"+data_id+"'>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Action'>";
									rowsHTML+="<input type='hidden' form='form51_"+data_id+"' value='"+data_id+"'>";
									rowsHTML+="<input type='hidden' form='form51_"+data_id+"' value='"+element.element_id+"'>";
									rowsHTML+="<input type='submit' class='save_icon' id='save_form51_"+data_id+"' form='form51_"+data_id+"'>";	
								rowsHTML+="</td>";			
						rowsHTML+="</tr>";
						
						$('#form51_body').append(rowsHTML);
						var fields=document.getElementById("form51_"+data_id);
						$(fields).on("submit", function(event)
						{
							event.preventDefault();
							form51_create_item(fields);
						});

					});
					$('#form51_body').find('textarea').i18n();
					hide_loader();
				});
			}
			
			results.forEach(function(result)
			{
				//console.log('existing user');
				var rowsHTML="";
				rowsHTML+="<tr>";
					rowsHTML+="<form id='form51_"+result.id+"'></form>";
						rowsHTML+="<td data-th='Name'>";
							rowsHTML+="<textarea readonly='readonly' form='form51_"+result.id+"' data-i18n='form."+result.element_name+"'></textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Read'>";
							rowsHTML+="<input type='checkbox' form='form51_"+result.id+"' "+result.re+">";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Create'>";
						rowsHTML+="<input type='checkbox' form='form51_"+result.id+"' "+result.cr+">";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Update'>";
							rowsHTML+="<input type='checkbox' form='form51_"+result.id+"' "+result.up+">";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Delete'>";
							rowsHTML+="<input type='checkbox' form='form51_"+result.id+"' "+result.del+">";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form51_"+result.id+"' value='"+result.id+"'>";
							rowsHTML+="<input type='hidden' form='form51_"+result.id+"' value='"+result.element_id+"'>";
							rowsHTML+="<input type='submit' class='save_icon' id='save_form51_"+result.id+"' form='form51_"+result.id+"' value='saved'>";	
						rowsHTML+="</td>";			
				rowsHTML+="</tr>";
				
				$('#form51_body').append(rowsHTML);
				var fields=document.getElementById("form51_"+result.id);
				$(fields).on("submit", function(event)
				{
					event.preventDefault();
					form51_update_item(fields);
				});
				hide_loader();
			});
			$('#form51_body').find('textarea').i18n();
		});
	}
	else
	{
		$('#form51_body').html("");
	}
};


/**
 * @form Manage Supplier Bills
 * @formNo 53
 * @Loading light
 */
function form53_ini()
{
	show_loader();
	var fid=$("#form53_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form53_header');
	
	var fbill_id=filter_fields.elements[0].value;
	var fname=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form53_index');
	var prev_element=document.getElementById('form53_prev');
	var next_element=document.getElementById('form53_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<supplier_bills count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<bill_id>"+fbill_id+"</bill_id>" +
			"<supplier>"+fname+"</supplier>" +
			"<bill_date></bill_date>" +
			"<entry_date></entry_date>" +
			"<total></total>" +
			"<notes></notes>" +
			"<transaction_id></transaction_id>" +
			"<last_updated sort='desc'></last_updated>" +
			"</supplier_bills>";

	$('#form53_body').html("");

	fetch_requested_data('form53',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form53_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Bill Number'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form53_"+result.id+"' value='"+result.bill_id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Supplier'>";
						rowsHTML+="<textarea readonly='readonly' form='form53_"+result.id+"'>"+result.supplier+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Bill Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form53_"+result.id+"' value='"+get_my_past_date(result.bill_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Total'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form53_"+result.id+"' value='"+result.total+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Notes'>";
						rowsHTML+="<textarea readonly='readonly' form='form53_"+result.id+"' class='dblclick_editable'>"+result.notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form53_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='button' class='edit_icon' form='form53_"+result.id+"' title='Edit Bill'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form53_"+result.id+"' title='Delete Bill' onclick='form53_delete_item($(this));'>";
						rowsHTML+="<input type='hidden' form='form53_"+result.id+"' value='"+result.transaction_id+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form53_body').append(rowsHTML);
			var fields=document.getElementById("form53_"+result.id);
			var edit_button=fields.elements[6];
			$(edit_button).on("click", function(event)
			{
				event.preventDefault();
				element_display(result.id,'form21');
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'supplier_bills');
		});
		hide_loader();
	});
}

/**
 * @form Select Templates
 * @formNo 54
 */
function form54_ini()
{
	show_loader();
	var fid=$("#form54_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form54_header');
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form54_index');
	var prev_element=document.getElementById('form54_prev');
	var next_element=document.getElementById('form54_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<user_preferences count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name></name>" +
			"<display_name>"+fname+"</display_name>" +
			"<value></value>" +
			"<status>active</status>" +
			"<type>template</type>" +
			"</user_preferences>";

	$('#form54_body').html("");

	fetch_requested_data('form54',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form54_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Template Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form54_"+result.id+"' data-i18n='form."+result.display_name+"'></textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Selected Template'>";
						rowsHTML+="<input type='text' form='form54_"+result.id+"' value='"+result.value+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form54_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' id='save_form54_"+result.id+"' form='form54_"+result.id+"' title='Save'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form54_body').append(rowsHTML);
			var fields=document.getElementById("form54_"+result.id);
			var template_filter=fields.elements[1];
			set_static_value_list('template',result.name,template_filter);
			
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form54_update_item(fields);
			});
		});
		
		$('#form54_body').find('textarea').i18n();

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
				
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'printing_templates');
		});
		hide_loader();
	});
};


/**
 * @form Cash Register
 * @formNo 56
 * @Loading light
 */
function form56_ini()
{
	show_loader();
	var fid=$("#form56_link").attr('data_id');
	if(fid==null)
		fid="";	
	var filter_fields=document.getElementById('form56_header');
	
	var faccount=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form56_index');
	var prev_element=document.getElementById('form56_prev');
	var next_element=document.getElementById('form56_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<cash_register count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<type>"+ftype+"</type>" +
			"<acc_name>"+faccount+"</acc_name>" +
			"<notes></notes>" +
			"<amount></amount>" +
			"<last_updated sort='desc'></last_updated>" +
			"</cash_register>";

	$('#form56_body').html("");

	fetch_requested_data('form56',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form56_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Account'>";
						rowsHTML+="<textarea readonly='readonly' form='form56_"+result.id+"'>"+result.acc_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form56_"+result.id+"' value='"+result.type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Amount'>";
						rowsHTML+="<input type='number' readonly='readonly' step='any' form='form56_"+result.id+"' value='"+result.amount+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Notes'>";
						rowsHTML+="<textarea readonly='readonly' form='form56_"+result.id+"' class='dblclick_editable'>"+result.notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form56_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form56_"+result.id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form56_"+result.id+"' onclick='form56_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form56_body').append(rowsHTML);
			var fields=document.getElementById("form56_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form56_update_item(fields);
			});
		});
		

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'expenses');
		});
		hide_loader();
	});
};

/**
 * @form manage services
 * @formNo 57
 * @Loading light
 */
function form57_ini()
{
	show_loader();
	var fid=$("#form57_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form57_header');
	var fservices=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form57_index');
	var prev_element=document.getElementById('form57_prev');
	var next_element=document.getElementById('form57_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<services count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fservices+"</name>" +
			"<description></description>" +
			"<price></price>" +
			"<tax></tax>" +
			"<last_updated sort='desc'></last_updated>" +
			"</services>";

	$('#form57_body').html("");

	fetch_requested_data('form57',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form57_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form57_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Description'>";
						rowsHTML+="<textarea readonly='readonly' form='form57_"+result.id+"' class='dblclick_editable'>"+result.description+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Price'>";
						rowsHTML+="<input type='number' readonly='readonly' form='form57_"+result.id+"' class='dblclick_editable' value='"+result.price+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Tax(in %)'>";
						rowsHTML+="<input type='number' readonly='readonly' form='form57_"+result.id+"' class='dblclick_editable' value='"+result.tax+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form57_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form57_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='copy_icon' form='form57_"+result.id+"' value='saved' onclick='modal21_action($(this));'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form57_"+result.id+"' value='saved' onclick='form57_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form57_body').append(rowsHTML);
			var fields=document.getElementById("form57_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form57_update_item(fields);
			});			
		});


		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'services');
		});
		hide_loader();
	});
};

/**
 * @form Service pre-requisites
 * @formNo 58
 * @Loading light
 */
function form58_ini()
{
	show_loader();
	var fid=$("#form58_link").attr('data_id');
	if(fid==null)
		fid="";	
	var filter_fields=document.getElementById('form58_header');
	
	var fservice=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	var frequisite=filter_fields.elements[2].value;

	////indexing///
	var index_element=document.getElementById('form58_index');
	var prev_element=document.getElementById('form58_prev');
	var next_element=document.getElementById('form58_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<pre_requisites count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fservice+"</name>" +
			"<type>service</type>" +
			"<requisite_type>"+ftype+"</requisite_type>" +
			"<requisite_name>"+frequisite+"</requisite_name>" +
			"<quantity></quantity>" +
			"<last_updated sort='desc'></last_updated>" +
			"</pre_requisites>";

	$('#form58_body').html("");

	fetch_requested_data('form58',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form58_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form58_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Requisite Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form58_"+result.id+"' value='"+result.requisite_type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Requisite Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form58_"+result.id+"' value='"+result.requisite_name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Quantity'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form58_"+result.id+"' class='dblclick_editable' value='"+result.quantity+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form58_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form58_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form58_"+result.id+"' value='saved' onclick='form58_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form58_body').append(rowsHTML);
			var fields=document.getElementById("form58_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form58_update_item(fields);
			});
		});
		

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'service_pre_requisites');
		});
		hide_loader();
	});
};

/**
 * @form product pre-requisites
 * @formNo 59
 * @Loading light
 */
function form59_ini()
{
	show_loader();
	var fid=$("#form59_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form59_header');
	
	var fproduct=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	var frequisite=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form59_index');
	var prev_element=document.getElementById('form59_prev');
	var next_element=document.getElementById('form59_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<pre_requisites count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fproduct+"</name>" +
			"<type>product</type>" +
			"<requisite_type>"+ftype+"</requisite_type>" +
			"<requisite_name>"+frequisite+"</requisite_name>" +
			"<quantity></quantity>" +
			"<last_updated sort='desc'></last_updated>" +
			"</pre_requisites>";

	$('#form59_body').html("");

	fetch_requested_data('form59',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form59_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form59_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Requisite Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form59_"+result.id+"' value='"+result.requisite_type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Requisite Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form59_"+result.id+"' value='"+result.requisite_name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Quantity'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form59_"+result.id+"' class='dblclick_editable' value='"+result.quantity+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form59_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form59_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form59_"+result.id+"' value='saved' onclick='form59_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form59_body').append(rowsHTML);
			var fields=document.getElementById("form59_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form59_update_item(fields);
			});
		});
		

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'product_pre_requisites');
		});
		hide_loader();
	});
};


/**
 * @form Product Attributes
 * @formNo 60
 * @Loading light
 */
function form60_ini()
{
	show_loader();
	var fid=$("#form60_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form60_header');
	
	var fproduct=filter_fields.elements[0].value;
	var fattribute=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form60_index');
	var prev_element=document.getElementById('form60_prev');
	var next_element=document.getElementById('form60_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<attributes count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fproduct+"</name>" +
			"<type exact='yes'>product</type>" +
			"<attribute>"+fattribute+"</attribute>" +
			"<value></value>" +
			"<last_updated sort='desc'></last_updated>" +
			"</attributes>";

	$('#form60_body').html("");

	fetch_requested_data('form60',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form60_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form60_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Attribute'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form60_"+result.id+"' value='"+result.attribute+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Value'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form60_"+result.id+"' value='"+result.value+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form60_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form60_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form60_"+result.id+"' value='saved' onclick='form60_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form60_body').append(rowsHTML);
			var fields=document.getElementById("form60_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form60_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		
		longPressEditable($('.dblclick_editable'));
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'product_attributes');
		});
		hide_loader();
	});
};

/**
 * @form Service Attributes
 * @formNo 61
 * @Loading light
 */
function form61_ini()
{
	show_loader();
	var fid=$("#form61_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form61_header');
	
	var fservice=filter_fields.elements[0].value;
	var fattribute=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form61_index');
	var prev_element=document.getElementById('form61_prev');
	var next_element=document.getElementById('form61_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<attributes count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fservice+"</name>" +
			"<type>service</type>" +
			"<attribute>"+fattribute+"</attribute>" +
			"<value></value>" +
			"<last_updated sort='desc'></last_updated>" +
			"</attributes>";

	$('#form61_body').html("");

	fetch_requested_data('form61',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form61_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form61_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Attribute'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form61_"+result.id+"' value='"+result.attribute+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Value'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form61_"+result.id+"' value='"+result.value+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form61_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form61_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form61_"+result.id+"' value='saved' onclick='form61_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form61_body').append(rowsHTML);
			var fields=document.getElementById("form61_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form61_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		
		longPressEditable($('.dblclick_editable'));
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'service_attributes');
		});
		hide_loader();
	});
};

/**
 * @form Product reviews
 * @formNo 62
 * @Loading light
 */
function form62_ini()
{
	show_loader();
	var fid=$("#form62_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form62_header');
	
	var fproduct=filter_fields.elements[0].value;
	var freviewer=filter_fields.elements[1].value;
	var frating=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form62_index');
	var prev_element=document.getElementById('form62_prev');
	var next_element=document.getElementById('form62_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<reviews count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fproduct+"</name>" +
			"<type>product</type>" +
			"<reviewer>"+freviewer+"</reviewer>" +
			"<detail></detail>" +
			"<rating>"+frating+"</rating>" +
			"<last_updated sort='desc'></last_updated>" +
			"</reviews>";

	$('#form62_body').html("");

	fetch_requested_data('form62',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form62_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form62_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Reviewer'>";
						rowsHTML+="<textarea readonly='readonly' form='form62_"+result.id+"'>"+result.reviewer+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Detail'>";
						rowsHTML+="<textarea readonly='readonly' form='form62_"+result.id+"'>"+result.detail+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Rating'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form62_"+result.id+"' value='"+result.rating+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form62_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form62_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form62_"+result.id+"' value='saved' onclick='form62_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form62_body').append(rowsHTML);
			var fields=document.getElementById("form62_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form62_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'product_reviews');
		});
		hide_loader();
	});
};

/**
 * @form Service reviews
 * @formNo 63
 * @Loading light
 */
function form63_ini()
{
	show_loader();
	var fid=$("#form63_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form63_header');
	
	var fservice=filter_fields.elements[0].value;
	var freviewer=filter_fields.elements[1].value;
	var frating=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form63_index');
	var prev_element=document.getElementById('form63_prev');
	var next_element=document.getElementById('form63_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<reviews count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fservice+"</name>" +
			"<type>service</type>" +
			"<reviewer>"+freviewer+"</reviewer>" +
			"<detail></detail>" +
			"<rating>"+frating+"</rating>" +
			"<last_updated sort='desc'></last_updated>" +
			"</reviews>";

	$('#form63_body').html("");

	fetch_requested_data('form63',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form63_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form63_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Reviewer'>";
						rowsHTML+="<textarea readonly='readonly' form='form63_"+result.id+"'>"+result.reviewer+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Detail'>";
						rowsHTML+="<textarea readonly='readonly' form='form63_"+result.id+"'>"+result.detail+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Rating'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form63_"+result.id+"' value='"+result.rating+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form63_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form63_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form63_"+result.id+"' value='saved' onclick='form63_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form63_body').append(rowsHTML);
			var fields=document.getElementById("form63_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form63_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'service_reviews');
		});
		hide_loader();
	});
};

/**
 * @form Service Cross sells
 * @formNo 64
 * @Loading light
 */
function form64_ini()
{
	show_loader();
	var fid=$("#form64_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form64_header');
	
	var fservice=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	var fcross=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form64_index');
	var prev_element=document.getElementById('form64_prev');
	var next_element=document.getElementById('form64_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<cross_sells count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fservice+"</name>" +
			"<type>service</type>" +
			"<cross_type>"+ftype+"</cross_type>" +
			"<cross_name>"+fcross+"</cross_name>" +
			"<last_updated sort='desc'></last_updated>" +
			"</cross_sells>";

	$('#form64_body').html("");

	fetch_requested_data('form64',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form64_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form64_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form64_"+result.id+"' value='"+result.cross_type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Cross-sold Item'>";
						rowsHTML+="<textarea readonly='readonly' form='form64_"+result.id+"'>"+result.cross_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form64_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form64_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form64_"+result.id+"' value='saved' onclick='form64_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form64_body').append(rowsHTML);
			var fields=document.getElementById("form64_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form64_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'service_cross_sells');
		});
		hide_loader();
	});
};


/**
 * @form Cross sells
 * @formNo 66
 * @Loading light
 */
function form66_ini()
{
	show_loader();
	var fid=$("#form66_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form66_header');
	
	var fproduct=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	var fcross=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form66_index');
	var prev_element=document.getElementById('form66_prev');
	var next_element=document.getElementById('form66_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<cross_sells count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fproduct+"</name>" +
			"<type>product</type>" +
			"<cross_type>"+ftype+"</cross_type>" +
			"<cross_name>"+fcross+"</cross_name>" +
			"<last_updated sort='desc'></last_updated>" +
			"</cross_sells>";

	$('#form66_body').html("");

	fetch_requested_data('form66',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form66_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form66_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form66_"+result.id+"' value='"+result.cross_type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Cross-sold Item'>";
						rowsHTML+="<textarea readonly='readonly' form='form66_"+result.id+"'>"+result.cross_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form66_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form66_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form66_"+result.id+"' value='saved' onclick='form66_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form66_body').append(rowsHTML);
			var fields=document.getElementById("form66_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form66_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'product_cross_sells');
		});
		hide_loader();
	});
};

/**
 * @form New sale order
 * @formNo 69
 * @Loading light
 */
function form69_ini()
{
	//console.log('form69_ini');
	var order_id=$("#form69_link").attr('data_id');
	if(order_id==null)
		order_id="";	
	
	$('#form69_body').html("");

	if(order_id!="")
	{
		show_loader();
		var order_columns="<sale_orders>" +
				"<id>"+order_id+"</id>" +
				"<customer_name></customer_name>" +
				"<order_date></order_date>" +
				"<type>product</type>" +
				"<status></status>" +
				"</sale_orders>";
		var order_items_column="<sale_order_items>" +
				"<id></id>" +
				"<item_name></item_name>" +
				"<quantity></quantity>" +
				"<order_id>"+order_id+"</order_id>" +
				"<notes></notes>" +
				"</sale_order_items>";
	
		////separate fetch function to get order details like customer name, total etc.
		fetch_requested_data('',order_columns,function(order_results)
		{
			for(var i in order_results)
			{
				var filter_fields=document.getElementById('form69_master');
				filter_fields.elements[1].value=order_results[i].customer_name;
				filter_fields.elements[2].value=get_my_past_date(order_results[i].order_date);
				filter_fields.elements[3].value=order_results[i].status;
				filter_fields.elements[4].value=order_id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form69_update_form();
				});
				break;
			}
		});
		/////////////////////////////////////////////////////////////////////////
		
		fetch_requested_data('',order_items_column,function(results)
		{
			results.forEach(function(result)
			{
				var rowsHTML="";
				var id=result.id;
				rowsHTML+="<tr>";
				rowsHTML+="<form id='form69_"+id+"'></form>";
					rowsHTML+="<td data-th='Product Name'>";
						rowsHTML+="<input type='text' readonly='readonly' required form='form69_"+id+"' value='"+result.item_name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Quantity'>";
						rowsHTML+="<input type='number' class='dblclick_editable' readonly='readonly' required form='form69_"+id+"' value='"+result.quantity+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Notes'>";
						rowsHTML+="<textarea readonly='readonly' form='form69_"+id+"'>"+result.notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form69_"+id+"' value='"+id+"'>";
						rowsHTML+="<input type='submit' class='submit_hidden' form='form69_"+id+"' id='save_form69_"+id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form69_"+id+"' id='delete_form69_"+id+"' onclick='form69_delete_item($(this));'>";
					rowsHTML+="</td>";			
				rowsHTML+="</tr>";
			
				$('#form69_body').append(rowsHTML);
				
				var fields=document.getElementById("form69_"+id);
				var name_filter=fields.elements[0];
				var quantity_filter=fields.elements[1];
				
				$(fields).on("submit", function(event)
				{
					event.preventDefault();
					form69_update_item(fields);
				});
				
				var product_data="<product_master>" +
						"<name></name>" +
						"</product_master>";
				
				set_my_value_list(product_data,name_filter);
				
				$(name_filter).on('blur',function(event)
				{
					get_inventory(name_filter.value,'',function(quantity)
					{
						$(quantity_filter).attr('max',quantity);
						$(quantity_filter).attr('min',"0");
					});
				});
	
			});
			hide_loader();
		});
	}
}


/**
 * @form Manage Sale orders
 * @formNo 70
 * @Loading light
 */
function form70_ini()
{
	show_loader();
	var fid=$("#form70_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form70_header');
	
	//populating form 
	if(fid==="")
		fid=filter_fields.elements[0].value;
	var fname=filter_fields.elements[1].value;
	var fstatus=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form70_index');
	var prev_element=document.getElementById('form70_prev');
	var next_element=document.getElementById('form70_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<sale_orders count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<customer_name>"+fname+"</customer_name>" +
			"<order_date></order_date>" +
			"<type>product</type>" +
			"<status>"+fstatus+"</status>" +
			"<last_updated sort='desc'></last_updated>" +
			"</sale_orders>";

	$('#form70_body').html("");

	fetch_requested_data('form70',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form70_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Order No.'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form70_"+result.id+"' value='"+result.id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Customer'>";
						rowsHTML+="<textarea readonly='readonly' form='form70_"+result.id+"'>"+result.customer_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Order Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form70_"+result.id+"' value='"+get_my_past_date(result.order_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form70_"+result.id+"' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='button' class='edit_icon' form='form70_"+result.id+"' title='Edit order' onclick=\"element_display('"+result.id+"','form69');\">";
						rowsHTML+="<input type='submit' class='save_icon' form='form70_"+result.id+"' title='Save order'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form70_"+result.id+"' title='Delete order' onclick='form70_delete_item($(this));'>";
						rowsHTML+="<br><input type='button' class='generic_icon' form='form70_"+result.id+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form70_body').append(rowsHTML);
			var fields=document.getElementById("form70_"+result.id);
			var bill_button=fields.elements[7];
			var status_filter=fields.elements[3];
			
			set_static_value_list('sale_orders','status',status_filter);
			
			if(result.status=='pending')
			{
				$(bill_button).attr('value','Create Bill');
				$(bill_button).on('click',function(event)
				{
					form70_bill(result.id);
				});
			}
			else
			{
				$(bill_button).hide();
			}
			
			$(fields).on("submit",function(event)
			{
				event.preventDefault();
				form70_update_item(fields);
			});
			
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'sale_orders');
		});
		hide_loader();
	});
};


/**
 * @form Manage Accounts
 * @formNo 71
 * @Loading heavy
 */
function form71_ini()
{
	show_loader();
	var fid=$("#form71_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form71_header');
	var fname=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form71_index');
	var prev_element=document.getElementById('form71_prev');
	var next_element=document.getElementById('form71_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<accounts count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<acc_name>"+fname+"</acc_name>" +
			"<description></description>" +
			"<type>"+ftype+"</type>" +
			"<last_updated sort='desc'></last_updated>" +
			"</accounts>";

	$('#form71_body').html("");

	fetch_requested_data('form71',columns,function(results)
	{	
		var payments_data="<payments>" +
				"<id></id>" +
				"<acc_name></acc_name>" +
				"<type></type>" +
				"<total_amount></total_amount>" +
				"<paid_amount></paid_amount>" +
				"<status>pending</status>" +
				"</payments>";
		fetch_requested_data('form71',payments_data,function(payments)
		{
			results.forEach(function(result)
			{		
				var balance_amount=0;
				payments.forEach(function(payment)
				{
					if(payment.acc_name==result.acc_name)
					{
						if(payment.type=='received')
						{
							balance_amount+=parseFloat(payment.total_amount);
							balance_amount-=parseFloat(payment.paid_amount);
						}
						else if(payment.type=='paid')
						{
							balance_amount-=parseFloat(payment.total_amount);
							balance_amount+=parseFloat(payment.paid_amount);
						}
					}
				});
				
				var balance_display="";
				if(balance_amount==0)
				{
					balance_display="Rs. 0";
				}
				else if(balance_amount>0)
				{
					balance_display="Receivable: Rs. "+balance_amount;
				}
				else
				{
					balance_amount=(-balance_amount);
					balance_display="Payable: Rs. "+balance_amount;
				}
				
				var rowsHTML="";
				rowsHTML+="<tr>";
					rowsHTML+="<form id='form71_"+result.id+"'></form>";
						rowsHTML+="<td data-th='Name'>";
							rowsHTML+="<textarea readonly='readonly' form='form71_"+result.id+"'>"+result.acc_name+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Type'>";
							rowsHTML+="<input type='text' readonly='readonly' required form='form71_"+result.id+"' value='"+result.type+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Description'>";
							rowsHTML+="<textarea readonly='readonly' form='form71_"+result.id+"' class='dblclick_editable'>"+result.description+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Balance'>";
							rowsHTML+="<textarea readonly='readonly' form='form71_"+result.id+"'>"+balance_display+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form71_"+result.id+"' value='"+result.id+"'>";
							rowsHTML+="<input type='submit' class='save_icon' form='form71_"+result.id+"'>";
							rowsHTML+="<input type='button' class='delete_icon' form='form71_"+result.id+"' onclick='form71_delete_item($(this));'>";
							rowsHTML+="</br><input type='button' class='generic_icon' value='Close payments' form='form71_"+result.id+"' onclick='modal41_action($(this));'>";
							rowsHTML+="<input type='hidden' form='form71_"+result.id+"' value='"+balance_amount+"'>";
						rowsHTML+="</td>";			
				rowsHTML+="</tr>";
				
				$('#form71_body').append(rowsHTML);
				var fields=document.getElementById("form71_"+result.id);
				$(fields).on("submit", function(event)
				{
					event.preventDefault();
					form71_update_item(fields);
				});
			});

			////indexing///
			var next_index=parseInt(start_index)+25;
			var prev_index=parseInt(start_index)-25;
			next_element.setAttribute('data-index',next_index);
			prev_element.setAttribute('data-index',prev_index);
			index_element.setAttribute('data-index','0');
			if(results.length<25)
			{
				$(next_element).hide();
			}
			else
			{
				$(next_element).show();
			}
			if(prev_index<0)
			{
				$(prev_element).hide();
			}
			else
			{
				$(prev_element).show();
			}
			/////////////

			longPressEditable($('.dblclick_editable'));
			$('textarea').autosize();
				
			var export_button=filter_fields.elements[3];
			$(export_button).off("click");
			$(export_button).on("click", function(event)
			{
				my_obj_array_to_csv(results,'accounts');
			});
			hide_loader();
		});
	});
};

/**
 * @form New Bill
 * @formNo 72
 * @Loading light
 */
function form72_ini()
{
	var bill_id=$("#form72_link").attr('data_id');
	if(bill_id==null)
		bill_id="";	
	
	$('#form72_body').html("");

	if(bill_id!="")
	{
		show_loader();
		var bill_columns="<bills>" +
				"<id>"+bill_id+"</id>" +
				"<customer_name></customer_name>" +
				"<total></total>" +
				"<bill_date></bill_date>" +
				"<amount></amount>" +
				"<discount></discount>" +
				"<tax></tax>" +
				"<offer></offer>" +
				"<type>both</type>" +
				"<transaction_id></transaction_id>" +
				"</bills>";
		var bill_items_column="<bill_items>" +
				"<id></id>" +
				"<item_name></item_name>" +
				"<batch></batch>" +
				"<staff></staff>" +
				"<quantity></quantity>" +
				"<notes></notes>" +
				"<unit_price></unit_price>" +
				"<amount></amount>" +
				"<total></total>" +
				"<discount></discount>" +
				"<offer></offer>" +
				"<type></type>" +
				"<bill_id>"+bill_id+"</bill_id>" +
				"<tax></tax>" +
				"<free_with></free_with>" +
				"</bill_items>";
	
		////separate fetch function to get bill details like customer name, total etc.
		fetch_requested_data('',bill_columns,function(bill_results)
		{
			var filter_fields=document.getElementById('form72_master');
			
			for (var i in bill_results)
			{
				filter_fields.elements[1].value=bill_results[i].customer_name;
				filter_fields.elements[2].value=get_my_past_date(bill_results[i].bill_date);
				filter_fields.elements[3].value=bill_results[i].amount;
				filter_fields.elements[4].value=bill_results[i].discount;
				filter_fields.elements[5].value=bill_results[i].tax;
				filter_fields.elements[6].value=bill_results[i].total;
				filter_fields.elements[7].value=bill_id;
				filter_fields.elements[8].value=bill_results[i].offer;
				filter_fields.elements[9].value=bill_results[i].transaction_id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form12_update_form();
				});
				break;
			}
			
			
			
			fetch_requested_data('',bill_items_column,function(results)
			{
				var message_string="Bill from:"+get_session_var('title')+"\nAddress: "+get_session_var('address');
				
				results.forEach(function(result)
				{
					message_string+="\nItem: "+result.item_name;
					message_string+=" Price: "+result.unit_price;
					message_string+=" Total: "+result.total;
					
					var rowsHTML="";
					var id=result.id;
					rowsHTML+="<tr>";
					rowsHTML+="<form id='form72_"+id+"'></form>";
						rowsHTML+="<td data-th='Item Name'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form72_"+id+"' value='"+result.item_name+"'>";
						rowsHTML+="</td>";
						if(result.batch!=null && result.batch!="")
						{
							rowsHTML+="<td data-th='Batch'>";
								rowsHTML+="<input type='text' readonly='readonly' form='form72_"+id+"' value='"+result.batch+"'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Quantity'>";
								rowsHTML+="<input type='number' readonly='readonly' form='form72_"+id+"' value='"+result.quantity+"'>";
							rowsHTML+="</td>";
						}
						else
						{
							rowsHTML+="<td data-th='Person'>";
								rowsHTML+="<input type='text' readonly='readonly' form='form72_"+id+"' value='"+result.staff+"'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Notes'>";
								rowsHTML+="<textarea readonly='readonly' form='form72_"+id+"'>"+result.notes+"</textarea>";
							rowsHTML+="</td>";
						}
						rowsHTML+="<td data-th='Unit Price'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form72_"+id+"' value='"+result.unit_price+"' step='any'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Total'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form72_"+id+"' value='"+result.total+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form72_"+id+"' value='"+result.amount+"'>";
							rowsHTML+="<input type='hidden' form='form72_"+id+"' value='"+result.discount+"'>";
							rowsHTML+="<input type='hidden' form='form72_"+id+"' value='"+result.tax+"'>";
							rowsHTML+="<input type='hidden' form='form72_"+id+"' value='"+result.offer+"'>";
							rowsHTML+="<input type='hidden' form='form72_"+id+"' value='"+id+"'>";
							rowsHTML+="<input type='submit' class='submit_hidden' form='form72_"+id+"' id='save_form72_"+id+"'>";
							rowsHTML+="<input type='button' class='delete_icon' form='form72_"+id+"' id='delete_form72_"+id+"' onclick='form72_delete_item($(this));'>";
							rowsHTML+="<input type='hidden' form='form72_"+id+"'>";
							rowsHTML+="<input type='hidden' form='form72_"+id+"'>";
							rowsHTML+="<input type='hidden' form='form72_"+id+"'>";
						rowsHTML+="</td>";			
					rowsHTML+="</tr>";
				
					$('#form72_body').append(rowsHTML);
					
					var fields=document.getElementById("form72_"+id);
					$(fields).on("submit", function(event)
					{
						event.preventDefault();
					});
				});
				
				
				message_string+="\nAmount: "+filter_fields.elements[3].value;
				message_string+="\ndiscount: "+filter_fields.elements[4].value;
				message_string+="\nTax: "+filter_fields.elements[5].value;
				message_string+="\nTotal: "+filter_fields.elements[6].value;

				var subject="Bill from "+get_session_var('title');
				$('#form72_share').show();
				$('#form72_share').click(function()
				{
					modal44_action(filter_fields.elements[1].value,subject,message_string);
				});
				
				hide_loader();
			});
		});
	}
}


/**
 * Notifications screen
 */
function notifications_ini()
{
	show_loader();
	var columns="<notifications count='100'>" +
			"<id></id>" +
			"<title></title>" +
			"<link_to></link_to>" +
			"<data_id></data_id>" +
			"<notes></notes>" +
			"<t_generated></t_generated>" +
			"<status>pending</status>" +
			"<last_updated sort='desc'></last_updated>" +
			"</notifications>";

	fetch_requested_data('',columns,function(notifs)
	{	
		var result_html="";
		notifs.forEach(function(notif)
		{
			result_html+="<div class='notification_detail'><b>" +
					notif.title +
					"</b></br><a onclick=\"" +
					"element_display('"+notif.data_id +
					"','"+notif.link_to+"');\">"+notif.notes+"</a>" +
					"<div class='notification_status'>" +
					" Generated @ " +
					get_formatted_time(notif.t_generated) +
					"</div><div>" +
					"<input type='button' class='generic_icon' value='Seen' onclick=\"notifications_update($(this),'"+notif.id+"','reviewed')\">" +
					"<input type='button' class='generic_icon' value='Close' onclick=\"notifications_update($(this),'"+notif.id+"','closed')\">" +
					"</div>" +
					"</div>";
		});
		
		var columns2="<notifications count='100'>" +
				"<id></id>" +
				"<title></title>" +
				"<link_to></link_to>" +
				"<data_id></data_id>" +
				"<notes></notes>" +
				"<t_generated></t_generated>" +
				"<status>reviewed</status>" +
				"<last_updated sort='desc'></last_updated>" +
				"</notifications>";
		
		fetch_requested_data('',columns2,function(notifs2)
		{	
			notifs2.forEach(function(notif2)
			{
				result_html+="<div class='notification_detail'><b>" +
						notif2.title +
						"</b></br><a onclick=\"" +
						"element_display('"+notif2.data_id +
						"','"+notif2.link_to+"');\">"+notif2.notes+"</a>" +
						"<div class='notification_status'>" +
						" Generated @ " +
						get_formatted_time(notif2.t_generated) +
						"</div><div>" +
						"<input type='button' class='generic_icon' value='Close' onclick=\"notifications_update($(this),'"+notif2.id+"','closed')\">" +
						"</div>" +
						"</div>";
			});
			$("#notifications_detail").html(result_html);
			hide_loader();
		});
	});
}



function activities_ini() 
{
	show_loader();
	var columns="<activities count='100'>" +
		"<title></title>" +
		"<link_to></link_to>" +
		"<data_id></data_id>" +
		"<notes></notes>" +
		"<updated_by></updated_by>" +
		"<user_display>yes</user_display>" +
		"<last_updated sort='desc'></last_updated>" +
		"</activities>";
	
	fetch_requested_data('',columns,function(activities)
	{
		var result_html="";
		for(var i in activities)
		{
			result_html+="<div class='all_activity_detail'><b>" +
						activities[i].title +
						"</b></br><a onclick=\"" +
						"element_display('"+activities[i].data_id +
						"','"+activities[i].link_to+
						"');\">"+activities[i].notes+"</a>" +
						"<div class='all_activity_log'>By:" +
						activities[i].updated_by +
						" @ " +
						get_formatted_time(activities[i].last_updated) +
						"</div>" +
						"</div>";
		}
		$("#all_activity_lane").html(result_html);
		hide_loader();
	});
}



function search_ini()
{
	var searchStr=document.getElementById("search_box").value;	
	
	$("#search_results").html("");
	
	var length=searchStr.length;
	
	if(length>=3)
	{
		///////////////////////from products//////////////
		var product_columns="<product_master count='10'>" +
				"<id></id>" +
				"<name>"+searchStr+"</name>" +
				"</product_master>";
	
		fetch_requested_data('',product_columns,function(product_results)
		{
			var num_res=0;
			var result_html="";
			product_results.forEach(function(product)
			{
				result_html+="<div class='search_detail'>" +
						"<b>Product"+
						"</b></br><a onclick=\"" +
						"element_display('"+product.id +
						"','form87');\">"+product.name+"</a>" +
						"</div>";
				num_res=num_res+1;
			});
			$("#search_results").append(result_html);
		});
	
		///////////////////////from services//////////////
		var service_columns="<services count='10'>" +
				"<id></id>" +
				"<name>"+searchStr+"</name>" +
				"</services>";
	
		fetch_requested_data('',service_columns,function(service_results)
		{
			var num_res=0;
			var result_html="";
			service_results.forEach(function(service)
			{
				result_html+="<div class='search_detail'>" +
						"<b>Service"+
						"</b></br><a onclick=\"" +
						"element_display('"+service.id +
						"','form57');\">"+service.name+"</a>" +
						"</div>";
				num_res=num_res+1;
			});
			$("#search_results").append(result_html);
		});
	
		///////////////////////from customer//////////////
		var customer_columns="<customers count='10'>" +
				"<id></id>" +
				"<name></name>" +
				"<acc_name>"+searchStr+"</acc_name>" +
				"<email></email>" +
				"<phone></phone>" +
				"</customers>";
	
		fetch_requested_data('',customer_columns,function(customer_results)
		{
			var num_res=0;
			var result_html="";
			customer_results.forEach(function(customer)
			{
				result_html+="<div class='search_detail'>" +
						"<b>Customer: "+customer.name+
						"</b></br><a onclick=\"" +
						"element_display('"+customer.id +
						"','form30');\">Email:"+customer.email+" Phone:"+customer.phone+"</a>" +
						"</div>";
				num_res=num_res+1;
			});
			$("#search_results").append(result_html);
		});
	
		///////////////////////from supplier//////////////
		var supplier_columns="<suppliers count='10'>" +
				"<id></id>" +
				"<name></name>" +
				"<acc_name>"+searchStr+"</acc_name>" +
				"<email></email>" +
				"<phone></phone>" +
				"</suppliers>";
	
		fetch_requested_data('',supplier_columns,function(supplier_results)
		{
			var num_res=0;
			var result_html="";
			supplier_results.forEach(function(supplier)
			{
				result_html+="<div class='search_detail'>" +
						"<b>Supplier: "+supplier.name+
						"</b></br><a onclick=\"" +
						"element_display('"+supplier.id +
						"','form40');\">Email:"+supplier.email+" Phone:"+supplier.phone+"</a>" +
						"</div>";
				num_res=num_res+1;
			});
			$("#search_results").append(result_html);
		});
	
		///////////////////////from staff//////////////
		var staff_columns="<staff count='10'>" +
				"<id></id>" +
				"<name></name>" +
				"<acc_name>"+searchStr+"</acc_name>" +
				"<email></email>" +
				"<phone></phone>" +
				"</staff>";
	
		fetch_requested_data('',staff_columns,function(staff_results)
		{
			var num_res=0;
			var result_html="";
			staff_results.forEach(function(staff)
			{
				result_html+="<div class='search_detail'>" +
						"<b>Staff: "+staff.name+
						"</b></br><a onclick=\"" +
						"element_display('"+staff.id +
						"','form8');\">Email:"+staff.email+" Phone:"+staff.phone+"</a>" +
						"</div>";
				num_res=num_res+1;
			});
			$("#search_results").append(result_html);
		});
	
		///////////////////////from assets//////////////
		var assets_columns="<assets count='10'>" +
				"<id></id>" +
				"<name>"+searchStr+"</name>" +
				"<type></type>" +
				"<owner></owner>" +
				"</assets>";
	
		fetch_requested_data('',assets_columns,function(asset_results)
		{
			var num_res=0;
			var result_html="";
			asset_results.forEach(function(asset)
			{
				result_html+="<div class='search_detail'>" +
						"<b>Asset: "+asset.name+
						"</b></br><a onclick=\"" +
						"element_display('"+asset.id +
						"','form5');\">Type: "+asset.type+" Owner: "+asset.owner+"</a>" +
						"</div>";
				num_res=num_res+1;
			});
			$("#search_results").append(result_html);
		});
	
		/////////////////////from activities///////////
		var columns="<activities count='10'>" +
				"<title></title>" +
				"<link_to></link_to>" +
				"<data_id></data_id>" +
				"<notes></notes>" +
				"<updated_by></updated_by>" +
				"<data_xml>"+searchStr+"</data_xml>" +
				"<user_display>yes</user_display>" +
				"<last_updated sort='desc'></last_updated>" +
				"</activities>";
	
		fetch_requested_data('',columns,function(activity_results)
		{
			var num_res=0;
			var result_html="";
			activity_results.forEach(function(activity)
			{
				result_html+="<div class='search_detail'>" +
						"<b>Activity: "+activity.title +
						"</b></br><a onclick=\"" +
						"element_display('"+activity.data_id +
						"','"+activity.link_to +
						"');\">"+activity.notes+"</a>" +
						"</div>";
				num_res=num_res+1;
			});
			$("#search_results").append(result_html);
		});
	}
	else
	{
		$("#search_results").html("Type atleast 3 letters to find any results");
	}
};

/**
 * @form Set shortcut keys
 * @formNo 77
 * @Loading light
 */
function form77_ini()
{
	show_loader();
	var fid=$("#form77_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form77_header');
	var felement=filter_fields.elements[0].value;
	var fkey=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form77_index');
	var prev_element=document.getElementById('form77_prev');
	var next_element=document.getElementById('form77_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<user_preferences count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name></name>" +
			"<display_name>"+felement+"</display_name>" +
			"<shortcut>"+fkey+"</shortcut>" +
			"<value exact='yes'>checked</value>" +
			"<type array='yes'>--form--report--</type>" +
			"</user_preferences>";

	
	$('#form77_body').html("");

	fetch_requested_data('form77',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form77_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Report/Form'>";
						rowsHTML+="<textarea readonly='readonly' form='form77_"+result.id+"' data-i18n='form."+result.display_name+"'></textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Key'>";
						rowsHTML+="<input type='text' form='form77_"+result.id+"' class='dblclick_editable' value='"+result.shortcut+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form77_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='hidden' form='form77_"+result.id+"' value='"+result.name+"'>";
						rowsHTML+="<input type='submit' class='save_icon' id='save_form77_"+result.id+"' form='form77_"+result.id+"'>";	
					rowsHTML+="</td>";
			rowsHTML+="</tr>";
			
			$('#form77_body').append(rowsHTML);
			var fields=document.getElementById("form77_"+result.id);
			var key_filter=fields.elements[1];
			
			set_static_value_list('shortcuts','key',key_filter);
			
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form77_update_item(fields);
			});
		});
		
		$('#form77_body').find('textarea').i18n();
		

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
				
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'shortcuts');
		});
		hide_loader();
	});
};

/**
 * @form Promotion Emails
 * @formNo 78
 * @Loading light
 */
function form78_ini()
{
	var pamphlet_id=$("#form78_link").attr('data_id');
	if(pamphlet_id==null)
		pamphlet_id="";	

	var pamphlet_name=document.getElementById('form78_master').elements[1].value;
	
	$('#form78_body').html("");
	if(pamphlet_id!="" || pamphlet_name!="")
	{
		show_loader();
		var pamphlet_columns="<pamphlets>" +
				"<id>"+pamphlet_id+"</id>" +
				"<name>"+pamphlet_name+"</name>" +
				"</pamphlets>";
		
		////separate fetch function to get pamphlet details like name
		fetch_requested_data('',pamphlet_columns,function(pamphlet_results)
		{
			for (var i in pamphlet_results)
			{
				pamphlet_id=pamphlet_results[i].id;
				var filter_fields=document.getElementById('form78_master');
				filter_fields.elements[1].value=pamphlet_results[i].name;
				filter_fields.elements[2].value=pamphlet_results[i].id;
				break;
			}
			/////////////////////////////////////////////////////////////////////////
			var pamphlet_item_columns="<pamphlet_items>" +
				"<id></id>" +
				"<pamphlet_id>"+pamphlet_id+"</pamphlet_id>" +
				"<item_name></item_name>" +
				"<offer_name></offer_name>" +
				"<offer></offer>" +
				"</pamphlet_items>";

			
			fetch_requested_data('',pamphlet_item_columns,function(pamphlet_items)
			{
				var items_string="--";
				for(var j in pamphlet_items)
				{
					items_string+=pamphlet_items[j].item_name+"--";
				}
				
				var bill_items_columns="<bill_items>" +
						"<bill_id></bill_id>" +
						"<item_name array='yes'>"+items_string+"</item_name>" +
						"</bill_items>";
				fetch_requested_data('',bill_items_columns,function(bill_items)
				{
					var bill_id_string="--";
					for(var k in bill_items)
					{
						bill_id_string+=bill_items[k].bill_id+"--";
					}
					
					var bills_columns="<bills>" +
							"<customer_name></customer_name>" +
							"<id array='yes'>"+bill_id_string+"</id>" +
							"</bills>";
					fetch_requested_data('',bills_columns,function(bills)
					{
						var customer_string="--";
						for(var l in bills)
						{
							customer_string+=bills[l].customer_name+"--";
						}
						
						var customer_columns="<customers>" +
								"<id></id>" +
								"<name></name>" +
								"<email></email>" +
								"<acc_name array='yes'>"+customer_string+"</acc_name>" +
								"</customers>";
						fetch_requested_data('',customer_columns,function(results)
						{
							results.forEach(function(result)
							{
								var rowsHTML="";
								var id=result.id;
								rowsHTML+="<tr>";
								rowsHTML+="<form id='row_form78_"+id+"'></form>";
									rowsHTML+="<td data-th='Customer Name'>";
										rowsHTML+="<textarea readonly='readonly' form='row_form78_"+id+"'>"+result.acc_name+"</textarea>";
									rowsHTML+="</td>";
									rowsHTML+="<td data-th='Email'>";
										rowsHTML+="<textarea readonly='readonly' form='row_form78_"+id+"'>"+result.email+"</textarea>";
									rowsHTML+="</td>";
									rowsHTML+="<td data-th='Select for mailing'>";
										rowsHTML+="<input type='checkbox' form='row_form78_"+id+"' checked>";
										rowsHTML+="<input type='hidden' form='row_form78_"+id+"' value='"+result.name+"'>";
									rowsHTML+="</td>";
								rowsHTML+="</tr>";
							
								$('#form78_body').append(rowsHTML);				
							});
							$('textarea').autosize();
							hide_loader();
						});
					});
				});
			});
		});
	}
}

/**
 * @form Manage task types
 * @formNo 79
 * @Loading light
 */
function form79_ini()
{
	show_loader();
	var fid=$("#form79_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form79_header');
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form79_index');
	var prev_element=document.getElementById('form79_prev');
	var next_element=document.getElementById('form79_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<task_type count='25' start_index='"+start_index+"'>" +
		"<id>"+fid+"</id>" +
		"<name>"+fname+"</name>" +
		"<description></description>" +
		"<est_hours></est_hours>" +
		"<last_updated sort='desc'></last_updated>" +
		"</task_type>";
	
	$('#form79_body').html("");
	
	fetch_requested_data('form79',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form79_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Task'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form79_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Description'>";
						rowsHTML+="<textarea readonly='readonly' form='form79_"+result.id+"' class='dblclick_editable'>"+result.description+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Estimated Hours'>";
						rowsHTML+="<input type='number' step='any' readonly='readonly' form='form79_"+result.id+"' class='dblclick_editable' value='"+result.est_hours+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form79_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form79_"+result.id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form79_"+result.id+"' onclick='form79_delete_item($(this));'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form79_body').append(rowsHTML);
			var fields=document.getElementById("form79_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form79_update_item(fields);
			});
		});
		

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'task_types');
		});
		hide_loader();
	});
};


/**
 * @form De-duplication mapping
 * @formNo 80
 * @Loading light
 */
function form80_ini()
{
	show_loader();
	var fid=$("#form80_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form80_master');
	var fobject=filter_fields.elements[1].value;
	
	var columns="<de_duplication>" +
		"<id></id>" +
		"<object>"+fobject+"</object>" +
		"<slave_id></slave_id>" +
		"<slave_value></slave_value>" +
		"<master_id></master_id>" +
		"<master_value></master_value>" +
		"<status>pending</status>" +
		"</de_duplication>";
	
	$('#form80_body').html("");
	
	fetch_requested_data('form80',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="<tr>";
				rowsHTML+="<form id='form80_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Change'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form80_"+result.id+"' value='"+result.slave_value+"'>";
						rowsHTML+="<input type='hidden' form='form80_"+result.id+"' value='"+result.slave_id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='To'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form80_"+result.id+"' value='"+result.master_value+"'>";
						rowsHTML+="<input type='hidden' form='form80_"+result.id+"' value='"+result.master_id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form80_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form80_"+result.id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form80_"+result.id+"' onclick='form80_delete_item($(this));'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form80_body').append(rowsHTML);
			var fields=document.getElementById("form80_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
			});
		});
		hide_loader();
	});
};


/**
 * @form Sale Leads
 * @formNo 81
 * @Loading light
 */
function form81_ini()
{
	show_loader();
	var fid=$("#form81_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form81_header');
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form81_index');
	var prev_element=document.getElementById('form81_prev');
	var next_element=document.getElementById('form81_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<sale_leads count='25' start_index='"+start_index+"'>" +
		"<id>"+fid+"</id>" +
		"<customer>"+fname+"</customer>" +
		"<detail></detail>" +
		"<due_date></due_date>" +
		"<identified_by></identified_by>" +
		"<last_updated sort='desc'></last_updated>" +
		"</sale_leads>";
	
	$('#form81_body').html("");
	
	fetch_requested_data('form81',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form81_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Customer'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form81_"+result.id+"' value='"+result.customer+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Details'>";
						rowsHTML+="<textarea readonly='readonly' form='form81_"+result.id+"' class='dblclick_editable'>"+result.detail+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Due Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form81_"+result.id+"' class='dblclick_editable' value='"+get_my_past_date(result.due_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Indetified By'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form81_"+result.id+"' value='"+result.identified_by+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form81_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form81_"+result.id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form81_"+result.id+"' onclick='form81_delete_item($(this));'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form81_body').append(rowsHTML);
			var fields=document.getElementById("form81_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form81_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'sale_leads');
		});
		hide_loader();
	});
};

/**
 * @form Store Areas
 * @formNo 83
 * @Loading light
 */
function form83_ini()
{
	show_loader();
	var fid=$("#form83_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form83_header');
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form83_index');
	var prev_element=document.getElementById('form83_prev');
	var next_element=document.getElementById('form83_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<store_areas count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fname+"</name>" +
			"<area_type></area_type>" +
			"<last_updated sort='desc'></last_updated>" +
			"</store_areas>";

	$('#form83_body').html("");

	fetch_requested_data('form83',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form83_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form83_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form83_"+result.id+"' value='"+result.area_type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form83_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form83_"+result.id+"' title='Delete' onclick='form83_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form83_body').append(rowsHTML);
			var fields=document.getElementById("form83_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
			});
		});
		

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'store_areas');
		});
		hide_loader();
	});
};

/**
 * @form Service Subscriptions
 * @formNo 84
 * @Loading light
 */
function form84_ini()
{
	show_loader();
	var fid=$("#form84_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form84_header');
	
	var fcustomer=filter_fields.elements[0].value;
	var fservice=filter_fields.elements[1].value;
	var fstatus=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form84_index');
	var prev_element=document.getElementById('form84_prev');
	var next_element=document.getElementById('form84_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<service_subscriptions count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<customer>"+fcustomer+"</customer>" +
			"<service>"+fservice+"</service>" +
			"<status>"+fstatus+"</status>" +
			"<notes></notes>" +
			"<last_bill_date></last_bill_date>" +
			"<next_due_date></next_due_date>" +
			"<last_bill_id></last_bill_id>" +
			"<last_updated sort='desc'></last_updated>" +
			"</service_subscriptions>";

	$('#form84_body').html("");

	fetch_requested_data('form84',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var last_bill_string="Last bill Id: "+result.last_bill_id+"\nLast bill date: "+get_my_past_date(result.last_bill_date)+"\nNext due date: "+get_my_past_date(result.next_due_date);
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form84_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Customer'>";
						rowsHTML+="<textarea readonly='readonly' form='form84_"+result.id+"'>"+result.customer+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Service'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form84_"+result.id+"' value='"+result.service+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form84_"+result.id+"' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Notes'>";
						rowsHTML+="<textarea readonly='readonly' form='form84_"+result.id+"' class='dblclick_editable'>"+result.notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Last Bill'>";
						rowsHTML+="<textarea readonly='readonly' form='form84_"+result.id+"'>"+last_bill_string+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form84_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form84_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form84_"+result.id+"' title='Delete' onclick='form84_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form84_body').append(rowsHTML);
			var fields=document.getElementById("form84_"+result.id);
			var status_filter=fields.elements[2];
			
			set_static_filter('service_subscriptions','status',status_filter);
			
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form84_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'subscriptions');
		});
		hide_loader();
	});
};


/**
 * @form Verify supplier geo-location
 * @formNo 85
 * @Loading light
 */
function form85_ini()
{
	show_loader();

	if(is_online())
	{
		var domain=get_domain();
		var username=get_username();
		var re_access=get_session_var('re');
		ajax_with_custom_func("./ajax/geoCode.php","domain="+domain+"&username="+username+"&type=suppliers&re="+re_access,function(e)
		{
			console.log(e.responseText);

			$('#form85_header').html("");
		
			var lat=get_session_var('lat');
			var lng=get_session_var('lng');
			var title=get_session_var('title');
			
			if(typeof map85 != 'undefined')
				map85.remove();
		
			map85 = L.map('form85_map',{
				center: [lat,lng], 
				zoom: 10
			});
		
			L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
		        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenstreetMap</a>',
		        subdomains:'1234'
		    }).addTo(map85);
			
			//////////changeable master coordinates/////////
			
			var mlatlng=L.latLng(lat,lng);
			var mmarker=L.marker(mlatlng,{draggable:true}).addTo(map85).bindPopup(title);
			mmarker.on('dragend',function(event){
				var m=event.target;
				var latlng=m.getLatLng();
				var form=document.getElementById('form85_master');
				form.elements[1].value=latlng.lat;
				form.elements[2].value=latlng.lng;
				var save_button=form.elements[3];
				$(save_button).show();
			});
			
			var rowsHTML="<div class='customers_content_item'>" +
					"<form id='form85_master'>" +
					"Name: <textarea style='height:40px;width:100px' readonly='readonly'>"+title+"</textarea></br>" +
					"Latitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+lat+"</textarea></br>" +
					"Longitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+lng+"</textarea></br>" +
					"<input type='button' class='export_icon' value='Confirm' style='display:none;' form='form85_master'>" +
					"</form>" +
					"</div>";
			
			$('#form85_header').append(rowsHTML);
			var fields=document.getElementById("form85_master");
			var save_button=fields.elements[3];
			$(save_button).on("click", function(event)
			{
				event.preventDefault();
				form85_update_master(fields);
			});
			$(fields).parent().on('click',function(event)
			{
				mmarker.openPopup();
			});
		
			/////////////////////////////////////////////////
			
			var suppliers_data="<suppliers>" +
					"<id></id>" +
					"<name></name>" +
					"<lat></lat>" +
					"<lng></lng>" +
					"<acc_name></acc_name>" +
					"<address_status>unconfirmed</address_status>" +
					"<address></address>" +
					"<pincode></pincode>" +
					"<city></city>" +
					"<state></state>" +
					"<country></country>" +
					"</suppliers>";
			fetch_requested_data('form85',suppliers_data,function(suppliers)
			{
				suppliers.forEach(function(supplier)
				{
					if(supplier.lat=='')
					{
						supplier.lat=lat;
					}
					if(supplier.lng=='')
					{
						supplier.lng=lng;
					}
					var latlng=L.latLng(supplier.lat,supplier.lng);
					var marker=L.marker(latlng,{draggable:true}).addTo(map85).bindPopup(supplier.name);
					marker.on('dragend',function(event){
						var m=event.target;
						var latlng=m.getLatLng();
						var form=document.getElementById('form85_'+supplier.id);
						form.elements[1].value=latlng.lat;
						form.elements[2].value=latlng.lng;
						var save_button=form.elements[4];
						$(save_button).show();
					});
					
					var rowsHTML="<div class='customers_content_item'>" +
							"<form id='form85_"+supplier.id+"'>" +
							"Name: <textarea style='height:40px;width:100px' readonly='readonly'>"+supplier.acc_name+"</textarea><br>" +
							"Latitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+supplier.lat+"</textarea><br>" +
							"Longitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+supplier.lng+"</textarea><br>" +
							"<input type='hidden' value='"+supplier.id+"'>" +
							"<input type='button' class='export_icon' value='Confirm' form='form85_"+supplier.id+"'>" +
							"</form>" +
							"</div>";
					
					$('#form85_header').append(rowsHTML);
					var fields=document.getElementById("form85_"+supplier.id);
					var save_button=fields.elements[4];
					$(save_button).on("click", function(event)
					{
						event.preventDefault();
						form85_update_item(fields);
					});
					$(fields).parent().on('click',function(event)
					{
						//console.log('clicked on customer');
						marker.openPopup();
					});
				});
				
				var scrollPane=$(".customers_pane");
				var scrollContent=$(".customers_content");
				scrollContent.css('width',(Math.round(225*suppliers.length)+225)+"px");
				$(".customers_bar").slider({
					slide: function(event,ui) {
						if (scrollContent.width()>scrollPane.width()){
							scrollContent.css( "margin-left", Math.round(ui.value/100*(scrollPane.width()-scrollContent.width()))+"px");
						} 
						else{
							scrollContent.css("margin-left",0);
						}
					}
				});
		
				scrollPane.css("overflow","hidden");			
			
				hide_loader();
			});
		});
	}
	else
	{
		$("#modal6").dialog("open");
	}
}


/**
 * @form Verify staff geo-location
 * @formNo 86
 * @Loading light
 */
function form86_ini()
{
	show_loader();

	if(is_online())
	{
		var domain=get_domain();
		var username=get_username();
		var re_access=get_session_var('re');
		ajax_with_custom_func("./ajax/geoCode.php","domain="+domain+"&username="+username+"&type=staff&re="+re_access,function(e)
		{
			console.log(e.responseText);

			$('#form86_header').html("");
		
			var lat=get_session_var('lat');
			var lng=get_session_var('lng');
			var title=get_session_var('title');
			
			if(typeof map86 != 'undefined')
				map86.remove();
		
			map86 = L.map('form86_map',{
				center: [lat,lng], 
				zoom: 10
			});
		
			L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
		        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenstreetMap</a>',
		        subdomains:'1234'
		    }).addTo(map86);
			
			//////////changeable master coordinates/////////
			
			var mlatlng=L.latLng(lat,lng);
			var mmarker=L.marker(mlatlng,{draggable:true}).addTo(map86).bindPopup(title);
			mmarker.on('dragend',function(event){
				var m=event.target;
				var latlng=m.getLatLng();
				var form=document.getElementById('form86_master');
				form.elements[1].value=latlng.lat;
				form.elements[2].value=latlng.lng;
				var save_button=form.elements[3];
				$(save_button).show();
			});
			
			var rowsHTML="<div class='customers_content_item'>" +
					"<form id='form86_master'>" +
					"Name: <textarea style='height:40px;width:100px' readonly='readonly'>"+title+"</textarea></br>" +
					"Latitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+lat+"</textarea></br>" +
					"Longitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+lng+"</textarea></br>" +
					"<input type='button' class='export_icon' value='Confirm' style='display:none;' form='form86_master'>" +
					"</form>" +
					"</div>";
			
			$('#form86_header').append(rowsHTML);
			var fields=document.getElementById("form86_master");
			var save_button=fields.elements[3];
			$(save_button).on("click", function(event)
			{
				event.preventDefault();
				form86_update_master(fields);
			});
			$(fields).parent().on('click',function(event)
			{
				//console.log('clicked on master');
				mmarker.openPopup();
			});
		
			/////////////////////////////////////////////////
			
			var staff_data="<staff>" +
					"<id></id>" +
					"<name></name>" +
					"<lat></lat>" +
					"<lng></lng>" +
					"<acc_name></acc_name>" +
					"<address_status>unconfirmed</address_status>" +
					"<address></address>" +
					"<pincode></pincode>" +
					"<city></city>" +
					"<state></state>" +
					"<country></country>" +
					"</staff>";
			fetch_requested_data('form86',staff_data,function(staffs)
			{
				staffs.forEach(function(staff)
				{
					if(staff.lat=='')
					{
						staff.lat=lat;
					}
					if(staff.lng=='')
					{
						staff.lng=lng;
					}
					var latlng=L.latLng(staff.lat,staff.lng);
					var marker=L.marker(latlng,{draggable:true}).addTo(map86).bindPopup(staff.name);
					marker.on('dragend',function(event){
						var m=event.target;
						var latlng=m.getLatLng();
						var form=document.getElementById('form86_'+staff.id);
						form.elements[1].value=latlng.lat;
						form.elements[2].value=latlng.lng;
						var save_button=form.elements[4];
						$(save_button).show();
					});
					
					var rowsHTML="<div class='customers_content_item'>" +
							"<form id='form86_"+staff.id+"'>" +
							"Name: <textarea style='height:40px;width:100px' readonly='readonly'>"+staff.acc_name+"</textarea></br>" +
							"Latitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+staff.lat+"</textarea></br>" +
							"Longitude: <textarea style='height:20px;width:100px' readonly='readonly'>"+staff.lng+"</textarea></br>" +
							"<input type='hidden' value='"+staff.id+"'>" +
							"<input type='button' class='export_icon' value='Confirm' form='form86_"+staff.id+"'>" +
							"</form>" +
							"</div>";
					
					$('#form86_header').append(rowsHTML);
					var fields=document.getElementById("form86_"+staff.id);
					var save_button=fields.elements[4];
					$(save_button).on("click", function(event)
					{
						event.preventDefault();
						form86_update_item(fields);
					});
					$(fields).parent().on('click',function(event)
					{
						//console.log('clicked on customer');
						marker.openPopup();
					});
				});
				
				var scrollPane=$(".customers_pane");
				var scrollContent=$(".customers_content");
				scrollContent.css('width',(Math.round(225*staffs.length)+225)+"px");
				$(".customers_bar").slider({
					slide: function(event,ui) {
						if (scrollContent.width()>scrollPane.width()){
							scrollContent.css( "margin-left", Math.round(ui.value/100*(scrollPane.width()-scrollContent.width()))+"px");
						} 
						else{
							scrollContent.css("margin-left",0);
						}
					}
				});
		
				scrollPane.css("overflow","hidden");			
			
				hide_loader();
			});
		});
	}
	else
	{
		$("#modal6").dialog("open");
	}
}

/**
 * @form Manage Products
 * @formNo 87
 * @Loading light
 */
function form87_ini()
{
	show_loader();
	var fid=$("#form87_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form87_header');
	
	var fname=filter_fields.elements[0].value;
	var fmakes=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form87_index');
	var prev_element=document.getElementById('form87_prev');
	var next_element=document.getElementById('form87_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<product_master count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fname+"</name>" +
			"<make>"+fmakes+"</make>" +
			"<description></description>" +
			"<tax></tax>" +
			"<bar_code></bar_code>" +
			"<last_updated sort='desc'></last_updated>" +
			"</product_master>";

	$('#form87_body').html("");

	fetch_requested_data('form87',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form87_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form87_"+result.id+"'>"+result.name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Make'>";
						rowsHTML+="<textarea readonly='readonly' form='form87_"+result.id+"' class='dblclick_editable'>"+result.make+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Description'>";
						rowsHTML+="<textarea readonly='readonly' form='form87_"+result.id+"' class='dblclick_editable'>"+result.description+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Tax'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form87_"+result.id+"' class='dblclick_editable' value='"+result.tax+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form87_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form87_"+result.id+"' value='saved'>";
						rowsHTML+="<input type='button' class='copy_icon' form='form87_"+result.id+"' value='saved' onclick='modal19_action($(this));'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form87_"+result.id+"' value='saved' onclick='form87_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
		
			$('#form87_body').append(rowsHTML);

			var fields=document.getElementById("form87_"+result.id);
			
			$(fields).on("submit",function(event)
			{
				event.preventDefault();
				form87_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'products');
		});
		hide_loader();
	});	
};


/**
 * @form Manufacturing Schedule
 * @formNo 88
 * @Loading light
 */
function form88_ini()
{
	show_loader();
	var fid=$("#form88_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form88_header');
	var fname=filter_fields.elements[0].value;
	var fstatus=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form88_index');
	var prev_element=document.getElementById('form88_prev');
	var next_element=document.getElementById('form88_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<manufacturing_schedule count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<product>"+fname+"</product>" +
			"<process_notes></process_notes>" +
			"<iteration_notes></iteration_notes>" +
			"<schedule></schedule>" +
			"<status>"+fstatus+"</status>" +
			"<last_updated sort='desc'></last_updated>" +
			"</manufacturing_schedule>";

	$('#form88_body').html("");

	fetch_requested_data('form88',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form88_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Product'>";
						rowsHTML+="<textarea readonly='readonly' form='form88_"+result.id+"'>"+result.product+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Process Notes'>";
						rowsHTML+="<textarea readonly='readonly' form='form88_"+result.id+"' class='dblclick_editable'>"+result.process_notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form88_"+result.id+"' class='dblclick_editable' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Schedule'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form88_"+result.id+"' class='dblclick_editable' value='"+get_my_datetime(result.schedule)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Iteration Notes'>";
						rowsHTML+="<textarea readonly='readonly' form='form88_"+result.id+"' class='dblclick_editable'>"+result.iteration_notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form88_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form88_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form88_"+result.id+"' title='Delete' onclick='form88_delete_item($(this));'>";
						rowsHTML+="<input type='hidden' form='form88_"+result.id+"' value='"+result.status+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
		
			$('#form88_body').append(rowsHTML);

			var fields=document.getElementById("form88_"+result.id);
			var status_filter=fields.elements[2];
			var schedule_filter=fields.elements[3];
			
			set_static_value_list('manufacturing_schedule','status',status_filter);
			$(schedule_filter).datetimepicker();
			
			$(fields).on("submit",function(event)
			{
				event.preventDefault();
				form88_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'manufacturing_schedule');
		});
		hide_loader();
	});	
};

/**
 * @form Appointments
 * @formNo 89
 * @Loading heavy
 */
function form89_ini()
{
	show_loader();
	var fid=$("#form89_link").attr('data_id');
	if(fid==null)
		fid="";
	
	var filter_fields=document.getElementById('form89_header');
	
	//populating form 
	var fcustomer=filter_fields.elements[0].value;
	var fassignee=filter_fields.elements[1].value;
	var fstatus=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form89_index');
	var prev_element=document.getElementById('form89_prev');
	var next_element=document.getElementById('form89_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<appointments count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<customer>"+fcustomer+"</customer>" +
			"<schedule></schedule>" +
			"<assignee>"+fassignee+"</assignee>" +
			"<hours></hours>" +
			"<status>"+fstatus+"</status>" +
			"<notes></notes>" +
			"<last_updated sort='desc'></last_updated>" +
			"</appointments>";

	$('#form89_body').html("");

	fetch_requested_data('form89',columns,function(results)
	{
		results.forEach(function(result)
		{
			var message_string=result.customer+" appointment with "+result.assignee+" @"+get_my_datetime(result.schedule)+"\nNotes:"+result.notes;
			message_string=encodeURIComponent(message_string);
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form89_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Customer'>";
						rowsHTML+="<textarea readonly='readonly' form='form89_"+result.id+"'>"+result.customer+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Assignee'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form89_"+result.id+"' class='dblclick_editable' value='"+result.assignee+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Schedule'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form89_"+result.id+"' class='dblclick_editable'>"+get_my_datetime(result.schedule)+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Notes'>";
						rowsHTML+="<textarea readonly='readonly' form='form89_"+result.id+"' class='dblclick_editable'>"+result.notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form89_"+result.id+"' class='dblclick_editable' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' readonly='readonly' form='form89_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form89_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form89_"+result.id+"' title='Delete' onclick='form89_delete_item($(this));'>";
						rowsHTML+="<a id='form89_whatsapp_"+result.id+"' href='whatsapp://send?text="+message_string+"' target='_blank'><img style='width:25px;height:25px;' src='./images/whatsapp.jpeg' form='form89_"+result.id+"' title='Send details through WhatsApp'></a>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form89_body').append(rowsHTML);
			var fields=document.getElementById("form89_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form89_update_item(fields);
			});
			
			var name_filter=fields.elements[0];
			var assignee_filter=fields.elements[1];
			var schedule_filter=fields.elements[2];
			var status_filter=fields.elements[4];
						
			var staff_data="<staff>" +
					"<acc_name></acc_name>" +
					"</staff>";
			set_my_value_list(staff_data,assignee_filter);
			set_static_value_list('appointments','status',status_filter);
			$(schedule_filter).datetimepicker();
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'appointments');
		});
		hide_loader();
	});
};

/**
 * @form Billing types
 * @formNo 90
 * @Loading light
 */
function form90_ini()
{
	show_loader();
	var fid=$("#form90_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form90_header');
	
	var fname=filter_fields.elements[0].value;
	
	////indexing///
	var index_element=document.getElementById('form90_index');
	var prev_element=document.getElementById('form90_prev');
	var next_element=document.getElementById('form90_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<bill_types count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fname+"</name>" +
			"<notes></notes>" +
			"<last_updated sort='desc'></last_updated>" +
			"</bill_types>";

	$('#form90_body').html("");

	fetch_requested_data('form90',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form90_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form90_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Notes'>";
						rowsHTML+="<textarea readonly='readonly' form='form90_"+result.id+"' class='dblclick_editable'>"+result.notes+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form90_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form90_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form90_"+result.id+"' title='Delete' onclick='form90_delete_item($(this));'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
		
			$('#form90_body').append(rowsHTML);

			var fields=document.getElementById("form90_"+result.id);
			
			$(fields).on("submit",function(event)
			{
				event.preventDefault();
				form90_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[2];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'billing_types');
		});
		hide_loader();
	});	
};

/**
 * @form Create Bills(multiple register)
 * @formNo 91
 * @Loading light
 */
function form91_ini()
{
	var bill_id=$("#form91_link").attr('data_id');
	if(bill_id==null)
		bill_id="";	
	
	$('#form91_body').html("");

	if(bill_id!="")
	{
		show_loader();
		var bill_columns="<bills>" +
				"<id exact='yes'>"+bill_id+"</id>" +
				"<customer_name></customer_name>" +
				"<total></total>" +
				"<bill_date></bill_date>" +
				"<amount></amount>" +
				"<discount></discount>" +
				"<tax></tax>" +
				"<offer></offer>" +
				"<billing_type></billing_type>" +
				"<type>product</type>" +
				"<transaction_id></transaction_id>" +
				"</bills>";
		var bill_items_column="<bill_items>" +
				"<id></id>" +
				"<item_name></item_name>" +
				"<batch></batch>" +
				"<unit_price></unit_price>" +
				"<quantity></quantity>" +
				"<amount></amount>" +
				"<total></total>" +
				"<discount></discount>" +
				"<offer></offer>" +
				"<type></type>" +
				"<bill_id exact='yes'>"+bill_id+"</bill_id>" +
				"<tax></tax>" +
				"<free_with></free_with>" +
				"</bill_items>";
	
		////separate fetch function to get bill details like customer name, total etc.
		fetch_requested_data('',bill_columns,function(bill_results)
		{
			var filter_fields=document.getElementById('form91_master');
			
			for (var i in bill_results)
			{
				filter_fields.elements[1].value=bill_results[i].customer_name;
				filter_fields.elements[2].value=bill_results[i].billing_type;
				filter_fields.elements[3].value=get_my_past_date(bill_results[i].bill_date);
				filter_fields.elements[4].value=bill_results[i].amount;
				filter_fields.elements[5].value=bill_results[i].discount;
				filter_fields.elements[6].value=bill_results[i].tax;
				filter_fields.elements[7].value=bill_results[i].total;
				filter_fields.elements[8].value=bill_id;
				filter_fields.elements[9].value=bill_results[i].offer;
				filter_fields.elements[10].value=bill_results[i].transaction_id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form91_update_form();
				});
				break;
			}
		
			fetch_requested_data('',bill_items_column,function(results)
			{
				var message_string="Bill from: "+get_session_var('title')+"\nAddress: "+get_session_var('address');
				
				results.forEach(function(result)
				{
					message_string+="\nItem: "+result.item_name;
					message_string+=" Quantity: "+result.quantity;
					message_string+=" Total: "+result.total;
					
					var rowsHTML="";
					var id=result.id;
					rowsHTML+="<tr>";
					rowsHTML+="<form id='form91_"+id+"'></form>";
						rowsHTML+="<td data-th='Product Name'>";
							rowsHTML+="<textarea readonly='readonly' form='form91_"+id+"'>"+result.item_name+"</textarea>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Batch'>";
							rowsHTML+="<input type='text' readonly='readonly' form='form91_"+id+"' value='"+result.batch+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Quantity'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form91_"+id+"' value='"+result.quantity+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Unit Price'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form91_"+id+"' value='"+result.unit_price+"' step='any'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Total'>";
							rowsHTML+="<input type='number' readonly='readonly' form='form91_"+id+"' value='"+result.total+"'>";
						rowsHTML+="</td>";
						rowsHTML+="<td data-th='Action'>";
							rowsHTML+="<input type='hidden' form='form91_"+id+"' value='"+result.amount+"'>";
							rowsHTML+="<input type='hidden' form='form91_"+id+"' value='"+result.discount+"'>";
							rowsHTML+="<input type='hidden' form='form91_"+id+"' value='"+result.tax+"'>";
							rowsHTML+="<input type='hidden' form='form91_"+id+"' value='"+result.offer+"'>";
							rowsHTML+="<input type='hidden' form='form91_"+id+"' value='"+id+"'>";
							rowsHTML+="<input type='submit' class='submit_hidden' form='form91_"+id+"' id='save_form91_"+id+"'>";
							rowsHTML+="<input type='button' class='delete_icon' form='form91_"+id+"' id='delete_form91_"+id+"' onclick='form91_delete_item($(this));'>";
							rowsHTML+="<input type='hidden' form='form91_"+id+"'>";
							rowsHTML+="<input type='hidden' form='form91_"+id+"'>";
						rowsHTML+="</td>";			
					rowsHTML+="</tr>";
				
					$('#form91_body').append(rowsHTML);
					
					var fields=document.getElementById("form91_"+id);
					$(fields).on("submit", function(event)
					{
						event.preventDefault();
					});
				});
				
				message_string+="\nAmount: "+filter_fields.elements[4].value;
				message_string+="\ndiscount: "+filter_fields.elements[5].value;
				message_string+="\nTax: "+filter_fields.elements[6].value;
				message_string+="\nTotal: "+filter_fields.elements[7].value;
				
				var subject="Bill from "+get_session_var('title');
				$('#form91_share').show();
				$('#form91_share').click(function()
				{
					modal44_action(filter_fields.elements[1].value,subject,message_string);
				});

				hide_loader();
			});
		});
	}
}


/**
 * @form Manage Bills(multiple registers)
 * @formNo 92
 * @Loading light
 */
function form92_ini()
{
	show_loader();
	var fid=$("#form92_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form92_header');
	
	//populating form 
	if(fid==="")
		fid=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	var fname=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form92_index');
	var prev_element=document.getElementById('form92_prev');
	var next_element=document.getElementById('form92_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<bills count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<customer_name>"+fname+"</customer_name>" +
			"<bill_date></bill_date>" +
			"<total></total>" +
			"<type></type>" +
			"<transaction_id></transaction_id>" +
			"<billing_type>"+ftype+"</billing_type>" +
			"<last_updated sort='desc'></last_updated>" +
			"</bills>";

	$('#form92_body').html("");

	fetch_requested_data('form92',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form92_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Bill No.'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form92_"+result.id+"' value='"+result.id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form92_"+result.id+"' value='"+result.billing_type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Customer'>";
						rowsHTML+="<textarea readonly='readonly' form='form92_"+result.id+"'>"+result.customer_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Bill Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form92_"+result.id+"' value='"+get_my_past_date(result.bill_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Bill Amount'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form92_"+result.id+"' value='"+result.total+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='button' class='edit_icon' form='form92_"+result.id+"' title='Edit Bill'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form92_"+result.id+"' title='Delete Bill' onclick='form92_delete_item($(this));'>";
						rowsHTML+="<input type='hidden' form='form92_"+result.id+"' value='"+result.transaction_id+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form92_body').append(rowsHTML);
			var fields=document.getElementById("form92_"+result.id);
			var edit_button=fields.elements[5];
			$(edit_button).on("click", function(event)
			{
				event.preventDefault();
				element_display(result.id,'form91');
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'bills');
		});
		hide_loader();
	});
}

/**
 * @form Manage Loans
 * @formNo 93
 * @Loading light
 */
function form93_ini()
{
	show_loader();
	var fid=$("#form93_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form93_header');
	var faccount=filter_fields.elements[0].value;
	var ftype=filter_fields.elements[1].value;
	var fstatus=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form93_index');
	var prev_element=document.getElementById('form93_prev');
	var next_element=document.getElementById('form93_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<loans count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<type>"+ftype+"</type>" +
			"<account>"+faccount+"</account>" +
			"<loan_amount></loan_amount>" +
			"<repayment_method></repayment_method>" +
			"<status>"+fstatus+"</status>" +
			"<date_initiated></date_initiated>" +
			"<interest_paid></interest_paid>" +
			"<interest_rate></interest_rate>" +
			"<interest_period></interest_period>" +
			"<next_interest_date></next_interest_date>" +
			"<emi></emi>" +
			"<emi_period></emi_period>" +
			"<next_emi_date></next_emi_date>" +
			"<pending_emi></pending_emi>" +
			"<interest_type></interest_type>" +
			"<last_updated sort='desc'></last_updated>" +
			"</loans>";

	$('#form93_body').html("");

	fetch_requested_data('form93',columns,function(results)
	{
		results.forEach(function(result)
		{
			var details="Repayment as lump sum "+
					"\nDate inititated: "+get_my_past_date(result.date_initiated)+
					"\nInterest rate is "+result.interest_rate + "%"+
					"\nInterest period is "+result.interest_period+" days" +
					"\nInterest is "+result.interest_type +
					"\nInterest paid till date: "+result.interest_paid+
					"\nNext interest payment date: "+get_my_past_date(result.next_interest_date);
			if(result.repayment_method=='instalments')
			{
				details="Repayment in instalments"+
				"\nDate inititated: "+get_my_past_date(result.date_initiated)+
				"\nEMI is Rs. "+result.emi +
				"\nEMI period is "+result.emi_period+" days" +
				"\n"+result.pending_emi+" EMIs are pending"+
				"\nNext emi payment date is "+get_my_past_date(result.next_emi_date);
			}
			var rowsHTML="<tr>";
				rowsHTML+="<form id='form93_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Account'>";
						rowsHTML+="<textarea readonly='readonly' form='form93_"+result.id+"'>"+result.account+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form93_"+result.id+"' value='"+result.type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Loan Amount'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form93_"+result.id+"' value='"+result.loan_amount+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Details'>";
						rowsHTML+="<textarea readonly='readonly' form='form93_"+result.id+"'>"+details+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form93_"+result.id+"' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form93_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='hidden' form='form93_"+result.id+"' value='"+result.repayment_method+"'>";
						rowsHTML+="<input type='hidden' form='form93_"+result.id+"' value='"+result.emi+"'>";
						rowsHTML+="<input type='hidden' form='form93_"+result.id+"' value='"+result.pending_emi+"'>";
						if(result.status=='open')
						{
							rowsHTML+="<input type='submit' class='export_icon' title='Close loan' form='form93_"+result.id+"' value='Close'>";
						}
						rowsHTML+="<input type='button' class='delete_icon' form='form93_"+result.id+"' title='Delete' onclick='form93_delete_item($(this));'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
		
			$('#form93_body').append(rowsHTML);

			var fields=document.getElementById("form93_"+result.id);
			var status_filter=fields.elements[4];
			
			set_static_value_list('loans','status',status_filter);
			$(fields).on("submit",function(event)
			{
				event.preventDefault();
				form93_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'loans');
		});
		hide_loader();
	});	
};


/**
 * @form Discard Items
 * @formNo 94
 * @Loading light
 */
function form94_ini()
{
	show_loader();
	var fid=$("#form94_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form94_header');
	
	var fname=filter_fields.elements[0].value;
	var fbatch=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form94_index');
	var prev_element=document.getElementById('form94_prev');
	var next_element=document.getElementById('form94_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<discarded count='25' start_index='"+start_index+"'>" +
		"<id>"+fid+"</id>" +
		"<batch>"+fbatch+"</batch>" +
		"<product_name>"+fname+"</product_name>" +
		"<quantity></quantity>" +
		"<source></source>" +
		"<source_link></source_link>" +
		"<source_id></source_id>" +
		"<last_updated sort='desc'></last_updated>" +
		"</discarded>";
	
	$('#form94_body').html("");
	
	fetch_requested_data('form94',columns,function(results)
	{
		results.forEach(function(result)
		{
			var source_string=result.source+" <a onclick=\"element_display('"+result.source_id+"','"+result.source_link+"')\"><u>"+result.source_id+"</u></a>";
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form94_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Item Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form94_"+result.id+"'>"+result.product_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Batch'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form94_"+result.id+"' value='"+result.batch+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Quantity'>";
						rowsHTML+="<input type='number' step='any' readonly='readonly' form='form94_"+result.id+"' value='"+result.quantity+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Source'>";
						rowsHTML+=source_string;
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form94_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' title='Save' form='form94_"+result.id+"'>";
						rowsHTML+="<input type='button' class='delete_icon' title='Delete' form='form94_"+result.id+"' onclick='form94_delete_item($(this));'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form94_body').append(rowsHTML);
			var fields=document.getElementById("form94_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'discarded_items');
		});
		hide_loader();
	});
};

/**
 * @form Data Import
 * @formNo 95
 * @Loading light
 */
function form95_ini()
{
	show_loader();
	var fid=$("#form95_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form95_header');
		
	var fnumber=filter_fields.elements[0].value;
	var fname=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form95_index');
	var prev_element=document.getElementById('form95_prev');
	var next_element=document.getElementById('form95_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////
	
	var columns="<user_preferences count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fnumber+"</name>" +
			"<display_name>"+fname+"</display_name>" +
			"<type exact='yes'>form</type>" +
			"<value exact='yes'>checked</value>" +
			"</user_preferences>";
	
	$('#form95_body').html("");

	fetch_requested_data('form95',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form95_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Form No'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form95_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Form Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form95_"+result.id+"' data-i18n='form."+result.display_name+"'></textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Import'>";
						rowsHTML+="<input type='hidden' form='form95_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='button' class='import_icon' form='form95_"+result.id+"' value='IMPORT'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form95_body').prepend(rowsHTML);
			
			var fields=document.getElementById("form95_"+result.id);
			
			var import_button=fields.elements[3];
			$(import_button).on("click",function(event)
			{
				import_data(result.name);
			});
		});
		
		$('#form95_body').find('textarea').i18n();

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////
		$('textarea').autosize();
		
		hide_loader();
	});
};

/**
 * @form Customer Attributes
 * @formNo 96
 * @Loading light
 */
function form96_ini()
{
	show_loader();
	var fid=$("#form96_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form96_header');
	
	var fcustomer=filter_fields.elements[0].value;
	var fattribute=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form96_index');
	var prev_element=document.getElementById('form96_prev');
	var next_element=document.getElementById('form96_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<attributes count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fcustomer+"</name>" +
			"<type exact='yes'>customer</type>" +
			"<attribute>"+fattribute+"</attribute>" +
			"<value></value>" +
			"<last_updated sort='desc'></last_updated>" +
			"</attributes>";

	$('#form96_body').html("");

	fetch_requested_data('form96',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form96_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form96_"+result.id+"'>"+result.name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Attribute'>";
						rowsHTML+="<textarea readonly='readonly' form='form96_"+result.id+"'>"+result.attribute+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Value'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form96_"+result.id+"' value='"+result.value+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form96_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form96_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form96_"+result.id+"' title='Delete' onclick='form96_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form96_body').append(rowsHTML);
			var fields=document.getElementById("form96_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form96_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'customer_attributes');
		});
		hide_loader();
	});
};

/**
 * @form Supplier Attributes
 * @formNo 97
 * @Loading light
 */
function form97_ini()
{
	show_loader();
	var fid=$("#form97_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form97_header');
	
	var fsupplier=filter_fields.elements[0].value;
	var fattribute=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form97_index');
	var prev_element=document.getElementById('form97_prev');
	var next_element=document.getElementById('form97_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<attributes count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fsupplier+"</name>" +
			"<type exact='yes'>supplier</type>" +
			"<attribute>"+fattribute+"</attribute>" +
			"<value></value>" +
			"<last_updated sort='desc'></last_updated>" +
			"</attributes>";

	$('#form97_body').html("");

	fetch_requested_data('form97',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form97_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form97_"+result.id+"'>"+result.name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Attribute'>";
						rowsHTML+="<textarea readonly='readonly' form='form97_"+result.id+"'>"+result.attribute+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Value'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form97_"+result.id+"' value='"+result.value+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form97_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form97_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form97_"+result.id+"' title='Delete' onclick='form97_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form97_body').append(rowsHTML);
			var fields=document.getElementById("form97_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form97_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'supplier_attributes');
		});
		hide_loader();
	});
};

/**
 * @form Staff Attributes
 * @formNo 98
 * @Loading light
 */
function form98_ini()
{
	show_loader();
	var fid=$("#form98_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form98_header');
	
	var fsupplier=filter_fields.elements[0].value;
	var fattribute=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form98_index');
	var prev_element=document.getElementById('form98_prev');
	var next_element=document.getElementById('form98_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<attributes count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fsupplier+"</name>" +
			"<type exact='yes'>staff</type>" +
			"<attribute>"+fattribute+"</attribute>" +
			"<value></value>" +
			"<last_updated sort='desc'></last_updated>" +
			"</attributes>";

	$('#form98_body').html("");

	fetch_requested_data('form98',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form98_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form98_"+result.id+"'>"+result.name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Attribute'>";
						rowsHTML+="<textarea readonly='readonly' form='form98_"+result.id+"'>"+result.attribute+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Value'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form98_"+result.id+"' value='"+result.value+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form98_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form98_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form98_"+result.id+"' title='Delete' onclick='form98_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form98_body').append(rowsHTML);
			var fields=document.getElementById("form98_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form98_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'staff_attributes');
		});
		hide_loader();
	});
};

/**
 * @form Selective Sync
 * @formNo 100
 * @Loading light
 */
function form100_ini()
{
	show_loader();
	var fid=$("#form100_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form100_header');
	var fname=filter_fields.elements[0].value;
	var felement=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form100_index');
	var prev_element=document.getElementById('form100_prev');
	var next_element=document.getElementById('form100_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<user_preferences count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+felement+"</name>" +
			"<display_name>"+fname+"</display_name>" +
			"<sync></sync>" +
			"<value exact='yes'>checked</value>" +
			"<type exact='yes'>form</type>" +
			"</user_preferences>";
	
	$('#form100_body').html("");

	fetch_requested_data('form100',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form100_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Form Name'>";
						rowsHTML+="<textarea readonly='readonly' form='form100_"+result.id+"' data-i18n='form."+result.display_name+"'></textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Sync'>";
						rowsHTML+="<input type='checkbox' form='form100_"+result.id+"' "+result.sync+">";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form100_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='hidden' form='form100_"+result.id+"' value='"+result.name+"'>";
						rowsHTML+="<input type='submit' class='save_icon' id='save_form100_"+result.id+"' form='form100_"+result.id+"'>";	
					rowsHTML+="</td>";
			rowsHTML+="</tr>";
			
			$('#form100_body').append(rowsHTML);
			var fields=document.getElementById("form100_"+result.id);
			
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form100_update_item(fields);
			});
		});
		
		$('#form100_body').find('textarea').i18n();
		

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		
		$('textarea').autosize();
		hide_loader();
	});
};

/**
 * @form Manage Projects
 * @formNo 101
 * @Loading light
 */
function form101_ini()
{
	show_loader();
	var fid=$("#form101_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form101_header');
	
	//populating form 
	var fname=filter_fields.elements[0].value;
	var fstatus=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form101_index');
	var prev_element=document.getElementById('form101_prev');
	var next_element=document.getElementById('form101_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<projects count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fname+"</name>" +
			"<details></details>" +
			"<start_date></start_date>" +
			"<status>"+fstatus+"</status>" +
			"<last_updated sort='desc'></last_updated>" +
			"</projects>";

	$('#form101_body').html("");

	if_data_read_access('projects',function(accessible_data)
	{
		fetch_requested_data('form101',columns,function(results)
		{
			results.forEach(function(result)
			{
				var read=false;
				var update=false;
				var del=false;
				var access=false;
				for(var x in accessible_data)
				{
					if(accessible_data[x].record_id===result.id || accessible_data[x].record_id=='all')
					{
						if(accessible_data[x].criteria_field=="" || accessible_data[x].criteria_field== null || result[accessible_data[x].criteria_field]==accessible_data[x].criteria_value)
						{
							if(accessible_data[x].access_type=='all')
							{
								read=true;
								update=true;
								del=true;
								access=true;
								break;
							}
							else if(accessible_data[x].access_type=='read')
							{
								read=true;
							}
							else if(accessible_data[x].access_type=='delete')
							{
								del=true;
							}
							else if(accessible_data[x].access_type=='delete')
							{
								update=true;
							}
						}
					}
				}
				
				if(read)
				{
					var rowsHTML="";
					rowsHTML+="<tr>";
						rowsHTML+="<form id='form101_"+result.id+"'></form>";
							rowsHTML+="<td data-th='Project Name'>";
								rowsHTML+="<textarea readonly='readonly' form='form101_"+result.id+"'>"+result.name+"</textarea>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Details'>";
								rowsHTML+="<textarea readonly='readonly' class='dblclick_editable' form='form101_"+result.id+"'>"+result.details+"</textarea>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Start Date'>";
								rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form101_"+result.id+"' value='"+get_my_past_date(result.start_date)+"'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Status'>";
								rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form101_"+result.id+"' value='"+result.status+"'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Action'>";
								rowsHTML+="<input type='hidden' readonly='readonly' form='form101_"+result.id+"' value='"+result.id+"'>";
								if(update)
								{
									rowsHTML+="<input type='submit' class='save_icon' form='form101_"+result.id+"' title='Save'>";
								}
								if(del)
								{
									rowsHTML+="<input type='button' class='delete_icon' form='form101_"+result.id+"' title='Delete' onclick='form101_delete_item($(this));'>";
								}
								if(access)
								{
									rowsHTML+="<input type='button' class='generic_icon' form='form101_"+result.id+"' value='Access' onclick=\"access_display('projects','"+result.id+"');\">";
								}
								if(result.status=='active')
								{
									rowsHTML+="<input type='button' class='generic_icon' form='form101_"+result.id+"' value='Team' onclick=\"element_display('"+result.id+"','form102');\">";
									rowsHTML+="<input type='button' class='generic_icon' form='form101_"+result.id+"' value='Phases' onclick=\"element_display('"+result.id+"','form103');\">";
									rowsHTML+="<input type='button' class='generic_icon' form='form101_"+result.id+"' value='Tasks' onclick=\"element_display('"+result.id+"','form104');\">";
								}
							rowsHTML+="</td>";			
					rowsHTML+="</tr>";
					
					$('#form101_body').append(rowsHTML);
					
					var fields=document.getElementById("form101_"+result.id);
					var status_filter=fields.elements[3];
					set_static_value_list('projects','status',status_filter);
					
					$(fields).on("submit", function(event)
					{
						event.preventDefault();
						form101_update_item(fields);
					});
				}
			});
	
			////indexing///
			var next_index=parseInt(start_index)+25;
			var prev_index=parseInt(start_index)-25;
			next_element.setAttribute('data-index',next_index);
			prev_element.setAttribute('data-index',prev_index);
			index_element.setAttribute('data-index','0');
			if(results.length<25)
			{
				$(next_element).hide();
			}
			else
			{
				$(next_element).show();
			}
			if(prev_index<0)
			{
				$(prev_element).hide();
			}
			else
			{
				$(prev_element).show();
			}
			
			longPressEditable($('.dblclick_editable'));
			$('textarea').autosize();
			
			var export_button=filter_fields.elements[3];
			$(export_button).off("click");
			$(export_button).on("click", function(event)
			{
				my_obj_array_to_csv(results,'projects');
			});
			hide_loader();
		});
	});
};

/**
 * @form Assign project members
 * @formNo 102
 * @Loading light
 */
function form102_ini()
{
	var project_id=$("#form102_link").attr('data_id');
	if(project_id==null)
		project_id="";
	$('#form102_body').html("");
	if(project_id!="")
	{
		show_loader();
		var project_columns="<projects>" +
				"<id>"+project_id+"</id>" +
				"<name></name>" +
				"</projects>";
		var member_columns="<project_team>" +
				"<id></id>" +
				"<project_id>"+project_id+"</project_id>" +
				"<member></member>" +
				"<role></role>" +
				"<notes></notes>" +
				"<status></status>" +
				"</project_team>";
	
		fetch_requested_data('',project_columns,function(project_results)
		{
			for (var i in project_results)
			{
				var filter_fields=document.getElementById('form102_master');
				filter_fields.elements[1].value=project_results[i].name;
				filter_fields.elements[2].value=project_results[i].id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form102_create_form();
				});
				break;
			}
		});
		/////////////////////////////////////////////////////////////////////////
		
		if_data_read_access('project_team',function(accessible_data)
		{
			fetch_requested_data('',member_columns,function(results)
			{
				results.forEach(function(result)
				{
					var read=false;
					var update=false;
					var del=false;
					var access=false;
					for(var x in accessible_data)
					{
						if(accessible_data[x].record_id===result.id || accessible_data[x].record_id=='all')
						{
							if(accessible_data[x].criteria_field=="" || accessible_data[x].criteria_field== null || result[accessible_data[x].criteria_field]==accessible_data[x].criteria_value)
							{
								if(accessible_data[x].access_type=='all')
								{
									read=true;
									update=true;
									del=true;
									access=true;
									break;
								}
								else if(accessible_data[x].access_type=='read')
								{
									read=true;
								}
								else if(accessible_data[x].access_type=='delete')
								{
									del=true;
								}
								else if(accessible_data[x].access_type=='delete')
								{
									update=true;
								}
							}
						}
					}
					
					if(read)
					{
						var rowsHTML="";
						var id=result.id;
						rowsHTML+="<tr>";
						rowsHTML+="<form id='form102_"+id+"'></form>";
							rowsHTML+="<td data-th='Member'>";
								rowsHTML+="<textarea readonly='readonly' form='form102_"+id+"'>"+result.member+"</textarea>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Role'>";
								rowsHTML+="<textarea readonly='readonly' class='dblclick_editable' form='form102_"+id+"'>"+result.role+"</textarea>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Notes'>";
								rowsHTML+="<textarea readonly='readonly' class='dblclick_editable' form='form102_"+id+"'>"+result.notes+"</textarea>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Status'>";
								rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form102_"+id+"' value='"+result.status+"'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Action'>";
								rowsHTML+="<input type='hidden' form='form102_"+id+"' value='"+id+"'>";
							if(update)
							{
								rowsHTML+="<input type='submit' class='submit_hidden' form='form102_"+id+"' id='save_form102_"+id+"'>";
							}
							if(del)
							{
								rowsHTML+="<input type='button' class='delete_icon' form='form102_"+id+"' id='delete_form102_"+id+"' onclick='form102_delete_item($(this));'>";
							}
							if(access)
							{
								rowsHTML+="<input type='button' class='generic_icon' form='form102_"+result.id+"' value='Access' onclick=\"access_display('project_team','"+result.id+"');\">";
							}
							rowsHTML+="</td>";			
						rowsHTML+="</tr>";
					
						$('#form102_body').append(rowsHTML);
						
						var fields=document.getElementById("form102_"+id);
						var status_filter=fields.elements[3];
						set_static_value_list('projects','status',status_filter);
						
						$(fields).on("submit", function(event)
						{
							event.preventDefault();
							form102_update_item(fields);
						});
					}
				});
				
				longPressEditable($('.dblclick_editable'));
				$('textarea').autosize();
				
				hide_loader();
			});
		});
	}
}

/**
 * @form Create project phases
 * @formNo 103
 * @Loading light
 */
function form103_ini()
{
	var project_id=$("#form103_link").attr('data_id');
	if(project_id==null)
		project_id="";	
	$('#form103_body').html("");
	if(project_id!="")
	{
		show_loader();
		var project_columns="<projects>" +
				"<id>"+project_id+"</id>" +
				"<name></name>" +
				"</projects>";
		var phase_columns="<project_phases>" +
				"<id></id>" +
				"<project_id>"+project_id+"</project_id>" +
				"<phase_name></phase_name>" +
				"<details></details>" +
				"<start_date></start_date>" +
				"<due_date></due_date>" +
				"<status></status>" +
				"</project_phases>";
	
		fetch_requested_data('',project_columns,function(project_results)
		{
			for (var i in project_results)
			{
				var filter_fields=document.getElementById('form103_master');
				filter_fields.elements[1].value=project_results[i].name;
				filter_fields.elements[2].value=project_results[i].id;
				
				$(filter_fields).off('submit');
				$(filter_fields).on("submit", function(event)
				{
					event.preventDefault();
					form103_create_form();
				});
				break;
			}
		});
		/////////////////////////////////////////////////////////////////////////
		if_data_read_access('project_phases',function(accessible_data)
		{
			fetch_requested_data('',phase_columns,function(results)
			{
				results.forEach(function(result)
				{
					var read=false;
					var update=false;
					var del=false;
					var access=false;
					for(var x in accessible_data)
					{
						if(accessible_data[x].record_id===result.id || accessible_data[x].record_id=='all')
						{
							if(accessible_data[x].criteria_field=="" || accessible_data[x].criteria_field== null || result[accessible_data[x].criteria_field]==accessible_data[x].criteria_value)
							{
								if(accessible_data[x].access_type=='all')
								{
									read=true;
									update=true;
									del=true;
									access=true;
									break;
								}
								else if(accessible_data[x].access_type=='read')
								{
									read=true;
								}
								else if(accessible_data[x].access_type=='delete')
								{
									del=true;
								}
								else if(accessible_data[x].access_type=='delete')
								{
									update=true;
								}
							}
						}
					}
					
					if(read)
					{
						var rowsHTML="";
						var id=result.id;
						rowsHTML+="<tr>";
						rowsHTML+="<form id='form103_"+id+"'></form>";
							rowsHTML+="<td data-th='Phase Name'>";
								rowsHTML+="<textarea readonly='readonly' form='form103_"+id+"'>"+result.phase_name+"</textarea>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Details'>";
								rowsHTML+="<textarea readonly='readonly' class='dblclick_editable' form='form103_"+id+"'>"+result.details+"</textarea>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Start Date'>";
								rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form103_"+id+"' value='"+get_my_past_date(result.start_date)+"'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Due Date'>";
								rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form103_"+id+"' value='"+get_my_past_date(result.due_date)+"'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='status'>";
								rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form103_"+id+"' value='"+result.status+"'>";
							rowsHTML+="</td>";
							rowsHTML+="<td data-th='Action'>";
								rowsHTML+="<input type='hidden' form='form103_"+id+"' value='"+id+"'>";
							if(update)
								rowsHTML+="<input type='submit' class='submit_hidden' form='form103_"+id+"' id='save_form103_"+id+"'>";
							if(del)
								rowsHTML+="<input type='button' class='delete_icon' form='form103_"+id+"' id='delete_form103_"+id+"' onclick='form103_delete_item($(this));'>";
							if(access)
								rowsHTML+="<input type='button' class='generic_icon' form='form103_"+result.id+"' value='Access' onclick=\"access_display('project_phases','"+result.id+"');\">";
							rowsHTML+="</td>";			
						rowsHTML+="</tr>";
					
						$('#form103_body').append(rowsHTML);
						
						var fields=document.getElementById("form103_"+id);
						var start_filter=fields.elements[2];
						var due_filter=fields.elements[3];
						var status_filter=fields.elements[4];
						set_static_value_list('project_team','status',status_filter);
						
						$(start_filter).datepicker();
						$(due_filter).datepicker();
						
						$(fields).on("submit", function(event)
						{
							event.preventDefault();
							form103_update_item(fields);
						});
					}	
				});
				longPressEditable($('.dblclick_editable'));
				$('textarea').autosize();
				
				hide_loader();
			});
		});
	}
}

/**
 * @form Assign project tasks
 * @formNo 104
 * @Loading light
 */
function form104_ini()
{
	var project_id=$("#form104_link").attr('data_id');
	if(project_id==null)
		project_id="";	
	$('#form104_body').html("");
	if(project_id!="")
	{
		$('#form104_calendar').fullCalendar('destroy');
		$('#form104_calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			height:400,
			fixedWeekCount:false,
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			events: function(start, end, timezone, callback) {
		        var start_time=parseFloat(start.unix())*1000;
		        var end_time=parseFloat(end.unix())*1000;
		        var tasks_data="<task_instances>" +
		        		"<id></id>" +
		        		"<name></name>" +
		        		"<description></description>" +
		        		"<t_initiated compare='more than'>"+start_time+"</t_initiated>" +
		        		"<t_initiated compare='less than'>"+end_time+"</t_initiated>" +
		        		"<t_due></t_due>" +
		        		"<status></status>" +
		        		"<assignee></assignee>" +
		        		"<task_hours></task_hours>" +
		        		"<source exact='yes'>projects</source>" +
		        		"<source_id exact='yes'>"+project_id+"</source_id>" +
						"</task_instances>";

		        if_data_read_access('task_instances',function(accessible_data)
		        {
			        fetch_requested_data('form104',tasks_data,function(tasks)
			        {
			        	var events=[];
			        	
			        	tasks.forEach(function(task)
			        	{
							var read=false;
							var update=false;
							var del=false;
							var access=false;
							for(var x in accessible_data)
							{
								if(accessible_data[x].record_id===task.id || accessible_data[x].record_id=='all')
								{
									if(accessible_data[x].criteria_field=="" || accessible_data[x].criteria_field== null || task[accessible_data[x].criteria_field]==accessible_data[x].criteria_value)
									{
										if(accessible_data[x].access_type=='all')
										{
											read=true;
											update=true;
											del=true;
											access=true;
											break;
										}
										else if(accessible_data[x].access_type=='read')
										{
											read=true;
										}
										else if(accessible_data[x].access_type=='delete')
										{
											del=true;
										}
										else if(accessible_data[x].access_type=='delete')
										{
											update=true;
										}
									}
								}
							}
							
							if(read)
							{
			        			var color="yellow";
			        			if(task.status=='cancelled')
			        			{
			        				color="aaaaaa";
			        			}
			        			else if(task.status=='pending' && parseFloat(task.t_due)<get_my_time())
			        			{
			        				color='#ff0000';
			        			}
			        			else if(task.status=='completed')
			        			{
			        				color='#00ff00';
			        			}
				        		events.push({
				        			title: "\n"+task.name+"\nAssigned to: "+task.assignee+"\nDue time: "+get_formatted_time(task.t_due),
				        			start:get_iso_time(task.t_initiated),
				        			end:get_iso_time(parseFloat(task.t_initiated)+(parseFloat(task.task_hours)*3600000)),
				        			color: color,
				        			textColor:"#333",
				        			id: task.id,
				        			editable:update
				        		});
							}
			        	});
			        	callback(events);
			        });
		        });
		    },
		    dayClick: function(date,jsEvent,view){
		    	modal43_action(get_my_date_from_iso(date.format()),project_id);
		    },
		    eventClick: function(calEvent,jsEvent,view){
		    	modal33_action(calEvent.id);
		    },
		    eventDrop: function(event,delta,revertFunc){
		    	var t_initiated=(parseFloat(event.start.unix())*1000);
		    	var data_xml="<task_instances>" +
							"<id>"+event.id+"</id>" +
							"<t_initiated>"+t_initiated+"</t_initiated>" +
							"<last_updated>"+get_my_time()+"</last_updated>" +
							"</task_instances>";
				if(is_online())
				{
					server_update_simple(data_xml);
				}
				else
				{
					local_update_simple(data_xml);
				}
		    },
		    eventResize: function(event, delta, revertFunc){
		    	var task_hours=parseFloat((parseFloat(event.end.unix())-parseFloat(event.start.unix()))/3600);
		    	var data_xml="<task_instances>" +
							"<id>"+event.id+"</id>" +
							"<task_hours>"+task_hours+"</task_hours>" +
							"<last_updated>"+get_my_time()+"</last_updated>" +
							"</task_instances>";
				if(is_online())
				{
					server_update_simple(data_xml);
				}
				else
				{
					local_update_simple(data_xml);
				}
			}
		});
		
		var columns="<task_instances>" +
				"<id></id>" +
				"<name></name>" +
				"<description></description>" +
				"<assignee></assignee>" +
				"<t_due></t_due>" +
				"<t_initiated></t_initiated>" +
				"<task_hours></task_hours>" +
				"<status></status>" +
				"<source exact='yes'>projects</source>" +
				"<source_id exact='yes'>"+project_id+"</source_id>" +
				"<last_updated sort='desc'></last_updated>" +
				"</task_instances>";
		
		if_data_read_access('task_instances',function(accessible_data)
		{
			fetch_requested_data('form104',columns,function(results)
			{
				results.forEach(function(result)
				{
					var read=false;
					var update=false;
					var del=false;
					var access=false;
					for(var x in accessible_data)
					{
						if(accessible_data[x].record_id===result.id || accessible_data[x].record_id=='all')
						{
							if(accessible_data[x].criteria_field=="" || accessible_data[x].criteria_field== null || result[accessible_data[x].criteria_field]==accessible_data[x].criteria_value)
							{
								if(accessible_data[x].access_type=='all')
								{
									read=true;
									update=true;
									del=true;
									access=true;
									break;
								}
								else if(accessible_data[x].access_type=='read')
								{
									read=true;
								}
								else if(accessible_data[x].access_type=='delete')
								{
									del=true;
								}
								else if(accessible_data[x].access_type=='delete')
								{
									update=true;
								}
							}
						}
					}

					if(read)
					{
						result.t_due=get_my_datetime(result.t_due);
						result.t_initiated=get_my_datetime(result.t_initiated);
						var message_string="Due time: "+result.t_due+"\nTask: "+result.name+"\nAssignee:"+result.assignee;
						message_string=encodeURIComponent(message_string);
						var rowsHTML="";
						rowsHTML+="<tr>";
							rowsHTML+="<form id='form104_"+result.id+"'></form>";
								rowsHTML+="<td data-th='Task Name'>";
									rowsHTML+="<input type='text' readonly='readonly' form='form104_"+result.id+"' value='"+result.name+"'>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Assignee'>";
									rowsHTML+="<input type='text' readonly='readonly' form='form104_"+result.id+"' class='dblclick_editable' value='"+result.assignee+"'>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Start Time'>";
									rowsHTML+="<input type='text' readonly='readonly' form='form104_"+result.id+"' class='dblclick_editable' value='"+result.t_initiated+"'>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Due Time'>";
									rowsHTML+="<input type='text' readonly='readonly' form='form104_"+result.id+"' class='dblclick_editable' value='"+result.t_due+"'>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Status'>";
									rowsHTML+="<input type='text' readonly='readonly' form='form104_"+result.id+"' class='dblclick_editable' value='"+result.status+"'>";
								rowsHTML+="</td>";
								rowsHTML+="<td data-th='Action'>";
									rowsHTML+="<input type='hidden' readonly='readonly' form='form104_"+result.id+"' value='"+result.id+"'>";
								if(update)	
									rowsHTML+="<input type='submit' class='save_icon' form='form104_"+result.id+"' title='Save'>";
								if(del)
									rowsHTML+="<input type='button' class='delete_icon' form='form104_"+result.id+"' title='Delete' onclick='form104_delete_item($(this));'>";
									rowsHTML+="<a id='form104_whatsapp_"+result.id+"' href='whatsapp://send?text="+message_string+"' target='_blank'><img style='width:25px;height:25px;' src='./images/whatsapp.jpeg' form='form104_"+result.id+"' title='Send details through WhatsApp'></a>";
								if(access)
									rowsHTML+="<input type='button' class='generic_icon' form='form104_"+result.id+"' value='Access' onclick=\"access_display('task_instances','"+result.id+"');\">";
								rowsHTML+="</td>";			
						rowsHTML+="</tr>";
						
						$('#form104_body').append(rowsHTML);
						var fields=document.getElementById("form104_"+result.id);
						$(fields).on("submit", function(event)
						{
							event.preventDefault();
							form104_update_item(fields);
						});
						
						var name_filter=fields.elements[0];
						var assignee_filter=fields.elements[1];
						var start_filter=fields.elements[2];
						var due_filter=fields.elements[3];
						var status_filter=fields.elements[4];
									
						var staff_data="<staff>" +
								"<acc_name></acc_name>" +
								"</staff>";
						set_my_value_list(staff_data,assignee_filter);
						
						set_static_value_list('task_instances','status',status_filter);
						$(due_filter).datetimepicker();
						$(start_filter).datetimepicker();
					}
				});
				
				////indexing///
				longPressEditable($('.dblclick_editable'));
				hide_loader();
			});
		});
	}
}

/**
 * @form Manage Data Access
 * @formNo 105
 * @Loading light
 */
function form105_ini()
{
	show_loader();
	var fid=$("#form105_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var master_fields=document.getElementById('form105_master');
	var ftablename=master_fields.elements[1].value;
	var frecord=master_fields.elements[2].value;

	var columns="<data_access>" +
			"<id>"+fid+"</id>" +
			"<tablename exact='yes'>"+ftablename+"</tablename>" +
			"<record_id exact='yes'>"+frecord+"</record_id>" +
			"<access_type></access_type>" +
			"<user></user>" +
			"<criteria_field></criteria_field>" +
			"<criteria_value></criteria_value>" +
			"<last_updated sort='desc'></last_updated>" +
			"</data_access>";

	$('#form105_body').html("");

	fetch_requested_data('',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form105_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Access Type'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form105_"+result.id+"' value='"+result.access_type+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='User'>";
						rowsHTML+="<textarea readonly='readonly' form='form105_"+result.id+"'>"+result.user+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Criteria Field'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form105_"+result.id+"' value='"+result.criteria_field+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Criteria Value'>";
						rowsHTML+="<textarea readonly='readonly' form='form105_"+result.id+"'>"+result.criteria_value+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form105_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form105_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form105_"+result.id+"' title='Delete' onclick='form105_delete_item($(this));'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form105_body').append(rowsHTML);
			var fields=document.getElementById("form105_"+result.id);
						
			$(fields).on("submit",function(event)
			{
				event.preventDefault();
			});
		});

		$('textarea').autosize();
		hide_loader();
	});
};


/**
 * @form Manage Sale orders (multi-register)
 * @formNo 108
 * @Loading light
 */
function form108_ini()
{
	show_loader();
	var fid=$("#form108_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form108_header');
	
	//populating form 
	if(fid==="")
		fid=filter_fields.elements[0].value;
	var fname=filter_fields.elements[1].value;
	var fstatus=filter_fields.elements[2].value;
	
	////indexing///
	var index_element=document.getElementById('form108_index');
	var prev_element=document.getElementById('form108_prev');
	var next_element=document.getElementById('form108_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<sale_orders count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<customer_name>"+fname+"</customer_name>" +
			"<order_date></order_date>" +
			"<type>product</type>" +
			"<status>"+fstatus+"</status>" +
			"<last_updated sort='desc'></last_updated>" +
			"</sale_orders>";

	$('#form108_body').html("");

	fetch_requested_data('form108',columns,function(results)
	{	
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form108_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Order No.'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form108_"+result.id+"' value='"+result.id+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Customer'>";
						rowsHTML+="<textarea readonly='readonly' form='form108_"+result.id+"'>"+result.customer_name+"</textarea>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Order Date'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form108_"+result.id+"' value='"+get_my_past_date(result.order_date)+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Status'>";
						rowsHTML+="<input type='text' readonly='readonly' class='dblclick_editable' form='form108_"+result.id+"' value='"+result.status+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='button' class='edit_icon' form='form108_"+result.id+"' title='Edit order' onclick=\"element_display('"+result.id+"','form69');\">";
						rowsHTML+="<input type='submit' class='save_icon' form='form108_"+result.id+"' title='Save order'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form108_"+result.id+"' title='Delete order' onclick='form108_delete_item($(this));'>";
						rowsHTML+="<br><input type='button' class='generic_icon' form='form108_"+result.id+"'>";
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form108_body').append(rowsHTML);
			var fields=document.getElementById("form108_"+result.id);
			var bill_button=fields.elements[7];
			var status_filter=fields.elements[3];
			
			set_static_value_list('sale_orders','status',status_filter);
			
			if(result.status=='pending')
			{
				$(bill_button).attr('value','Create Bill');
				$(bill_button).on('click',function(event)
				{
					modal42_action(result.id);
				});
			}
			else
			{
				$(bill_button).hide();
			}
			
			$(fields).on("submit",function(event)
			{
				event.preventDefault();
				form108_update_item(fields);
			});
			
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		$('textarea').autosize();
		
		var export_button=filter_fields.elements[4];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'sale_orders');
		});
		hide_loader();
	});
};

/**
 * @form Asset Attributes
 * @formNo 109
 * @Loading light
 */
function form109_ini()
{
	show_loader();
	var fid=$("#form109_link").attr('data_id');
	if(fid==null)
		fid="";	
	
	var filter_fields=document.getElementById('form109_header');
	
	var fasset=filter_fields.elements[0].value;
	var fattribute=filter_fields.elements[1].value;
	
	////indexing///
	var index_element=document.getElementById('form109_index');
	var prev_element=document.getElementById('form109_prev');
	var next_element=document.getElementById('form109_next');
	var start_index=index_element.getAttribute('data-index');
	//////////////

	var columns="<attributes count='25' start_index='"+start_index+"'>" +
			"<id>"+fid+"</id>" +
			"<name>"+fasset+"</name>" +
			"<type exact='yes'>asset</type>" +
			"<attribute>"+fattribute+"</attribute>" +
			"<value></value>" +
			"<last_updated sort='desc'></last_updated>" +
			"</attributes>";

	$('#form109_body').html("");

	fetch_requested_data('form109',columns,function(results)
	{
		results.forEach(function(result)
		{
			var rowsHTML="";
			rowsHTML+="<tr>";
				rowsHTML+="<form id='form109_"+result.id+"'></form>";
					rowsHTML+="<td data-th='Name'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form109_"+result.id+"' value='"+result.name+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Attribute'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form109_"+result.id+"' value='"+result.attribute+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Value'>";
						rowsHTML+="<input type='text' readonly='readonly' form='form109_"+result.id+"' value='"+result.value+"'>";
					rowsHTML+="</td>";
					rowsHTML+="<td data-th='Action'>";
						rowsHTML+="<input type='hidden' form='form109_"+result.id+"' value='"+result.id+"'>";
						rowsHTML+="<input type='submit' class='save_icon' form='form109_"+result.id+"' title='Save'>";
						rowsHTML+="<input type='button' class='delete_icon' form='form109_"+result.id+"' title='Delete' onclick='form109_delete_item($(this));'>";	
					rowsHTML+="</td>";			
			rowsHTML+="</tr>";
			
			$('#form109_body').append(rowsHTML);
			var fields=document.getElementById("form109_"+result.id);
			$(fields).on("submit", function(event)
			{
				event.preventDefault();
				form109_update_item(fields);
			});
		});

		////indexing///
		var next_index=parseInt(start_index)+25;
		var prev_index=parseInt(start_index)-25;
		next_element.setAttribute('data-index',next_index);
		prev_element.setAttribute('data-index',prev_index);
		index_element.setAttribute('data-index','0');
		if(results.length<25)
		{
			$(next_element).hide();
		}
		else
		{
			$(next_element).show();
		}
		if(prev_index<0)
		{
			$(prev_element).hide();
		}
		else
		{
			$(prev_element).show();
		}
		/////////////

		longPressEditable($('.dblclick_editable'));
		
		var export_button=filter_fields.elements[3];
		$(export_button).off("click");
		$(export_button).on("click", function(event)
		{
			my_obj_array_to_csv(results,'product_attributes');
		});
		hide_loader();
	});
};
