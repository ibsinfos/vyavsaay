/**
 * @returns {Array}
 */
function get_single_column_data(callback,request_data)
{	
	var results=new Array();

	if(is_online())
	{
		server_read_single_column(request_data,callback,results);
	}
	else
	{
		local_read_single_column(request_data,callback,results);
	}
}

/**
 * 
 * @param columns
 * @param callback
 */
function fetch_requested_data(element_id,columns,callback)
{
	if(is_read_access(element_id))
	{
		var results=new Array();
		if(is_online())
		{
			server_read_multiple_column(columns,callback,results);
		}
		else
		{
			local_read_multi_column(columns,callback,results);
		}
	}
	else
	{
		$("#modal_access_denied").dialog("open");
	}
}

/**
 * this function resizes and sets the preview of the picture
 * @form Manage Products
 * @formNo 39
 * @param evt Event that is called when image is selected
 * @param pictureinfo the html element to display the preview of the image
 */
function select_picture(evt,pictureinfo,func)
{
	var file=evt.target.files[0];
	if(file.type.match('image.*'))
	{	
		var reader = new FileReader();
						
		reader.onloadend=function()
		{
		    var tempImg = new Image();
		    tempImg.src = reader.result;
		    tempImg.onload = function()
		    {
		        var MAX_WIDTH = 200;
		        var MAX_HEIGHT = 150;
		        var tempW = tempImg.width;
		        var tempH = tempImg.height;
		        if (tempW > tempH) {
		            if (tempW > MAX_WIDTH) {
		               tempH *= MAX_WIDTH / tempW;
		               tempW = MAX_WIDTH;
		            }
		        } else {
		            if (tempH > MAX_HEIGHT) {
		               tempW *= MAX_HEIGHT / tempH;
		               tempH = MAX_HEIGHT;
		            }
		        }
		 
		        var canvas = document.createElement('canvas');
		        canvas.width = tempW;
		        canvas.height = tempH;
		        var ctx = canvas.getContext("2d");
		        ctx.drawImage(this, 0, 0, tempW, tempH);
		        var dataURL = canvas.toDataURL("image/jpeg");
		        func(dataURL);
		    };
		 
		};
		reader.readAsDataURL(file);
	}
}

function get_new_key()
{
	var d=new Date();
	var seconds=d.getTime();
	seconds=""+seconds;
	return seconds;
}


function count_oppor()
{
	var oppor_data="<opportunities>" +
			"<id></id>" +
			"<status>pending</status>" +
			"</opportunities>";

	get_single_column_data(function(oppors)
	{
		var num_res=oppors.length;
	
		if(num_res===0)
		{	
			$('#count_oppor').html("");
		}
		else
		{	
			$('#count_oppor').html(num_res);
			$('#count_oppor').css('backgroundColor','#dddd00'); 
		}
	},oppor_data);
	setTimeout(count_oppor,100000);
}

function count_notif()
{
	//var notifs=fetch_notifications();	
	var notif_data="<notifications>" +
			"<id></id>" +
			"<status>pending</status>" +
			"</notifications>";

	get_single_column_data(function(notifs)
	{
		var num_res=notifs.length;
		
		if(num_res===0)
		{	
			$('#count_notif').html(""); 
		}
		else
		{	
			$('#count_notif').html(num_res);
			$('#count_notif').css('backgroundColor','#dddd00'); 
		}
	},notif_data);
	setTimeout(count_notif,100000);
}


function set_my_filter(filter_data,filter_element)
{
	get_single_column_data(function(data)
	{
		data=jQuery.unique(data);
		$(filter_element).autocomplete({
			source:data
		});
	},filter_data);		
}

function set_static_filter(table,list,filter_element)
{
	var list_data="<values_list>" +
			"<name></name>" +
			"<tablename>"+table+"</tablename>" +
			"<listname>"+list+"</listname>" +
			"<status>active</status>" +
			"</values_list>";
	get_single_column_data(function(data)
	{
		data=jQuery.unique(data);
		$(filter_element).autocomplete({
			source:data
		});
	},list_data);		
}

function set_my_value_list(filter_data,filter_element)
{	
	get_single_column_data(function(data)
	{
		//$(filter_element).data().uiAutocomplete.term = null;
/*		var newobj=filter_element;
		var selectParentNode = newobj.parentNode;
		var newSelectObj = newobj.cloneNode(false); // Make a shallow copy
		selectParentNode.replaceChild(newSelectObj, newobj);		
		filter_element=newSelectObj;
*/		
//		$(filter_element).find('option').remove();
		data=jQuery.unique(data);
		$(filter_element).quickselect({
			data:data,
			autoSelectFirst:true,
			matchContains:true,
			match:'quicksilver'
		});
		//console.log(filter_element);
		$(filter_element).bind("change",function(event)
		{
			var found = $.inArray($(this).val(), data) > -1;
			if(!found)
			{
	            $(this).val('');
	        }
		});
	},filter_data);
}

function set_my_multiple_filter(filter_data,filter_element,output_element)
{	
	get_single_column_data(function(data)
	{
		data=jQuery.unique(data);

		$(filter_element).autocomplete({
			source:data
		});
	},filter_data);
	$(filter_element).on('select',function(event)
	{
		var value=output_element.value;
		var found=value.search(filter_element.value);
		if(found===-1)
		{
			value+=filter_element.value+",";
			output_element.value=value;
		}	
	});
	$(filter_element).on('blur',function(event)
	{
		var value=output_element.value;
		var found=value.search(filter_element.value);
		if(found===-1)
		{
			value+=filter_element.value+",";
			output_element.value=value;
		}	
	});
}

function set_my_multiple_list(filter_data,filter_element,output_element)
{	
	get_single_column_data(function(data)
	{
		data=jQuery.unique(data);
		$(filter_element).quickselect({
			data:data,
			autoSelectFirst:true,
			matchContains:true,
			match:'quicksilver'
		});
		$(filter_element).bind("change",function(event)
		{
			var found = $.inArray($(this).val(), data) > -1;
			if(!found)
			{
	            $(this).val('');
	        }
		});
	},filter_data);
	$(filter_element).on('select',function(event)
	{
		var value=output_element.value;
		var found=value.search(filter_element.value);
		if(found===-1)
		{
			value+=filter_element.value+",";
			output_element.value=value;
		}	
	});
}

function set_my_value(filter_data,filter_element)
{
	get_single_column_data(function(data)
	{
		filter_element.value=data[0];
	},filter_data);
}

function set_my_max_value(filter_data,filter_element)
{
	get_single_column_data(function(data)
	{
		$(filter_element).attr('max',data[0]);
		$(filter_element).attr('min',"0");
	},filter_data);
}

function set_static_value_list(table,list,filter_element)
{
	var list_data="<values_list>" +
			"<name></name>" +
			"<tablename>"+table+"</tablename>" +
			"<listname>"+list+"</listname>" +
			"<status>active</status>" +
			"</values_list>";
	get_single_column_data(function(data)
	{
		data=jQuery.unique(data);
		$(filter_element).quickselect({
			data:data,
			autoSelectFirst:true,
			matchContains:true,
			match:'quicksilver'
		});
		$(filter_element).bind("change",function(event)
		{
			var found = $.inArray($(this).val(), data) > -1;
			if(!found)
			{
	            $(this).val('');
	        }
		});
	},list_data);

}


function get_key_from_object(tablename,column,value)
{
}

function get_object_from_key(tablename,column,key)
{
}