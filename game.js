class Road {
  constructor(image, y) {
    this.x = 0;
    this.y = y;
    this.loaded = false;

    this.image = new Image();

    var obj = this;

    this.image.addEventListener('load', function () {
      obj.loaded = true;
    });

    this.image.src = image;
  }

  Update(road) {
    this.y += speed; //The image will move down with every frame

    if (this.y > window.innerHeight) {
      //if the image left the screen, it will change it's position
      this.y = road.y - canvas.width + speed; //New position depends on the second Road object
    }
  }
}
