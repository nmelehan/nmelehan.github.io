function SketchCell(cellSize, lineLength, lineAngle, rectColor, lineColor, lineWeight) {
    this.cellSize = cellSize;
    this.lineLength = lineLength;
    this.lineAngle = lineAngle;
    this.rectColor = rectColor;
    this.lineColor = lineColor;
    this.lineWeight = lineWeight;
    this.needsDisplay = true;

    this.lineOffset = createVector(random(-1*cellSize/2,cellSize/2), random(-1*cellSize/2, cellSize/2));

    this.draw = function(x, y) {
        if (!this.needsDisplay) {
            return;
        }

        push();
        translate(x, y);
        stroke(0, 0);
        fill(this.rectColor);
        rect(0, 0, this.cellSize, this.cellSize);

        stroke(this.lineColor);
        strokeCap(ROUND);
        strokeWeight(this.lineWeight);
        translate(this.cellSize/2, this.cellSize/2);
        translate(this.lineOffset.x, this.lineOffset.y);
        rotate(this.lineAngle);
        line(-this.lineLength/2, 0, this.lineLength/2, 0);

        // ellipse(lineLength/2, 0, 7, 7);
        
        pop();

        this.needsDisplay = false;
    }
}

function SketchGrid(numberOfRows, numberOfCellsInRow, cellSize, cellPadding) {
    this.numberOfRows = numberOfRows;
    this.numberOfCellsInRow = numberOfCellsInRow;
    this.cellSize = cellSize;
    this.cellPadding = cellPadding;

    this.cells = [];

    this.init = function(helloMessage) {
        for (row = 0; row < this.numberOfRows; row++) {
            this.cells.push(new Array());
            for (cellInRow = 0; cellInRow < this.numberOfCellsInRow; cellInRow++) {
                this.cells[row].push(new SketchCell(this.cellSize,
                    3,
                    random(TWO_PI),
                    color('#FEFBEE'),
                    color('#FFEA93'),
                    1));
            }
        }
    }

    this.width = function() {
        return cellSize*numberOfCellsInRow + cellPadding*(numberOfCellsInRow-1);
    }

    this.height = function() {
        return cellSize*numberOfRows + cellPadding*(numberOfRows-1);
    }

    this.resizeGridFromDimensions = function(width, height) {
        var gridSize = SketchGrid.gridSizeFromDimensions(width, height, cellSize, cellPadding);

        this.numberOfRows = gridSize.numberOfRows;
        this.numberOfCellsInRow = gridSize.numberOfCellsInRow;
    }

    this.iterateThroughCells = function(functionToCallOnCell) {
        for (row = 0; row < this.numberOfRows; row++) {
            for (cellInRow = 0; cellInRow < this.numberOfCellsInRow; cellInRow++) {
                functionToCallOnCell(this, this.cells[row][cellInRow], row, cellInRow);
            }
        }
    }

    this.xyCoordinatesForGridCoordinates = function(row, cellInRow) {
        return createVector((this.cellSize+this.cellPadding)*cellInRow,
            (this.cellSize+this.cellPadding)*row);
    }

    this.cellCenterXYCoordinatesForGridCoordinates = function(row, cellInRow) {
        return createVector((this.cellSize+this.cellPadding)*cellInRow + cellSize/2,
            (this.cellSize+this.cellPadding)*row + cellSize/2);
    }
     
    this.draw = function() {
        push();

        function cellDrawingFunction(grid, cell, row, cellInRow) {
            var coords = grid.xyCoordinatesForGridCoordinates(row, cellInRow);
            cell.draw(coords.x, coords.y);
        }

        this.iterateThroughCells(cellDrawingFunction);

        pop();
    }
}

SketchGrid.gridSizeFromDimensions = function(width, height, cellSize, cellPadding) {
    var numberOfRows = floor((height + cellPadding)/(cellSize + cellPadding));
    var numberOfCellsInRow = floor((width + cellPadding)/(cellSize + cellPadding));

    return {
        "numberOfRows": numberOfRows,
        "numberOfCellsInRow": numberOfCellsInRow,
    }
}


var sketchGrid;

function setup() {
    // put setup code here
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.class('backgroundsketch');

    var cellSize = 10;
    var cellPadding = 0;
    var gridSize = SketchGrid.gridSizeFromDimensions(windowWidth, 
        windowHeight, cellSize, cellPadding);
    sketchGrid = new SketchGrid(gridSize.numberOfRows, gridSize.numberOfCellsInRow, cellSize, cellPadding);
    sketchGrid.init();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function sketchGridCoords() {
    return createVector((width - sketchGrid.width())/2,
        (height - sketchGrid.height())/2);
}

function mouseMoved() {
    function magnetize(grid, cell, row, rowInCell) {
        var mouseCoordsInGrid = createVector(mouseX, mouseY).sub(sketchGridCoords())
        var newDirection = mouseCoordsInGrid.sub(
            grid.cellCenterXYCoordinatesForGridCoordinates(row, rowInCell));
        if (newDirection.mag() < 200 ) {
            cell.lineAngle += (newDirection.heading() - cell.lineAngle)/min(max(1, newDirection.mag()/4));
            cell.needsDisplay = true;
        } else if (newDirection.mag() < 250 ) {
            cell.needsDisplay = true;
        }
    }

    sketchGrid.iterateThroughCells(magnetize);
}

function draw() {
    // put drawing code here
    push();
    translate(sketchGridCoords().x, sketchGridCoords().y);
    
    // function magnetize(grid, cell, row, rowInCell) {
    //     var mouseCoordsInGrid = createVector(mouseX, mouseY).sub(sketchGridCoords())
    //     var newDirection = mouseCoordsInGrid.sub(
    //         grid.cellCenterXYCoordinatesForGridCoordinates(row, rowInCell));
    //     if (newDirection.mag() < 200 ) {
    //         cell.lineAngle += (newDirection.heading() - cell.lineAngle)/min(max(1, newDirection.mag()/4));
    //         cell.needsDisplay = true;
    //     } else if (newDirection.mag() < 250 ) {
    //         cell.needsDisplay = true;
    //     }
    // }

    // sketchGrid.iterateThroughCells(magnetize);

    sketchGrid.draw();
    pop();
}