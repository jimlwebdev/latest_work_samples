//	pdone.storage.prog_path = "http://tmb_rpc.qa.stg1.pdone.com/";

    pdone.namespace("pdone.repconnect");
	pdone.repconnect.brandshares = null;
	pdone.repconnect.presentations = null;
    
    pdone.namespace("pdone.handlebars");
	pdone.handlebars.hellodr = null;
	pdone.handlebars.tower = null;
	pdone.handlebars.brandshares = null;
	pdone.handlebars.addlinfo = null;
	pdone.handlebars.reprequest = null;
	pdone.handlebars.fullisi = null;
	pdone.handlebars.coverisi = null;
	pdone.handlebars.maincompanylogos = null;
	pdone.handlebars.footer = null;


/*
 compile handlebars for later use
*/
	pdone.handlebars.compiler = function(){
		var hellodr = $('#tmplt_hellodr').html();
		pdone.handlebars.hellodr = Handlebars.compile(hellodr);

		var tower = $('#tmplt_tower').html();
		pdone.handlebars.tower = Handlebars.compile(tower);

		var maincompanylogos = $('#tmplt_main_company_logos').html();
		pdone.handlebars.maincompanylogos = Handlebars.compile(maincompanylogos);

		var brandshares = $('#tmplt_brandshares').html();
		pdone.handlebars.brandshares = Handlebars.compile(brandshares);

		var presentations = $('#tmplt_presentations').html();
		pdone.handlebars.presentations = Handlebars.compile(presentations);

		var addlinfo = $('#tmplt_addlinfo').html();
		pdone.handlebars.addlinfo = Handlebars.compile(addlinfo);

		var reprequest = $('#tmplt_reprequest').html();
		pdone.handlebars.reprequest = Handlebars.compile(reprequest);

		var fullisi= $('#tmplt_fullisi').html();
		pdone.handlebars.fullisi = Handlebars.compile(fullisi);

		var coverisi= $('#tmplt_coverisi').html();
		pdone.handlebars.coverisi = Handlebars.compile(coverisi);

		var footer= $('#tmplt_footer').html();
		pdone.handlebars.footer = Handlebars.compile(footer);

		return null;
	}


/*

*/
	pdone.namespace("pdone.page");
	pdone.page.docReady = function(){
		 $('#main_hcp_name span').html(pdone.storage.name);

		 $('main div#rightside').on('click','#contactrep',function(){
			$('.popup_overlay').show();
			$('#email_overlay').show();
		 });

		 $('#email_overlay').on('click', 'button',function(){
			if(this.id == 'btn_send'){pdone.jqwhen.single('reprequest');} else {pdone.jqdone.reprequest();}

		 });
/*		 
		 if (Modernizr.video) {
		   var videohtml = $('<video>',{'width':'320','height':'220','controls':''}).html($('<source>',{'src':'/media/intro.mp4','type':'video/mp4'}));
		   $('#showvideo').html(videohtml);
		 } else {
		  swfobject.embedSWF("/media/intro.swf", "showvideo", "320px", "220px", "9");
		 }
*/		
		pdone.jqwhen.multiple('brandshares');

	}

/*
 add window scroll to control ISI
*/
	pdone.page.isiReady = function(){
	 $(window).on('scroll',function() {
	  if($('.hidecoverisi').is(":within-viewport")) {
	  	$('div#coverISI').hide();
	  } else {
	  	$('div#coverISI').show();
	  }
	 });
	}

	//scrolls the user to the ISI part of the page
	pdone.page.expandISI = function() {
		pdone.page.scrollToElement('footer .isi');
	}

	//function to scroll to a specific element within the DOM
	pdone.page.scrollToElement = function(selector, time, verticalOffset) {
	    time = typeof(time) != 'undefined' ? time : 1000;
	    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
	    element = $(selector);
	    offset = element.offset();
	    offsetTop = offset.top + verticalOffset;
	    $('html, body').animate({
        	scrollTop: offsetTop
	    }, time);
	}

/*
 standard ajax call used with $.when
*/
	pdone.namespace("pdone.ajax");
	pdone.ajax.getjson = function(phprocess,datatosend){
	        return $.ajax({
	         url: phprocess,
        	 data:datatosend,
	         dataType:'jsonp',
        	 timeout:5000,
	         success:function(response){
        	 },
	         error:function(request,error){}});
    	}

/*
 initalize processors
*/
    pdone.namespace("pdone.processor");
    pdone.processor.ajaxurl = "company_brand_processor.php";
    pdone.processor.mailurl = "mail_processor.php";

