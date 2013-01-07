<?php
header('Access-Control-Allow-Origin: *')
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Reddit Sentiment Analyzer</title>
        <meta name="description" content="Analyze reddit sentiment concerning a search term."/>
		<link href="Libraries/bootstrap/css/bootstrap.css" type="text/css" rel="stylesheet" />
    </head>
    <body>
		<div class="row-fluid">
			<form name="search_form" id="search_form" class="form-horizontal" action="<?php echo $_SERVER['PHP_SELF'] ?>" method="get">

					<label for="search_box">Analyze sentiment about: </label>
					<div class="input-append">
						<input class="span12" type="text" id="search_box" name="search_box" placeholder="search"/>
						<button class="btn" type="submit" id="search_button" name="search_button">Analyze</button>
					</div>

				<div class="control-group">
					<label class="radio inline" for="reddit_radio">
						<input type="radio" name="search_type" id="reddit_radio" value="reddit" checked/>
						Reddit
					</label>
					<label class="radio inline" for="twitter_radio">
						<input type="radio" name="search_type" id="twitter_radio" value="Twitter"/>
						Twitter
					</label>
				</div>
			</form>
		</div>
		<div class="row-fluid">
			<div id="post_box">
			</div>
		</div>
		
        <script src="Libraries/dojo/dojo.js" data-dojo-config="async: true"></script>
        <script src="search.js"></script>
    </body>
</html>