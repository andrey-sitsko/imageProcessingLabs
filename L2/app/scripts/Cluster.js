module.exports = class Cluster {
  constructor(currentSquare, currentPerimeter, currentDensity) {
    this.figures = [];
    this.currentPoint = {};
    this.lastPoint = {};
    this.currentPoint.square = currentSquare;
    this.currentPoint.perimeter = currentPerimeter;
    this.currentPoint.density = currentDensity;
    this.perimeters = [];
    this.squares = [];
    this.densities = [];
  }
};
