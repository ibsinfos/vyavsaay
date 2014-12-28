/**
 * handles default page redirection for active session
 */
function default_load()
{
	var location=window.location.pathname;
	if(((location.indexOf("index")>-1) || (location.indexOf(".php")==-1)) && is_set_session())
	{
		window.location.assign("main.php");
	}
	else if(!is_set_session() && (location.indexOf("main")>-1))
	{
		window.location.assign("index.php");
	}
	
	localdb_open_requests=0;
	number_active_ajax=0;
	loaderTimer=0;
	count_notif_timer=0;
	show_notif_timer=0;
	progress_value=0;
	
	if(is_set_session())
	{
		set_menu_shortcuts();
		//setup_elements_display();
		setup_grid_display();
		date_formating();
		modal_forms_ini();
		print_setup();
		Chart.defaults.global.responsive = true;
		Chart.defaults.global.scaleFontSize= 10;
		Chart.defaults.global.scaleFontColor="#000";
		Chart.defaults.global.maintainAspectRatio=false;
		$('textarea').autosize();
		i18n_setup();
		home_display();
		start_workers();
	}
	hide_loader();
}

function show_progress()
{
	$("#progress_ind").show();
	$("#progress_bar").val(progress_value);
    $('#progress_value').html(parseInt(progress_value) + '%');
    progress_runner=setTimeout(show_progress,500);
}

function hide_progress()
{
	clearInterval(progress_runner);
	$("#progress_ind").hide();
	$("#progress_bar").val(0);
    $('#progress_value').html('0 %');
    progress_value=0;
}


function start_workers()
{
	setTimeout(function()
	{
		set_grid_item_1();
		set_grid_item_2();
		set_grid_item_3();
		set_grid_item_4();
		set_grid_item_5();
		set_grid_item_6();
		set_grid_item_7();
//		set_grid_item_8();
		set_grid_item_9();
		set_grid_item_11();
		set_grid_item_12();
		set_grid_item_13();
		set_grid_item_14();
		set_grid_item_15();
		set_grid_item_16();
		set_grid_item_17();
		set_grid_item_18();
		set_grid_item_19();
		set_grid_item_20();
		set_grid_item_22();
		set_grid_item_23();
		set_grid_item_24();
		set_grid_item_25();
		set_grid_item_26();
	},2000);
	setTimeout(function()
	{
		activities_lane_ini();
	},10000);
	setTimeout(function()
	{
		notifications_add();
	},20000);
	setTimeout(function()
	{
		sale_leads_add();
	},25000);
	setTimeout(function()
	{
		generate_attendance_records();
	},30000);
	setTimeout(function()
	{
		manufactured_products_outofstock();
	},40000);
	setTimeout(function()
	{
		loans_interest_processing();
	},50000);
	setTimeout(function()
	{
		loans_instalment_processing();
	},60000);
	setTimeout(function()
	{
		show_notif();
	},70000);
			
}

function show_function(function_id)
{
	hide_all();
	$(function_id).show();
}

function modal_forms_ini()
{
	for(var i=1;i<8;i++)
	{
		var dialog=$("#modal"+i).dialog({
	   		autoOpen: false,
	   		modal: true,
	   		width: 300,
	   		show: "slide",
	   		closeOnEscape: true,
	       	buttons:{ OK:function(){$(this).dialog("close");}}
		});
		dialog.find("form").on("submit", function(event)
		{
			event.preventDefault();
			$(this).parent().dialog("close");
		});
	}
	for(var i=8;i<43;i++)
	{
		var j=i;
		$("#modal"+i).dialog({
	   		autoOpen: false,
	   		width: 300,
	   		modal: true,
	   		show: "slide",
	   		closeOnEscape: true,
	   		close:function(event,ui)
	   		{
	   			var form_id="modal"+j+"_form";
	   			document.getElementById(form_id).reset();
	   		}
		});
	}
	for(var i=50;i<53;i++)
	{
		var dialog=$("#modal"+i).dialog({
	   		autoOpen: false,
	   		modal: true,
	   		width: 300,
	   		show: "slide",
	   		closeOnEscape: true,
	       	buttons:{ OK:function(){$(this).dialog("close");}}
		});
		dialog.find("form").on("submit", function(event)
		{
			event.preventDefault();
			$(this).parent().dialog("close");
		});
	}
}

