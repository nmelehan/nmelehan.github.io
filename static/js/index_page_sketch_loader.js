var sketchGrid;


function centerOfAvatar() {
    var centerOfAvatar = $("#avatar").offset();
    centerOfAvatar.left += $("#avatar").width()/2;
    centerOfAvatar.top += $("#avatar").height()/2;
    return centerOfAvatar;
}

function colorsForCell(grid, row, cellInRow) {
    var lerpColorPercentage = row/grid.numberOfRows;
    var lightYellow = color('#FEFBEE');
    var silverBlue = color('#9AB4B7');
    var darkerSilverBlue = color('#27546B');

    colors = {
        "backgroundColor": lightYellow,
        "markColor": lerpColor(darkerSilverBlue, lightYellow, lerpColorPercentage)
    };
    
    return colors;
}

function setup() {
    // put setup code here
    canvas = createCanvas(windowWidth, $(document).height());
    canvas.class('backgroundsketch');

    var cellSize = 10;
    var cellPadding = 0;
    var gridSize = SketchGrid.gridSizeFromDimensions(windowWidth, 
        $(document).height(), cellSize, cellPadding);
    sketchGrid = new SketchGrid(gridSize.numberOfRows, gridSize.numberOfCellsInRow, cellSize, cellPadding);
    sketchGrid.init();
}

function windowResized() {
    sketchGrid.iterateThroughCells(function (grid, cell, row, cellInRow) { 
        cell.needsDisplay = true; 
    })
    resizeCanvas(windowWidth, $(document).height());
    sketchGrid.resizeGridFromDimensions(width,height);
}

function sketchGridCoords() {
    return createVector((width - sketchGrid.width())/2,
        (height - sketchGrid.height())/2);
}

function draw() {
    // put drawing code here
    push();
    translate(sketchGridCoords().x, sketchGridCoords().y);

    sketchGrid.draw();

    if (frameCount < 60) {
        // var centerOfAvatar = centerOfAvatar();
        sketchGrid.iterateThroughCells(sketchGrid.magnetize, { 
                "location": createVector(centerOfAvatar().left, centerOfAvatar().top),
                "distanceThreshold": 200,
                "rotationSpeedFactor": 5, 
            });
    }

    pop();
}