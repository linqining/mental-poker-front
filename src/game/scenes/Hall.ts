import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Hall extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    commonMatch: Phaser.GameObjects.Image;
    hundredMatch: Phaser.GameObjects.Image;
    tournamentMatch: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Hall');
    }

    create ()
    {
        this.camera = this.cameras.main;

        if (!this.registry.get("current_account") ) {
            this.scene.start('MainMenu');
        }

        this.background = this.add.image(512, 384, 'hall_background');
        this.background.displayWidth = 1024;
        this.background.displayHeight = 768;

        this.commonMatch = this.add.image(850, 300, 'common_button');
        this.commonMatch.displayWidth = 280;
        this.commonMatch.displayHeight = 84;

        this.hundredMatch = this.add.image(850, 400, 'hundred_button');
        this.hundredMatch.displayWidth = 280;
        this.hundredMatch.displayHeight = 84;

        this.tournamentMatch = this.add.image(850, 500, 'match_button');
        this.tournamentMatch.displayWidth = 280;
        this.tournamentMatch.displayHeight = 84;


        this.commonMatch.setInteractive().on('pointerdown', () => {
            //todo call api an join match
            // joinRoomApi()
            this.scene.start("Game");
        })

        // this.gameText = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
