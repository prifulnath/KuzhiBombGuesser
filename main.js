var g, game = {

  /**
   * Define basic game elements to be updated
   */
  settings: {
    score: document.getElementById('current-score'),
    life: document.getElementById('life-remain'),
    bombSound: document.getElementById('bomb-sound'),
    dimondSound: document.getElementById('dimond-sound'),
    startGame: document.getElementById('start-game'),
    mineField: document.getElementById('mine-field'),
    items: document.querySelectorAll('[data-element="item"]'),
  },

  properties: {
    scoreStep: 1,
    currentScore: 0,
    numberOfMines: 1,
    lifeRemain: 5,
  },

  init: function () {
    self = this.settings;
    prop = this.properties;
    this.initAction();
    this.generateGridItem();
  },

  initAction: function () {
    this.startGame();
  },

  startGame: function () {
    self.startGame.addEventListener("click", function (event) {
      self.startGame.classList.add("hide");
      self.mineField.classList.remove("hide");
    });
  },

  generateGridItem: function () {
    let inner = '';
    let random = this.getRandomNumber(1, 9);
    for (let index = 1; index <= 9; index++) {
      inner += (random == index) ? this.generateGridBomb() : this.generateGridDimond();
    }
    self.mineField.innerHTML = inner;
    self.items = document.querySelectorAll('[data-element="item"]');
    this.addGridItemEventListener();
  },

  addGridItemEventListener: function () {
    var that = this;
    self.items.forEach(item => {
      item.addEventListener("click", function (event) {
        self.bombSound.pause();
        self.dimondSound.pause();
        self.bombSound.currentTime = 0;
        self.dimondSound.currentTime = 0;
        that.checkMineOrDimond(item);
      });
    });
  },

  generateGridBomb: function () {
    return `<div class="single-plot-simple">
                <div class="item hide-item" data-element="item">
                    <img class="bomb hide" src="images/icons/bomb.svg" alt="bomb" />
                </div>
            </div>`;
  },

  generateGridDimond: function () {
    return `<div class="single-plot-simple">
                <div class="item hide-item" data-element="item">
                    <img class="dimond hide" src="images/icons/dimond.svg" alt="dimond" />
                </div>
            </div>`;
  },


  checkMineOrDimond: function (item) {
    item.classList.remove("hide-item");
    const img = item.querySelector('img');
    if (img) {
      img.classList.remove("hide");
      if (img.classList.contains("bomb")) {
        self.bombSound.play();
        prop.lifeRemain -= 1;
        this.updateLife();
        setTimeout(this.resetLevel(), 100000);
      } else if (img.classList.contains("dimond")) {
        self.dimondSound.play();
        prop.currentScore += prop.scoreStep;
        this.updateScore();
      }
    }
  },

  resetLevel: function () {
    self.items.forEach(item => {
      item.classList.add("hide-item");
      const img = item.querySelector('img');
      if (img) {
        img.classList.add("hide");
      }
    });
  },

  updateScore: function () {
    self.score.innerHTML = prop.currentScore;
  },

  updateLife: function () {
    self.life.innerHTML = prop.lifeRemain;
  },

  getRandomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
document.addEventListener("DOMContentLoaded", function (event) {
  game.init();
});
