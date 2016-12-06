const binarizingLimit = 10;

module.exports = class ImageObject {
    constructor(canvas) {
        let context = canvas.getContext('2d'),
            imageData = context.getImageData(0, 0, canvas.width,  canvas.height);

        this.binariziedMatrix = this._getBinariziedMatrix(imageData);
        this.imageHeight = canvas.height;
        this.imageWidth = canvas.width;
    }

    _getBinariziedMatrix(imageData) {
        let colorData = imageData.data,
            binariziedMatrix = [];

        for(let i = 0; i < colorData.length; i += 4) {
            let pixelValue = (colorData[i] + colorData[i + 1] + colorData[i + 2]) / 3;
            if(pixelValue <= binarizingLimit) {
                binariziedMatrix.push(1);
            } else {
                binariziedMatrix.push(-1);
            }
        }

        return binariziedMatrix;
    }
};

