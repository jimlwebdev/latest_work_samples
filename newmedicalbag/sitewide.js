/*================================
 * pdone namspace definition
 *================================*/
    if (typeof pdone == "undefined" || !pdone) var pdone = {};
	pdone.namespace = function() {var a,o;a=arguments[0].split(".");o=pdone;o[a[1]]=o[a[1]]||{};o=o[a[1]];return o;};
	
	pdone.namespace("pdone.site");
    pdone.site.docReady = function(){
	    if (window.addEventListener){ 
			window.addEventListener("online", pdone.wireless.online, false);
			window.addEventListener("offline", pdone.wireless.offline , false);
		} else if (window.attachEvent){
			document.body.attachEvent("ononline", pdone.wireless.online);
			document.body.attachEvent("onoffline", pdone.wireless.offline);
		}

	  if(pdone.storage.go_home == 'no'){
	    $('input#searchTerms').on('keypress',pdone.site.gosearch);
  	  }	
    }
    

    pdone.site.getInternetExplorerVersion = function() {
     var rv = -1; // Return value assumes failure.
     if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
     }
     return rv;
    }

    pdone.site.ajaxSetup = {"":""}
    
    pdone.site.ajax = function(performfn, params, phprocess, datatosend, datatype){
		var ajax_datatype = 'jsonp';
		if(typeof datatype != 'undefined') 
			ajax_datatype = datatype;
        $.ajax({
                   url: pdone.storage.prog_path + phprocess,
                   data:datatosend,
                   dataType:ajax_datatype,
                   timeout:10000,
                   error:function(request,error) {
                    if (error == "timeout") {
                     pdone.site.console("The request timed out, please resubmit");
                    }
                    else {
                     pdone.site.console("ERROR: " + error);
                    }
                   },
                   success:function(response) {
                    if (performfn != null){
						if (params != null){performfn(response,params);} else {performfn(response);}
					}
                   }
        });
    }


    pdone.site.jsoncallback = function(performfn, params, phprocess, datatosend, datatype){
		var ajax_datatype = 'jsonp';
		if(typeof datatype != 'undefined') 
			ajax_datatype = datatype;
        $.ajax({
                   url: pdone.storage.prog_path + phprocess,
                   jsonp: "jsoncallback",
                   data:datatosend,
                   dataType:ajax_datatype,
                   timeout:5000,
                   error:function(request,error) {
                    if (error == "timeout") {
                     pdone.site.console("The request timed out, please resubmit");
                    }
                    else {
                     pdone.site.console("ERROR: " + error);
                    }
                   },
                   success:function(response) {
                    if (performfn != null){
						if (params != null){performfn(response,params);} else {performfn(response);}
					}
                   }
        });
    }

	pdone.site.getMailStats = function(){
	 pdone.site.ajax(pdone.site.updateMailStats, null, "mail_processor.php", "mode=get_mail_stats&hcp_id="+pdone.storage.hcp_id);
	}

	pdone.site.updateMailStats = function(response){
//	 alert(response.inbox_stats.total_unread);
pdone.site.console(response.inbox_stats.total_unread)
	}
	
    pdone.site.console = function(msg){
//    	if (window.console){console.log(msg);}
    }

    pdone.site.showResultsBkup = function(){
    	location.href = 'results.php?search=' + $('#search-terms').val();
    }

    pdone.site.showResults = function(){
	var srchterms = $('#searchTerms').val()
	var encodedata = encodeURIComponent(srchterms);
    	location.href = '/pdone/search_results?phrase=' + encodedata;
    }

    pdone.site.gosearch = function(event){
    if(event.keyCode == 13){pdone.site.showResults();}
   }
	pdone.namespace("pdone.util");
    pdone.util.getURLParam = function(strParam){
         var strReturn = "";
         var queryString = window.location.search.substr(1);
         strReturn = pdone.util.findParam("&",strParam,queryString)
         return strReturn;
    }

    pdone.util.getHashVal = function(strParam){
        var strReturn = "";
        var hashpairs = location.hash.substr(1);
        strReturn = pdone.util.findParam("!",strParam,hashpairs)
        return strReturn;
    }
    pdone.util.getCookie = function(strParam){
        var strReturn = "";
        var allcookies = document.cookie;
        strReturn = pdone.util.findParam("!",strParam,allcookies)
        return strReturn;
    }
    pdone.util.findParam = function(charSplit,strParam,dataArray){
         var strReturn = "";
         var queryString = dataArray.split(charSplit);
            $.each(queryString,function(i,v){
                if (new RegExp(strParam,"i").test(v)){
                    var a = v.split("=");
   		    strReturn = a[1];
                    return false;
                }
            });
         return strReturn;
    }

    pdone.namespace("pdone.wireless");

    pdone.wireless.offline = function(){
        setTimeout(pdone.wireless.online,5000);
//        alert("No wireless connection! Check your WIFI");
    }

    pdone.wireless.online = function(){
        if (navigator.onLine == false){pdone.wireless.offline();} else {}
    }


pdone.namespace("pdone.ajax");
pdone.ajax.jsonp = function(phprocess, datatosend){
return $.ajax({    url: pdone.storage.prog_path + phprocess,
                   data:datatosend,
                   dataType:'jsonp',
                   timeout:5000,
                   error:function(request,error) {
//                    alert("ERROR: " + error);
                   },
                   success:function(response) {}});
}
