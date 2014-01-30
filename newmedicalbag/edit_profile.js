/* variables to store data */
pdone.storage.memberdata = {};
pdone.storage.listofstates = "";

pdone.namespace("pdone.profile");
/* profile json template */
pdone.profile.template = {
	position : [{title : "",dates : {dt_start : "",dt_end : ""}}], // position
	experiences : [{hospital : '',city : '',state : '',position : [{title : "",dates : {dt_start : "",dt_end : ""}}]}],// experiences
	residencies : [{hospital : '',city : '',state : '',dates : {dt_start : "",dt_end : ""}}], // residency
	medschools : [{school : '',degree : '',city : '',state : '',dates : {dt_start : "",dt_end : ""}}], //medschool
	undergrads : [{school : '',degree : '',city : '',state : '',dates : {dt_start : "",dt_end : ""}}], //undergrad
	specialties : [""]
}; //template

/* handlebars */
pdone.namespace("pdone.handlebars");
pdone.handlebars.compiled = {}
pdone.handlebars.templates = function(){

 Handlebars.registerHelper("citystate", function(c,s) {
  var r="";
  switch(true){
   case c > '' && s > '':
    r = c + ', ' + s;
    break;
   case c == '' && s > '':
    r = s;
    break;
   case c > '' && s == '':
    r = c;
    break;
  }
  return r;
 });

//  pdone.handlebars.compiled['header'] = Handlebars.compile($('#profile_header_template').html());
//  pdone.handlebars.compiled['biography'] = Handlebars.compile($('#biography_template').html());

  pdone.storage.listofstates = $('#listofstates').html();
  var listofstates = Handlebars.compile($('#listofstates').html());
  Handlebars.registerPartial("listofstates", listofstates);

  var specialtyopts = Handlebars.compile(pdone.storage.specialty_options);
  Handlebars.registerPartial("specialtyopts", specialtyopts);

  var partialPos = Handlebars.compile($('#TpositionT').html());
  Handlebars.registerPartial("position", partialPos);

  pdone.handlebars.compiled["position"] = partialPos;
  pdone.handlebars.compiled["experiences"] = Handlebars.compile($('#TexperienceT').html());
  pdone.handlebars.compiled["residencies"] = Handlebars.compile($('#TresidencyT').html());
  pdone.handlebars.compiled["medschools"] = Handlebars.compile($('#TmedschoolT').html());
  pdone.handlebars.compiled["undergrads"] = Handlebars.compile($('#TundergradT').html());
  pdone.handlebars.compiled["specialties"] = Handlebars.compile($('#TspecialtyT').html());
}

