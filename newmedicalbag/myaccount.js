/* storage fields for specialties and user data */
pdone.storage.specialty_options = null;
pdone.storage.specialties = null;
pdone.storage.userdata = {};

pdone.namespace("pdone.templates");
pdone.templates.specialties = null;
pdone.templates.acctinfo = null;

pdone.namespace("pdone.page");

pdone.page.docReady = function(){

 pdone.templates.specialties = Handlebars.compile($('#format_specialties').html());
 pdone.templates.acctinfo = Handlebars.compile($('#format_acct_info').html());

 $.when(
  pdone.ajax.jsonp("specialty_processor.php", "mode=list"),
  pdone.ajax.jsonp("network_processor.php", "mode=get_personal_info&hcp_id="+pdone.storage.hcp_id),
  pdone.ajax.jsonp("network_processor.php", "mode=get_preferences&hcp_id="+pdone.storage.hcp_id)
 ).then(function(specialties,personal_info,preferences){
  pdone.storage.specialty_options = pdone.templates.specialties(specialties[0]);
  pdone.page.personalinfo(personal_info[0]);
  pdone.page.userprefs(preferences[0]);
//  pdone.page.upduserinfo(personal_info[0]);
 }).done(function(){

  pdone.page.upduserinfo();

  $.validator.messages.required = "";
  $.validator.messages.minlength = "";
  $.validator.messages.maxlength = "";
  $.validator.messages.date = "";
  $.validator.messages.digits = "";
  $.validator.messages.email = "";
  $.validator.messages.password = "";
  $.validator.messages.equalTo = "";

  try {
   $('#phone, #fax').mask("(999) 999-9999? 99999",{placeholder:""});
  } catch(e){}
  
  pdone.validate.PIform();
  pdone.validate.Emailform();
  pdone.validate.Passwordform();
//pdone.validate.NAform();

  var hashval = "";
  try {
	 hashval = pdone.util.getHashVal('show');
  }
  catch(e){}

  if(hashval != ""){pdone.page.findhash(hashval);}


 }); // end done
};


/* store user preferences data */
pdone.page.userprefs = function(response){
 delete response._id;
 pdone.storage.userdata["preferences"] = response.preferences;

}
/* save account data */
pdone.page.personalinfo = function(response){
 delete response._id;
 pdone.storage.userdata = response;
}

pdone.page.upduserinfo = function(){
 pdone.page.upduserinfo2()
 pdone.page.adduserclick();
}
/* process and format account data */
pdone.page.upduserinfo2 = function(){
 var acctinfo = pdone.templates.acctinfo(pdone.storage.userdata);

 $('#myaccount').html(acctinfo);

 $('form#preference_fields input[type=checkbox]').each(function(i,v){
  if(this.value == 'yes'){
   this.checked = true;
  }
 })

 $('select#suffix').val(pdone.storage.userdata.suffix);
 $('select#credential').val(pdone.storage.userdata.credential);
 $('select#gender').val(pdone.storage.userdata.gender);
 $('select#state').val(pdone.storage.userdata.address.state);
 $('select#license_state').val(pdone.storage.userdata.license_state);
 $('select#specialty').html(pdone.storage.specialty_options);
 $('select#specialty').val(pdone.storage.userdata.specialty);

 $('#password_form').hide();
 $('div.myacct_divider span').show();

 $.each($("p#msgbar span"),function(){$(this).removeClass('underline');});

 $('#preferences').addClass('underline');
};
/* add click events to show/hide password change */
pdone.page.adduserclick = function(){
 $('#myaccount').on('click','input[type=button]',pdone.page.buttonclk);
 $('#myaccount').on('click','div.myacct_divider span',pdone.page.showpasswd);
 $('p#msgbar span').on('click',pdone.page.findform);
};
/* display message */
pdone.page.alert = function(w){
  pdone.site.popup('alert', '', w);
//alert(w);
};
/* complete button click event */
pdone.page.buttonclk = function(event){
 if(this.id.indexOf('_chgs')>-1){pdone.process[this.id]();} else {pdone.page.upduserinfo2();}
}
/* hide toggle, show password fields */
pdone.page.showpasswd = function(){
 $(this).hide();
 $('#password_form').show();
}
/* hide/show page sections */
pdone.page.findform = function(){
 var where = this.innerHTML;
 var showform = this.id + "_form";
 if (where != '|'){pdone.page.showform(where,showform);}
}
pdone.page.findhash = function(find){
 var where = $('#' + find)[0].innerHTML;
 var showform = find + "_form";
 pdone.page.showform(where,showform);
}
pdone.page.showform = function(where,showform){
 $.each($("p#msgbar span"),function(){
  $(this).removeClass('underline');
  if(this.innerHTML.indexOf(where) > -1){$(this).addClass('underline');}
 });

 $('div#myaccount > div').hide();
 $('div#myaccount div#'+showform).show();

 if(this.id != 'acct_information'){
  $('#password_form').hide();
  $('div.myacct_divider span').show();
  $("#email_form input").removeClass('error');
  $("#password_form input").removeClass('error');
 }
}
/* use validator plugin */
pdone.namespace("pdone.validate");
pdone.validate.PIform = function(){
 $('#personal_information').validate({
  errorClass: "error",
  rules:{first:{required:true},
   last:{required:true},
   credential:{required:true},
   address1:{required:true},
   city:{required:true},
   state:{required:true},
   zip:{
     required: true,
     digits: true,
     minlength: 5,
     maxlength: 5
    },
   specialty:{required:true},
   phone:{required:true}
  }
 });
  $("#personal_information").removeAttr("novalidate");
}
/* validate email addresses */
pdone.validate.Emailform = function(){
 $('#email_form').validate({
  errorClass: "error",
  rules:{oldemail:{required:true,email:true},
	newemail1:{required:true,email:true},
	newemail2:{required:true,email:true,equalTo:"#newemail1"}
  }
 });

  $("#email_form").removeAttr("novalidate");
}
/* validate passwords */
pdone.validate.Passwordform = function(){
 $('#password_form').validate({
  errorClass: "error",
  rules:{oldpassword:{required:true,password:false},
	newpassword1:{required:true,password:true},
	newpassword2:{required:true,password:true,equalTo:"#newpassword1"}
  }
 });
  $("#password_form").removeAttr("novalidate");
}
/* validate preferences */
pdone.validate.NAform = function(){
 $('#preference_fields').validate({
  errorClass: "error",
  rules:{}});
  $("#preference_fields").removeAttr("novalidate");
}

