import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import User from '../../Poker/user';
import MainState from '../../Poker/mainState';

export class Game extends Scene
{
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
        this.load.image('playerBK', gImageDir+'player-me.png')
        this.load.image('userBK', gImageDir+'player-guest.png')
        this.load.image('blankBK', gImageDir+'player-blank.png')
        this.load.image('winBK', gImageDir+'win-frame-bg.png')
        this.load.image('winBKFrame', gImageDir+'win-frame.png')
        this.load.image('buttonblue', gImageDir+'btn-big-green.png')
        this.load.image('buttongrey', gImageDir+'btn-big-green.png')
        this.load.image('buttonyellow', gImageDir+'btn-big-blue.png')
        this.load.image('animeCoins', gImageDir+'coin.png')
        this.load.image('light', gImageDir+'roomLight.png')
        var cardImageName = ["spades", "hearts", "clubs", "diamonds"];
        var cardName = ["S", "H", "C", "D"];
        var cardNumber = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
        for(var i = 0; i < cardImageName.length; i++)
        {
            for(var j = 0; j < cardNumber.length; j++)
            {
                this.load.image(cardName[i] + cardNumber[j], gImageDir+'cards/card_' + cardImageName[i] + "_" + (j + 1) + ".png")
            }
        }

        this.load.image("cardBK", 'src/assets/cards/CardBack.png')
        this.load.image("chipPool", gImageDir+'chip-pool.png')
        this.load.image("chip01", gImageDir+'texas_chip01.png')
        this.load.image("chip05", gImageDir+'texas_chip05.png')
        this.load.image("chip1k", gImageDir+'texas_chip1k.png')
        this.load.image("chip5k", gImageDir+'texas_chip5k.png')
        this.load.image("chip10w", gImageDir+'texas_chip10w.png')
        this.load.image("chip50w", gImageDir+'texas_chip50w.png')
        this.load.image("dcardBK", gImageDir+'card_backs_rotate.png')
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
        this.load.audio('sendcard', soundDir+'sendcard.mp3')
        this.load.audio('click', soundDir+'click.mp3')
        this.load.audio('chipsmoving',soundDir+ 'chipsmoving.mp3')
        this.load.audio('reordercard', soundDir+'reordercard.mp3')
        this.load.audio('ding', soundDir+'ding.mp3')
        this.load.audio('win', soundDir+'win.mp3')
        this.load.audio('lost', soundDir+'lose.mp3')
    }



    create () {

        const roomID ="1";
        const userAccount = this.registry.get("current_account")
        if (!userAccount ) {
            this.scene.start('MainMenu');
        }

        this.camera = this.cameras.main;

        const betApi = this.game.registry.get("betApi");

        this.gameState = new MainState(this);
        this.gameState.create(this,betApi)




        const exitGame = this.add.image(84, 42, 'exit_game');
        exitGame.setScale(0.7);
        exitGame.setInteractive().on('pointerdown', () => {
            betApi.disconnect();
            this.scene.start("Hall");
        })

        betApi.connectWithCallback(userAccount.address,function (openCBData){
                betApi.loginCertification(userAccount.address, function (authData){
                    // 登录成功
                    betApi.enterRoom(function(data){
                        console.log("enterRoom", JSON.stringify(data))
                    },roomID)
                })
            },  this.gameState.callbackClose.bind(this.gameState),
            this.gameState.callbackMessage.bind(this.gameState),  this.gameState.callbackError.bind(this.gameState))

        EventBus.emit('current-scene-ready', this);
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
    callbackClose (data) {
        console.log("callbackClose " + JSON.stringify(data));
        // this.loginCertification = false;
        //
        // this._disconnectReset();
    }
    callbackMessage(data) {
        console.log("callbackMessage " + JSON.stringify(data));
        // if(data.version && data.version == this.strVersion) // checkVersion result
        // {
        //     var authToken = gParam.user_name;
        //
        //     if (this.appToken != undefined ) {
        //         authToken = this.appToken
        //     };
        //
        //     game.betApi.loginCertification(authToken, function(isOK){
        //         console.log("loginCertification is " +  isOK);
        //         //alert("loginCertification is" +  isOK);
        //     });
        // }
        // else if(!this.loginCertification) // loginCertification result
        // {
        //     if(data.id)
        //     {
        //         this.userID = data.id;
        //         this.userName = data.name;
        //         game.betApi.setUserID(this.userID);
        //         this.loginCertification = true;
        //
        //         this._currentPlayButtonUpdate(false)
        //         console.log("gParam:", JSON.stringify(gParam))
        //
        //         if(gParam.joinroom != undefined && gParam.joinroom != null) {
        //             this.roomID = gParam.joinroom
        //             console.log("enter room:", this.rootID);
        //             game.betApi.enterRoom(function(isOK){
        //                 console.log("enterRoom is " +  isOK);
        //             }, this.roomID);
        //
        //         } else {
        //             console.log("enter random room:");
        //             game.betApi.enterRoom(function(isOK){
        //                 console.log("enterRoom is " +  isOK);
        //             }, null);
        //         }
        //     }
        // }
        // else if(data.type == "iq")
        // {
        //     if(data.class == "room")       //查询游戏房间列表
        //     {
        //         this.handleCreateRoom(data);
        //     }
        // }
        // else if(data.type == "message")
        // {
        // }
        // else if(data.type == "presence")
        // {
        //     if(data.action == "active")         //服务器广播进入房间的玩家
        //     {
        //     }
        //     else if(data.action == "gone")      //服务器广播离开房间的玩家
        //     {
        //         this.handleGone(data)
        //     }
        //     else if(data.action == "join")      //服务器通报加入游戏的玩家
        //     {
        //         this.handleJoin(data);
        //     }
        //     else if(data.action == "button")    //服务器通报本局庄家
        //     {
        //         this.handleButton(data);
        //     }
        //     else if(data.action == "preflop")   //服务器通报发牌
        //     {
        //         this.handlePreflop(data);
        //     }
        //     else if(data.action == "flop")   //发牌
        //     {
        //         this.handleFlop(data);
        //     }
        //     else if(data.action == "turn")   //发牌
        //     {
        //         this.handleTurn(data);
        //     }
        //     else if(data.action == "river")   //发牌
        //     {
        //         this.handleRiver(data);
        //     }
        //     else if(data.action == "pot")       //服务器通报奖池
        //     {
        //         this.handlePot(data)
        //     }
        //     else if(data.action == "action")    //服务器通报当前下注玩家
        //     {
        //         this.handleAction(data);
        //
        //     }
        //     else if(data.action == "bet")       //服务器通报玩家下注结果
        //     {
        //         this.handleBet(data);
        //     }
        //     else if(data.action == "showdown")  //服务器通报摊牌和比牌
        //     {
        //         this.handleShowDown(data);
        //     }
        //     else if(data.action == "state")  //服务器通报房间信息
        //     {
        //         this.handleState(data);
        //     }
        // }
    }
    callbackError(data) {
        console.log("callbackError" + JSON.stringify(data));
    }
}




