import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    login: GameObjects.Image;
    avatar:GameObjects.Image;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {

        this.background = this.add.image(650, 390, 'background');
        this.background.setScale(0.76);
        this.background.setDepth(-1);


        this.avatar = this.add.image(500, 370, 'loading_avatar');
        this.avatar.setScale(0.7);
        // this.background.setDepth(-1);



        if (!this.registry.get("current_account") ) {
            this.login = this.add.image(512, 550   , 'guest_login');
            this.login.displayHeight= 50;
            this.login.displayWidth = 150;
            EventBus.removeListener("action_login")
            this.login.setInteractive().on("pointerdown", () => {
                console.log('图片被点击');
                EventBus.emit('action_login', this);
            })
        }else{
            this.scene.start('Hall');
        }

        // this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.title = this.add.text(512, 150, 'Trusted Poker', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
