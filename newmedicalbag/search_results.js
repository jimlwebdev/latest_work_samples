/* handlebars */
pdone.namespace("pdone.handlebars");
pdone.handlebars.compiled = {};

/* variables to save search results */
pdone.namespace("pdone.search");
pdone.search.page = {"people":{"curr":0,"last":0},"groups":{"curr":0,"last":0},"news":{"curr":0,"last":0}};
pdone.search.data = {"people":{},"groups":{},"news":{}};
pdone.search.phrase = "";
pdone.search.filter = "";

pdone.namespace("pdone.page");
pdone.page.docReady = function(){
 pdone.search.phrase = pdone.util.getURLParam('phrase');
 $('#search_page_input').val(decodeURIComponent(pdone.search.phrase));
 var filter = pdone.util.getURLParam('filter')
 pdone.search.filter = (filter!="")?filter:"people";
 pdone.search.decode = {"people":"people","groups":"forums","news":"news"}
/*
 var filter = pdone.util.getURLParam('filter');
 pdone.search.filter = pdone.search.decode[filter];

*/


 $('form#filter_form input').each(function(i,v){
  if(this.value == pdone.search.filter){
   this.checked = true;
  }
 });

 $('form#filter_form input[type="radio"]').on('click',pdone.page.filterclk);

 $('div.pages').on('click','span',pdone.page.filterpage);

 $('input#search_page_input').on('keypress',pdone.page.enterbtn);

 $('img#search_page_action').on('click',pdone.page.searchinput);

 pdone.page.searchphrase();
}
/* enter button was pressed when search box is in focus */
pdone.page.enterbtn = function(event){
 if(event.keyCode == 13){pdone.page.searchinput();}
}
/* save and process user's search phrase */
pdone.page.searchinput = function(){
 pdone.search.phrase = $('input#search_page_input').val();
 pdone.page.searchphrase();
}
/* get results for user's search phrase */
pdone.page.searchphrase = function(){
var encodedata = encodeURIComponent(pdone.search.phrase);
var data = "mode=SEARCH&page=0&phrase=" + encodedata + "&page_length=10&type=";

 $.when(
  pdone.page.compile(),
  pdone.page.filtersrch(data+"people"),
  pdone.page.filtersrch(data+"groups"),
  pdone.page.filtersrch(data+"news")
 ).then(
  function(compile,results_people,results_forums,results_news){
   pdone.page.donothing(compile);
   pdone.page.whenthen(results_people[0],"people");
   pdone.page.whenthen(results_forums[0],"groups");
   pdone.page.whenthen(results_news[0],"news");
  }
 ).fail(
  function(){pdone.page.whenfail();}
 ).done(
  function(){
   pdone.page.whendone('people');
   pdone.page.whendone('groups');
   pdone.page.whendone('news');
  }
 );

 var where = $('form#filter_form input:checked').val();
 $('div#'+where+'_search').show();

}

pdone.page.donothing = function(){}

