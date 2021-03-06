/**
* @form Update Inventory
* @formNo 1
*/
function activities_import_template()
{
	var data_array=['id','type','status','data_xml','user_display','data_id','tablename','link_to','last_updated'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage Assets
* @formNo 5
*/
function form5_import_template()
{
	var data_array=['id','name','type','description'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Create Service Bills
* @formNo 10
* @table bill_items
*/
function form10_import_template()
{
	var data_array=['id','bill_id','item_name','quantity','unit_price','mrp','amount',
	                'total','discount','offer','type','batch','notes',
	                'staff','tax','free_with'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage Payments
* @formNo 11
*/
function form11_import_template()
{
	var data_array=['id','type','acc_name','total_amount','paid_amount','status','date','source','source_id','source_info','due_date','mode'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Create Product Bills
* @formNo 12
* @table bill_items
*/
function form12_import_template()
{
	var data_array=['id','bill_id','item_name','quantity','unit_price','mrp','amount',
	                'total','discount','offer','type','batch','notes',
	                'staff','tax','free_with'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Manage Tasks
* @formNo 14
*/
function form14_import_template()
{
	var data_array=['id','name','description','assignee','t_due','task_hours','t_initiated','status'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Manage Customer Returns
* @formNo 16
* @table customer_returns
*/
function form16_import_template()
{
	var data_array=['id','order_num','order_id','channel','customer','return_date','total','tax','transaction_id','status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form create Purchase Order
* @formNo 24
* @table purchase_order_items
*/
function form24_import_template()
{
	var data_array=['id','order_id','item_name','item_desc','supplier_sku','quantity','make','mrp','price','amount','tax','total'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Manage Offers
* @formNo 35
*/
function form35_import_template()
{
	var data_array=['id','offer_name','offer_type','end_date','offer_detail','status',
	                'product_name','batch','service','criteria_type','criteria_amount','criteria_quantity',
	                'result_type','discount_percent','discount_amount','quantity_add_percent','quantity_add_amount',
	                'free_product_name','free_product_quantity'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form manage purchase order
* @formNo 43
* @table purchase_orders
*/
function form43_import_template()
{
	var data_array=['id','order_num','order_date','supplier','status','amount','tax','total'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Service pre-requisites
* @formNo 58
*/
function form58_import_template()
{
	var data_array=['id','name','requisite_type','requisite_name','quantity','type'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form product pre-requisites
* @formNo 59
*/
function form59_import_template()
{
	var data_array=['id','name','requisite_type','requisite_name','quantity','type'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Service Attributes
* @formNo 61
*/
function form61_import_template()
{
	var data_array=['id','name','attribute','value'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Product reviews
* @formNo 62
*/
function form62_import_template()
{
	var data_array=['id','name','type','reviewer','detail','rating'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Service reviews
* @formNo 63
*/
function form63_import_template()
{
	var data_array=['id','name','type','reviewer','detail','rating'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Service Cross sells
* @formNo 64
*/
function form64_import_template()
{
	var data_array=['id','name','type','cross_type','cross_name'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Product Cross sells
* @formNo 66
*/
function form66_import_template()
{
	var data_array=['id','name','type','cross_type','cross_name'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Create sale order
* @formNo 69
* @table sale_order_items
*/
function form69_import_template()
{
	var data_array=['id','order_id','item_name','item_desc','channel_sku','vendor_sku','quantity','mrp','price','amount','tax','freight','total'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage sale order
* @formNo 70
* @table sale_orders
*/
function form70_import_template()
{
	var data_array=['id','customer_name','order_date','type','status'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Manage task types
* @formNo 79
*/
function form79_import_template()
{
	var data_array=['id','name','description','est_hours'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Sale leads
* @formNo 81
*/
function form81_import_template()
{
	var data_array=['id','customer','detail','due_date','identified_by'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Scan items
* @formNo 82
* @table bill_items
*/
function form82_import_template()
{
	var data_array=['id','bill_id','item_name','quantity','unit_price','mrp','amount',
	                'total','discount','offer','type','batch','notes',
	                'staff','tax','free_with'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Manage Subscriptions
* @formNo 84
*/
function form84_import_template()
{
	var data_array=['id','customer','service','status','notes','last_bill_id','last_bill_date','next_due_date'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage Products
* @formNo 87
*/
function form87_import_template()
{
	var data_array=['id','name','make','description','tax','bar_code'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manufacturing Schedule
* @formNo 88
*/
function form88_import_template()
{
	var data_array=['id','product','process_notes','status','schedule','iteration_notes'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Create bills(multiple registers)
* @formNo 91
* @table bill_items
*/
function form91_import_template()
{
	var data_array=['id','bill_id','item_name','item_desc','quantity','unit_price','mrp','amount',
	                'total','freight','batch','tax_rate','tax','cst','vat','storage'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Manage Loans
* @formNo 93
*/
function form93_import_template()
{
	var data_array=['id','type','account','date_initiated','loan_amount','repayment_method',
	                'interest_paid','interest_rate','interest_period','next_interest_date','interest_type',
	                'emi','emi_period','next_emi_date','pending_emi','status'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form manage Projects
* @formNo 101
* @table projects
*/
function form101_import_template()
{
	var data_array=['id','name','details','start_date','status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Project Team
* @formNo 102
* @table project_team
*/
function form102_import_template()
{
	var data_array=['id','project_id','member','notes','role','status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Project Phases
* @formNo 103
* @table project_phases
*/
function form103_import_template()
{
	var data_array=['id','project_id','phase_name','details','start_date','due_date','status'];
	vUtil.arrayToCSV(data_array);
};



/**
* @form Manage sale order (multi-register)
* @formNo 108
* @table sale_orders
*/
function form108_import_template()
{
	var data_array=['id','order_num','customer_name','order_date','channel','status','amount','tax','freight','total'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Asset Attributes
* @formNo 109
*/
function form109_import_template()
{
	var data_array=['id','name','attribute','value'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Add sale challans
* @formNo 112
*/
function form112_import_template()
{
	var data_array=['id','customer','item_name','item_desc','batch','quantity','sale_date','mrp','unit_price','amount','tax','total','storage','bill_status','picked_status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage sale challans
* @formNo 113
*/
function form113_import_template()
{
	var data_array=['id','customer','item_name','item_desc','batch','quantity','sale_date','mrp','unit_price','amount','tax','total','storage','bill_status','picked_status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Add purchase challans
* @formNo 114
*/
function form114_import_template()
{
	var data_array=['id','supplier','item_name','item_desc','batch','quantity','purchase_date','unit_price','amount','tax','total','storage','put_away_status','bill_status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage purchase challans
* @formNo 115
*/
function form115_import_template()
{
	var data_array=['id','supplier','item_name','item_desc','batch','quantity','purchase_date','unit_price','amount','tax','total','storage','put_away_status','bill_status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage Loyalty Programs
* @formNo 116
*/
function form116_import_template()
{
	var data_array=['id','name','type','tier','tier_criteria_lower','tier_criteria_upper','points_addition',
	                'discount','redemption_criteria','cashback','reward_product','status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Create bills(loyalty)
* @formNo 118
* @table bill_items
*/
function form118_import_template()
{
	var data_array=['id','bill_id','item_name','quantity','p_quantity','f_quantity','unit_price','mrp','amount',
	                'total','discount','offer','type','batch','notes',
	                'staff','tax','free_with'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Create bills(multiple registers, unbilled items)
* @formNo 119
* @table bill_items
*/
function form119_import_template()
{
	var data_array=['id','bill_id','item_name','quantity','p_quantity','f_quantity','unit_price','mrp','amount',
	                'total','discount','offer','type','batch','notes',
	                'staff','tax','free_with'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage Loyalty customers
* @formNo 120
*/
function form120_import_template()
{
	var data_array=['id','program_name','customer','tier','status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Adjust Loyalty Points
* @formNo 121
*/
function form121_import_template()
{
	var data_array=['id','program_name','customer','points','date','source','source_id'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Enter supplier bill(unbilled items)
* @formNo 122
* @table supplier_bill_items
*/
function form122_import_template()
{
	var data_array=['id','quantity','product_name','item_desc','batch','bill_id','mrp','unit_price',
					'amount','tax','cst','total','qc','qc_comments','storage','put_away_status'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Receipts
* @formNo 124
* @table receipts
*/
function form124_import_template()
{
	var data_array=['id','receipt_id','payment_id','type','amount','acc_name','date'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Customer Accounts
* @formNo 125
* @table accounts
*/
function form125_import_template()
{
	var data_array=['id','username','acc_name','description','type','status'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Customer Profiling
* @formNo 139
* @table expenses
*/
function form139_import_template()
{
	var data_array=['id','name','type','owner','owner_type','description','location','area','floors','notes'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Customer Profiling
* @formNo 140
* @table expenses
*/
function form140_import_template()
{
	var data_array=['id','name','type','owner','owner_type','description','location','area','floors','notes'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Manufacturing
* @formNo 146
*/
function form146_import_template()
{
	var data_array=['id','product','batch','quantity','status','schedule'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Create Bill (DLM)
* @formNo 154
*/
function form154_import_template()
{
	var data_array=['id','bill_id','item_name','quantity','unit','unit_price','amount','from_date','to_date','storage','hired','fresh'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Update Inventory (DLM)
* @formNo 155
*/
function form155_import_template()
{
	var data_array=['id','product_name','cost_price','sale_price','manufacture_date','mrp','actual_quantity'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Store Placement (DLM)
* @formNo 156
*/
function form156_import_template()
{
	var data_array=['id','item_name','name'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Store Movement (DLM)
* @formNo 157
*/
function form157_import_template()
{
	var data_array=['id','item_name','quantity','source','target',
	                'status','dispatcher','receiver'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Enter Purchase bill (DLM)
* @formNo 158
* @table supplier_bill_items
*/
function form158_import_template()
{
	var data_array=['id','quantity','product_name',
	               'bill_id','unit_price','amount','tax','total','storage'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Checklist items
* @formNo 161
*/
function form161_import_template()
{
	var data_array=['id','checkpoint','desired_result','status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Checklist mapping
* @formNo 162
*/
function form162_import_template()
{
	var data_array=['id','checkpoint','desired_result','item'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Storage Structure
* @formNo 167
* @table storage_structure
*/
function form167_import_template()
{
	var data_array=['id','name','parent','length','breadth','height','unit'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage Products (Nikki)
* @formNo 169
*/
function form169_import_template()
{
	var data_array=['id','sku','name','brand','tax','bar_code','length','breadth','height','volume','unit','weight','packing'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Store Areas (Nikki)
* @formNo 170
*/
function form170_import_template()
{
	var data_array=['id','name','parent','owner','area_type','height','breadth','length','unit'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Manage Channels
* @formNo 171
*/
function form171_import_template()
{
	var data_array=['id','name','details','dead_weight_factor'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Pricing Sheet
* @formNo 172
*/
function form172_import_template()
{
	var data_array=['id','channel','item','from_time','mrp','discount_customer','sale_price','freight','channel_commission_percentage','channel_commission','pickup_charges','gateway_charges','service_tax','total_charges','cost_price'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form SKU mapping
* @formNo 173
*/
function form173_import_template()
{
	var data_array=['id','channel','channel_sku','system_sku','item_desc'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Pickup Charges
* @formNo 174
*/
function form174_import_template()
{
	var data_array=['id','channel','pincode','minimum','maximum','weight_rate'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Channel Categories
* @formNo 175
*/
function form175_import_template()
{
	var data_array=['id','channel','type','name','parent','commission'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Category Item mapping
* @formNo 176
*/
function form176_import_template()
{
	var data_array=['id','channel','cat_type','cat_name','sku'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Prioritization Parameters
* @formNo 177
*/
function form177_import_template()
{
	var data_array=['id','name','type','values','threshold'];
	vUtil.arrayToCSV(data_array);
};



/**
* @form Production Steps
* @formNo 184
*/
function form184_import_template()
{
	var data_array=['id','name','details','time_estimate','default_assignee','order_no','type','status'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Testing Steps
* @formNo 187
*/
function form187_import_template()
{
	var data_array=['id','name','details','time_estimate','default_assignee','order_no','status'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Orders (laundry)
* @formNo 190
*/
function form190_import_template()
{
	var data_array=['id','customer_name','notes','order_date','assignee','status','address'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Update Stock
* @formNo 193
*/
function form193_import_template()
{
	var data_array=['id','product_name','batch','quantity','source','storage'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Letterhead
* @formNo 195
*/
function form195_import_template()
{
	var data_array=['id','name','date','receiver','subject','salutation','content','signature','footer'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form SKU Mapping (Supplier)
* @formNo 217
*/
function form217_import_template()
{
	var data_array=['id','item','item_desc','supplier_sku','margin','supplier'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form create Purchase Order
* @formNo 222
* @table purchase_order_items
*/
function form222_import_template()
{
	var data_array=['id','order_id','item_name','quantity','make','mrp','price','amount','tax','total'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form manage purchase order (Aurilion)
* @formNo 223
* @table purchase_orders
*/
function form223_import_template()
{
	var data_array=['id','order_num','order_date','supplier','status','amount','tax','total'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form In-out
* @formNo 230
*/
function form230_import_template()
{
	var data_array=['id','item','quantity','issue_type','for_from','date','to_from','notes'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form SKU components
* @formNo 245
*/
function form245_import_template()
{
	var data_array=['id','sku','component_sku','component_name','quantity'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Purchase leads
* @formNo 273
*/
function form273_import_template()
{
	var data_array=['id','name','phone','email','address','city','item','company','price','quantity','comments','identified date'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Inventory (poojaelec)
* @formNo 274
*/
function form274_import_template()
{
	var data_array=['id','item','quantity'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form In-out (poojaelec)
* @formNo 275
*/
function form275_import_template()
{
	var data_array=['id','item','quantity','type','date','to/from','notes'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Buyer leads
* @formNo 289
*/
function form289_import_template()
{
	var data_array=['id','name','phone','email','address','city','item','company','price','point-of-contact','quantity','comments','followup date'];
	vUtil.arrayToCSV(data_array);
};

/**
* @form Cities
* @formNo 290
*/
function form290_import_template()
{
	var data_array=['id','city','state','country'];
	vUtil.arrayToCSV(data_array);
};


/**
* @form Manage Products (Pooja)
* @formNo 300
*/
function form300_import_template()
{
	var data_array=['id','Model','Company','Category','Description','MRP','Cost Price','Sale Price'];
	vUtil.arrayToCSV(data_array);
};
