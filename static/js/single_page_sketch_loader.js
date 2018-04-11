var sketchGrid;

function colorsForCell(grid, row, cellInRow) {
    var lerpColorPercentage = row/grid.numberOfRows;
    var lightYellow = color('#FEFBEE');
    var silverBlue = color('#9AB4B7');
    var darkerSilverBlue = color('#27546B');
    return {
        "backgroundColor": lightYellow,//lerpColor(darkerSilverBlue, lightYellow, .9+lerpColorPercentage*.1),
        "markColor": lerpColor(darkerSilverBlue, lightYellow, .8)
    };
}

function canvasSize() {
    return { 
        "width": $('#post-header').innerWidth(),
        "height": $('#post-header').innerHeight(),
        };
}

function canvasParent() {
    return 'post-header';
}

function sketchGridCoords() {
    return createVector((width - sketchGrid.width())/2,
        (height - sketchGrid.height())/2);
}

function windowResized() {
    sketchGrid.iterateThroughCells(function (grid, cell, row, cellInRow) { 
        cell.needsDisplay = true; 
    })
    resizeCanvas(canvasSize().width, canvasSize().height);
    sketchGrid.resizeGridFromDimensions(canvasSize().width, canvasSize().height);
}

function setup() {
    // put setup code here
    canvas = createCanvas(canvasSize().width, canvasSize().height);
    canvas.class('backgroundsketch');
    canvas.parent(canvasParent());

    var cellSize = 10;
    var cellPadding = 0;
    var gridSize = SketchGrid.gridSizeFromDimensions(width, height, cellSize, cellPadding);
    sketchGrid = new SketchGrid(gridSize.numberOfRows, gridSize.numberOfCellsInRow, cellSize, cellPadding);
    sketchGrid.init();
}

function draw() {
    // put drawing code here
    push();
    translate(sketchGridCoords().x, sketchGridCoords().y);
    sketchGrid.draw();
    pop();
}