pdone.namespace("pdone.page");
pdone.page.docReady = function(){

        $("div#edit_profile_content").on('click','input#saveprofilechgs',pdone.page.saveprofilechgs);
        $("div#edit_profile_content").on('click','input#cancelprofilechgs',pdone.page.cancelchanges);

	$('div#edit_profile_content').on('click','img.remove',pdone.page.rmvstuff);
	$('div#edit_profile_content').on('click','img.rmvpos',pdone.page.rmvpos);

	$('div#edit_profile_content').on('click','img.addme',function(evt){
	  if($(this).parent().parent().find('div.outer').length < 5){
		var clkd = $(this).attr('alt');
		var mystuff = pdone.page.returnHTML(clkd,pdone.profile.template);
		$(this).parent().parent().find('form.edit').append(mystuff);
//		$(this).before(mystuff);
//		$(this).parent().append(mystuff);
//                $('#'+clkd).find('form.edit').append(mystuff);
	 } else {
	    pdone.site.popup('alert','','you reached the maximum number of entries');
//          alert('you reached the maximum number of entries');
         }
	});

	$('div#edit_profile_content').on('click','img.addpos',function(evt){
          if($(this).parent().parent().find('p').length < 8){
		var clkd = $(this).attr('alt');
		var mystuff = pdone.page.returnHTML(clkd,pdone.profile.template);
//		$(this).before(mystuff);
		$(this).parent().before(mystuff);
          } else {
	    pdone.site.popup('alert', '', 'you reached the maximum number of entries');
//          alert('you reached the maximum number of entries');
         }
	});


	$('div#edit_profile_content').on('click','img.addSpc',function(){
	  if($(this).parent().parent().find('div.outer').length < 5){
		var mystuff = pdone.page.returnHTML('specialties',pdone.profile.template);
//		$(this).parent().append(mystuff);
		$(this).parent().parent().find('form.edit').append(mystuff);
 		$(this).parent().parent().find('input[type="hidden"]').remove();
//		var stuffSpcS = $(pdone.storage.specialty_options).clone();
          } else {
	    pdone.site.popup('alert', '', 'you reached the maximum number of entries');
//          alert('you reached the maximum number of entries');
         }

	});
 pdone.handlebars.compiled['specialtopts'] = Handlebars.compile($('#format_specialties').html());

 $.when(
  pdone.ajax.jsonp("specialty_processor.php", "mode=list"),
  pdone.ajax.jsonp("network_processor.php", "mode=pdone_member_lookup&requestor_id="+pdone.storage.hcp_id+"&member_id="+pdone.storage.hcp_id)
 ).then(function(specialties,profiledata){
  pdone.storage.specialty_options = pdone.handlebars.compiled['specialtopts'](specialties[0]);
  pdone.page.network(profiledata[0]);
 }).done(function(){pdone.page.whendone();});
};

pdone.page.whenthen = function(){}//this does nothing, placeholder for the function
/* save profile data */
pdone.page.network = function(profiledata){
  pdone.handlebars.templates();
 pdone.storage.memberdata = profiledata;
}

/* perform this when ajax is done */
pdone.page.whendone = function(){
/*
 var profile = {"photo_id":pdone.storage.memberdata.user.photo_id,"name":pdone.storage.memberdata.user.name,"specialty":pdone.storage.memberdata.profile.specialties[0],"position":pdone.storage.memberdata.profile.experiences[0].position[0].title,"hospital":pdone.storage.memberdata.profile.experiences[0].hospital,"city":pdone.storage.memberdata.profile.experiences[0].city,"state":pdone.storage.memberdata.profile.experiences[0].state};
 var headerhtml = pdone.handlebars.compiled['header'](profile);
 headerhtml = headerhtml.replace(/pdone.storage.data_path/g,pdone.storage.data_path);

 $('div#profile_header').append(headerhtml);
*/
 var stuff = "";
				
 stuff = pdone.handlebars.compiled['experiences'](pdone.storage.memberdata.profile);
 $('div#experiences form.edit').append(stuff);
 $('div#experiences form.edit input[type="hidden"]').each(function(i,v){
  var state_value = this.value;
  $(this).siblings('select')[0].value = this.value;
  $(this).remove();
 })
				
 stuff = pdone.handlebars.compiled['residencies'](pdone.storage.memberdata.profile);
 $('div#residencies form.edit').append(stuff);
 $('div#residencies form.edit input[type="hidden"]').each(function(i,v){
  $(this).siblings('select')[0].value = this.value;
  $(this).remove();
 })

 stuff = pdone.handlebars.compiled['medschools'](pdone.storage.memberdata.profile);
 $('div#medschools form.edit').append(stuff);
 $('div#medschools form.edit input[type="hidden"]').each(function(i,v){
  $(this).siblings('select')[0].value = this.value;
  $(this).remove();
 })

 stuff = pdone.handlebars.compiled['undergrads'](pdone.storage.memberdata.profile);
 $('div#undergrads form.edit').append(stuff);
 $('div#undergrads form.edit input[type="hidden"]').each(function(i,v){
  $(this).siblings('select')[0].value = this.value;
  $(this).remove();
 })

 stuff = pdone.handlebars.compiled['specialties'](pdone.storage.memberdata.profile);
 $('div#specialties form.edit').append(stuff);
 $('div#specialties form.edit input[type="hidden"]').each(function(i,v){
  $(this).siblings('select')[0].value = this.value;
  $(this).remove();
 })

/*
 $.each(pdone.storage.memberdata.profile.specialties,function(k,m){
  $('div#specialties form.edit select')[k].value = m;

  var stuffSpcS = $(pdone.storage.specialty_options).clone();
  stuffSpcS.find('select').val($.trim(m));
  $('div#specialties form.edit').append(stuffSpcS);

 })
*/
}
/* transform json into html using handlebars */
pdone.page.returnHTML = function(w,data){
	var r = pdone.handlebars.compiled[w](data);
	return r;
}
/* remove parent of selected item */
pdone.page.rmvstuff = function(){
//
	$(this).parent().parent().remove();
//
}
/* remove selected item */
pdone.page.rmvpos= function(){$(this).parent().remove();}

