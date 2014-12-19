<div id='form24' class='function_detail'>
	<form id='form24_master'>
		<fieldset>
			<label>Supplier <img src='./images/add_image.png' class='add_image' title='Add new supplier' onclick='modal13_action();'></br>
			<input type='text' required></label>
			<label>Order Date</br><input type='text' required></label>
			<label>Notes</br><textarea></textarea></label>
			<label>Order Status</br><input type='text' required></label>
			<input type='hidden' name='order_id' value=''>
			<input type='button' title='New Order' class='add_icon' onclick='form24_new_form();'>
			<input type='submit' title='Save order' class='save_icon'>
			<input type='hidden' name='email_id' value=''>
			<input type='hidden' name='phone' value=''>
			<input type='button' title='Print Bill' class='print_icon' onclick='form24_print_form();'>
			<a id='form24_whatsapp' target='_blank' style='display:none;'><img style='width:25px;height:25px;' src='./images/whatsapp.jpeg' title='Send details through WhatsApp'></a>
			<a id='form24_gmail' target='_blank' style='display:none;'><img style='width:25px;height:25px;' src='./images/gmail.png' title='Send details through Gmail'></a>
		</fieldset>
	</form>
	<table class='rwd-table'>
		<thead>
			<tr>
				<form id='form24_header'></form>
					<th>Product Name</th>
					<th>Quantity</th>
					<th>Make</th>
					<th>Price</th>
					<th><input type='button' form='form24_header' title='Add item' class='add_icon' onclick='form24_add_item();'></th>
			</tr>
		</thead>
		<tbody id='form24_body'>
		</tbody>
	</table>
</div>