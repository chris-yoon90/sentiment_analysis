require([
	"dojo/ready",
	"dojo/dom",
	"dojo/on",
	"dojo/request",
    "dojo/promise/all",
    "dojo/dom-construct",
	"dojo/dom-form"
	], function(ready, dom, on, request, all, domConstruct, domForm) {
		"use strict";

		function searchAttempt(evt) {
			evt.stopPropagation();
			evt.preventDefault();
			
			//Convert HTML form to JavaScript object
			var formObject = domForm.toObject("search_form");
			
            var post_box = dom.byId("post_box");
			//Clear inner text of post_box element
			post_box.innerText = "";
			
			var search_text = formObject.search_box;
            search_text = search_text.replace(/ /g,"+");
			var url;
			//if search_type is reddit, then use Reddit API. Else use Twitter API
			if(formObject.search_type === "reddit") {
				url = 'http://www.reddit.com/r/search/search.json?&q='+search_text;
			} else {
				url = 'http://search.twitter.com/search.json?q='+search_text;
			}
			
            var search_results;

            // get the search results from reddit
			request.post("proxy.php", {
                data: { url: url },
                handleAs: "json"
            }).then(function(response){
                search_results = response;
                // pass the search results to the sentiment analyzer api
                var def_array = [],
                    sentiment_text,
                    sentiment_url = 'http://text-processing.com/api/sentiment/';
                for (var post = 0; post < 9; post = post+1) {
                //for (var post in search_results.data.children) {
					//if search_type is reddit, then use Reddit API. Else use Twitter API
					if(formObject.search_type === "reddit") {
						sentiment_text = search_results.data.children[post].data.selftext;
					} else {
						sentiment_text = search_results.results[post].text;
					}
						
                    def_array[post] = request.post("proxy_post.php", {
                        data: {
                            url: sentiment_url,
                            text: sentiment_text
                        },
                        handleAs: "json"
                    });
                }
                // look at the results
                all(def_array).then(function(response) {
                    var sentiment_results = response;
                    var pos, comment_id, label_id;
                    for (var index = 0; index < 9; index = index + 1) {
                        console.log(sentiment_results[index].label);
                        pos = index * 2;
                        comment_id = "comment[" + index + "]";
                        label_id = "label[" + index + "]";
                        domConstruct.create("p",
                                            {
                                                id: comment_id
                                            },
                                            post_box,
                                            pos
                        );
						
						//if search_type is reddit, then use Reddit API. Else use Twitter API
						if(formObject.search_type === "reddit") {
							dom.byId(comment_id).innerText = search_results.data.children[index].data.selftext;
						} else {
							dom.byId(comment_id).innerText = search_results.results[index].text;
						}
                        
                        var label_class;
						var label;
						if(sentiment_results[index].label === "neg") {
							label_class = "alert alert-error";
							label = "NEGATIVE";
						}
						if(sentiment_results[index].label === "pos") {
							label_class = "alert alert-success";
							label = "POSITIVE";
						}
						if(sentiment_results[index].label === "neutral") {
							label_class = "alert alert-info";
							label = "NEUTRAL";
						}
						domConstruct.create("div",
                                            {
                                                id: label_id,
												className: label_class,
												innerHTML: label
                                            },
                                            post_box,
                                            pos+1
                        );

                    }
					domConstruct.create("h2",
						{
							innerHTML: "Results:"
						},
						post_box,
						"first"
					);
                });
            });
		}

		ready( function() {
			var search_form = dom.byId("search_form");
			on(search_form, "submit", searchAttempt);
		});
});