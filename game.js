import { createAnimations } from "./animations.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debugger: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

new Phaser.Game(config);

// this --> game

function preload() {
    this.load.image('cloud1', 'assets/scenery/overworld/cloud1.png');

    this.load.image('floorbricks', 'assets/scenery/overworld/floorbricks.png');

    this.load.spritesheet('mario', 'assets/entities/mario.png', { frameWidth: 18, frameHeight: 16 });

    this.load.audio('gameover', 'assets/sound/music/gameover.mp3');
}

function create() {

    this.keys = this.input.keyboard.createCursorKeys(); // For arrow keys
    this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT); // For shift key
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // For space bar

    //image(x, y, asset-id)
    this.add.image(250, 350, 'cloud1')
        .setOrigin(0, 0)
        .setScale(0.5)

    this.floor = this.physics.add.staticGroup();

    this.floor.create(0, 570, 'floorbricks')
        .setOrigin(0, 0.5)
        .setScale(2)
        .refreshBody()

    this.floor.create(400, 570, 'floorbricks')
        .setOrigin(0, 0.5)
        .setScale(2)
        .refreshBody()

    this.mario = this.physics.add.sprite(100, 505, 'mario')
        .setOrigin(0, 1)
        .setScale(2)
        .setGravityY(300)
        .setCollideWorldBounds(true)

    this.physics.world.setBounds(0, 0, 2000, config.height);

    this.cameras.main.setBounds(0, 0, 2000, config.height);

    this.cameras.main.startFollow(this.mario)
    
    this.physics.add.collider(this.mario, this.floor);
    
    createAnimations(this);

}

function update() {
    if(this.mario.isDead) return;

    if (this.keys.left.isDown) {
        !this.mario.body.touching.down ? this.mario.anims.play('mario-jump', true) : this.mario.anims.play('mario-walk', true);
        this.mario.x -= 2;
        this.mario.flipX = true;

        //Extra Speed with shift pressed
        if (this.shift.isDown) {
            this.mario.x -= 1;
        }
    } else if (this.keys.right.isDown) {
        !this.mario.body.touching.down ? this.mario.anims.play('mario-jump', true) : this.mario.anims.play('mario-walk', true);
        this.mario.x += 2;
        this.mario.flipX = false;

        //Extra Speed with shift pressed
        if (this.shift.isDown) {
            this.mario.x += 1;
        }
    } else {
        // this.mario.anims.stop();
        this.mario.anims.play('mario-idle', true);
    }

    if (this.spaceBar.isDown && this.mario.body.touching.down) {
        this.mario.anims.stop();
        this.mario.setVelocityY(-300)
        this.mario.anims.play('mario-jump', true); 
    }

    if(!this.mario.body.touching.down) {
        this.mario.anims.play('mario-jump', true);
    }

    if(this.mario.y >= config.height) {
        this.mario.isDead = true;
        this.mario.anims.play('mario-die', true);
        this.mario.setCollideWorldBounds(false)
        this.sound.play('gameover');

        setTimeout(() => {
            this.mario.setVelocityY(-350)
        }, 100);
        setTimeout(() => {
            this.scene.restart();
        }, 2000)
    }
}