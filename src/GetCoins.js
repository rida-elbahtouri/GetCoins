let game;
var player;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

let gameOptions = {
	platformStartSpeed: 75,
	platformSizeRange: [ 200, 350 ],
	platformCounter: 0
};

window.onload = function() {
	let gameConfig = {
		type: Phaser.AUTO,
		width: 500,
		height: 1000,
		scene: playGame,
		backgroundColor: 0x44f4f4,
		physics: {
			default: 'arcade'
		}
	};

	game = new Phaser.Game(gameConfig);
	window.focus();
	resize();
	window.addEventListener('resize', resize, false);
};

class playGame extends Phaser.Scene {
	constructor() {
		super('PlayGame');
	}
	preload() {
		this.load.image('platform', 'platform.png');
		this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
	}

	create() {
		this.platformGroup = this.add.group({
			removeCallback: function(platform) {
				platform.scene.platformPool.add(platform);
			}
		});

		this.platformPool = this.add.group({
			removeCallback: function(platform) {
				platform.scene.platformGroup.add(platform);
			}
		});

		this.addPlatform(game.config.width, game.config.width / 2);

		this.player = this.physics.add.sprite(100, -100, 'dude');
		this.player.body.setGravityY(400);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});
		cursors = this.input.keyboard.createCursorKeys();
		this.physics.add.collider(this.player, this.platformGroup);

		scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '39px', fill: '#f00' });
	}

	addPlatform(platformWidth, posX) {
		let platform;
		platform = this.physics.add.sprite(posX, game.config.height * 0, 'platform');
		platform.setImmovable(true);
		platform.setVelocityY(score / 2 + 50);
		this.platformGroup.add(platform);

		platform.displayWidth = platformWidth;
	}

	update() {
		if (this.player.y > game.config.height) {
			gameOptions.platformCounter = 0;
			this.scene.start('PlayGame');
			score = 0;
			this.create();
		}

		let platform = this.platformGroup.getChildren();
		let canvasWidth = parseInt(document.querySelector('canvas').style.width, 10);
		for (let i = gameOptions.platformCounter; i < platform.length; i++) {
			if (platform[i].y > 150) {
				var nextPlatformWidth = Phaser.Math.Between(
					gameOptions.platformSizeRange[0],
					gameOptions.platformSizeRange[1]
				);
				let position;

				if (gameOptions.platformCounter % 2 == 0) {
					position = Phaser.Math.Between(0, canvasWidth / 2);
				} else {
					position = Phaser.Math.Between(canvasWidth / 2, canvasWidth);
				}

				this.addPlatform(nextPlatformWidth, position);
				updateScore();
				gameOptions.platformCounter++;
			}
		}
		if (cursors.left.isDown) {
			this.player.setVelocityX(-160);

			this.player.anims.play('left', true);
		} else if (cursors.right.isDown) {
			this.player.setVelocityX(160);

			this.player.anims.play('right', true);
		} else {
			this.player.setVelocityX(0);

			this.player.anims.play('turn');
		}

		if (cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330);
		}
	}
}
function resize() {
	let canvas = document.querySelector('canvas');
	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;
	let windowRatio = windowWidth / windowHeight;
	let gameRatio = game.config.width / game.config.height;
	if (windowRatio < gameRatio) {
		canvas.style.width = windowWidth + 'px';
		canvas.style.height = windowWidth / gameRatio + 'px';
	} else {
		canvas.style.width = windowHeight * gameRatio + 'px';
		canvas.style.height = windowHeight + 'px';
	}
}

function updateScore() {
	score += 10;
	scoreText.setText('Score: ' + score);
}
