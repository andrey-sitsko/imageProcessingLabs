const interferenceIndex = 0.20;

module.exports = class HopfieldNetwork {
  constructor() {
    this.imagesNeurons = [];
    this.figuresWeights = [];
    this.imagesFigures = [];
    this.imageWidth = 0;
  }

  addImage(image) {
    this.imageWidth = this.imageWidth || image.imageWidth;
    this.imagesNeurons.push(this._multiplyVectors(image.binariziedMatrix));
    this.imagesFigures.push(image.binariziedMatrix);
  }

  calculateWeights() {
    let neuronsCount = this.imagesNeurons[0].length;

    for (let i = 0; i < neuronsCount; i++) {
      this.figuresWeights[i] = this._getNeuronWeight(this.imagesNeurons, i);
    }

    for (let i = 0; i < neuronsCount; i++) {
      if (i % this.imageWidth === Math.floor(i / this.imageWidth)) {
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
      let summ = 0;
      figureMatrix.forEach((secondElement) => {
        summ += firstElement * secondElement;
      });
      finalMatrix.push(summ);
    });

    return finalMatrix;
  }

  recogniseImage(image) {
    let imageMatrix = image.binariziedMatrix,
        currentMatrix,
        prevMatrix,
        counter = 0;

    currentMatrix = imageMatrix;

    do {
      counter++;
      prevMatrix = currentMatrix;
      currentMatrix = this._getImageMultMatrix(this.figuresWeights, currentMatrix);
    } while (this._checkArraysEquality(currentMatrix, prevMatrix));

    return this._findStandart(this.imagesFigures, currentMatrix);
  }

  _getImageMultMatrix(weights, imageMatrix) {
    let finalMatrix = [];

    for(let i = 0; i < weights.length; i++) {
      finalMatrix.push(weights[i] * imageMatrix[i]);
    }

    return finalMatrix.map((elem) => {
      if(elem >= 0) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  _findStandart(standards, image) {
    let recognisied = false;
    standards.forEach((standart) => {
      if(this._checkImagesEquality(standart, image)) {
        recognisied = true;
      }
    });
    return recognisied;
  }

  _checkArraysEquality(firstArr, secondArr) {
    return (firstArr.length == secondArr.length &&
    firstArr.every((elem, index) => {
      return elem === secondArr[index];
    }));
  }

  _checkImagesEquality(firstArr, secondArr) {
    let counter = 0;
    firstArr.forEach((elem, index) => {
      if(elem !== secondArr[index]) {
        counter++;
      }
    });
    //console.log(counter / firstArr.length);
    return (counter / firstArr.length) < interferenceIndex;
  }
};