function print_setup()
{
//	print_template_setup('sale_bill');
	print_css_setup('sale_bill');
	print_css_setup('purchase_order');
	print_css_setup('payment_receipt');
	print_css_setup('credit_note');
	print_css_setup('pamphlet');
	print_css_setup('service_bill');
	print_css_setup('product_bill');
	print_css_setup('return_receipt');
	print_css_setup('supplier_return');
}

function print_css_setup(name)
{
	var template_name=get_session_var(name);
	var link = document.createElement('link');
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", "./templates/"+name+"/"+template_name+".css");
	document.head.appendChild(link);
}

function home_display()
{
	count_notif();
	hide_all();
	$('#home_grid').show();
}

function set_menu_username()
{
	var name=get_session_var('name');
	var hello=i18n.t("general.hello");
	$('#menu_username').html(hello+" "+name);
}

function setup_grid_display()
{
	var functions_array=['sale_bills','purchase','finances','products','services','inventory','customers','suppliers','staff','store','ecommerce','offers','maps','sale_reports'];
	functions_array.forEach(function(func)
	{
		var function_main=$("#"+func+"_main").find('ul').find('li').length;
		if(function_main===0)
		{
			$("#"+func+"_link").parent().hide();
		}
	});
}

function grid_click(func)
{
	show_function("#"+func+"_main");
	$("#"+func+"_main").find('ul').find('li').find('a').first().click();
}

function i18n_setup()
{
	var language=get_session_var('locale');
	var lan=language.substring(0,2);
	i18n.init({
		lng:lan,
		debug: true,
	    fallbackLng: false,
	    load:'unspecific',
	    resGetPath: "locales/__ns__-__lng__.json",
	    ns: {
	        namespaces: ['translation'],
	        defaultNs: 'translation'
	    }
	},function(t)
	{
		$('title').i18n();
		$("#content_box").find('div').i18n();
		$("#content_box").find('a').i18n();
		$(".side_lane").find('div').i18n();
		set_menu_username();
	});
}

function hide_menu_items()
{
	//console.log("hiding menu items");
	var offline=get_session_var('offline');
	if(offline=="online")
	{
		$('#offline_icon').hide();
		$('#sync_icon').hide();
		$('#online_icon').show();
	}
	else
	{
		$('#online_icon').hide();
		$('#offline_icon').show();
		$('#sync_icon').show();
	}
}

/**
 * this function hides all the elements on the main page
 */
function hide_all()
{
	$("#settings_main").hide();
	$("#r_preferences").hide();
	$("#search_results_box").hide();
	$("#all_activities_box").hide();
	$("#notifications_box").hide();
	
	//hide all functions
	$("#sale_bills_main").hide();
	$("#products_main").hide();
	$("#purchase_main").hide();
	$("#services_main").hide();
	$("#inventory_main").hide();
	$("#finances_main").hide();
	$("#ecommerce_main").hide();
	$("#customers_main").hide();
	$("#suppliers_main").hide();
	$("#staff_main").hide();
	$("#store_main").hide();
	$("#offers_main").hide();
	$("#sale_reports_main").hide();
	$("#maps_main").hide();
	hide_menu_items();
	
	$("#home_grid").hide();
	hide_loader();
}

/**
 * This function displays the laoder icon on the screen
 */
function show_loader()
{
		$("#loading_icon").show();
		$("#transparent_layer").show();
}

/**
 * This function hides the loader icon
 */
function hide_loader()
{
	$("#loading_icon").hide();
	$("#transparent_layer").hide();
}


function load_tooltips()
{
	$(".icon").tooltip();
}

/**
 * this function displays the fetched results in the search_results_box
 */
function show_search_results() 
{
	hide_all();
	$("#search_results_box").show();
	search_ini();
}

