<div id='form70' class='tab-pane'>
	<table class='rwd-table'>
		<thead>
			<tr>
				<form id='form70_header'></form>
					<th>Order No. <img src='../images/filter.png' class='filter_icon' onclick='show_filter($(this));'><input type='text' class='filter' form='form70_header'></th>
					<th>Customer <img src='../images/filter.png' class='filter_icon' onclick='show_filter($(this));'><input type='text' class='filter' form='form70_header'></th>
					<th>Order Date </th>
					<th>Status <img src='../images/filter.png' class='filter_icon' onclick='show_filter($(this));'><input type='text' class='filter' form='form70_header'></th>
					<th><input type="button" value='Add new order' class='add_icon' form='form70_header' onclick="element_display('','form69'); form69_new_form();">
						<input type='button' form='form70_header' value='EXPORT' class='export_icon'>
						<input type='submit' form='form70_header' style='visibility: hidden;'>
					</th>
			</tr>
		</thead>
		<tbody id='form70_body'>
		</tbody>
	</table>
	<div class='form_nav'>
		<img src='./images/previous.png' id='form70_prev' class='prev_icon' data-index='-25' onclick="$('#form70_index').attr('data-index',$(this).attr('data-index')); form70_ini();">
		<div style='display:hidden;' id='form70_index' data-index='0'></div>
		<img src='./images/next.png' id='form70_next' class='next_icon' data-index='25' onclick="$('#form70_index').attr('data-index',$(this).attr('data-index')); form70_ini();">
	</div>
</div>