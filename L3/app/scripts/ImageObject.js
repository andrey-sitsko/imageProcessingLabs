const binarizingLimit = 10;

module.exports = class ImageObject {
    constructor(canvas) {
        let _context = canvas.getContext('2d'),
            _imageData = _context.getImageData(0, 0, this.canvas.width,  this.canvas.height);

        this.binariziedMatrix = this._getBinariziedMatrix(_imageData);
        this.imageHeight = canvas.height;
        this.imageWidth = canvas.width;
    }

    _getBinariziedMatrix(imageData) {
        let colorData = imageData.data,
            binariziedMatrix = [];

        for(let i = 0; i < colorData.length; i += 4) {
            let pixelValue = (colorData[i] + colorData[i + 1] + colorData[i + 2]) / 3;
            if(pixelValue <= binarizingLimit) {
                binariziedMatrix.push(-1);
            } else {
                binariziedMatrix.push(1);
            }
        }

        return binariziedMatrix;
    }
};

