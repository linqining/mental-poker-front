import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/loading/loading.png');
        this.load.image('guest_login','assets/loading/guest_login.png')
        this.load.image('loading_avatar','avatars/avater0.png')
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
