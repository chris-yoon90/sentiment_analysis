require([
	"dojo/ready",
	"dojo/dom",
	"dojo/on",
	"dojo/request",
    "dojo/promise/all",
    "dojo/dom-construct",
	], function(ready, dom, on, request, all, domConstruct) {
		"use strict";

		function searchAttempt(evt) {
			evt.stopPropagation();
			evt.preventDefault();
            
            var post_box = dom.byId("post_box");

			var search_text = dom.byId("search_box").value;
            var reddit_url = 'http://www.reddit.com/r/search/search.json?&q='+search_text;
            var search_results;

            // get the search results from reddit
			request.post("proxy.php", {
                data: { url: reddit_url },
                handleAs: "json"
            }).then(function(response){
                search_results = response;
                // pass the search results to the sentiment analyzer api
                var def_array = [],
                    sentiment_text,
                    sentiment_url = 'http://text-processing.com/api/sentiment/';
                for (var post = 0; post < 9; post = post+1) {
                //for (var post in search_results.data.children) {
                    sentiment_text = search_results.data.children[post].data.selftext;
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
                        dom.byId(comment_id).innerText = search_results.data.children[index].data.selftext;
                        domConstruct.create("p",
                                            {
                                                id: label_id
                                            },
                                            post_box,
                                            pos+1
                        );
                        dom.byId(label_id).innerText = sentiment_results[index].label;
                    }
                });
            });
		}

		ready( function() {
			var search_form = dom.byId("search_form");
			on(search_form, "submit", searchAttempt);
		});
});