var g, game = {

  /**
   * Define basic game elements to be updated
   */
  settings: {
    score: document.getElementById('current-score'),
    level: document.getElementById('current-level'),
    life: document.getElementById('life-remain'),
    levelUpText: document.getElementById('level-up-text'),
    levelUpScreen: document.getElementById("level-up-screen"),
    bombSound: document.getElementById('bomb-sound'),
    dimondSound: document.getElementById('dimond-sound'),
    levelUpSound: document.getElementById('level-up-sound'),
    startGame: document.getElementById('start-game'),
    mineField: document.getElementById('mine-field'),
    highScore: document.getElementById('high-score'),
    items: document.querySelectorAll('[data-element="item"]'),
  },

  properties: {
    scoreStep: 1,
    currentScore: 0,
    currentLevel: 0,
    numberOfMines: 1,
    lifeRemain: 5,
    noGrid: 9,
    highScore: localStorage.getItem('KUZHIBOMB_GUESSER_HIGHSCORE') || 0,
    levelGrid: {
      1: "threebythree",
      5: "sixbysix",
    }
  },

  init: function () {
    self = this.settings;
    prop = this.properties;
    this.updateLife();
    this.initAction();
  },

  initAction: function () {
    this.startGame();
    this.updateHighScore();
  },

  /**
   * Set the logics that need to be done on game start
   */
  startGame: function () {
    var that = this;
    self.startGame.addEventListener("click", function (event) {
      self.startGame.classList.add("hide");
      self.mineField.classList.remove("hide");
      prop.currentScore = 0;
      prop.currentLevel = 1;
      prop.lifeRemain = 5;
      that.generateGridItem();
      that.updateLife();
      that.updateHighScore();
      that.updateScore();
    });
  },

  generateGridItem: function () {
    let inner = '';
    let random = this.getRandomNumber(1, prop.noGrid);
    for (let index = 1; index <= prop.noGrid; index++) {
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
                    <img class="bomb hide" src="assets/images/icons/bomb.svg" alt="bomb" />
                </div>
            </div>`;
  },

  generateGridDimond: function () {
    return `<div class="single-plot-simple">
                <div class="item hide-item" data-element="item">
                    <img class="dimond hide" src="assets/images/icons/dimond.svg" alt="dimond" />
                </div>
            </div>`;
  },


  checkMineOrDimond: function (item) {
    if (!item.classList.contains("hide-item")) {
      return;
    }
    item.classList.remove("hide-item");
    const img = item.querySelector('img');
    if (img) {
      img.classList.remove("hide");
      if (img.classList.contains("bomb")) {
        self.bombSound.play();
        prop.lifeRemain -= 1;
        this.updateLife();
        setTimeout(() => {
          this.resetCurrentLevel()
        }, 500);
      } else if (img.classList.contains("dimond")) {
        self.dimondSound.play();
        prop.currentScore += prop.scoreStep;
        this.updateScore();
      }
    }
    this.checkRemainingItemsAreBomb();
  },

  checkRemainingItemsAreBomb: function () {
    var dimondCount = 0;
    self.items.forEach(item => {
      const img = item.querySelector('img');
      if (item.classList.contains("hide-item") && img.classList.contains("dimond")) {
        dimondCount++;
      }
    });
    if (0 == dimondCount) {
      this.gameLevelUpgrade();
    }
  },

  gameLevelUpgrade: function () {
    prop.currentLevel++;
    prop.currentScore += (prop.currentLevel * 5);
    self.levelUpSound.play();
    self.levelUpText.innerHTML = "Level " + prop.currentLevel;
    self.levelUpScreen.classList.remove("hide");
    this.gridLevelSwitch();
    setTimeout(() => {
      self.levelUpScreen.classList.add("hide");
    }, 800);
    this.updateScore();
    this.updateLevel();
    this.generateGridItem();
  },

  gridLevelSwitch: function () {
    if (6 == prop.currentLevel) {
      prop.noGrid = 36;
      self.mineField.classList.remove("threebythree");
      self.mineField.classList.add("sixbysix");
    }
  },

  resetCurrentLevel: function () {
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

  updateLevel: function () {
    self.level.innerHTML = prop.currentLevel;
  },

  updateLife: function () {
    if (prop.lifeRemain < 1) {
      self.startGame.classList.remove("hide");
      self.mineField.classList.add("hide");
      if (prop.currentScore > prop.highScore) {
        localStorage.setItem('KUZHIBOMB_GUESSER_HIGHSCORE', prop.currentScore);
      }
    }
    let lifeHeart = '';
    for (let index = 0; index < prop.lifeRemain; index++) {
      lifeHeart += `<img class="heart" src="assets/images/icons/heart.svg" alt="heart"/>`;
    }
    self.life.innerHTML = lifeHeart;
  },

  updateHighScore: function () {
    prop.highScore = localStorage.getItem('KUZHIBOMB_GUESSER_HIGHSCORE') || 0;
    self.highScore.innerHTML = prop?.highScore || 0;
  },

  getRandomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
document.addEventListener("DOMContentLoaded", function (event) {
  game.init();
});
