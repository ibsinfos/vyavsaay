<div id='report76' class='function_detail'>
	<form id='report76_header'>
		<fieldset>
			<legend>Select Filters</legend>
			<label>AWB #<br><input type='text' name='awb'></label>
			<label>Delivery Person<br><input name='delivery' type='text'></label>
			<label>Date<br><input type='text' name='date'></label>
			<label>Status<br><input type='text' name='status'></label>
			<label>	
				<input type='submit' value='Refresh' name='refresh' class='generic_icon'>
				<input type='button' title='Print' name='print' class='print_icon'>
			</label>	
		</fieldset>
	</form>
	<table class='rwd-table'>
		<thead>
			<tr>
				<th>AWB #</th>
				<th>Delivery Person</th>
				<th>Date</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody id='report76_body'>
		</tbody>
	</table>
	<div class='form_nav'>
		<img src='./images/previous.png' id='report76_prev' class='prev_icon' data-index='-25' onclick="$('#report76_index').attr('data-index',$(this).attr('data-index')); report76_ini();">
		<div style='display:hidden;' id='report76_index' data-index='0'></div>
		<img src='./images/next.png' id='report76_next' class='next_icon' data-index='25' onclick="$('#report76_index').attr('data-index',$(this).attr('data-index')); report76_ini();">
	</div>
</div>