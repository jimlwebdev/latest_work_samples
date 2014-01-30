	if (typeof blog == "undefined" || !blog) var blog = {};
	blog.namespace = function() {var a,o;a=arguments[0].split(".");o=blog;o[a[1]]=o[a[1]]||{};o=o[a[1]];return o;};

	blog.namespace("blog.sitewide");	
	blog.sitewide.docReady = function(){	
        }

	blog.namespace("blog.topnav");
	blog.topnav.findlink = function(currlink){
         $.each($("div.topnav a"),function(){
          if(this.innerHTML.indexOf(currlink) > -1){
             $(this).addClass('current');
          }
         });
         blog.namespace("blog.animated");
  	 blog.topnav.long = {'src':"/images/site/240x400.swf",'width':'240px','height':'400px'};
  	 blog.topnav.short = {'src':"/images/site/180x150.swf",'width':'180px','height':'150px'};
	}

	blog.namespace("blog.page");
	blog.page.linkredirect = function(){
	 $("div.sources a").click(function() {
	    link_host = this.href.split("/")[2];
	    document_host = document.location.href.split("/")[2];

	    if (link_host != document_host) {
	      window.open(this.href);
	      return false;
	    }
	 });
	}
			blog.namespace("blog.hashtag");
			blog.hashtag.findparam = function(param){
			 var hashpairs = location.hash.substr(1).split('!');
			 var i=-1,z=hashpairs.length;
			 var returnval = "";
 			 if (location.hash != ''){
	          for(;(i++)<z-1;){
               if (hashpairs[i].indexOf(param) > -1){
                returnval = hashpairs[i];
               }
              }
             }
             return returnval;
			}
			
			blog.hashtag.getvalue = function(param){
			 return blog.hashtag.findparam(param).split('=')[1];
			}