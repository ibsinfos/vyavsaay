<div id='finances_main'>

	<?php 

		echo "<ul>";
			if(strpos($_SESSION['forms'],'form11')!==false)
				echo "<li><a id='form11_link' href='#form11' onclick='form11_header_ini(); form11_ini();'>Manage payments</a></li>";
			if(strpos($_SESSION['reports'],'report4')!==false)
				echo "<li><a id='report4_link' href='#report4' onclick='report4_header_ini(); report4_ini();'>Modes of Payment</a></li>";
			if(strpos($_SESSION['forms'],'form9')!==false)
				echo "<li><a id='form9_link' href='#form9' onclick='form9_header_ini(); form9_ini();'>Cash Register</a></li>";
			if(strpos($_SESSION['forms'],'form56')!==false)
				echo "<li><a id='form56_link' href='#form56' onclick='form56_header_ini(); form56_ini();'>Expense Register</a></li>";			
			if(strpos($_SESSION['reports'],'report14')!==false)
				echo "<li><a id='report14_link' href='#report14' onclick='report14_header_ini(); report14_ini();'>Expenses by period</a></li>";
			if(strpos($_SESSION['reports'],'report15')!==false)
				echo "<li><a id='report15_link' href='#report15' onclick='report15_ini();'>Financial Summary</a></li>";
			if(strpos($_SESSION['reports'],'report34')!==false)
				echo "<li><a id='report34_link' href='#report34' onclick='report34_ini();'>Profit projector</a></li>";
			if(strpos($_SESSION['reports'],'report6')!==false)
				echo "<li><a id='report6_link' href='#report6' onclick='report6_header_ini(); report6_ini();'>Payments due</a></li>";
		echo "</ul>";

		if(strpos($_SESSION['forms'],'form11')!==false)
			include "forms/form11.php"; 
		if(strpos($_SESSION['reports'],'report4')!==false)
			include "reports/report4.php";
		if(strpos($_SESSION['forms'],'form9')!==false)
			include "forms/form9.php";
		if(strpos($_SESSION['forms'],'form56')!==false)
			include "forms/form56.php";
		if(strpos($_SESSION['reports'],'report14')!==false)
			include "reports/report14.php";
		if(strpos($_SESSION['reports'],'report15')!==false)
			include "reports/report15.php";
		if(strpos($_SESSION['reports'],'report34')!==false)
			include "reports/report34.php";
		if(strpos($_SESSION['reports'],'report6')!==false)
			include "reports/report6.php";
	?>		
	
	<script>
	!function(){
		$("#finances_main").tabs({
			heightStyle:"fill",
			show:"slide"});
		}();
	</script>

</div>