pdone.namespace("pdone.process");
/* process email fields */
pdone.process.EM_save_chgs = function(){
  pdone.validate.Emailform();
  var formboolean = $('#email_form').valid();
  if(formboolean){
//    var emailfields = $('#email_form').serialize();
    var oldusername = $('#oldemail').val();
    var newusername = $('#newemail1').val();
    pdone.site.ajax(pdone.process.EM_done, null, "network_processor.php", 'mode=set_account_settings&hcp_id='+pdone.storage.hcp_id+'&account={"email":"'+newusername+'","oldemail":"'+oldusername+'"}');
  }
 if($('#newemail1').val() > '' || $('#newemail2').val() > ''){}}
/* alert that email fields were udpated */
pdone.process.EM_done = function(response){
 if(response.status == "updated") {
   pdone.site.popup('alert', 'MY ACCOUNT', 'Your account has been update.');
//   alert("your email address has been updated");
   document.getElementById("email_form").reset();
 } else{
   pdone.site.popup('alert', 'MY ACCOUNT', 'Your email address has not been updated.');
 }
}
/* process password fields */
pdone.process.PW_save_chgs = function(){
  $('#oldemail').removeClass('error');
  $('#newemail1').removeClass('error');
  $('#newemail2').removeClass('error');

  pdone.validate.Passwordform();
  var formboolean = $('#password_form').valid();

  if($('#oldemail').val().trim() == ''){
   $('#oldemail').addClass('error');
   formboolean = false;
  }
  
  if(formboolean){
//    var pwfields = $('#password_form').serialize();
    var oldpassword = $('#oldpassword').val();
    var password = $('#newpassword1').val();
    var username = $('#oldemail').val();
        pdone.site.ajax(pdone.process.PW_done, null, "network_processor.php", 'mode=set_account_settings&hcp_id='+pdone.storage.hcp_id+'&account={"email":"'+username+'","password":"'+password+'","oldpassword":"'+oldpassword+'"}');
  }// if
}// function
/* alert that password fields were updated */
pdone.process.PW_done = function(response){
 if(response.status == "updated") {
   pdone.site.popup('alert', 'MY ACCOUNT', 'Your account has been update.');
   document.getElementById("password_form").reset();
   document.getElementById("email_form").reset();
 } else{
   pdone.site.popup('alert', 'MY ACCOUNT', 'Your password has not been updated.');
 }
}
/* validate personal information */
pdone.process.PI_save_chgs = function(){
 pdone.validate.PIform();
 var formboolean = $('#personal_information').valid();
 if(formboolean){
 var first = encodeURIComponent($('#first').val());
 var last = encodeURIComponent($('#last').val());
 var npinum = encodeURIComponent($('#npi').val());
 var deanum = encodeURIComponent($('#dea').val());
 var license = encodeURIComponent($('#license').val());
 var license_state = encodeURIComponent($('#license_state').val());
 var reason = '';
 $.when(
  pdone.process.validate("validation_type=npi&first="+first+"&last="+last+"&number="+npinum,npinum.length),
  pdone.process.validate("validation_type=dea&first="+first+"&last="+last+"&number="+deanum,deanum.length),
  pdone.process.validate("validation_type=state&first="+first+"&last="+last+"&number="+license+"&state="+license_state,license.length)
 ).then(function(npi_response,dea_response,state_response){
  if(npi_response != null && npi_response[0].valid == 'no'){formboolean = false;};
  if(dea_response != null && dea_response[0].valid == 'no'){formboolean = false;};
  if(state_response != null && state_response[0].valid == 'no'){reason = state_response[0].reason};
 }).done(function(){
  if(reason==''){pdone.process.PI_done();} else {
    pdone.site.popup('alert', 'MY ACCOUNT', reason);
  }
 });//done

 }//if(formboolean)
 window.scroll(0,0)

}// pdone.process.PI_save_chgs
/* validate licenses */
pdone.process.validate = function(v,l){
 var rtnval = null;
 if(l > 0){
  rtnval = pdone.ajax.jsonp("validation_processor.php", v);
 }
 return rtnval;
}
/* process personal information */
pdone.process.PI_done = function(){
  var pifields = $('#personal_information').serializeObject();

  var pijson = {
    "address":{"address1":encodeURIComponent(pifields.address1),"address2":encodeURIComponent(pifields.address2),"suite":encodeURIComponent(pifields.suite),"city":encodeURIComponent(pifields.city),"state":pifields.state,"zip":encodeURIComponent(pifields.zip)},
    "credential":pifields.credential,"dea":encodeURIComponent(pifields.dea),"fax":encodeURIComponent(pifields.fax),"first":encodeURIComponent(pifields.first),"gender":pifields.gender,
    "grad_year":encodeURIComponent(pifields.grad_year),"last":encodeURIComponent(pifields.last),"license":encodeURIComponent(pifields.license),"license_state":encodeURIComponent(pifields.license_state),
    "middle":encodeURIComponent(pifields.middle),"npi":encodeURIComponent(pifields.npi),"phone":encodeURIComponent(pifields.phone),"prefix":pifields.prefix,"suffix":pifields.suffix,
    "yob":encodeURIComponent(pifields.yob),"specialty":encodeURIComponent(pifields.specialty)
   }
  var pistr = JSON.stringify(pijson);
  pdone.site.ajax(pdone.process.PI_done2, null, "network_processor.php", 'mode=set_personal_info&hcp_id='+pdone.storage.hcp_id+'&account='+pistr);
}
/* alert that personal information were saved */
pdone.process.PI_done2 = function(response){
 window.scroll(0,0);
 if(response.status == "personal info set") {
   pdone.site.popup('alert', 'MY ACCOUNT', 'Your account has been update.');
//   alert("your personal info has been updated");
   pdone.process.updateUser();
 } else{
   pdone.site.popup('alert', 'MY ACCOUNT', 'Your personal info has not been updated.');
 }
}
/* process preferences selections */
pdone.process.NA_save_chgs = function(w){

 var nafields = "{";
 var naform = $('#preference_fields input[type=checkbox]');

 naform.each(function(i,v){
  if(this.checked == true){
   nafields += '"'+ this.name + '":"yes",'
  } else {
   nafields += '"'+ this.name + '":"no",'
  }
 })

 nafields = nafields.substring(0,nafields.length-1) + '}';
 pdone.site.ajax(pdone.process.NA_done, null, "network_processor.php", 'mode=set_preferences&hcp_id='+pdone.storage.hcp_id+'&account={"network_activity":'+nafields+'}');
}
/* alert that preferences were udpated*/
pdone.process.NA_done = function(response){
 if(response.preferences == "updated") {
   pdone.site.popup('alert', 'MY ACCOUNT', 'Your account has been update.');
   pdone.process.updateUser();
 } else{
   pdone.site.popup('alert', 'MY ACCOUNT', 'Your preferences have not been updated.');
 }
}
/* update user data */
pdone.process.updateUser = function(){
 $.when(
  pdone.ajax.jsonp("network_processor.php", "mode=get_personal_info&hcp_id="+pdone.storage.hcp_id),
  pdone.ajax.jsonp("network_processor.php", "mode=get_preferences&hcp_id="+pdone.storage.hcp_id)
 ).then(function(personal_info,preferences){
  pdone.page.personalinfo(personal_info[0]);
  pdone.page.userprefs(preferences[0]);
 }).done(function(){pdone.page.upduserinfo2();})
}