require(["gitbook"], function(gitbook) {
    gitbook.events.bind("start", function(e, config) {
        var waitForEl = function(selector, callback) {
            if (jQuery(selector).length) {
                callback();
            } else {
                setTimeout(function() {
                waitForEl(selector, callback);
                }, 100);
            }
        };
        waitForEl('#launcher', function() {
            var iframe = $("#launcher").contents();
            $(iframe).find("#Embed").click(function(event) {
                console.log("support chat opened")
                mixpanel.track("support-chat.opened", {});
            })
        });
    });
});