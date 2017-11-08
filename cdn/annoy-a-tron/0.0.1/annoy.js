/*
 *  annoy-a-tron
 *
 *  Used for displaying a banner
 *  reminding the user that they
 *  are on a dev/staging site.
 *
 *  Use something like this in your vhost
 *
 *  <Location />
 *      RequestHeader unset Accept-Encoding
 *      AddOutputFilterByType SUBSTITUTE text/html
 *      Substitute "s|</body>|<script src='//cdn.research.pdx.edu/annoy-a-tron/0.0.1/annoy.js'></script>$1|iq"
 *  </Location>
 *
 *  The banner will display on the top of the page. If the user clicks it, it
 *  will disappear for the next `ttl` requests, which starts off at 2, and
 *  increases expontentially. The `ttl` is decremented on every request, until
 *  it reaches 0, and is set to the next power of 2. The cookie named
 *  `hidecookie` stores the ttl and current exponent, with a comma separating
 *  the two numbers.
 */

(function(){
    // if this gets accidentally loaded multiple times, we only want to run it once
    if(typeof(ANNOY_A_TRON_LOADED) == "undefined"){
        ANNOY_A_TRON_LOADED = true;
    } else {
        return; // already loaded. Don't need to do anything
    }

    // this means at most 2^MAX_EXPONENT requests will happen before the banner displays
    // again.
    var MAX_EXPONENT = 4;

    var message = "REMINDER: This website is for testing and demonstrations only. Click me to hide."

    // this is the HTML element we inject into the page
    var element = null;

    // Hides the entire banner for the next n requests
    // (where n is an exponentially increasing number)
    function hide(){
        // if we're here, the user clicked the banner to dismiss it. We either
        // need to increment the exponent, or initialize it
        var matches = document.cookie.match(/hidecookie=(\d+),(\d+)/);
        if(matches){
            var exponent = parseInt(matches[2]) + 1;
        } else {
            var exponent = 1;
        }

        if(exponent >= MAX_EXPONENT){
            exponent = 1;
        }

        // calculate the ttl -- or the number of requests to go without displaying the banner -- and update the cookie
        var ttl = Math.pow(2, exponent)
        document.cookie = "hidecookie=" + ttl + "," + exponent + "; path=/";

        element.parentNode.removeChild(element);
    }

    // Add the banner to the page
    function annoy(){
        // and you thought this didn't exist anymore...
        element = document.createElement("marquee");
        element.style.position = "fixed";
        element.style.top = "0";
        element.style.left = "0";
        element.style.right = "0";
        element.style.zIndex = 999999;
        element.style.fontSize = "24px";
        element.style.padding = "10px";
        element.style.width = "100%";
        element.style.lineHeight = "normal";
        element.style.color = "#fff";
        element.style.fontWeight = "bold";
        element.style.fontFamily = "courier new, monospace"
        element.style.cursor = "pointer";
        element.setAttribute("scrollamount", "20")
        element.textContent = message;
        try {
            element.style.backgroundColor = "rgba(255, 105, 180, .8)"
        } catch(e){
            element.style.backgroundColor = "rgb(255, 105, 180)"
        }

        // when it is clicked, make it go away
        try {
            element.addEventListener("click", hide, false);
        } catch(e){
            element.attachEvent('click', hide);
        }

        // add it to the page
        var body = document.getElementsByTagName("body");
        if(body.length){
            body[0].appendChild(element)
        }
    }

    // check the cookie to see what to do
    var matches = document.cookie.match(/hidecookie=(\d+),(\d+)/);
    // if it isn't set at all, or the ttl has reached 0, then redisplay the banner 
    if(!matches || matches[1] == "0"){
        try {
            window.addEventListener('load', annoy, false);
        } catch(e){
            window.attachEvent('onload', annoy);
        }
    } else {
        // otherwise we decrement the counter 
        var ttl = parseInt(matches[1]) - 1;
        var exponent = parseInt(matches[2])
        document.cookie = "hidecookie=" + ttl + "," + exponent + "; path=/";
    }
})();
