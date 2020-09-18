import "phaser"
import config from "../Config/config"
export default class WorldScene extends Phaser.Scene {
    constructor () {
      super('World');
      this.score = 0
    }
    
    create () {    
    //map
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'map').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'map');
    this.platforms.create(50, 250, 'map');
    this.platforms.create(750, 220, 'map');
    this.platforms.create(1000, 220, 'map');

    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [3, 7, 11, 15],
          }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 1 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {
            frames: [0, 4, 8, 12],
          }),
        frameRate: 10,
        repeat: -1
    });
    
    this.coins = this.physics.add.group({
        key: 'coins',
        repeat: 22,
        setXY: { x: 2, y: 0, stepX: 40 },
        setScale: { x: 0.1, y: 0.1}
    });
    console.log(this.coins)
    this.coins.children.iterate(function (child) {

        //  Give each coin a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });
this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });

    //  Collide the player and the coins with the platforms
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.coins, this.platforms);

    //  Checks to see if the this.player overlaps with any of the coins, if he does call the collectStar function
    this.physics.add.overlap(this.player, this.coins, this.collectCoins, null, this);

    
}

collectCoins (player, coin)
{
    coin.disableBody(true, true);

    //  Add and update the score
    this.score += 10;
    console.log(this.score)
    this.scoreText.setText('Score: ' + this.score);

    if (this.coins.countActive(true) === 0)
    {
        //  A new batch of .coins to collect
        this.coins.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    }
}
update(){
    let cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown)
    {
        this.player.setVelocityX(-160);

        this.player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        this.player.setVelocityX(160);

        this.player.anims.play('right', true);
    }
    else
    {
        this.player.setVelocityX(0);

        this.player.anims.play('turn');
    }
    //&& this.player.body.touching.down
    if (cursors.up.isDown )
    {
        this.player.setVelocityY(-330);
    }
}

  };