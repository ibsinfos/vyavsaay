<div id='form228' class='function_detail'>
	<table class='rwd-table'>
		<thead>
			<tr>
				<form id='form228_header'></form>
					<th>Item <img src='../images/filter.png' class='filter_icon' onclick='show_filter($(this));'><input type='text' class='filter' form='form228_header'></th>
					<th>Quantity</th>
					<th><input type='button' form='form228_header' value='EXPORT' class='export_icon'>
						<input type='submit' form='form228_header' style='display:none;visibility: hidden;'>
					</th>
			</tr>
		</thead>
		<tbody id='form228_body'>
		</tbody>
	</table>
	<div class='form_nav'>
		<img src='./images/previous.png' id='form228_prev' class='prev_icon' data-index='-25' onclick="$('#form228_index').attr('data-index',$(this).attr('data-index')); form228_ini();">
		<div style='display:hidden;' id='form228_index' data-index='0'></div>
		<img src='./images/next.png' id='form228_next' class='next_icon' data-index='25' onclick="$('#form228_index').attr('data-index',$(this).attr('data-index')); form228_ini();">
	</div>
</div>