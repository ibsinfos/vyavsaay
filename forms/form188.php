<div id='form188' class='tab-pane'>
<input type='button' value='Switch view' class='generic_icon' onclick='form188_switch_view();'>
	<div id="form188_calendar" style="max-width: 900px;margin:20px auto;"></div>
	<table class='rwd-table'>
		<thead>
			<tr>
				<form id='form188_header'></form>
					<th>Task</th>
					<th>Details</th>
					<th>Assignee</th>
					<th>Due Time</th>
					<th>Status</th>
					<th><input type='button' class='add_icon' form='form188_header' title='Add task' onclick="modal117_action('testing');">
					</th>
			</tr>
		</thead>
		<tbody id='form188_body'>
		</tbody>
	</table>
	<div id='form188_nav' class='form_nav'>
		<img src='./images/previous.png' id='form188_prev' class='prev_icon' data-index='-25' onclick="$('#form188_index').attr('data-index',$(this).attr('data-index')); form188_ini();">
		<div style='display:hidden;' id='form188_index' data-index='0'></div>
		<img src='./images/next.png' id='form188_next' class='next_icon' data-index='25' onclick="$('#form188_index').attr('data-index',$(this).attr('data-index')); form188_ini();">
	</div>
</div>