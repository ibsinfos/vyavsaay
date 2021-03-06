<div id='report103' class='tab-pane portlet box red-sunglo'>
	<div class="portlet-title">
        <div class='caption'>
            <div class='btn-group' id='report103_status' data-toggle='buttons' data-value='pending'>
                <label class='btn red-pink active pending' onclick=report103_ini('pending');><input name='due_date' type='radio' class='toggle'>Pending</label>
                <label class='btn red-pink closed' onclick=report103_ini('closed');><input type='radio' name='due_date' class='toggle'>Closed</label>
            </div>
        </div>
        <div class="actions">
            <div class="btn-group">
                <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">Tools <i class="fa fa-angle-down"></i></button>
                <ul class="dropdown-menu pull-right">
                    <li>
                      	<a id='report103_csv'><i class='fa fa-file-excel-o'></i> Save as CSV</a>
                    </li>
                    <li>
                      	<a id='report103_pdf'><i class='fa fa-file-pdf-o'></i> Save as PDF</a>
                    </li>
                    <li>
                        <a id='report103_print'><i class='fa fa-print'></i> Print</a>
                    </li>
                    <li>
                        <a id='report103_email'><i class='fa fa-envelope'></i> Email</a>
                    </li>
                </ul>
            </div>
      </div>
	</div>

	<div class="portlet-body">
        <form id='report103_master' autocomplete="off">
            <fieldset>
                <label><input type='text' name='account' class='floatlabel' placeholder='Account'></label>
                <input type='submit' class='submit_hidden'>
            </fieldset>
        </form>
        <br>
		<table class="table table-striped table-bordered table-hover dt-responsive no-more-tables" width="103%">
			<thead>
				<tr>
					<th>Account</th>
                    <th>Details</th>
                    <th>Transaction Date</th>
					<th>Due Date</th>
                    <th>Total</th>
                    <th>Paid</th>
				</tr>
			</thead>
			<tbody id='report103_body'>
			</tbody>
		</table>
	</div>

	<script>
    function report103_header_ini()
    {
        var fields=document.getElementById('report103_master');
        var customers_filter=fields.elements['account'];
        var accounts_data={data_store:'accounts',return_column:'acc_name'};
        set_my_value_list_json(accounts_data,customers_filter);

        $(fields).off('submit');
        $(fields).on("submit", function(event)
        {
            event.preventDefault();
            report103_ini();
        });

        $('#report103').formcontrol();
    }

    function report103_ini(status)
    {
        show_loader();

        $('#report103_body').html('');

        var status_filter='pending';
        if(typeof status!='undefined' && status=='closed')
        {
            status_filter='closed';
			$('#report103_status').data('value','closed');
        }
        else
        {
			$('#report103_status').data('value','pending');
            $('#report103_status').find('label.pending').addClass('active');
            $('#report103_status').find('label.closed').removeClass('active');
        }
        var filter_fields=document.getElementById('report103_master');
        var account_filter=filter_fields.elements['account'].value;

        var paginator=$('#report103_body').paginator({func:"report103_ini($('#report103_status').data('value'))"});

        var columns=new Object();
                columns.count=paginator.page_size();
                columns.start_index=paginator.get_index();
                columns.data_store='payments';

                columns.indexes=[{index:'id'},
                                {index:'acc_name',value:account_filter},
                                {index:'type'},
                                {index:'total_amount'},
                                {index:'paid_amount'},
                                {index:'status',exact:status_filter},
                                {index:'date'},
                                {index:'due_date'},{index:'source',array:["purchase bill","purchase return"]},
                                {index:'source_id'},{index:'source_info'}];
        read_json_rows('report103',columns,function(results)
        {
            var rowsHTML="";
            results.forEach(function (result)
            {
                var details="<a onclick=element_display('"+result.source_id+"','form17');>For "+result.source+" # "+result.source_info+"</a>";
                var sign="";
                var color="label-success";
                if(result.type=='paid')
                {
                    details="<a onclick=\"element_display('"+result.source_id+"','form53');\">For "+result.source+" # "+result.source_info+"</a>";
                    sign="- ";
                    color="label-warning";
                }
                rowsHTML+="<tr>";
                rowsHTML+="<td data-th='Account'><a onclick=\"show_object('suppliers','"+result.acc_name+"');\">";
                    rowsHTML+=result.acc_name;
                rowsHTML+="</a></td>";
                rowsHTML+="<td data-th='Details'>";
                    rowsHTML+=details;
                rowsHTML+="</td>";
                rowsHTML+="<td data-th='Transaction Date'>";
                    rowsHTML+=get_my_past_date(result.date);
                rowsHTML+="</td>";
                rowsHTML+="<td data-th='Due Date'>";
                    rowsHTML+=get_my_past_date(result.date);
                rowsHTML+="</td>";
                rowsHTML+="<td data-th='Total'><span class='label label-sm "+color+"'>";
                    rowsHTML+=sign+"Rs. "+result.total_amount;
                rowsHTML+="</span></td>";
                rowsHTML+="<td data-th='Paid'><span class='label label-sm "+color+"'>";
                    rowsHTML+=sign+"Rs. "+result.paid_amount;
                rowsHTML+="</span></td>";
                rowsHTML+="</tr>";
            });
            $('#report103_body').html(rowsHTML);
            $('#report103').formcontrol();
            hide_loader();

            paginator.update_index(results.length);

			vExport.export_buttons({action:'dynamic',columns:columns,file:'Purchase Invoice Ledger',report_id:'report103',feach:function (item)
			{
                item.due_date=get_my_past_date(item.due_date);
                item.date=get_my_past_date(item.date);
                delete item.status;
                delete item.source_id;
                delete item.source_info;
            }});
        });
    };

	</script>
</div>
