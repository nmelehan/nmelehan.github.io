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

        arc(0, 0, lineLength, lineLength, -1*PI/4, PI/4)
        // line(-this.lineLength/2, 0, this.lineLength/2, 0);
        
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

    this.createCell = function(row, cellInRow) {
        var colors = colorsForCell(this, row, cellInRow);
        return new SketchCell(this.cellSize,
            10,
            random(TWO_PI),
            colors.backgroundColor,
            colors.markColor,
            1.8);
    }

    this.init = function() {
        for (row = 0; row < this.numberOfRows; row++) {
            this.cells.push(new Array());
            for (cellInRow = 0; cellInRow < this.numberOfCellsInRow; cellInRow++) {
                this.cells[row].push(this.createCell(row, cellInRow));
            }
        }

        var gridWidth = this.width();
        var gridHeight = this.height();
        for (i = 0; i < 20; i++) {
            this.iterateThroughCells(this.magnetize, { 
                "location": createVector(random(gridWidth), random(gridHeight)),
                "distanceThreshold": random(200,600),
                "rotationSpeedFactor": 1000, 
            });
        }
    }

    this.width = function() {
        return this.cellSize*this.numberOfCellsInRow + this.cellPadding*(this.numberOfCellsInRow-1);
    }

    this.height = function() {
        return this.cellSize*this.numberOfRows + this.cellPadding*(this.numberOfRows-1);
    }

    this.resizeGridFromDimensions = function(width, height, blockFunction) {
        var gridSize = SketchGrid.gridSizeFromDimensions(width, height, this.cellSize, this.cellPadding);

        if (gridSize.numberOfCellsInRow >= this.numberOfCellsInRow+2) {
            var numberOfCellsDifference = ceil((gridSize.numberOfCellsInRow - this.numberOfCellsInRow)/2)*2;
            for (row = 0; row < this.numberOfRows; row++) {
                for (cell = 0; cell < numberOfCellsDifference/2; cell++) {
                    this.cells[row].unshift(this.createCell(row, cell));
                }
                for (cell = 0; cell < numberOfCellsDifference/2; cell++) {
                    this.cells[row].push(this.createCell(row, cell));
                }
            }

            this.numberOfCellsInRow = gridSize.numberOfCellsInRow;
        }

        if (gridSize.numberOfRows >= this.numberOfRows + 2) {
            var numberOfRowsDifference = ceil((gridSize.numberOfRows - this.numberOfRows)/2)*2;
            for (row = 0; row < numberOfRowsDifference/2; row++) {
                var newRow = new Array();
                this.cells.unshift(newRow);
                for (cell = 0; cell < this.numberOfCellsInRow; cell++) {
                    newRow.push(this.createCell(row, cell));
                }
            }
            for (row = 0; row < numberOfRowsDifference/2; row++) {
                var newRow = new Array();
                this.cells.push(newRow);
                for (cell = 0; cell < this.numberOfCellsInRow; cell++) {
                    newRow.push(this.createCell(row, cell));
                }
            }
            
            this.numberOfRows = gridSize.numberOfRows;
        }

        blockFunction();
    }

    this.iterateThroughCells = function(functionToCallOnCell, options) {
        // for (row = 0; row < this.numberOfRows; row++) {
        //     for (cellInRow = 0; cellInRow < this.numberOfCellsInRow; cellInRow++) {
        //         functionToCallOnCell(this, this.cells[row][cellInRow], row, cellInRow);
        //     }
        // }

        var grid = this;
        this.cells.map (function(cellRow, row) {
            cellRow.map (function(cell, cellInRow) {
                functionToCallOnCell(grid, cell, row, cellInRow, options);
            }) 
        });
    }

    this.xyCoordinatesForGridCoordinates = function(row, cellInRow) {
        return createVector((this.cellSize+this.cellPadding)*cellInRow,
            (this.cellSize+this.cellPadding)*row);
    }

    this.cellCenterXYCoordinatesForGridCoordinates = function(row, cellInRow) {
        return createVector((this.cellSize+this.cellPadding)*cellInRow + cellSize/2,
            (this.cellSize+this.cellPadding)*row + cellSize/2);
    }

    this.magnetize = function(grid, cell, row, cellInRow, options) {
        var location = options.location;
        var mouseCoordsInGrid = createVector(location.x, location.y).sub(sketchGridCoords())
        var newDirection = mouseCoordsInGrid.sub(
            grid.cellCenterXYCoordinatesForGridCoordinates(row, cellInRow));
        if (newDirection.mag() < options.distanceThreshold ) {
            cell.lineAngle += (newDirection.heading() - cell.lineAngle)/min(max(1, newDirection.mag()/options.rotationSpeedFactor));
            cell.needsDisplay = true;
        } else if (newDirection.mag() < options.distanceThreshold*1.1 ) {
            cell.needsDisplay = true;
        }
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
    var numberOfRows = ceil(ceil((height + cellPadding)/(cellSize + cellPadding))/2)*2;
    var numberOfCellsInRow = ceil(ceil((width + cellPadding)/(cellSize + cellPadding))/2)*2;

    return {
        "numberOfRows": numberOfRows,
        "numberOfCellsInRow": numberOfCellsInRow,
    }
}

function mouseMoved() {
    sketchGrid.iterateThroughCells(sketchGrid.magnetize, { 
        "location": createVector(mouseX, mouseY),
        "distanceThreshold": 200,
        "rotationSpeedFactor": 50, 
    });
}