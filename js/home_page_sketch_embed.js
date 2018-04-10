var sketchCollection = window.sketchCollection || {};

$(document).ready(function() {
    $('body').each(function () {
        // Swap out sketches by:
        // 1. Reassigning the sketchName here
        // 2. Adding a javascript file of the same name and the same structure,
        // but with a different sketchCode function
        var sketchName = "color_lines_sketch";

        // Test to see if the corresponding Javascript/sketch file was loaded, 
        // and then call its init.
        if (sketchCollection.hasOwnProperty(sketchName)) {
            sketchCollection[sketchName].init(this);
        }
        else {
            console.log("[home_page_sketch_embed.js] No sketch found with name: " + sketchName);
        }
    });
});

$(window).resize(function() {
    $('body').each(function () {
        var sketchName = "color_lines_sketch";

        if (sketchCollection.hasOwnProperty(sketchName)) {
            sketchCollection[sketchName].resize();
        }
        else {
            console.log("[home_page_sketch_embed.js] No sketch found with name: " + sketchName);
        }
    });
});
