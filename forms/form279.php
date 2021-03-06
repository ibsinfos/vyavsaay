<div id='form279' class='tab-pane portlet box green-meadow'>
	<div class="portlet-title">
		<div class='caption'>
            <div class='btn-group' id='form279_status' data-toggle='buttons' data-value='pending'>
                <label class='btn green-jungle pending active' onclick=form279_ini('pending');><input name='pending' type='radio' class='toggle'>Pending</label>
				<label class='btn green-jungle suspended' onclick=form279_ini('suspended');><input name='suspended' type='radio' class='toggle'>Suspended</label>
                <label class='btn green-jungle completed' onclick=form279_ini('completed');><input type='radio' name='completed' class='toggle'>Completed</label>
            </div>
			<a class='btn btn-circle grey btn-outline btn-sm' onclick='form279_list_popup();'>Add List <i class='fa fa-plus'></i></a>
		</div>
		<div class="actions">
            <div class="btn-group">
                <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">Tools <i class="fa fa-angle-down"></i></button>
                <ul class="dropdown-menu pull-right">
                    <li>
                        <a id='form279_csv'><i class='fa fa-file-excel-o'></i> Save as CSV</a>
                    </li>
                    <li>
                      	<a id='form279_pdf'><i class='fa fa-file-pdf-o'></i> Save as PDF</a>
                    </li>
                    <li>
                        <a id='form279_print'><i class='fa fa-print'></i> Print</a>
                    </li>
                    <li class="divider"> </li>
                    <li>
                        <a id='form279_upload' onclick=modal23_action(form279_import_template,form279_import,form279_import_validate);><i class='fa fa-upload'></i> Import</a>
                    </li>
                </ul>
            </div>
        </div>
	</div>

	<div class="portlet-body">
	   <form id='form279_header' autocomplete="off">
			<fieldset>
				<label><input type='text' placeholder="List" class='floatlabel' name='list'></label>
				<label><input type='text' placeholder="Task" class='floatlabel' name='task'></label>
				<label><input type='text' placeholder="Assignee" class='floatlabel' name='staff'></label>
				<label><input type='submit' class='submit_hidden'></label>
			</fieldset>
		</form>
		<br>

        <div id='form279_body' class='row'>
        </div>
    </div>

	<script>

		function form279_header_ini()
		{
			var form=document.getElementById('form279_header');
			var list_filter=form.elements['list'];
			var task_filter=form.elements['task'];

			var assignee_filter=form.elements['staff'];
			$(form).off('submit');
			$(form).on('submit',function(event)
			{
				event.preventDefault();
				form279_ini();
			});

	      var list_data={data_store:'task_instances',return_column:'source_name'};
	      set_my_filter_json(list_data,list_filter);

	      var task_data={data_store:'task_instances',return_column:'name'};
	      set_my_filter_json(task_data,task_filter);

	      var assignee_data={data_store:'task_instances',return_column:'assignee'};
	      set_my_filter_json(assignee_data,assignee_filter);
	  	}

		function form279_ini(task_types)
		{
			var fid=$("#form279_link").attr('data_id');
			if(fid==null)
				fid="";

		      var status_filter='pending';
		      if(typeof task_types!='undefined' && task_types=='completed')
		      {
		          status_filter='completed';
				  $('#form279_status').data('value','completed');
				  $('#form279_status').find('label.completed').addClass('active');
		          $('#form279_status').find('label.pending').removeClass('active');
		      }
		      else if(task_types=='suspended')
		      {
				  status_filter='suspended';
				  $('#form279_status').data('value','suspended');
		          $('#form279_status').find('label.suspended').addClass('active');
		          $('#form279_status').find('label.suspended').removeClass('active');
		      }
			  else
		      {
				  $('#form279_status').data('value','pending');
		          $('#form279_status').find('label.pending').addClass('active');
		          $('#form279_status').find('label.completed').removeClass('active');
		      }

			var form=document.getElementById('form279_header');
			var list_filter=form.elements['list'].value;
			var task_filter=form.elements['task'].value;
			var staff_filter=form.elements['staff'].value;

			show_loader();
			$('#form279_body').html('');

			var paginator=$('#form279_body').paginator({func:"form279_ini($('#form279_status').data('value'))"});

			var list_columns = {count:paginator.page_size(),
						start_index:paginator.get_index(),
						data_store:'task_lists',
						indexes:[{index:'id'},
								{index:'name',value:list_filter},
								{index:'color'},
								{index:'sort_order'},
                                {index:'source',exact:'to_do'}]};
			read_json_rows('form279',list_columns,function(lists)
			{
				// console.log(lists);
 				var list_ids = vUtil.arrayColumn(lists,'id');
				var columns={data_store:'task_instances',
							indexes:[{index:'id',value:fid},
									{index:'name',value:task_filter},
									{index:'description'},
									{index:'source_id',array:list_ids},
									{index:'status',exact:status_filter},
	                                {index:'assignee',value:staff_filter}]};
				read_json_rows('form279',columns,function(results)
				{
					// console.log(results);
					var lists_array = vUtil.arrayColumn(results,'source_id');
					for(var i=0;i<lists.length;i++){
						if(lists_array.indexOf(lists[i].id)==-1){
							lists.splice(i,1);
							i--;
						}
					}
					lists.forEach(function(list_item)
	                {
	                    var list_item_clean=list_item.name.replace(/ /g,"");
	                    var list_html="<div class='col-sm-4' style='padding-bottom:10px;'>"+
	                                "<div class='mt-element-list'>"+
	                                    "<div class='mt-list-head list-todo "+list_item.color+"'>"+
	                                        "<div class='list-head-title-container'>"+
	                                            "<a class='list-toggle-container' data-toggle='collapse' href='#form279_lists_heading_"+list_item_clean+"' aria-expanded='false'>"+
	                                                "<h3 class='list-title uppercase'>"+list_item.name+"</h3>"+
	                                            "</a>"+
	                                        "</div>"+
	                                        "<a title='Edit' onclick=\"form279_list_popup('"+list_item.id+"');\"><div class='list-count pull-right yellow-crusta' style='padding:16px;'><i class='fa fa-edit'></i></div></a>"+
											"<a title='Add Task' onclick=\"form279_add_task_popup('"+list_item.id+"','"+list_item.name+"');\"><div class='list-count pull-right yellow-crusta' style='padding:16px;'><i class='fa fa-plus'></i></div></a>"+
	                                    "</div>"+
	                                    "<div class='task-list panel-collapse collapse in' id='form279_lists_heading_"+list_item_clean+"' area-expanded='false'>"+
	                                        "<ul id='form279_lists_"+list_item_clean+"' class='v_task_list'></ul>"+
	                                    "</div>"+
	                                "</div>"+
	                            "</div>"+
	                        "</div>";

	                    $('#form279_body').append(list_html);
	                });

					results.forEach(function(result)
					{
	                    var list_item_clean=result.source_name.replace(/ /g,"");
						var rowsHTML="<li class='task-list-item done'>"+
	                                    "<div class='task-status'>";
	                        if(result.status=='pending')
	                        {
	                            rowsHTML+="<a class='done' onclick=form279_close_item('"+result.id+"',this); title='Close'>"+
	                                        "<i class='fa fa-check'></i>"+
	                                    "</a>"+
										"<a class='suspend' onclick=form279_suspend_item('"+result.id+"',this); title='Suspend'>"+
	                                        "<i class='fa fa-clock-o'></i>"+
	                                    "</a>";
	                        }
							else
							{
								rowsHTML+="<a class='done' onclick=form279_reopen_item('"+result.id+"',this); title='Re-open'>"+
	                                        "<i class='fa fa-reply'></i>"+
	                                    "</a>";
							}
	                        rowsHTML+="<a class='pending' title='Delete' onclick=form279_delete_item('"+result.id+"',this);>"+
	                            "<i class='fa fa-close link'></i>"+
	                                    "</a>"+
	                                    "</div>"+
	                                    "<div class='task-content'>"+
	                                        "<h4 class='uppercase bold'>"+
	                                            "<a onclick=\"modal202_action('"+result.id+"');\">"+result.name+"</a>"+
	                                        "</h4>"+
	                                        "<p>"+result.assignee+"</p>"+
	                                    "</div>"+
	                                "</li>";

						$('#form279_lists_'+list_item_clean).append(rowsHTML);
	                });

					$('#form279').formcontrol();
					paginator.update_index(results.length);
					vExport.export_buttons({action:'dynamic',columns:columns,file:'Tasks',report_id:'form279',feach:function (item)
					{
	                    delete item.source;
	                    item['list name']=item.source_name;
	                    delete item.source_name;
	                }});
					hide_loader();
				});
			});
		};

		function form279_reopen_item(id,button)
		{
			if(is_update_access('form279'))
			{
				var last_updated=get_my_time();
				var data_json={data_store:'task_instances',
	 				data:[{index:'id',value:id},
	 					{index:'status',value:'pending'},
	 					{index:'last_updated',value:last_updated}]};
 				update_json(data_json);
                $(button).parent().parent().remove();
			}
			else
			{
				$("#modal2_link").click();
			}
		}

		function form279_close_item(id,button)
		{
			if(is_update_access('form279'))
			{
				var last_updated=get_my_time();
				var data_json={data_store:'task_instances',
	 				data:[{index:'id',value:id},
	 					{index:'status',value:'completed'},
	 					{index:'last_updated',value:last_updated}]};
 				update_json(data_json);
                $(button).parent().parent().remove();
			}
			else
			{
				$("#modal2_link").click();
			}
		}

		function form279_suspend_item(id,button)
		{
			if(is_update_access('form279'))
			{
				var last_updated=get_my_time();
				var data_json={data_store:'task_instances',
	 				data:[{index:'id',value:id},
	 					{index:'status',value:'suspended'},
	 					{index:'last_updated',value:last_updated}]};
 				update_json(data_json);
                $(button).parent().parent().remove();
			}
			else
			{
				$("#modal2_link").click();
			}
		}

		function form279_delete_item(id,button)
		{
			if(is_delete_access('form279'))
			{
				modal115_action(function()
				{
					var data_json={data_store:'task_instances',
 							data:[{index:'id',value:id}]};
					delete_json(data_json);
					$(button).parent().parent().remove();
				});
			}
			else
			{
				$("#modal2_link").click();
			}
		}

		function form279_import_template()
		{
			var data_array=['id','task name','description','status','assignee','list name'];
			vUtil.arrayToCSV(data_array);
		};

		function form279_import_validate(data_array)
		{
			var validate_template_array=[{column:'task name',required:'yes',regex:new RegExp('^[0-9a-zA-Z _,;:/\'()!@#$%-]+$')},
									{column:'description',regex:new RegExp('^[0-9a-zA-Z _.,:/\'+@!$()-]+$')},
                                    {column:'list name',required:'yes',regex:new RegExp('^[0-9a-zA-Z _.,:/\'+@!$()-]+$')},
                                    {column:'assignee',regex:new RegExp('^[0-9a-zA-Z _.,:/\'+@!$()-]+$')},
									{column:'status',required:'yes',list:['pending','completed','cancelled']}];

			var error_array=vImport.validate(data_array,validate_template_array);
			return error_array;
		}

		function form279_import(data_array,import_type)
		{
			var data_json={data_store:'task_instances',
 					loader:'no',
 					log:'yes',
 					data:[],
 					log_data:{title:'To do list',link_to:'form279'}};

			var counter=1;
			var last_updated=get_my_time();

			data_array.forEach(function(row)
			{
				counter+=1;
				if(import_type=='create_new')
				{
					row.id=last_updated+counter;
				}

				var data_json_array=[{index:'id',value:row.id},
	 					{index:'name',value:row['task name']},
	 					{index:'description',value:row.description},
	 					{index:'source_name',value:row['list name']},
	 					{index:'status',value:row.status},
                        {index:'source',value:'to_do'},
                        {index:'assignee',value:row.assignee},
	 					{index:'last_updated',value:last_updated}];

				data_json.data.push(data_json_array);
			});

			if(import_type=='create_new')
			{
				create_batch_json(data_json);
			}
			else
			{
				update_batch_json(data_json);
			}
		};


		function form279_add_task_popup(list_id,list_name)
		{
			var form=document.getElementById('modal201_form');
		    var list_filter=form.elements['list'];
		    var task_filter=form.elements['task'];
		    var desc_filter=form.elements['desc'];
		    var staff_filter=form.elements['assignee'];

		    list_filter.value="";
		    task_filter.value="";
		    desc_filter.value="";
		    staff_filter.value="";
		    $(list_filter).focus();
		    if(typeof list_name!='undefined' && list_name!="")
		    {
		        list_filter.value=list_name;
		        list_filter.setAttribute('readonly','readonly');
		        $(task_filter).focus();
		    }

		    var assignee_data={data_store:'staff',return_column:'acc_name'};
		    set_my_value_list_json(assignee_data,staff_filter);

		    $(form).off('submit');
			$(form).on('submit',function(event)
			{
				event.preventDefault();
		        var task=task_filter.value;
		        var desc=desc_filter.value;
		        var staff=staff_filter.value;
		        var last_updated=get_my_time();

				var data_json={data_store:'task_instances',
		                       log:'yes',
			                   data:[{index:'id',value:vUtil.newKey()},
			 					{index:'name',value:task},
		                        {index:'source_id',value:list_id},
		                        {index:'source',value:'to_do'},
		                        {index:'description',value:desc},
		                        {index:'assignee',value:staff},
		                        {index:'status',value:'pending'},
			 					{index:'last_updated',value:last_updated}],
			 			   log_data:{title:'Added',notes:'Task to list '+list_name,link_to:'form279'}};
		        create_json(data_json);

		        $(form).find('.close').click();
			});
			$('#modal201').formcontrol();
			$("#modal201_link").click();
		}

	</script>
</div>
