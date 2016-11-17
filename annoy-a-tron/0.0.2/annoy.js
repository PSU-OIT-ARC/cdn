/**
 *  annoy-a-tron
 *
 *  Used for displaying a banner reminding the user that they are on
 *  a staging/test site.
 *
 *  Use something like this in your vhost:
 *
 *  <Location />
 *      RequestHeader unset Accept-Encoding
 *      AddOutputFilterByType SUBSTITUTE text/html
 *      Substitute "s|</body>|<script src='//cdn.research.pdx.edu/annoy-a-tron/0.0.2/annoy.js'></script>$1|iq"
 *  </Location>
 *
 *  The banner will display on the top of the page. If the user clicks
 *  it, it will disappear for the next `N` requests, which starts off at
 *  2, and increases expontentially. `N` is decremented on every
 *  request, until it reaches 0, and is set to the next power of
 *  2. The cookie named `hidecookie` stores `N` and the current
 *     exponent, with a comma separating the two numbers.
 */
(function (global) {
    // This allows a site/app to opt out when this script is injected
    // into the page via Apache (as we do for all stage sites running
    // via httpdmulti on merope and sterope).
    if (global.ANNOY_A_TRON_DISABLED) {
        return;
    }

    // Ensure this is only loaded/run once.
    // XXX: Not sure why this is necessary.
    if (global.ANNOY_A_TRON_LOADED) {
        return;
    } else {
        global.ANNOY_A_TRON_LOADED = true;
    }

    // This means at most 2^MAX_EXPONENT requests will happen before the
    // banner displays again.
    var MAX_EXPONENT = 4;

    var message = [
        '<div>REMINDER: This website is for testing and demonstrations only.</div>',
        '<a href title="Hide banner" style="color: white; text-decoration: underline;">&times; Hide</a>'
    ].join('');

    // this is the HTML element we inject into the page
    var element = null;

    // Hides the entire banner for the next N requests (where N is an
    // exponentially increasing number)
    function hide () {
        // If we're here, the user clicked the banner to dismiss it. We
        // either need to increment the exponent, or initialize it
        var hasCookie = document.cookie.match(/hidecookie=(\d+),(\d+)/);
        var N;
        var exponent;

        if (hasCookie) {
            exponent = parseInt(hasCookie[2], 10) + 1;
        } else {
            exponent = 1;
        }

        if (exponent >= MAX_EXPONENT){
            exponent = 1;
        }

        // Calculate the number of requests to go without displaying
        // the banner and update the cookie.
        N = Math.pow(2, exponent)
        document.cookie = 'hidecookie=' + N + ',' + exponent + '; path=/';

        element.parentNode.removeChild(element);
    }

    // Add banner to page.
    function annoy () {
        element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.right = '0';
        element.style.zIndex = 999999;
        element.style.fontSize = '32px';
        element.style.padding = '16px';
        element.style.lineHeight = 'normal';
        element.style.color = '#ffffff';
        element.style.fontWeight = 'bold';
        element.style.fontFamily = 'courier new, monospace'
        element.style.cursor = 'pointer';
        element.style.backgroundColor = 'rgb(255, 105, 180)';
        element.style.boxShadow = '4px 4px 10px';
        element.style.textAlign = 'center';
        element.innerHTML = message;

        // Hide banner when clicked.
        try {
            element.addEventListener('click', hide, false);
        } catch(e){
            element.attachEvent('click', hide);
        }

        document.body.appendChild(element)
    }

    // Check the cookie to see what to do.
    var hasCookie = document.cookie.match(/hidecookie=(\d+),(\d+)/);

    // If the cookie isn't set or N is 0, redisplay the banner.
    if (!hasCookie || hasCookie[1] == '0') {
        try {
            window.addEventListener('load', annoy, false);
        } catch(e){
            window.attachEvent('onload', annoy);
        }
    } else {
        // Otherwise, decrement the counter.
        var N = parseInt(hasCookie[1], 10) - 1;
        var exponent = parseInt(hasCookie[2], 10)
        document.cookie = 'hidecookie=' + N + ',' + exponent + '; path=/';
    }
})(this);
