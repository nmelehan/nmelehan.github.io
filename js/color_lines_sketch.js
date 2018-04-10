//
// Utility code for loading and managing sketch
//

var sketchCollection = window.sketchCollection || {};

sketchCollection["color_lines_sketch"] = {
    sketchName : "color_lines_sketch",

    init : function(parentElement) {
        this.parentElement = parentElement;
        this.canvas = $("<canvas class='backgroundsketch'></div>").prependTo(parentElement)[0];

        this.processingInstance = new Processing(this.canvas, this.sketchCode);
        this.setSketchSize();

        this.initComplete = true;
    },

    setSketchSize : function() {
        var newWidth = $(document).width();
        var newHeight = $(document).height();

        console.log("width " + newWidth + ", height" + newHeight);

        this.processingInstance.size(newWidth*window.devicePixelRatio, newHeight*window.devicePixelRatio);

        $(this.canvas).width(newWidth);
        $(this.canvas).height(newHeight);
    },

    resize : function() {
        // save image data so it can be applied to context after resize
        var sketchCanvasContext = this.canvas.getContext("2d");
        var oldWidth = this.canvas.width;
        var oldHeight = this.canvas.height;
        var imageData = sketchCanvasContext.getImageData(0, 0, oldWidth, oldHeight);

        this.setSketchSize();
        this.processingInstance.sketchResized();

        // apply saved image data
        var newWidth = this.canvas.width;
        var newHeight = this.canvas.height;

        var imageDataX = (newWidth - oldWidth)/2;
        var imageDataY = (newHeight - oldHeight)/2;
        sketchCanvasContext.putImageData(imageData, imageDataX, imageDataY);
    },

    //
    // Processing code for sketch
    //

    sketchCode :

    function(processing) {
        var Point = (function() {
            function Point() {
                var $this_1 = this;

                function $superCstr() {
                    processing.extendClassChain($this_1)
                }
                $this_1._x = 0;
                $this_1._y = 0;

                function x$0() {
                    return $this_1._x;
                }
                processing.addMethod($this_1, 'x', x$0, false);

                function x$1_2(anX) {
                    $this_1._x = anX;
                }
                processing.addMethod($this_1, 'x', x$1_2, false);

                function y$0() {
                    return $this_1._y;
                }
                processing.addMethod($this_1, 'y', y$0, false);

                function y$1_2(aY) {
                    $this_1._y = aY;
                }
                processing.addMethod($this_1, 'y', y$1_2, false);

                function $constr_2(anX, aY) {
                    $superCstr();

                    $this_1._x = anX;
                    $this_1._y = aY;
                }

                function $constr() {
                    if (arguments.length === 2) {
                        $constr_2.apply($this_1, arguments);
                    } else $superCstr();
                }
                $constr.apply(null, arguments);
            }
            return Point;
        })();
        processing.Point = Point;
        var ColorPoint = (function() {
            function ColorPoint() {
                var $this_1 = this;

                function $superCstr() {
                    processing.extendClassChain($this_1)
                }
                $this_1._point = null;
                $this_1._color = 0x00000000;

                function point$0() {
                    return $this_1._point;
                }
                processing.addMethod($this_1, 'point', point$0, false);

                function point$1_2(aPoint) {
                    $this_1._point = aPoint;
                }
                processing.addMethod($this_1, 'point', point$1_2, false);

                function hue$0() {
                    return $this_1._color;
                }
                processing.addMethod($this_1, 'hue', hue$0, false);

                function hue$1_2(aColor) {
                    $this_1._color = aColor;
                }
                processing.addMethod($this_1, 'hue', hue$1_2, false);

                function $constr_2(aPoint, aColor) {
                    $superCstr();

                    $this_1._point = aPoint;
                    $this_1._color = aColor;
                }

                function $constr() {
                    if (arguments.length === 2) {
                        $constr_2.apply($this_1, arguments);
                    } else $superCstr();
                }
                $constr.apply(null, arguments);
            }
            return ColorPoint;
        })();
        processing.ColorPoint = ColorPoint;
        var Crawler = (function() {
            function Crawler() {
                var $this_1 = this;

                function $superCstr() {
                    processing.extendClassChain($this_1)
                }
                $this_1._colorPoint = null;
                $this_1._direction = 0;

                function colorPoint$0() {
                    return $this_1._colorPoint;
                }
                processing.addMethod($this_1, 'colorPoint', colorPoint$0, false);

                function colorPoint$1_2(aColorPoint) {
                    $this_1._colorPoint = aColorPoint;
                }
                processing.addMethod($this_1, 'colorPoint', colorPoint$1_2, false);

                function direction$0() {
                    return $this_1._direction;
                }
                processing.addMethod($this_1, 'direction', direction$0, false);

                function direction$1_2(aDirection) {
                    $this_1._direction = aDirection;
                }
                processing.addMethod($this_1, 'direction', direction$1_2, false);

                function $constr_2(aColorPoint, aDirection) {
                    $superCstr();

                    $this_1._colorPoint = aColorPoint;
                    $this_1._direction = aDirection;
                }

                function $constr() {
                    if (arguments.length === 2) {
                        $constr_2.apply($this_1, arguments);
                    } else $superCstr();
                }
                $constr.apply(null, arguments);
            }
            return Crawler;
        })();
        processing.Crawler = Crawler;

        var crawlers = null;
        var colors = null;

        function setup() {
            //processing.size(800, 800);
            processing.background(255);

            crawlers = new processing.ArrayList();
            colors = [processing.color(0xFFDE2C32), processing.color(0xFF009FC1), processing.color(0xFF40908D), processing.color(0xFFE66028), processing.color(0xFFFCF396)];
        }
        processing.setup = setup;
        setup = setup.bind(processing);

        function draw() {
            if (processing.frameCount % 50 == 0) {
                var aPoint = new Point(processing.random(processing.width), processing.random(processing.height / 4, 3 * processing.height / 4));
                var aColorPoint = new ColorPoint(aPoint, colors[processing.__int_cast(processing.random(colors.length))]);

                crawlers.add(new Crawler(aColorPoint, processing.random(processing.TWO_PI)));
            }

            for (var $it0 = new processing.ObjectIterator(crawlers), crawler = void(0); $it0.hasNext() && ((crawler = $it0.next()) || true);) {
                if (processing.random(1) > .95) {
                    crawler.direction(processing.random(processing.TWO_PI));
                }

                processing.pushMatrix();

                var theColorPoint = crawler.colorPoint();
                var thePoint = theColorPoint.point();
                var theColor = theColorPoint.hue();
                processing.translate(thePoint.x(), thePoint.y());
                processing.rotate(crawler.direction());
                processing.translate(1, 0);
                processing.ellipseMode(processing.CENTER);
                processing.fill(theColor);
                processing.noStroke();
                processing.ellipse(0, 0, 2, 2);

                var newX = thePoint.x() + processing.cos(crawler.direction());
                var newY = thePoint.y() + processing.sin(crawler.direction());
                thePoint.x(newX);
                thePoint.y(newY);

                processing.popMatrix();
            }
        }
        processing.draw = draw;
        draw = draw.bind(processing);
    } // end -- sketchCode() declaration

}; // end -- sketchCollection["color_lines_sketch"] declaration