pdone.page.whenfail = function(){
// alert('failed');
};
/* process data for user's search phrase */
pdone.page.whenthen = function(response,filter){
 pdone.search.data[filter] = response;
 var label = "label[for='filter_"+filter+"'] span"
 $(label).html('('+response.total_hits+')');
 pdone.search.page[filter].last = Math.floor(response.total_hits/response.page_length);
 if (response.total_hits%response.page_length == 0){pdone.search.page[filter].last--;}
 if(pdone.search.filter == filter){pdone.page.countrecords(filter);}
};
/* complete process for search results */
pdone.page.whendone = function(clkd){
 var where = 'div#'+clkd+'_search';
 if(pdone.search.data[clkd].total_hits > 0){
  var stuff = pdone.handlebars.compiled[clkd](pdone.search.data[clkd].results);
  var html = stuff.replace(/pdone.storage.data_path/g,pdone.storage.data_path)
  $(where).html(html);
 } else {
  var html = $('#search_results_none').html();
  $(where).html(html);
  var decode =  pdone.search.decode[clkd];
  $(where).find('span.search_filter_none').html(decode);
  $(where).find('span.search_phrase_none').html($('#search_page_input').val());
  $(where).find('div.hide').show();
 }
}
/* this is not used, save for reference */
pdone.page.whendone_three = function(){
 var stuff = pdone.handlebars.compiled['people'](pdone.search.data['people'].results);
 var html = stuff.replace(/pdone.storage.data_path/g,pdone.storage.data_path)
 $('div#search_results_html').html(html);

 var stuff = pdone.handlebars.compiled['news'](pdone.search.data['news'].results);
 var html = stuff.replace(/pdone.storage.data_path/g,pdone.storage.data_path)
 $('div#search_results_html').append(html);

 var stuff = pdone.handlebars.compiled['groups'](pdone.search.data['groups'].results);
 var html = stuff.replace(/pdone.storage.data_path/g,pdone.storage.data_path)
 $('div#search_results_html').append(html);
 // alert('done');

};
/* user clicked filter, save selection and process data */
pdone.page.filterclk = function(event){
 var clkd = event.target.value;

 $("div#search_results_html div[id$='_search']").hide();
 var where = 'div#'+clkd+'_search';
 $(where).show();
 pdone.page.countrecords(clkd);

// pdone.page.filterfetch(clkd);
};
/* count search results and begin pagnination */
pdone.page.countrecords = function(filter){

  var totalhits = pdone.search.data[filter].total_hits;

  if(totalhits > 10){
   var pagei = parseInt(pdone.search.data[filter].page,10);
   var pagelen = parseInt(pdone.search.data[filter].page_length,10);

   var bottom = (pagei==0)?1:(pagelen*pagei)+1;
   var top = (pagelen*(pagei+1)>totalhits)?totalhits:pagelen*(pagei+1);

   var displaycount = "displaying results " + bottom + " through " + top + " out of " + totalhits;
   $('span.displaycount').html(displaycount);

   $('div.pages').show();

  } else {$('div.pages').hide();}
 window.scrollTo(0,0);
};
/* determine pagination click event */
pdone.page.filterpage = function(event){
 var filter = $('form#filter_form input:checked').val();
 var clkd = event.target.className;

 var chg = pdone.search.page[filter].curr;

 switch(clkd){
  case 'first_link':
   chg = 0;
   break;
  case 'previous_link':
   chg = pdone.search.page[filter].curr - 1;
   break;
  case 'next_link':
   chg = pdone.search.page[filter].curr + 1;
   break;
  case 'last_link':
   chg = pdone.search.page[filter].last;
   break;
 }

 switch(true){
  case chg < 0:
   chg = 0;
   break;
  case chg > pdone.search.page[filter].last:
   chg = pdone.search.page[filter].last;
   break;
 }

 if(chg != pdone.search.page[filter].curr){
  pdone.search.page[filter].curr = chg;
  pdone.page.filterfetch(filter);
 }
}
/* start process to fetch data for search phrase */
pdone.page.filterfetch = function(clkd){
 var encodedata = encodeURIComponent(pdone.search.phrase);
 var data = "mode=SEARCH&page="+pdone.search.page[clkd].curr+"&phrase=" + encodedata + "&page_length=10&type=";

 $.when(
  pdone.page.filtersrch(data+clkd)
 ).then(
  function(results){pdone.page.whenthen(results,clkd);}
 ).fail(
  function(){pdone.page.whenfail();}
 ).done(
  function(){
   pdone.page.whendone(clkd);
   pdone.page.countrecords(clkd);
  }
 );
/*
 $("div#search_results_html div[id$='_search']").hide();
 var where = 'div#'+clkd+'_search';
 $(where).show();
*/
}
/* fetch data for search phrase */
pdone.page.filtersrch = function(filter){
  return pdone.ajax.jsonp("search_processor.php", filter);
}
/* build handlebar helpers to format data */
pdone.page.compile = function(){
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

 Handlebars.registerHelper("credentials", function(c) {
  var r="";
  if (c > ''){
   r = ', ' + c;
  }
  return r;
 });

 Handlebars.registerHelper("plural", function(c,w) {
  var r= c + ' ' + w;
  if (c != 1){
   r = r + 's';
  }
  return r;
 });

 var templateList = 'people,groups,news'.split(',');
 var stuff = '';
 $.each(templateList,function(i,v){
  stuff = $('#search_results_'+v).html();
  pdone.handlebars.compiled[v] = Handlebars.compile(stuff);
 });
 return null;
}