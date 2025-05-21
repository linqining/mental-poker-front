import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import User from '../../Poker/user';
import MainState from '../../Poker/mainState';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    table:Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    gameState: any;

    constructor ()
    {
        super('Game');
    }
    preload(){
        const gImageDir = 'src/Poker/assets/2x/';
        this.load.image('gamecenterbackground', gImageDir+'background.png')
        this.load.image('playerBK', 'src/assets/Desktop/player_frame.png')
        this.load.image('userBK', gImageDir+'player-guest.png')
        this.load.image('blankBK', gImageDir+'player-blank.png')
        this.load.image('winBK', gImageDir+'win-frame-bg.png')
        this.load.image('winBKFrame', gImageDir+'win-frame.png')
        this.load.image('buttonblue', gImageDir+'btn-big-green.png')
        this.load.image('buttongrey', gImageDir+'btn-big-green.png')
        this.load.image('buttonyellow', gImageDir+'btn-big-blue.png')
        this.load.image('fold_btn','src/assets/operate/fold.png')
        this.load.image('call_btn','src/assets/operate/call.png')
        this.load.image('raise_btn','src/assets/operate/raise.png')
        this.load.image('animeCoins', gImageDir+'coin.png')
        this.load.image('light', gImageDir+'roomLight.png')

        var cardDir = "src/assets/cards/"

        var cardImageName = [ "clubs", "diamonds","hearts","spades"];
        var cardName = [  "C", "D","H","S"]; // 黑桃，红心，梅花，方块
        var cardNumber = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K","A"];
        for(var i = 0; i < cardImageName.length; i++)
        {
            for(var j = 0; j < cardNumber.length; j++)
            {
                this.load.image(cardName[i] + cardNumber[j], cardDir+i +  "_" + (j + 2) + ".png")
            }
        }

        this.load.image("cardBK", 'src/assets/cards/CardBack.png')
        this.load.image("chipPool", gImageDir+'chip-pool.png')
        this.load.image("chip01", 'src/assets/Desktop/chips.png')
        this.load.image("chip05", gImageDir+'texas_chip05.png')
        this.load.image("chip1k", gImageDir+'texas_chip1k.png')
        this.load.image("chip5k", gImageDir+'texas_chip5k.png')
        this.load.image("chip10w", gImageDir+'texas_chip10w.png')
        this.load.image("chip50w", gImageDir+'texas_chip50w.png')

        this.load.image("dcardBK", 'src/assets/cards/CardBack.png')
        // this.load.image("dcardBK", gImageDir+'card_backs_rotate.png');


        this.load.image("checkOn", gImageDir+'check-on.png')
        this.load.image("checkOff", gImageDir+'check-off.png')
        this.load.image("chipbox", gImageDir+'add-chips-box.png')
        this.load.image("winLight", gImageDir+'light_dot.png')
        this.load.image("groove", gImageDir+'sliderGroove.png')
        this.load.image("slidebar", gImageDir+'slidebar.png');
        this.load.image("btnslider", gImageDir+'btn-slider.png')
        this.load.image("fillbox", gImageDir+'fill-box.png')
        this.load.image("exitdoor", gImageDir+'btn-grey.png')
        this.load.image("dealer", gImageDir+'dealer.png')
        this.load.image("waitingRound", gImageDir+'win-frameWaiting.png')
        this.load.image("card_typebg", gImageDir+'card_typebg.png')
        this.load.image("defaultProfile", 'src/assets/Common/avatar.png')
        this.load.image("buttonrules", gImageDir+'btn-rules.png')

        const soundDir = "src/Poker/assets/sound/"
        this.load.audio('sendcard', 'src/assets/audio/desk_new_card.wav')
        this.load.audio('click', soundDir+'click.mp3')
        this.load.audio('chipsmoving',soundDir+ 'chipsmoving.mp3')
        this.load.audio('reordercard', soundDir+'reordercard.mp3')
        this.load.audio('ding', soundDir+'ding.mp3')
        this.load.audio('win', soundDir+'win.mp3')
        this.load.audio('lost', soundDir+'lose.mp3')
    }



    create (data) {
        console.log(data)
        const roomID =data.game_id;
        const userAccount = this.registry.get("current_account")
        if (!userAccount ) {
            this.scene.start('MainMenu');
        }

        this.camera = this.cameras.main;

        const betApi = this.game.registry.get("betApi");
        betApi.setRoomID(roomID);
        this.gameState = new MainState(this);
        this.gameState.create(this,betApi,roomID,data.chip_amount);

        const exitGame = this.add.image(84, 42, 'exit_game');
        exitGame.setScale(0.7);
        exitGame.setInteractive().on('pointerdown', () => {
            betApi.leaveRoom();
            this.scene.start("Hall");
        })

        betApi.connectWithCallback(userAccount.address,function (openCBData){
                betApi.loginCertification(userAccount.address, function (authData){
                    // // 登录成功
                    // betApi.enterRoom(function(data){
                    //     console.log("enterRoom", JSON.stringify(data))
                    // },roomID)
                    console.log("loginCertification",JSON.stringify(authData));
                })
            },  this.gameState.callbackClose.bind(this.gameState),
            this.gameState.callbackMessage.bind(this.gameState),  this.gameState.callbackError.bind(this.gameState))

        EventBus.emit('current-scene-ready', this);
    }

    update(){
        this.gameState.update();
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
    callbackOpen(data) {

        console.log("callbackOpen " + JSON.stringify(data));

        // game.betApi.checkVersion(this.strVersion, function(isOK){
        //     console.log("checkVersion " + isOK);
        // });
    }
}