function show_all_activities() 
{
	hide_all();
	$("#all_activities_box").show();
	activities_ini();
}

function element_display(fid,element_name)
{
	var element_link="#"+element_name+"_link";
	var function_link=$(element_link).parent().parent().parent().attr('id');
	show_function("#"+function_link);
	$(element_link).attr('data_id',fid);
	$(element_link).click();
	$(element_link).attr('data_id','');
}

function set_menu_shortcuts()
{
	var shortcuts_data="<user_preferences>" +
			"<id></id>" +
			"<name></name>" +
			"<shortcut></shortcut>" +
			"<value exact='yes'>checked</value>" +
			"<type array='yes'>--form--report--</type>" +
			"</user_preferences>";

	fetch_requested_data('',shortcuts_data,function(results)
	{
		results.forEach(function(result)
		{
			if(result.shortcut!="" && result.shortcut!="undefined")
			{	
				Mousetrap.bind(result.shortcut,function(e)
				{
			    	element_display('',result.name);
				});
			}
		});
	});
}


/**
 * this function displays the notifications in the main content box
 */
function show_notifications()
{
	hide_all();
	$("#notifications_box").show();
	notifications_ini();
}


/**
 * this function shows the settigns screen
 */
function show_settings()
{	
	hide_all();
	$("#settings_main").show();
	$("#settings_main").find('ul').find('li').find('a').first().click();
}

function longPressEditable(element)
{
	$(element).each(function()
	{
		var pressTimer;
		$(this).on('touchend',function()
		{
			clearTimeout(pressTimer);
		}).on('touchstart',function()
		{
			var input_box=this;
			pressTimer = window.setTimeout(function()
			{
				$(input_box).removeAttr('readonly');
				$(input_box).focus();
			},500); 
		});
		
		$(this).dblclick(function()
		{
			$(this).removeAttr('readonly');
		});
	});
}

/**
 * set the text value to be editable
 * @param element
 */
function set_editable(element)
{
	$(element).removeAttr('readonly');
}

/**
 * set the text value to be non-editable
 * @param element
 */
function set_non_editable(element)
{
	$(element).attr('readonly','readonly');
}

/**
 * show filter as a text-box below the heading
 * @param element
 */
function show_filter(element)
{
	$(element).parent().find('.filter').css('visibility','visible');
	$(element).parent().find('.filter').css('opacity','1');
	$(element).parent().find('.filter').css('background-color','#ffffff');
	$(element).parent().find('.filter').css('color','#545453');
	$(element).parent().find('.filter').focus();
}

function date_formating()
{
	$.datepicker.setDefaults({
		dateFormat:"dd/mm/yy"
	});
}