/* set empty template */
pdone.page.empty = {experiences:[],residencies:[],medschools:[],undergrads:[],specialties:[]};

/* format input fields into json object */
pdone.page.forminput = {
	 'xlen':0,'rlen':0,'mlen':0,'ulen':0,
	 "exp_hospital" : function(w){
		 pdone.page.empty['experiences'].push($.extend(true, {}, pdone.profile.template['experiences'][0]));
		 pdone.page.forminput.xlen = pdone.page.empty['experiences'].length - 1;
		 pdone.page.forminput.updother('experiences',pdone.page.forminput.xlen,'hospital',w);
		 pdone.page.empty['experiences'][pdone.page.forminput.xlen]['position'] = [];
	 },
	 "exp_city" : function(w){pdone.page.forminput.updother('experiences',pdone.page.forminput.xlen,'city',w);},
	 "exp_hide_state" : function(w){
	 },
	 "exp_state" : function(w){pdone.page.forminput.updother('experiences',pdone.page.forminput.xlen,'state',w);},
	 "exp_title" : function(w){
		 pdone.page.empty['experiences'][pdone.page.forminput.xlen]['position'].push($.extend(true, {}, pdone.profile.template['position'][0]));
		 pdone.page.forminput.updposition(pdone.page.forminput.xlen,'title',w);
	 },
	 "exp_dt_start" : function(w){pdone.page.forminput.updpositiondates(pdone.page.forminput.xlen,'dt_start',w);},
	 "exp_dt_end" : function(w){pdone.page.forminput.updpositiondates(pdone.page.forminput.xlen,'dt_end',w);},
	 "updpositiondates" : function(l,i,w){
		 pdone.page.empty["experiences"][l]['position'][pdone.page.empty['experiences'][l]['position'].length - 1]['dates'][i] = w;
	 },
	 "updposition" : function(l,i,w){
		 pdone.page.empty["experiences"][l]['position'][pdone.page.empty['experiences'][l]['position'].length - 1][i] = w;
	 },
	 "res_hospital" : function(w){
		 pdone.page.empty['residencies'].push($.extend(true, {}, pdone.profile.template['residencies'][0]));
		 pdone.page.forminput.rlen = pdone.page.empty['residencies'].length - 1;
		 pdone.page.forminput.updother('residencies',pdone.page.forminput.rlen,'hospital',w);
		 pdone.page.empty['residencies'][pdone.page.forminput.rlen]['dates'] = $.extend(true, {}, pdone.profile.template['residencies'][0]['dates']);
	 },
	 "res_city" : function(w){pdone.page.forminput.updother('residencies',pdone.page.forminput.rlen,'city',w);},
	 "res_hide_state" : function(w){
	 },
	 "res_state" : function(w){pdone.page.forminput.updother('residencies',pdone.page.forminput.rlen,'state',w);},
	 "res_dt_start" : function(w){pdone.page.forminput.updotherdates('residencies',pdone.page.forminput.rlen,'dt_start',w);},
	 "res_dt_end" : function(w){pdone.page.forminput.updotherdates('residencies',pdone.page.forminput.rlen,'dt_end',w);},
	 "med_school" : function(w){
		 pdone.page.empty['medschools'].push($.extend(true, {}, pdone.profile.template['medschools'][0]));
		 pdone.page.forminput.mlen = pdone.page.empty['medschools'].length - 1;
		 pdone.page.empty['medschools'][pdone.page.forminput.mlen]['dates'] =  $.extend(true, {}, pdone.profile.template['medschools'][0]['dates']);
		 pdone.page.forminput.updother('medschools',pdone.page.forminput.mlen,'school',w);
	 },
	 "med_city" : function(w){pdone.page.forminput.updother('medschools',pdone.page.forminput.mlen,'city',w);},
	 "med_hide_state" : function(w){
	 },
	 "med_state" : function(w){pdone.page.forminput.updother('medschools',pdone.page.forminput.mlen,'state',w);},
	 "med_dt_start" : function(w){pdone.page.forminput.updotherdates('medschools',pdone.page.forminput.mlen,'dt_start',w);},
	 "med_dt_end" : function(w){pdone.page.forminput.updotherdates('medschools',pdone.page.forminput.mlen,'dt_end',w);},
	 "med_degree" : function(w){pdone.page.forminput.updother('medschools',pdone.page.forminput.mlen,'degree',w);},
	 "ugd_school" : function(w){
		 pdone.page.empty['undergrads'].push($.extend(true, {}, pdone.profile.template['undergrads'][0]));
		 pdone.page.forminput.ulen = pdone.page.empty['undergrads'].length - 1;
		 pdone.page.empty['undergrads'][pdone.page.forminput.ulen]['dates'] =  $.extend(true, {}, pdone.profile.template['undergrads'][0]['dates']);
		 pdone.page.forminput.updother('undergrads',pdone.page.forminput.ulen,'school',w);
	 },
	 "ugd_city" : function(w){pdone.page.forminput.updother('undergrads',pdone.page.forminput.ulen,'city',w);},
	 "ugd_hide_state" : function(w){
	 },
	 "ugd_state" : function(w){pdone.page.forminput.updother('undergrads',pdone.page.forminput.ulen,'state',w);},
	 "ugd_dt_start" : function(w){pdone.page.forminput.updotherdates('undergrads',pdone.page.forminput.ulen,'dt_start',w);},
	 "ugd_dt_end" : function(w){pdone.page.forminput.updotherdates('undergrads',pdone.page.forminput.ulen,'dt_end',w);},
	 "ugd_degree" : function(w){pdone.page.forminput.updother('undergrads',pdone.page.forminput.ulen,'degree',w);},
	 "updotherdates" : function(o,l,i,w){
		 pdone.page.empty[o][l]['dates'][i] = w;
	 },
	 "updother" : function(o,l,i,w){
		 pdone.page.empty[o][l][i] = w;
	 }
 }
