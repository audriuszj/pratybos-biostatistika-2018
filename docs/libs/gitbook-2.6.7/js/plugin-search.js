gitbook.require(["gitbook","lodash","jQuery"],function(gitbook,_,$){function loadIndex(data){index=lunr(function(){this.ref("url"),this.field("title",{boost:10}),this.field("body")}),data.map(function(item){index.add({url:item[0],title:item[1],body:item[2]})})}function fetchIndex(){return $.getJSON(gitbook.state.basePath+"/search_index.json").then(loadIndex)}function search(q){if(index){var results=_.chain(index.search(q)).map(function(result){var parts=result.ref.split("#");return{path:parts[0],hash:parts[1]}}).value();return hi=0,$highlighted=0===results.length?void 0:$(".page-inner").unhighlight(hiOpts).highlight(q,hiOpts).find("span.search-highlight"),scrollToHighlighted(),toggleTOC(results.length>0),results}}function scrollToHighlighted(){if($highlighted){var n=$highlighted.length;if(0!==n){var $p=$highlighted.eq(hi),p=$p[0],rect=p.getBoundingClientRect();(rect.top<0||rect.bottom>$(window).height())&&$($(window).width()>=1240?".body-inner":".book-body").scrollTop(p.offsetTop-100),$highlighted.css("background-color",""),$p.css("background-color","orange"),setTimeout(function(){$p.css("background-color","")},2e3)}}}function toggleTOC(show){if(collapse){var toc_sub=$("ul.summary").children("li[data-level]").children("ul");if(show)return toc_sub.show();var href=window.location.pathname;href=href.substr(href.lastIndexOf("/")+1),""===href&&(href="index.html");var li=$('a[href^="'+href+location.hash+'"]').parent("li.chapter").first();toc_sub.hide().parent().has(li).children("ul").show(),li.children("ul").show()}}function createForm(value){$searchForm&&$searchForm.remove(),$searchInput&&$searchInput.remove(),$searchForm=$("<div>",{"class":"book-search",role:"search"}),$searchInput=$("<input>",{type:"search","class":"form-control",val:value,placeholder:"Type to search"}),$searchInput.appendTo($searchForm),$searchForm.prependTo(gitbook.state.$book.find(".book-summary"))}function isSearchOpen(){return gitbook.state.$book.hasClass("with-search")}function toggleSearch(_state){isSearchOpen()!==_state&&$searchInput&&(gitbook.state.$book.toggleClass("with-search",_state),isSearchOpen()?(gitbook.sidebar.toggle(!0),$searchInput.focus()):($searchInput.blur(),$searchInput.val(""),gitbook.storage.remove("keyword"),gitbook.sidebar.filter(null),$(".page-inner").unhighlight(hiOpts),toggleTOC(!1)))}function recoverSearch(){var keyword=gitbook.storage.get("keyword","");createForm(keyword),keyword.length>0&&(isSearchOpen()||toggleSearch(!0),gitbook.sidebar.filter(_.pluck(search(keyword),"path")))}var $searchInput,$searchForm,$highlighted,index=null,hi=0,hiOpts={className:"search-highlight"},collapse=!1;gitbook.events.bind("start",function(e,config){config.search!==!1&&(collapse=!config.toc||"section"===config.toc.collapse||"subsection"===config.toc.collapse,fetchIndex().then(recoverSearch),$(document).on("keyup",".book-search input",function(e){var key=e.keyCode?e.keyCode:e.which;27==key?(e.preventDefault(),toggleSearch(!1)):38==key?(0>=hi&&$highlighted&&(hi=$highlighted.length),hi--,scrollToHighlighted()):40==key&&(hi++,$highlighted&&hi>=$highlighted.length&&(hi=0),scrollToHighlighted())}).on("input",".book-search input",function(){var q=$(this).val().trim();if(0===q.length)gitbook.sidebar.filter(null),gitbook.storage.remove("keyword"),$(".page-inner").unhighlight(hiOpts),toggleTOC(!1);else{var results=search(q);gitbook.sidebar.filter(_.pluck(results,"path")),gitbook.storage.set("keyword",q)}}),gitbook.toolbar.createButton({icon:"fa fa-search",label:"Search",position:"left",onClick:toggleSearch}),gitbook.keyboard.bind(["f"],toggleSearch))})});
