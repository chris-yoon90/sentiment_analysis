<?php
header('Access-Control-Allow-Origin: *')
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Reddit Sentiment Analyzer</title>
        <meta name="description" content="Analyze reddit sentiment concerning a search term."/>
    </head>
    <body>
        <form name="search_form" id="search_form" action="<?php echo $_SERVER['PHP_SELF'] ?>" method="get">
            <label for="search_box">Analyze reddit's sentiment about: </label>
            <input type="text" id="search_box" name="search_box"/>
            <input type="submit" id="search_button" name="search_button" value="Analyze"/>
        </form>
        <div id="post_box">
        </div>
        <script src="../workjournal/ajax/ajax/js/dojo-toolkit/dojo/dojo.js" data-dojo-config="async: true"></script>
        <script src="search.js"></script>
    </body>
</html>