<div id='form19' class='function_detail'>
	<form id='form19_master'>
		<fieldset>
			<label>Supplier <img src='./images/add_image.png' class='add_image' title='Add new supplier' onclick='modal13_action();'></br>
			<input type='text' required></label>
			<label>Return Date</br><input type='text' required></label>
			<label>Total Refund</br>Rs. <input readonly='readonly' type='number' step='any'></label>
			<input type='hidden' name='id'>
			<input type='hidden' name='transaction'>
			<input type='hidden' name='tax'>
			<input type='button' title='New Bill' class='add_icon' onclick='form19_new_form();'>
			<input type='submit' title='Save Bill' class='save_icon'>
			<input type='button' title='Print Bill' class='print_icon' onclick='form19_print_form();'>
			<input type='hidden' name='email_id' value=''>
			<input type='hidden' name='phone' value=''>
			<a id='form19_whatsapp' target='_blank' style='display:none;'><img style='width:25px;height:25px;' src='./images/whatsapp.jpeg' title='Send details through WhatsApp'></a>
			<a id='form19_gmail' target='_blank' style='display:none;'><img style='width:25px;height:25px;' src='./images/gmail.png' title='Send details through Gmail'></a>
			</fieldset>
	</form>
	<table class='rwd-table'>
		<thead>
			<tr>
				<form id='form19_header'></form>
					<th>Product Name</th>
					<th>Batch</th>
					<th>Notes (Add reason for return)</th>
					<th>Quantity</th>
					<th>Return Amount</th>
					<th><input type='button' form='form19_header' title='Add item' class='add_icon' onclick='form19_add_item();'></th>
			</tr>
		</thead>
		<tbody id='form19_body'>
		</tbody>
	</table>
</div>