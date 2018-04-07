var sketchCollection = window.sketchCollection || {};

$(document).ready(function() {
    $('body').each(function () {
        // Each sketch is named in correspondence
        // with the gallery image's title, which Squarespace
        // assigns as the alt attribute of the image element
        var sketchName = "color_lines_sketch";

        // Test to see if there is a corresponding
        // processing sketch for the gallery image
        if (sketchCollection.hasOwnProperty(sketchName)) {
            sketchCollection[sketchName].init(this);
        }
        else {
            console.log("[cover_page_sketch_embed.js] No sketch found with name: " + sketchName);
        }
    });
});

$(window).resize(function() {
    console.log("Hello!");
    $('body').each(function () {
        var sketchName = "color_lines_sketch";

        if (sketchCollection.hasOwnProperty(sketchName)) {
            sketchCollection[sketchName].resize();
        }
        else {
            console.log("[cover_page_sketch_embed.js] No sketch found with name: " + sketchName);
        }
    });
});