/* udpate profile changes when save is clicked */
pdone.page.saveprofilechgs = function(){
	$('div#specialties select').each(function(){
		var encodedata = encodeURIComponent(this.value)
		pdone.page.empty['specialties'].push(encodedata);
	})

	if (pdone.page.empty['specialties'].length == 0){pdone.page.empty['specialties'].push("");}

	delete pdone.profile.template.experiences[0].position;
	
	$('div#edit_profile_content input, div#edit_profile_content select').each(function(k,n){
//	$('div#edit_profile_content input').each(function(k,n){
                var name = this.getAttribute("name");
		if(name != null && name != 'specialty'){pdone.page.forminput[name](encodeURIComponent(this.value));}
	})
    var jsonstr = JSON.stringify(pdone.page.empty);
    pdone.site.ajax(pdone.page.changesaved, null, "network_processor.php", 'mode=set_profile&hcp_id='+pdone.storage.hcp_id+'&profile='+jsonstr);
}
/* return to profile page with cancel is clicked */
pdone.page.cancelchanges = function(){
 window.location = "/pdone/profile";
}
/* changes saved is done */
pdone.page.changesaved = function(response){
 pdone.site.popup('alert', '', 'your changes have been saved');
// alert('your changes have been saved');
 window.location = "/pdone/profile";
}