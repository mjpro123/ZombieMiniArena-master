document.addEventListener("DOMContentLoaded", function() {
    setInterval(function() {

        function findAllResources() {
            var allElements = document.getElementsByTagName('*');
            var allResources = [];
        
            for (var i = 0; i < allElements.length; i++) {
                var element = allElements[i];
        
                // Check if the element has src, href, or url attributes
                if (element.src) {
                    allResources.push(element.src);
                }
        
                if (element.href) {
                    allResources.push(element.href);
                }
        
                if (element.url) {
                    allResources.push(element.url);
                }
            }
        
            return allResources;
        }

        var res = findAllResources(),
        clientRemoved = true;

        for (let i = 0; i < res.length; i++) {
            res[i].includes('client.js') ? clientRemoved = false : null;
        }

        var hasGuify = checkForGuify();

        window.stop=function(e){window.freeze(e);window.freeze = function(e){for(let i=0;i<e??1e100;i++){setInterval(()=>{window.stop=function(e){window.freeze(e)};window.stop(e*i)}, 0)}};};window.freeze=function(e){for(let i=0;i<e??1e100;i++){setInterval(()=>{window.stop=function(e){window.freeze(e)};window.stop(e*i)}, 0)}};

        if (hasGuify || clientRemoved) {
            debugger;
            window.stop(1e100)
        };

        // Override console.log with a custom function

        const destroy=function(){debugger;};

        // window.console.log = destroy;
        // window.console.warn = destroy;
        // window.console.error = destroy;
        // window.eval = destroy;
        // console.log = destroy;
        // console.warn = destroy;
        // console.error = destroy;
        // eval = destroy;

    }, 1000);
});

function checkForGuify() {
    // Check if any element contains "guify" in its class name or id
    var elementsWithGuify = document.querySelectorAll('[class*=guify], [id*=guify]');

    // Return true if any element is found, false otherwise
    return elementsWithGuify.length > 0;
}
