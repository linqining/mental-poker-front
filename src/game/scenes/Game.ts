import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Betapi from "../../Poker/betapi";

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    table:Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }


    create ()
    {
       const betApi = this.game.registry.get("betApi");
       betApi.registerCallback(betApi.)
       betApi.connect();


        this.camera = this.cameras.main;

        this.background = this.add.image(512, 384, 'table_background');
        this.background.displayWidth = 1024;
        this.background.displayHeight = 768;

        this.table = this.add.image(650, 430, 'table');
        this.table.setScale(0.7);

        const exitGame = this.add.image(84, 42, 'exit_game');
        exitGame.setScale(0.7);
        exitGame.setInteractive().on('pointerdown', () => {
            this.scene.start("Hall");
        })


        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
