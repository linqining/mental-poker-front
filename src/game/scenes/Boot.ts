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
        this.load.image('hall_background','assets_guopai/main/Main_atlas3.png')
        this.load.image('common_button','assets_guopai/main/common.png')
        this.load.image('hundred_button','assets_guopai/main/hundred.png')
        this.load.image('match_button','assets_guopai/main/match.png')

        this.load.image("table_background","assets_guopai/Desktop/Desktop_atlas1.png")
        this.load.image("table","assets_guopai/Desktop/Desktop_atlas2.png")

        this.load.image("exit_game","assets_guopai/joinmatch/JoinMatch_atlas0.png")
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