function import_data(form_name)
{
	switch(form_name)
	{
		case 'form1':modal23_action(form1_import_template,form1_import);
		break;
		case 'form2':modal23_action(form2_import_template,form2_import);
		break;
		case 'form5':modal23_action(form5_import_template,form5_import);
		break;
		case 'form7':modal23_action(form7_import_template,form7_import);
		break;
		case 'form8':modal23_action(form8_import_template,form8_import);
		break;
		case 'form10':modal23_action(form10_import_template,form10_import);
		break;
		case 'form11':modal23_action(form11_import_template,form11_import);
		break;
		case 'form12':modal23_action(form12_import_template,form12_import);
		break;
		case 'form14':modal23_action(form14_import_template,form14_import);
		break;
		case 'form15':modal23_action(form15_import_template,form15_import);
		break;
		case 'form16':modal23_action(form16_import_template,form16_import);
		break;
		case 'form17':modal23_action(form17_import_template,form17_import);
		break;
		case 'form19':modal23_action(form19_import_template,form19_import);
		break;
		case 'form21':modal23_action(form21_import_template,form21_import);
		break;
		case 'form24':modal23_action(form24_import_template,form24_import);
		break;
		case 'form30':modal23_action(form30_import_template,form30_import);
		break;
		case 'form35':modal23_action(form35_import_template,form35_import);
		break;
		case 'form38':modal23_action(form38_import_template,form38_import);
		break;
		case 'form39':modal23_action(form39_import_template,form39_import);
		break;
		case 'form40':modal23_action(form40_import_template,form40_import);
		break;
		case 'form41':modal23_action(form41_import_template,form41_import);
		break;
		case 'form42':modal23_action(form42_import_template,form42_import);
		break;
		case 'form43':modal23_action(form43_import_template,form43_import);
		break;
		case 'form44':modal23_action(form44_import_template,form44_import);
		break;
		case 'form46':modal23_action(form46_import_template,form46_import);
		break;
		case 'form47':modal23_action(form47_import_template,form47_import);
		break;
		case 'form48':modal23_action(form48_import_template,form48_import);
		break;
		case 'form49':modal23_action(form49_import_template,form49_import);
		break;
		case 'form50':modal23_action(form50_import_template,form50_import);
		break;
		case 'form51':modal23_action(form51_import_template,form51_import);
		break;
		case 'form53':modal23_action(form53_import_template,form53_import);
		break;
		case 'form54':modal23_action(form54_import_template,form54_import);
		break;
		case 'form56':modal23_action(form56_import_template,form56_import);
		break;
		case 'form57':modal23_action(form57_import_template,form57_import);
		break;
		case 'form58':modal23_action(form58_import_template,form58_import);
		break;
		case 'form59':modal23_action(form59_import_template,form59_import);
		break;
		case 'form60':modal23_action(form60_import_template,form60_import);
		break;
		case 'form61':modal23_action(form61_import_template,form61_import);
		break;
		case 'form62':modal23_action(form62_import_template,form62_import);
		break;
		case 'form63':modal23_action(form63_import_template,form63_import);
		break;
		case 'form64':modal23_action(form64_import_template,form64_import);
		break;
		case 'form66':modal23_action(form66_import_template,form66_import);
		break;
		case 'form69':modal23_action(form69_import_template,form69_import);
		break;
		case 'form70':modal23_action(form70_import_template,form70_import);
		break;
		case 'form71':modal23_action(form71_import_template,form71_import);
		break;
		case 'form72':modal23_action(form72_import_template,form72_import);
		break;
		case 'form74':modal23_action(form74_import_template,form74_import);
		break;
		case 'form75':modal23_action(form75_import_template,form75_import);
		break;
		case 'form76':modal23_action(form76_import_template,form76_import);
		break;
		case 'form77':modal23_action(form77_import_template,form77_import);
		break;
		case 'form78':modal23_action(form78_import_template,form78_import);
		break;
		case 'form79':modal23_action(form79_import_template,form79_import);
		break;
		case 'form80':modal23_action(form80_import_template,form80_import);
		break;
		case 'form81':modal23_action(form81_import_template,form81_import);
		break;
		case 'form82':modal23_action(form82_import_template,form82_import);
		break;
		case 'form83':modal23_action(form83_import_template,form83_import);
		break;
		case 'form84':modal23_action(form84_import_template,form84_import);
		break;
		case 'form85':modal23_action(form85_import_template,form85_import);
		break;
		case 'form86':modal23_action(form86_import_template,form86_import);
		break;
		case 'form87':modal23_action(form87_import_template,form87_import);
		break;
		case 'form88':modal23_action(form88_import_template,form88_import);
		break;
		case 'form89':modal23_action(form89_import_template,form89_import);
		break;
		case 'form90':modal23_action(form90_import_template,form90_import);
		break;
		case 'form91':modal23_action(form91_import_template,form91_import);
		break;
		case 'form92':modal23_action(form92_import_template,form92_import);
		break;
		case 'form93':modal23_action(form93_import_template,form93_import);
		break;
		case 'form94':modal23_action(form94_import_template,form94_import);
		break;
		case 'form96':modal23_action(form96_import_template,form96_import);
		break;
		case 'form97':modal23_action(form97_import_template,form97_import);
		break;
		case 'form98':modal23_action(form98_import_template,form98_import);
		break;
	}
}

