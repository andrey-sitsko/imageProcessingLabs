module.exports = class HopfieldNetwork {
  constructor() {
    this.imagesNeurons = [];
    this.figuresWeights = [];
    this.imageFigures = [];
    this.imageWidth = 0;
  }

  addImage(image) {
    this.imageWidth = this.imageWidth || image.imageWidth;
    this.imagesNeurons.push(this._multiplyVectors(image.binariziedMatrix));
    this.imageFigures.push(image.binariziedMatrix);
  }

  _calculateWeights() {
    let neuronsCount = this.imagesNeurons[0].length;

    for(let i = 0; i < neuronsCount; i++) {
      if(i % this.imageWidth !== Math.floor(i / this.imageWidth)) {
        this.figuresWeights[i] = this._getNeuronWeight(this.imagesNeurons, i);
      } else {
        this.figuresWeights[i] = 0;
      }
    }
  }

  _getNeuronWeight(neuronsWeights, index) {
    let weight = 0;
    neuronsWeights.forEach((item) => {
      weight += item[index];
    });
    return weight;
  }

  _multiplyVectors(figureMatrix) {
    let finalMatrix = [];

    figureMatrix.forEach((firstElement) => {
      figureMatrix.forEach((secondElement) => {
        finalMatrix.push(firstElement * secondElement);
      });
    });

    return finalMatrix;
  }

  recogniseImage(image) {
    let imageMatrix = image.binariziedMatrix,
        currentMatrix,
        prevMatrix;

    currentMatrix = prevMatrix = imageMatrix;

    do {
      prevMatrix = imageMatrix;
      currentMatrix = this._getImageSumMatrix(this.figuresWeights, imageMatrix);
    } while (!this._checkArraysEquality(currentMatrix, prevMatrix));
  }

  _checkArraysEquality(firstArr, secondArr) {
    return (firstArr.length == secondArr.length &&
    firstArr.every((elem, index) => {
      return elem === secondArr[index];
    }));
  }

  _getImageSumMatrix(weights, imageMatrix) {
    let finalMatrix = [];

    for(let i = 0; i < weights.length; i++) {
      finalMatrix[i] += weights[i] * imageMatrix[i];
    }

    return finalMatrix.map((elem) => {
      if(elem >= 0) {
        return 1;
      } else {
        return -1;
      }
    });
  }
};