/*
 set up $.when for single & multiple calls
*/

    pdone.namespace("pdone.jqwhen");
    pdone.jqwhen.single = function(what){
	$.when(
		pdone.jqwhen[what]()
        ).done(function(results, textStatus, jqXHR){pdone.jqdone[what](results);}
        ).fail(function(request,error){}
    	);
    }
    
    pdone.jqwhen.multiple = function(what){
	$.when(
		pdone.handlebars.compiler(),
		pdone.jqwhen[what]()
       	 ).then(
        	function(compile, results){
        	    pdone.jqdone.compile(compile);
	            pdone.jqdone[what](results);
	       	},
        	function(request,error){pdone.jqfail.common(request,error);}
	);
    }
        
/*
 set up specific when
*/
	pdone.jqwhen.reprequest = function(){
		var reprequest = $('form#form_reprequest').serialize();
		alert(reprequest);
   	 }
        
	pdone.jqwhen.mailprocess = function(){
		var params = "mode=get_mail_stats&hcp_id="+pdone.storage.hcp_id;
		return pdone.ajax.jsonp(pdone.processor.mailurl,params);
	}
        
	pdone.jqwhen.presentations = function(){
		var length = pdone.repconnect.presentations.length-1;
		var presentations = pdone.repconnect.presentations.substr(0,length);
		var params = "mode=tag_shares_displayed&id="+presentations;
		return pdone.ajax.jsonp(pdone.processor.ajaxurl,params);
	}
        
	pdone.jqwhen.brandshares = function(){
		var params = "mode=get_brand_shares&hcp_id="+pdone.storage.hcp_id+"&brand_id="+pdone.storage.brand_id;
		return pdone.ajax.jsonp(pdone.processor.ajaxurl,params);
	}


/*
 set up done 
*/
	pdone.namespace("pdone.jqdone");
	pdone.jqdone.compile = function(what){
	}
	
	pdone.jqdone.brandshares = function(results){
		pdone.repconnect.brandshares = results[0];
		var lastrep = pdone.repconnect.brandshares.reps.length - 1;
		$('span.rep_name').html(pdone.repconnect.brandshares.reps[lastrep].alias);

		var hellodr = pdone.handlebars.hellodr(pdone.repconnect.brandshares);
		$('div#leftside').html(hellodr);

		var tower = pdone.handlebars.tower(pdone.repconnect.brandshares);
		$('div#rightside').html(tower);

		var maincompanylogos = pdone.handlebars.maincompanylogos(pdone.repconnect.brandshares);
		$('div#main_company_logos').append(maincompanylogos);

		var brandshares = pdone.handlebars.brandshares(pdone.repconnect.brandshares);
		$('div#leftside').append(brandshares);

		var addlinfo = pdone.handlebars.addlinfo(pdone.repconnect.brandshares);
		$('section#addlinfo').append(addlinfo);

		var reprequest = pdone.handlebars.reprequest(pdone.repconnect.brandshares);
		$('div#email_overlay_content').html(reprequest);

		var fullisi= pdone.handlebars.fullisi(pdone.repconnect.brandshares);
		$('div#fullISI').html(fullisi);

		var coverisi = pdone.handlebars.coverisi(pdone.repconnect.brandshares);
		$('div#coverISI').append(coverisi);

		var footer = pdone.handlebars.footer(pdone.repconnect.brandshares);
		$('div#brand_footer').append(footer);

		pdone.repconnect.presentations = pdone.handlebars.presentations(pdone.repconnect.brandshares);

		pdone.jqwhen.single('presentations');
	}

	pdone.jqdone.mailprocess = function(results){
		if (results.inbox_stats !=""){
			var rep_unread = results.inbox_stats.rep_unread
			if(rep_unread > 0){$('#main_rep_msg_ctr').show();} else {$('#main_rep_msg_ctr').hide();}
			$('#main_rep_msg_ctr').html(rep_unread);
		}
	}

	pdone.jqdone.presentations = function(){
		pdone.jqwhen.single('mailprocess');

		$('body#rep_connect main div.new_to_tmb_yes').animate({backgroundColor:'transparent'},1000,function(){});
//		$('body#rep_connect main div#pdone_msg').show();

		$('body#rep_connect').on('click','img#close_msg',function(){$('div#pdone_msg').hide(1000);});

		pdone.page.isiReady();
	}
		
	pdone.jqdone.reprequest = function(){
		$('.popup_overlay').hide();
		$('#email_overlay').hide();
   	 }

/*
 set up fail
*/

	pdone.namespace("pdone.jqfail");
	pdone.jqfail.common = function(request,error){alert(error);}