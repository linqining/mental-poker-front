'use strict';

import Animations   from "./animations.js";
import User from "./user.js";

function _fontString(size, fontname) {
    if (fontname == undefined) {
        //fontname = "Impact"
        fontname = "Apple LiSung Light"
    };
    var gFontScale = 1.0;

    return (size * gFontScale)+"px " + fontname
}


// game main state
var MainState = function(game) {
    this.game = game
    this.strVersion = "1.0";
    this.CONST = {}

    //弃牌
    this.CONST.BetType_Fold = 0;
    //让牌/看注
    this.CONST.BetType_Check = 1;
    //跟注
    this.CONST.BetType_Call = 2;
    //加注
    this.CONST.BetType_Raise = 3;
    //全压
    this.CONST.BetType_ALL = 4;

    this.CONST.BetTypeNames= ["fold", "check", "call", "raise", "allin"]


    //10 - 皇家同花顺(Royal Flush)
    //9  - 同花顺(Straight Flush)
    //8  - 四条(Four of a Kind)
    //7  - 葫芦(Fullhouse)
    //6  - 同花(Flush)
    //5  - 顺子(Straight)
    //4  - 三条(Three of a kind)
    //3  - 两对(Two Pairs)
    //2  - 一对(One Pair)
    //1  - 高牌(High Card)
    this.CONST.CardType_RoyalFlush = 10;
    this.CONST.CardType_StraightFlush = 9;
    this.CONST.CardType_FourOfAKind = 8;
    this.CONST.CardType_Fullhouse = 7;
    this.CONST.CardType_Flush = 6;
    this.CONST.CardType_Straight = 5;
    this.CONST.CardType_ThreeOfAKind = 4;
    this.CONST.CardType_TwoPairs = 3;
    this.CONST.CardType_OnePairs = 2;
    this.CONST.CardType_HighCard = 1;

    this.CONST.CardTypeNames= ["", "高牌", "一对", "两对", "三条", "顺子","同花","葫芦","四条","同花顺","皇家同花顺"]
    
    //param
    this.userPosRate;                   //九个座位的坐标，按比值
    this.userSizeRate;                  //座位的大小，按比例


    this.scale;                         //全局缩放比

    //this.currentDrawUser;               //当前玩家

    // room info
    this.currentRoomID;                 //房间ID
    this.bb;                            //大盲注
    this.sb;                            //小盲注
    this.timeoutMaxCount;               //最大计时

    //user info
    this.chips                          //玩家手上剩余筹码
    this.userName;                      //用户名
    this.userID

    //this.currentBettinglines;           //当前注额
    //this.bankerPos;                     //庄家座位号
    

    this.waitSelected1;                 //等待时按钮选择状态1
    this.waitSelected2;                 //等待时按钮选择状态2
    this.waitSelected3;                 //等待时按钮选择状态3

    this.sliderMinNum;                  //滑块最小值
    this.sliderMaxNum;                  //滑块最大值

    this.chipboxOpened;

    //class
    this.userList;                      //玩家对象
    this.starGroup;                     //掉落金币动画对象
    this.light;                         //聚光灯
    this.drawRectAnime;                 //画边框对象

    this.animation;                     //动画特效类
    //this.deskCardIDs = []
    //this.lstCardImage = []

    //control
    this.background;                    //背景图
    this.button1;                       //按钮1
    this.button2;                       //按钮2
    this.button3;                       //按钮3
    this.buttonGroup1;
    this.buttonGroup2;
    this.buttonGroup3;
    this.waitbutton1;                   //等待时按钮1
    this.waitbutton2;                   //等待时按钮2
    this.waitbutton3;                   //等待时按钮3
    this.waitButtonGroup1;
    this.waitButtonGroup2;
    this.waitButtonGroup3;
    this.lbLookorGiveup;                //文本(看牌或弃牌)
    this.lbCall;                        //文本(跟注)
    this.lbCallEvery;                   //文本(全下)
    this.lbLookorGiveupWait;            //文本(看牌或弃牌,等待)
    this.imgLookorGiveupWait;           //选择(看牌或弃牌,等待)
    this.lbCallWait;                    //文本(跟注,等待)
    this.imgCallWait;                   //选择(跟注,等待)
    this.lbCallEveryWait;               //文本(全下,等待)
    this.imgCallEveryWait;              //选择(全下,等待)
    this.blinds;                        //盲注控件
    this.publicCards;                   //公共牌（五张）
    this.privateCards;                  //底牌(别人的八张)
    this.selfCards;                     //底牌(自己的两张)
    this.chipPoolBK;                    //筹码池背景
    this.chipPool;                      //筹码池
    this.chipPoolCoins;                 //收集的筹码块(动画用)
    this.chipbox;                       //加注选择框
    this.chipboxButton1;                //加注选择按钮1
    this.chipboxButton2;                //加注选择按钮2
    this.chipboxButton3;                //加注选择按钮3
    this.chipboxButton4;                //加注选择按钮4
    this.chipboxText1;                  //加注选择按钮文字1
    this.chipboxText2;                  //加注选择按钮文字2
    this.chipboxText3;                  //加注选择按钮文字3
    this.chipboxText4;                  //加注选择按钮文字4
    this.chipboxSliderGroove;           //加注滑条凹槽
    this.chipboxSliderHandle;           //加注滑条滑块
    this.chipboxTextSlider;             //加注滑块当前值
    this.chipboxGroup;
    this.currentBet;                    //最近bet值
    this.currentBetType;                //最近bet类型
    this.autoCall=0;                    // 纪录当前跟注值
    this.btnExitRoom;
    this.xOffset;
    this.yOffset;

    this.groupUser // game user layer

    this.soundSendCard;
    this.soundReorderCard;
    this.soundClick;
    this.soundDing;
    this.soundLost;
    this.soundWin;
    
    
    this.imageDefaultProfile;

    this.chipsmoving;


    // 牌提示
    this.card_typebg;

    this.currentSliderValue;



    // game current data
    this.gameStateObj = {}
    this.gameStateObj.mybet;                         //当前玩家需要下注额下
    this.gameStateObj.bankerPos;                     //庄家座位号
    this.gameStateObj.playerSeatNum;                     //庄家标记位置
    this.gameStateObj.currentDrawUser;
    this.gameStateObj.mybetOnDesk;                   //当前玩家本局下注额
    this.gameStateObj.chipboxValue1 = 10;
    this.gameStateObj.chipboxValue2 = 20;
    this.gameStateObj.chipboxValue3 = 40;

    this.game;
    this.betApi;
    this.createDone = false;
    this.initRoomDone = false
}

var gImageDir = "assets_guopai/2x"


MainState.prototype = {


    create: function(game,betApi,roomID,chipAmount) {
        this.game = game;
        this.betApi = betApi;
        this.roomID = roomID;
        this.chipAmount = chipAmount;

        this.soundSendCard = game.sound.add("sendcard");
        this.soundReorderCard = game.sound.add("reordercard");
        this.soundClick = game.sound.add("click");
        this.soundDing = game.sound.add("ding");
        this.soundWin = game.sound.add("win");
        this.soundLost = game.sound.add("lost");
        this.chipsmoving = game.sound.add("chipsmoving");

        this.animation = new Animations();
        // this.imageBK = game.add.image(0, 0, "gamecenterbackground");

        this.background = this.game.add.image(512, 384, 'table_background');
        this.background.setDepth(-1);
        this.background.displayWidth = 1024;
        this.background.displayHeight = 768;

        this.imageBK = this.game.add.image(650, 400, 'table');
        this.imageBK.setScale(0.7);

        // this.imageBK.displayWidth = 1024;
        // this.imageBK.displayHeight = 768;

        // this.background = this.imageBK;


        const gameWidth = game.game.config.width;
        const gameHeight = game.game.config.height;

        var xScale = gameWidth / gameWidth;
        var yScale = gameHeight / this.imageBK.height;

        // 计算资源的缩放比
        this.scale = xScale < yScale ? xScale : yScale;
        this.scale = 0.6;
        this.xOffset = (gameWidth - this.imageBK.width * this.scale) / 2;
        // console.log("xoffset",this.xOffset,gameWidth,gameWidth)
        this.xOffset = 0


        this.yOffset = (gameHeight - this.imageBK.height * this.scale) / 2;
        // console.log("yoffset",this.yOffset,gameHeight,this.imageBK.height)
        this.yOffset = 0


        this.currentDrawUser = 0;
        this.timeoutMaxCount = 30;
        this.sliderMinNum = 0;
        this.sliderMaxNum = 100;
        this.userList = [];
       // this.userName = "cmdTest";
        this.currentRoomID = "1";
        this.bb = 0;
        this.sb = 0;
        this.publicCards = [];
        this.privateCards = [];
        this.selfCards = [];
        this.chipPoolCoins = [];
        this.waitSelected1 = false;
        this.waitSelected2 = false;
        this.waitSelected3 = false;
        this.dealerPosRate = [{x:0.632, y:0.312}, {x:0.796, y:0.349}, {x:0.841, y:0.434}, {x:0.694, y:0.570}, {x: 0.44, y:0.574}, {x:0.306, y:0.570}, {x:0.154, y:0.434}, {x:0.204, y:0.349}, {x:0.368, y:0.312}];
        // this.dealerPosRate = [{x:0.632, y:0.362}, {x:0.796, y:0.399}, {x:0.841, y:0.484}, {x:0.694, y:0.620}, {x: 0.44, y:0.624}, {x:0.306, y:0.620}, {x:0.154, y:0.484}, {x:0.204, y:0.399}, {x:0.368, y:0.362}];
        // this.userPosRate = [{x:0.692, y:0.152}, {x:0.856, y:0.187}, {x:0.914, y:0.54}, {x:0.754, y:0.734}, {x: 0.5, y:0.734}, {x:0.246, y:0.734}, {x:0.086, y:0.54}, {x:0.144, y:0.187}, {x:0.308, y:0.152}];
        this.userPosRate = [{x:0.692, y:0.252}, {x:0.856, y:0.307}, {x:0.914, y:0.54}, {x:0.754, y:0.734}, {x: 0.5, y:0.734}, {x:0.246, y:0.734}, {x:0.086, y:0.54}, {x:0.144, y:0.307}, {x:0.308, y:0.252}];

        this.userSizeRate = {width:0.076, height:0.152};
        var userCoinRate = [{x:0.656, y:0.292}, {x:0.82, y:0.329}, {x:0.831, y:0.484}, {x:0.673, y:0.557}, {x:0.464, y:0.557}, {x:0.305, y:0.557}, {x:0.139, y:0.484}, {x:0.108, y:0.329}, {x:0.27, y:0.292}];
       
        var coinsize = 27

        var userCoinWidth = coinsize * 1;
        var userTextRate = [{x:0.69, y:0.292}, {x:0.856, y:0.329}, {x:0.768, y:0.484}, {x:0.61, y:0.557}, {x:0.5, y:0.557}, {x:0.339, y:0.557}, {x:0.173, y:0.484}, {x:0.142, y:0.329}, {x:0.306, y:0.292}];

        game.load.on('filecomplete',this._fileComplete,this);

        game.load.once('loaderror',this._fileError,this);


        this.animation.setPosParam(this.background.width, this.background.height, this.xOffset, this.yOffset);
        this.groupUser = game.add.group();

        for (var i = 0; i < this.userPosRate.length; i++) {
            var dict = this.userPosRate[i];
            var user = new User(this.game);
            // console.log("user pos scale",this.scale);
            user.setScale(this.scale);
            user.setAnimation(this.animation);
            user.setRect((dict.x - this.userSizeRate.width / 2) * gameWidth + this.xOffset, (dict.y - this.userSizeRate.height / 2) * gameHeight + this.yOffset, this.userSizeRate.width * gameWidth, this.userSizeRate.height * gameHeight);
            user.setCoinRect(userCoinRate[i].x * gameWidth + userCoinWidth / 2 + this.xOffset, userCoinRate[i].y * gameHeight + userCoinWidth / 2 + this.yOffset, userCoinWidth, userCoinWidth);
            user.setCoinTextPos(userTextRate[i].x * gameWidth + this.xOffset, userTextRate[i].y * gameHeight + this.yOffset);
            if(dict.x == 0.5) {
                user.create(game,"", null, "", true);
            }
            else
            {
                user.create(game,"", null, "", false);
            }
            user.addUserToGroup(this.groupUser)
            user.setVisible(false);
            this.userList.push(user);
        }
        // console.log("userlist",this.userList)

        this.cardPosRate = [{x:0.344, y:0.456}, {x:0.422, y:0.456}, {x:0.5, y:0.456}, {x:0.578, y:0.456}, {x:0.656, y:0.456}];
        this.cardSizeRate = {width:0.064, height:0.156};
        for (var i = 0; i < this.cardPosRate.length; i++) {
            var dict = this.cardPosRate[i];
            var imageCard = game.add.image(dict.x * gameWidth + this.xOffset, (dict.y+0.05 )* gameHeight + this.yOffset, "cardBK");
            imageCard.setOrigin(0.5);
            imageCard.setScale(0.9, 0.9);
            imageCard.setVisible(false);
            this.publicCards.push(imageCard);
        }
        this.animation.setPublicCard(this.publicCards);

        var preflopBKRate = [{x:0.722, y:0.203}, {x:0.889, y:0.241}, {x:0.945, y:0.594}, {x:0.787, y:0.788}, {x:0.167, y:0.788}, {x:0.011, y:0.594}, {x:0.071, y:0.241}, {x:0.236, y:0.203}];
        for (var i = 0; i < preflopBKRate.length; i++) {
            var dict = preflopBKRate[i];
            var imageCard = game.add.image(dict.x * gameWidth + this.xOffset, dict.y * gameHeight + this.yOffset, "dcardBK");
            imageCard.setOrigin(0.5);
            imageCard.setScale(0.4, 0.4);
            imageCard.setVisible(false);
            imageCard.visible = false;
            this.privateCards.push(imageCard);

            if (i < 4) {
                this.userList[i].setDcard(imageCard)
            } else {
                this.userList[i+1].setDcard(imageCard)
            }
        }

        var selfCardRate = {x:0.57, y:0.79};
        var imageCard1 = game.add.image(selfCardRate.x * gameWidth + this.xOffset, selfCardRate.y * gameHeight + this.yOffset, "cardBK");
        imageCard1.setScale(0.7,0.7);

        imageCard1.angle = -10;
        imageCard1.visible = false;
        this.selfCards.push(imageCard1);
        var imageCard2 = game.add.image(selfCardRate.x * gameWidth + imageCard1.width / 2 + this.xOffset, selfCardRate.y * gameHeight + this.yOffset, "cardBK");
        imageCard2.setScale(0.7, 0.7);
        imageCard2.angle = 10;
        imageCard2.visible = false;
        this.selfCards.push(imageCard2);

        this.light = game.add.sprite(gameWidth / 2 + this.xOffset, gameHeight / 2 + this.yOffset, 'light');
        this.light.setOrigin(0, 0.5);
        this.light.setScale(this.scale);
        this.light.visible = false;
        this.animation.setLight(this.light);

        this.chipbox = game.add.sprite(0, 0, "fillbox");
        this.chipbox.setOrigin(0, 0);

        this.chipbox.setScale(this.scale);


        this.chipboxButton1 = game.add.image(0,0, "buttonblue");
        this.chipboxButton1.setInteractive();
        this.chipboxButton1.on('pointerdown', this.chipOnClick1.bind(this));

        this.chipboxButton2 = game.add.image(0,0, "buttonyellow");
        this.chipboxButton2.setInteractive();
        this.chipboxButton2.on('pointerdown', this.chipOnClick2.bind(this));

        this.chipboxButton3 = game.add.image(0,0, "buttonyellow");
        this.chipboxButton3.setInteractive();
        this.chipboxButton3.on('pointerdown', this.chipOnClick3.bind(this));

        this.chipboxButton4 = game.add.image(0,0, "buttonyellow");
        this.chipboxButton4.setInteractive();
        this.chipboxButton4.on('pointerdown', this.chipOnClick4.bind(this));


        this.chipboxButton1.setScale(this.scale*0.9,this.scale*1.2);
        this.chipboxButton2.setScale(this.scale*0.9,this.scale*1.2);
        this.chipboxButton3.setScale(this.scale*0.9,this.scale*1.2);
        this.chipboxButton4.setScale(this.scale*0.9,this.scale*1.2);

        var style = { font: _fontString(30), fill: "#FFFFFF"};
        this.chipboxText1 = game.add.text(0, 0, "AllIn", style);
        style = { font: _fontString(28), fill: "#FFFFFF"};
        this.chipboxText2 = game.add.text(0, 0, "120", style);
        this.chipboxText3 = game.add.text(0, 0, "80", style);
        this.chipboxText4 = game.add.text(0, 0, "50", style);
        this.chipboxText1.setOrigin(0);
        this.chipboxText2.setOrigin(0);
        this.chipboxText3.setOrigin(0);
        this.chipboxText4.setOrigin(0);
        this.chipboxText1.setScale(1);
        this.chipboxText2.setScale(1);
        this.chipboxText3.setScale(1);
        this.chipboxText4.setScale(1);

        this.chipboxSliderGroove = game.add.sprite(0, 0, "slidebar");
        this.chipboxSliderGroove.visible = true
        this.chipboxSliderHandle = game.add.sprite(0, 0, "btnslider");
        this.chipboxSliderHandle.visible = true
        this.chipboxSliderGroove.setScale(this.scale);
        this.chipboxSliderHandle.setScale(this.scale,this.scale*1.3);
        this.chipboxSliderGroove.setOrigin(0.5);
        this.chipboxSliderHandle.setOrigin(0.5);
        style = { font: _fontString(32), fill: "#CE8D00"};
        this.chipboxTextSlider = game.add.text(0, 0, "0", style);
        this.chipboxTextSlider.visible = true;
        // this.chipboxTextSlider.setOrigin(0.5);
        // this.chipboxTextSlider.setScale(1);
        this.chipboxGroup = game.add.group();
        this.chipboxGroup.add(this.chipbox);
        this.chipboxGroup.add(this.chipboxButton1);
        this.chipboxGroup.add(this.chipboxButton2);
        this.chipboxGroup.add(this.chipboxButton3);
        this.chipboxGroup.add(this.chipboxButton4);
        this.chipboxGroup.add(this.chipboxText1);
        this.chipboxGroup.add(this.chipboxText2);
        this.chipboxGroup.add(this.chipboxText3);
        this.chipboxGroup.add(this.chipboxText4);
        this.chipboxGroup.add(this.chipboxSliderGroove);
        this.chipboxGroup.add(this.chipboxSliderHandle);
        this.chipboxGroup.add(this.chipboxTextSlider);
        this.chipboxGroup.visible=false;
        this.chipboxGroup.setVisible(false);

        var buttonPosRate1 = {x:0.468, y:0.881};
        var buttonPosRate2 = {x:0.594, y:0.881};
        var buttonPosRate3 = {x:0.72, y:0.881};
        var buttonSizeRate = {width:0.213, height:0.119};


        // this.buttonrules = game.add.image(buttonPosRate1.x * gameWidth * 0.3 + this.xOffset, buttonPosRate1.y * gameHeight + this.yOffset,'buttonrules')
        // this.buttonrules.setInteractive()
        // var that = this;
        // this.buttonrules.on('pointerdown',function (){
        //     that.actionOnRuleShow()
        // })
        //
        // this.buttonrules.setScale(this.scale, this.scale);



        this.button1 = game.add.image(buttonPosRate1.x * gameWidth + this.xOffset, buttonPosRate1.y * gameHeight + this.yOffset, 'fold_btn').setInteractive().on('pointerdown', this.actionOnClick1.bind(this));
        this.button2 = game.add.image(buttonPosRate2.x * gameWidth + this.xOffset, buttonPosRate2.y * gameHeight + this.yOffset, 'call_btn').setInteractive().on('pointerdown', this.actionOnClick2.bind(this));
        this.button3 = game.add.image(buttonPosRate3.x * gameWidth + this.xOffset, buttonPosRate3.y * gameHeight + this.yOffset, 'call_btn').setInteractive().on('pointerdown', this.actionOnClick3.bind(this));



        this.waitbutton1 = game.add.image(buttonPosRate1.x * gameWidth + this.xOffset, buttonPosRate1.y * gameHeight + this.yOffset, 'fold_btn').setInteractive().on('pointerdown', this.waitOnClick1.bind(this));
        this.waitbutton2 = game.add.image(buttonPosRate2.x * gameWidth + this.xOffset, buttonPosRate2.y * gameHeight + this.yOffset, 'call_btn').setInteractive().on('pointerdown', this.waitOnClick2.bind(this));
        this.waitbutton3 = game.add.image(buttonPosRate3.x * gameWidth + this.xOffset, buttonPosRate3.y * gameHeight + this.yOffset, 'call_btn').setInteractive().on('pointerdown', this.waitOnClick3.bind(this));



        this.buttonGroup1 = game.add.group();
        this.buttonGroup2 = game.add.group();
        this.buttonGroup3 = game.add.group();
        this._setBetButtonsVisible(false)

        this.waitButtonGroup1 = game.add.group();
        this.waitButtonGroup2 = game.add.group();
        this.waitButtonGroup3 = game.add.group();
        this._setWaitButtonsVisible(false)

        style = { font: _fontString(28), fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.button1.width, align: "center" };
        this.lbLookorGiveup = game.add.text(buttonPosRate1.x * gameWidth + this.xOffset , buttonPosRate1.y * gameHeight + this.yOffset , "Fold", style);
        this.lbLookorGiveup.setOrigin(0.5);
        this.lbLookorGiveup.setScale(this.scale, this.scale);
        this.buttonGroup1.add(this.button1);
        this.buttonGroup1.add(this.lbLookorGiveup);
        style = { font: _fontString(28), fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.button2.width, align: "center" };
        this.lbCall = game.add.text(buttonPosRate2.x * gameWidth + this.xOffset , buttonPosRate2.y * gameHeight + this.yOffset , "Call", style);
        this.lbCall.setOrigin(0.5);
        this.lbCall.setScale(this.scale, this.scale);
        this.buttonGroup2.add(this.button2);
        this.buttonGroup2.add(this.lbCall);
        style = { font: _fontString(28), fill: "#FFFFFF", wordWrap: false, wordWrapWidth: this.button3.width, align: "center" };
        this.lbCallEvery = game.add.text(buttonPosRate3.x * gameWidth + this.xOffset, buttonPosRate3.y * gameHeight + this.yOffset , "Raise", style);
        this.lbCallEvery.setOrigin(0.5);
        this.lbCallEvery.setScale(this.scale, this.scale);
        this.buttonGroup3.add(this.button3);
        this.buttonGroup3.add(this.lbCallEvery);

        style = { font: _fontString(24), fill: "#FFFFFF", wordWrap: false, wordWrapWidth: 0.6 * this.waitbutton1.width, align: "left" };
        this.lbLookorGiveupWait = game.add.text(buttonPosRate1.x * gameWidth + this.xOffset , buttonPosRate1.y * gameHeight + this.yOffset , "Fold", style);
        this.lbLookorGiveupWait.setOrigin(0.3, 0.5);
        this.lbLookorGiveupWait.setScale(this.scale, this.scale);
        this.imgLookorGiveupWait = game.add.image(buttonPosRate1.x * gameWidth + this.xOffset, buttonPosRate1.y * gameHeight + this.yOffset, "checkOff");
        this.imgLookorGiveupWait.setOrigin(2,0.5);
        this.imgLookorGiveupWait.setScale(this.scale*0.7);
        this.waitButtonGroup1.add(this.waitbutton1);
        this.waitButtonGroup1.add(this.lbLookorGiveupWait);
        this.waitButtonGroup1.add(this.imgLookorGiveupWait);
        style = { font: _fontString(24), fill: "#FFFFFF", wordWrap: false, wordWrapWidth: 0.6 * this.waitbutton2.width, align: "left" };
        this.lbCallWait = game.add.text(buttonPosRate2.x * gameWidth + this.xOffset  , buttonPosRate2.y * gameHeight + this.yOffset , "Call", style);
        this.lbCallWait.setOrigin(0.3, 0.5);
        this.lbCallWait.setScale(this.scale, this.scale);
        this.imgCallWait = game.add.image(buttonPosRate2.x * gameWidth + this.xOffset , buttonPosRate2.y * gameHeight + this.yOffset , "checkOff");
        this.imgCallWait.setOrigin(2,0.5);
        this.imgCallWait.setScale(this.scale*0.7);
        this.waitButtonGroup2.add(this.waitbutton2);
        this.waitButtonGroup2.add(this.lbCallWait);
        this.waitButtonGroup2.add(this.imgCallWait);
        style = { font: _fontString(24), fill: "#FFFFFF", wordWrap: false, wordWrapWidth: 0.6 * this.waitbutton3.width, align: "left" };
        this.lbCallEveryWait = game.add.text(buttonPosRate3.x * gameWidth + this.xOffset , buttonPosRate3.y * gameHeight + this.yOffset , "Call Any", style);
        this.lbCallEveryWait.setOrigin(0.3,0.5);
        this.lbCallEveryWait.setScale(this.scale);
        this.imgCallEveryWait = game.add.image(buttonPosRate3.x * gameWidth + this.xOffset , buttonPosRate3.y * gameHeight + this.yOffset, "checkOff");
        this.imgCallEveryWait.setOrigin(2,0.5);
        this.imgCallEveryWait.setScale(this.scale*0.7);

        this.waitButtonGroup3.add(this.waitbutton3);
        this.waitButtonGroup3.add(this.lbCallEveryWait);
        this.waitButtonGroup3.add(this.imgCallEveryWait);

        this._setWaitButtonsVisible(false);
        console.log("current scale",this.scale)
        this.chipbox.x = this.button3.x - this.button3.width * 0.5;
        this.chipbox.y = this.button3.y - this.button3.height * 0.5 - this.chipbox.height * this.scale;
        // console.log("chipbox with height",this.chipbox.width, this.chipbox.height)
        //
        // console.log("chipbox axis",this.chipbox.x, this.chipbox.y)


        var chipboxButtonGap = 0.14;
        var chipboxButtonStart = 0.4;
        //this.chipbox.width = this.button3.width * 0.92;
        this.chipboxButton1.x = this.chipbox.x +this.chipbox.width*0.5*this.scale;
        this.chipboxButton1.y = this.chipbox.y + this.chipboxButton1.height*0.5;

        // this.chipboxButton1.width = this.chipbox.width * 0.1 *this.scale;
        // this.chipboxButton1.height = this.chipbox.height * 0.18 *this.scale;

        this.chipboxButton2.x = this.chipbox.x +this.chipbox.width*0.5*this.scale;
        this.chipboxButton2.y = this.chipbox.y +this.chipboxButton2.height *0.5+ this.chipbox.height * ( chipboxButtonGap);
        this.chipboxButton2.width = this.chipbox.width * 0.3;
        //this.chipboxButton2.height = this.chipbox.height * 0.18;
        this.chipboxButton3.x = this.chipbox.x + +this.chipbox.width*0.5*this.scale;
        this.chipboxButton3.y = this.chipbox.y + this.chipboxButton3.height *0.5+this.chipbox.height * ( chipboxButtonGap*2) ;
        this.chipboxButton3.width = this.chipbox.width * 0.3;
        //this.chipboxButton3.height = this.chipbox.height * 0.18;
        this.chipboxButton4.x = this.chipbox.x + this.chipbox.width*0.5*this.scale;
        this.chipboxButton4.y = this.chipbox.y + this.chipboxButton4.height *0.5 + this.chipbox.height * (chipboxButtonGap*3) ;
        this.chipboxButton4.width = this.chipbox.width * 0.3;
        //this.chipboxButton4.height = this.chipbox.height * 0.18;
        this.chipboxText1.x = this.chipboxButton1.x ;
        this.chipboxText1.y = this.chipboxButton1.y ;
        this.chipboxText1.setOrigin(0.5,0.5);
        this.chipboxText2.x = this.chipboxButton2.x ;
        this.chipboxText2.y = this.chipboxButton2.y ;
        this.chipboxText2.setOrigin(0.5,0.5);
        this.chipboxText3.x = this.chipboxButton3.x ;
        this.chipboxText3.y = this.chipboxButton3.y ;
        this.chipboxText3.setOrigin(0.5,0.5);
        this.chipboxText4.x = this.chipboxButton4.x ;
        this.chipboxText4.y = this.chipboxButton4.y ;
        this.chipboxText4.setOrigin(0.5,0.5);
        this.chipboxTextSlider.x = this.chipbox.x ;
        this.chipboxTextSlider.y = this.chipboxButton1.y - this.chipbox.height * 1.3 ;
        //this.chipboxSliderGroove.width = this.chipbox.width * 0.1;
        //this.chipboxSliderGroove.height = this.chipbox.height * 0.7;
        console.log("chipbox",this.chipbox.x)
        console.log("chipboxy",this.chipbox.y)
        this.chipboxSliderGroove.x = this.chipbox.x ;
        this.chipboxSliderGroove.y = this.chipboxButton4.y + this.chipboxButton4.height - this.chipboxSliderGroove.height * 0.5;
        console.log("groovy",this.chipboxSliderGroove.y)
        //this.chipboxSliderHandle.width = this.chipbox.width * 0.2;
        //this.chipboxSliderHandle.height = this.chipboxSliderHandle.width * 0.5;
        this.chipboxSliderHandle.x = this.chipbox.x ;
        this.chipboxSliderHandle.y = this.chipboxSliderGroove.y + this.chipboxSliderGroove.height * 0.5 - this.chipboxSliderHandle.height * 0.5;
        console.log("handley",this.chipboxSliderHandle.y)

        this.chipboxSliderHandle.inputEnabled = true;
        // this.chipboxSliderHandle.input.enableDrag();
        // this.chipboxSliderHandle.input.setDragLock(false);
        this.dealer = null;
        //this.chipboxSliderHandle.events.onDragStart.add(sliderDragStart, this);
        //this.chipboxSliderHandle.events.onDragStop.add(sliderDragStop, this);

        style = { font: _fontString(22), fill: "#ffffff", wordWrap: true, wordWrapWidth: this.background.width, align: "center" };
        this.blinds = game.add.text(gameWidth *0.458 , 0.35 * gameHeight + this.yOffset, "$" + this.sb + " / $" + this.bb, style);
        // this.blinds.setOrigin(0.5);
        // this.blinds.setScale(this.scale);

        this.chipPoolBK = game.add.image(0.5 * gameWidth , 0.403 * gameHeight , "chipPool");
        // this.chipPoolBK.setScale(this.scale, this.scale);

        style = { font: _fontString(22), fill: "#FFFFFF", wordWrap: true, wordWrapWidth: 0, align: "center" };
        this.chipPool = game.add.text(this.chipPoolBK.x , this.chipPoolBK.y-10 , "0", style);

        // this.chipPool.setOrigin(0.5);
        // this.chipPool.setScale(this.scale);

        //this.btnExitRoom = game.add.button(0.92 * gameWidth + this.xOffset, 0.02 * gameHeight + this.yOffset, 'exitdoor', this.actionOnExit, this);
        //this.btnExitRoom.width = this.chipboxButton1.width;
        //this.btnExitRoom.height = this.chipboxButton1.height;

        this.starGroup = game.add.group();
        this.starGroup.enableBody = true;

        var coinCount = 9;
        for (var i = 0; i < coinCount; i++) {
            var star = this.starGroup.create((i + 0.5) * gameWidth / coinCount + this.xOffset, 0, 'animeCoins');
            star.visible = false;
            // star.body.velocity.y = 0;
            star.setOrigin(0.5, 0.5);
            star.rotation = 100*Math.random();
        }

        //this.drawRectAnime = new rectdrawer(this.groupUser);

        this._currentPlayButtonUpdate(false);
        // if(gParam["app_token"] == undefined || gParam["app_token"] == null) {
        //     game.betApi.enterRoom(function(isOK){
        //         console.log("enterRoom is " +  isOK);
        //         if(isOK)
        //         {
        //         }
        //         else
        //         {
        //         //game.state.start("LoginState");
        //         alert("进入房间失败!");
        //         }
        //     });
        // }

        // this.card_typebg=game.add.sprite( "card_typebg");
        // this.card_typebg.setOrigin(0);
        // this.card_typebg.setScale(this.scale, this.scale);
        // this.card_typebg.x = - this.card_typebg.width
        // this.card_typebg.inputEnabled = true;
        // var that = this
        // this.card_typebg.setInteractive().on('pointerdown',function () {
        //     console.log("card_typebg clicked");
        //     that.actionCardTypeToggle();
        // })

        this.createDone = true
    },

    actionCardTypeToggle:function() {
        var to_x = 0;
        if (this.card_typebg.x == 0 ) {
            to_x = -this.card_typebg.width
        }

        var tweens = game.tweens.add(this.card_typebg);
        tweens.to({x:to_x}, 200, Phaser.Easing.Quadratic.In, true);

        // this.tween = this.game.tweens.add({
        //     targets: this.dealer,   // 目标对象
        //     x: this.dealerPosRate[seatIndex].x * this.game.width+ this.xOffset,
        //     y:this.dealerPosRate[seatIndex].y * this.game.height + this.yOffset,
        //     duration: 800,    // 持续时间（毫秒）
        //     ease: 'Linear',    // 缓动函数（支持字符串或函数）
        //     onComplete: () => { /* 动画完成回调 */ }
        // })
    },


    _setSliderValue1:function(value) {
        // console.log("_setSliderValue1",value)
        var nMaxPos = this.chipboxSliderGroove.y + this.chipboxSliderGroove.height * 0.5 - this.chipboxSliderHandle.height * 0.5;
        var nMinPos = this.chipboxSliderGroove.y - this.chipboxSliderGroove.height * 0.5 + this.chipboxSliderHandle.height * 0.5

        var deltaPos = nMaxPos - nMinPos
        var deltaValue = this.sliderMaxNum - this.sliderMinNum
        this.chipboxSliderHandle.y = nMaxPos - deltaPos / deltaValue * value
    },


    _updateSliderBar:function() {
        if(this.chipboxGroup.visible == true) {
            var nMaxPos = this.chipboxSliderGroove.y + this.chipboxSliderGroove.height * 0.5 - this.chipboxSliderHandle.height * 0.5;
            var nMinPos = this.chipboxSliderGroove.y - this.chipboxSliderGroove.height * 0.5 + this.chipboxSliderHandle.height * 0.5;
            if(this.chipboxSliderHandle.y > nMaxPos)
            {
                this.chipboxSliderHandle.y = nMaxPos;
            }
            if(this.chipboxSliderHandle.y < nMinPos)
            {
                this.chipboxSliderHandle.y = nMinPos;
            }

            var value = Math.round(this.sliderMaxNum - (this.chipboxSliderHandle.y - nMinPos) / (nMaxPos - nMinPos) * (this.sliderMaxNum - this.sliderMinNum));
            value = Math.round(value / 5) * 5;
            this.chipboxTextSlider.setText(value);
            if(value > 0) {
                this.lbCallEvery.setText("Raise " + value);
            } else {
                this.lbCallEvery.setText("Raise")
            }
            this.currentSliderValue = value;
        } else {
            this.lbCallEvery.setText("Raise")
        }
    },

    update:function()
    {
        for(var i = 0; i < this.userList.length; i++) {
            if(this.userList[i])
            {
                this.userList[i].update();
            }
        }

        this._updateSliderBar()
    },

    _fileComplete:function(progress, cacheKey, success, totalLoaded, totalFiles)
    {
        if(cacheKey.indexOf("userImage") != -1)
        {
            var index = parseInt(cacheKey.substr(9));
            var user = this.userList[index];
            user.setParam(null, "userImage" + index, null);
        }
    },

    _fileError:function(cacheKey) {
        if(key.indexOf("userImage") != -1) {
            var index = parseInt(cacheKey.substr(9));
            var user = this.userList[index];
            user.setParam(null, "defaultProfile", null);
        }
    },

    actionOnExit:function()
    {
        this.betApi.leaveRoom();
        this.game.scene.start("Hall");
    },

    // 看或弃牌
    waitOnClick1:function() {
        console.log("waitOnClick1 click")

        if(this.waitSelected1)
        {
            this.waitSelected1 = false;
            let frame = this.game.textures.get("checkOff");
            this.imgLookorGiveupWait.setTexture(frame);
        }
        else
        {
            this.waitSelected1 = true;
            this.waitSelected2 = false;
            this.waitSelected3 = false;
            let onFrame = this.game.textures.get("checkOn");
            let offFrame = this.game.textures.get("checkOff");

            this.imgLookorGiveupWait.setTexture( onFrame);
            this.imgCallWait.setTexture(offFrame);
            this.imgCallEveryWait.setTexture(offFrame);
        }

    },

    // 自动看牌／自动跟注
    waitOnClick2:function()
    {
        console.log("waitOnClick2 click")

        if(this.waitSelected2) {
            this.waitSelected2 = false;
            let offFrame = this.game.textures.get("checkOff");
            this.imgCallWait.setTexture(offFrame);
            this.lbCallWait.setText("Check/Fold");
        }
        else
        {
            this.waitSelected1 = false;
            this.waitSelected2 = true;
            this.waitSelected3 = false;
            let onFrame = this.game.textures.get("checkOn");
            let offFrame = this.game.textures.get("checkOff");

            this.imgLookorGiveupWait.setTexture(offFrame);
            this.imgCallWait.setTexture(onFrame);
            this.imgCallEveryWait.setTexture(offFrame);

            var bet = this.currentBet - this.gameStateObj.mybetOnDesk;
            if (bet > 0 && bet < this.chips) {
                this.lbCallWait.setText("Call "+ bet);
            } else {
                this.lbCallWait.setText("Check");
            }
        }
    },

    // 跟任何注
    waitOnClick3:function()
    {
        console.log("waitOnClick3 click")

        if(this.waitSelected3)
        {
            this.waitSelected3 = false;
            let offFrame = this.game.textures.get("checkOff");
            this.imgCallEveryWait.setTexture(offFrame);
        }
        else
        {
            this.waitSelected1 = false;
            this.waitSelected2 = false;
            this.waitSelected3 = true;
            let onFrame = this.game.textures.get("checkOn");
            let offFrame = this.game.textures.get("checkOff");
            this.imgLookorGiveupWait.setTexture(offFrame);
            this.imgCallWait.setTexture(offFrame);
            this.imgCallEveryWait.setTexture(onFrame);
        }
    },

    // 弃牌
    actionOnClick1:function()
    {
        console.log("actionOnClick1 click")
        var that = this
        this.betApi.betFold(function(isok) {
            // send OK or NOK
            that._setBetButtonsVisible(false)
            that._playSound(that.soundClick);
        });
        
        console.log("game quit ============");

    },

    // 跟注
    actionOnClick2:function()
    {
        console.log("actionOnClick2 click")

        var that = this
        var betdiff = this.gameStateObj.mybet-this.gameStateObj.mybetOnDesk

        if(betdiff > this.chips) {
            betdiff = this.chips; 
        }

        //if (betdiff >= 0 ) {
            this.betApi.bet(betdiff,function(isok) {
                // send OK or NOK
                that._playSound(that.soundClick);
                that._setBetButtonsVisible(false)
            })
        //}


        
       // test native interface
        // gameQuit("test");
    },


    _raseAction:function(value) {
        console.log("raise value",value)
        var that = this
        this.betApi.bet(value,function(isok) {
                // send OK or NOK
                that._playSound(that.soundClick);
                that._setBetButtonsVisible(false)
            })

        that.chipboxGroup.visible = false ;
        that.chipboxGroup.setVisible(false);
    },

    // 加注
    actionOnClick3:function() {
        console.log("actionOnClick3 clicked visible",this.chipboxGroup.visible)
        if(this.chipboxGroup.visible) {
            var text = this.chipboxTextSlider.text
            var betValue = parseInt(text)
            this._raseAction(betValue)
            this.lbCallEvery.setText("Raise");
        } else {
            var bet = this.gameStateObj.mybet - this.gameStateObj.mybetOnDesk;

            if(bet > 0 && bet < this.chips) {
                bet=bet*2
            }
            
            if(bet > this.chips) {
                bet = 0;
            }

            this._updatePoolChipValue(bet*2?bet*2:10*2);
            this._setSliderRange(bet, this.chips);
            this.chipboxGroup.visible = true;
            this.chipboxGroup.setVisible(true);
            this.chipboxOpened = true;

            this.lbCallEvery.setText("Raise "+bet);
        }
    },

    chipOnClick1:function()
    {
        console.log("chipOnClick1",this.chips)

        //this._raseAction(this.chips)
        this._setSliderValue1(this.chips)
    },

    chipOnClick2:function()
    {
        console.log("chipOnClick2",this.gameStateObj.chipboxValue3,this.currentSliderValue)

        //this.chipboxGroup.visible = false;
        //this._setSliderValue(this.gameStateObj.chipboxValue3)
        //this._raseAction(this.gameStateObj.chipboxValue3)
        this._setSliderValue1(this.gameStateObj.chipboxValue3 + this.currentSliderValue)
    },

    chipOnClick3:function()
    {
        console.log("chipOnClick3",this.gameStateObj.chipboxValue2,this.currentSliderValue)

        //this._setSliderValue(this.gameStateObj.chipboxValue2)
        //this._raseAction(this.gameStateObj.chipboxValue2)
        this._setSliderValue1(this.gameStateObj.chipboxValue2 + this.currentSliderValue)
    },

    chipOnClick4:function()
    {
        console.log("chipOnClick4",this.gameStateObj.chipboxValue1,this.currentSliderValue)
        //this._setSliderValue(this.gameStateObj.chipboxValue1)
        //this._raseAction(this.gameStateObj.chipboxValue1)
        this._setSliderValue1(this.gameStateObj.chipboxValue1 + this.currentSliderValue)
    },

    actionOnRuleShow:function() {
        this.actionCardTypeToggle();
    },

    _showCoinAnime:function()
    {
        this.starGroup.forEach(function(child){
            child.y = 0;
            child.visible = true;
            child.body.velocity.y = 500 + 150 * Math.random();
        }, this);
    },

    callbackOpen:function(data)
    {
        console.log("callbackOpen " + data);

        this.betApi.checkVersion(this.strVersion, function(isOK){
            console.log("checkVersion " + isOK);
        });
    },

    callbackClose:function(data)
    {
        console.log("callbackClose " + data);
        this.loginCertification = false;

        this._disconnectReset();
    },

    callbackMessage:function(data) {
        if (!this.createDone){
            return
        }
        if (this.loginCertification && !this.initRoomDone && !(data.action == "state" && data.type=="presence")){
            return
        }
        // console.log("callbackMessage " + JSON.stringify(data));
        if(data.version && data.version == this.strVersion) {
            var authToken = gParam.user_name;

            if (this.appToken != undefined ) {
                authToken = this.appToken
            };

            this.betApi.loginCertification(authToken, function(isOK){
                console.log("loginCertification is " +  isOK);
                //alert("loginCertification is" +  isOK);
            });
        }
        else if(!this.loginCertification) // loginCertification result
        {
            if(data.id) {
                this.userID = data.id;
                this.userName = data.name;
                this.betApi.setUserID(this.userID);
                this.loginCertification = true;

                this._currentPlayButtonUpdate(false)
                // console.log("gParam:", JSON.stringify(gParam))

                // if(gParam.joinroom != undefined && gParam.joinroom != null) {
                //     this.roomID = gParam.joinroom
                //     console.log("enter room:", this.rootID);
                //     this.betApi.enterRoom(function(isOK){
                //         console.log("enterRoom is " +  isOK);
                //     }, this.roomID);
                //
                // } else {
                    console.log("enter random room:");
                    this.betApi.enterRoom(function(isOK){
                                console.log("enterRoom is " +  isOK);
                    }, this.roomID,this.chipAmount);
                // }
            }
        }
        else if(data.type == "iq")
        {
            if(data.class == "room")       //查询游戏房间列表
            {
                this.handleCreateRoom(data);
            }
        }
        else if(data.type == "message")
        {
        }
        else if(data.type == "presence") {
            // console.log("presence data",JSON.stringify(data))
            if(data.action == "active")         //服务器广播进入房间的玩家
            {
            }
            else if(data.action == "gone")      //服务器广播离开房间的玩家
            {
                this.handleGone(data)
            }
            else if(data.action == "join")      //服务器通报加入游戏的玩家
            {
                this.handleJoin(data);
            }
            else if(data.action == "button")    //服务器通报本局庄家
            {
                this.handleButton(data);
            }
            else if(data.action == "preflop")   //服务器通报发牌
            {
                this.handlePreflop(data);
            }
            else if(data.action == "flop")   //发牌
            {
                this.handleFlop(data);
            }
            else if(data.action == "turn")   //发牌
            {
                this.handleTurn(data);
            }
            else if(data.action == "river")   //发牌
            {
                this.handleRiver(data);
            }
            else if(data.action == "pot")       //服务器通报奖池
            {
                this.handlePot(data)
            }
            else if(data.action == "action")    //服务器通报当前下注玩家
            {
                this.handleAction(data);

            }
            else if(data.action == "bet")       //服务器通报玩家下注结果
            {
                this.handleBet(data);

            }
            else if(data.action == "showdown")  //服务器通报摊牌和比牌
            {
                this.handleShowDown(data);
            }
            else if(data.action == "state")  {//服务器通报房间信息
                this.handleState(data);
                this.initRoomDone = true;
            }
        }
    },

    callbackError:function(data)
    {
        console.log("callbackError" + data);
    },

    handleCreateRoom:function(data) 
    {
        this.roomID = data.room.id;
        this.betApi.setRoomID(this.roomID);
        //game.Native.roomCreated(this.rootID);
    },

    handleJoin:function(data) {
        console.log("JoinRoom data",JSON.stringify(data))
        var occupant = data.occupant;
        //通过和自己的座位号码推算应该在第几个座位
        var self = this.userList[ (this.userList.length - 1) / 2];
        var seatOffset = occupant.index - self.param.seatNum;
        var userIndex = (this.userList.length - 1) / 2 + seatOffset;
        if(userIndex >= this.userList.length)
        {
            userIndex -= this.userList.length;
        }
        else if(userIndex < 0)
        {
            userIndex += this.userList.length;
        }
        var user = this.userList[userIndex];
        if(occupant.profile && occupant.profile != "") {
            console.log("user profile",occupant.profile)
            this.game.load.image("userImage" + userIndex, occupant.profile, true);
            // this.game.load.start();
        }

        if (occupant.name == "") {
            console.log("error userName =", occupant.name);
        }

        user.setParam(occupant.name, occupant.profile, occupant.chips);
        user.param.seatNum = occupant.index;
        user.param.userID = occupant.id;

        user.visible = true;
    },

    handlePot:function(data) {
        var arrayPool = data.class.split(",");

        this.chipPoolCoins = this.animation.showCollectChip(this.game,this.userList, this.chipPoolBK.x - this.chipPoolBK.width*0.3 , this.chipPoolBK.y, this.chipPoolCoins);
        this._resetGameRoundStatus()

        var poolall = 0;

        for(var i = 0; i < arrayPool.length; i++) {
            poolall += parseInt(arrayPool[i])
        }

        this.chipPool.setText(poolall);

        // clear Use coin
        for (var i = this.userList.length - 1; i >= 0; i--) {
            this.userList[i].setUseCoin("");
        };
    },

    handleGone:function(data) {
        var goneUserID = data.occupant.id;
        var user = this._userByUserID(goneUserID);
        console.log("Handle Gone ........UserID:",goneUserID);
        
        if(user.param.userID == this.userID) {
            //gameQuit();
            console.log("Handle Gone ........");
            this.selfCards[0].visible = false;
            this.selfCards[1].visible = false;
            console.log("chips", this.chips)
            
            if(this.chips <= 0) {
                if(this.game.Native != undefined) {
                    this.game.Native.confrimPopupWindow("你的钱输光了！！","你的积分为0， 即将被踢出游戏", "确认", function(data){
                                                   game.Native.quitToApp();
                                               });
                    return;
                }
                this.game.scene.start('Hall');
            }
        }
        
        user.clean();
        user.setVisible(false)

        var seatNum = user.param["seatNum"]
        if(this.gameStateObj.bankerPos == seatNum) {
            if(this.dealer != null) {
                this.dealer.destroy();
                this.dealer = null;
            }
        }
        
        
    },

    handleButton:function(data)
    {
        this.gameStateObj.bankerPos = data.class;
        var seatIndex = this._userIndexBySeatNum(parseInt(data.class))

        
        if(this.dealer == null) {
            const gameWidth = this.game.width;
            const gameHeight = this.game.height;
            this.dealer = this.game.add.sprite(this.dealerPosRate[seatIndex].x * gameWidth + this.xOffset, this.dealerPosRate[seatIndex].y * gameHeight + this.yOffset, "dealer");
            this.dealer.setOrigin(0.5);
            this.dealer.setScale(this.scale, this.scale);

            this.groupUser.add(this.dealer);

        } else {
            
            var user = this._userBySeatNum(this.gameStateObj.bankerPos)
            if(user) {
                this.tween = this.game.tweens.add({
                    targets: this.dealer,   // 目标对象
                    x: this.dealerPosRate[seatIndex].x * this.game.width+ this.xOffset,
                    y:this.dealerPosRate[seatIndex].y * this.game.height + this.yOffset,
                    duration: 800,    // 持续时间（毫秒）
                    ease: 'Linear',    // 缓动函数（支持字符串或函数）
                    onComplete: () => { /* 动画完成回调 */ }
                })
            }
        
        }

        this._initNewRound()

        var that = this

        //this._playSound(this.soundReorderCard, function(){
            that._sendCardAnimation();
        //}, true);
    },

    handlePreflop:function(data)
    {
        var arrayCards = data.class.split(",");
        
        this._loadSelfCard(arrayCards)
        /*
        for(var i = 0; i < this.praviteCards.length; i++)
        {
            var card = this.praviteCards[i];
            card.visible = true;
        }
        */

    },
    
    handleFlop:function(data)
    {
        var arrayParam = data.class.split(",");
        var arrayCards = arrayParam.slice(0,3) 
        this.animation.setPublicCard(this.publicCards);
        this._flopAnimation(arrayCards[0], arrayCards[1], arrayCards[2])

        this._setBetCardType(arrayParam[3])
    },
    handleTurn:function(data)
    {
        var arrayCards = data.class.split(",");
        this._turnAnimation(arrayCards[0])

        this._setBetCardType(arrayCards[1])
        // TODO setName
    },

    handleRiver:function(data)
    {
        var arrayCards = data.class.split(",");
        this._riverAnimation(arrayCards[0])

        this._setBetCardType(arrayCards[1])
    },

    handleAction:function(data)
    {
        var arrayInfo = data.class.split(",");
        var seatNum = arrayInfo[0]; //座位号
        var bet = arrayInfo[1]; //单注额

        this.gameStateObj.playerSeatNum = seatNum

        var user = this._userBySeatNum(seatNum)
        this.gameStateObj.currentBettinglines = bet        

        // 当前玩家
        if (user.param.userID == this.userID) {

            if ( parseInt(bet) > 0 ) {
                this.gameStateObj.mybet = bet
            };

            var diffbet = this.gameStateObj.mybet - this.gameStateObj.mybetOnDesk

            if(diffbet > this.chips) {
                diffbet = this.chips;
                this.lbCall.setText("Allin");
            } else if(diffbet == 0 ) {
                this.lbCall.setText("Check");
            } else {
                this.lbCall.setText("Call "+ diffbet);
            }

            if(this._betWaitButtonChecked()) {
                this._autoAction();
            } else {
                this._currentPlayButtonUpdate(true);
            }
            

        } else {
            this._currentPlayButtonUpdate(false);
        }

        this._drawUserProgress(user.rect.left, user.rect.width, user.rect.top, user.rect.height)
    },

    handleBet:function(data)
    {

        var arrayInfo = data.class.split(",");
        var betTypeName = arrayInfo[0]  // 下注类型
        var betvalue = parseInt(arrayInfo[1]) // 本局下注总数
        var chips = parseInt(arrayInfo[2]) // 手上剩余筹码数

        var user = this._userByUserID(data.from)
        // user.setParam(null, null, chips, null)
        var betType = this._betTypeByBetTypeNames(betTypeName)

        if (user.param.userID != this.userID) {
            this._playSound(this.soundClick);
        }

        this.currentBet = betvalue
        this.currentBetType = betType
     
        switch(betType){
            case this.CONST.BetType_ALL:
            case this.CONST.BetType_Call:
            case this.CONST.BetType_Raise: {
                if (user) {
                    user.setUseCoin(betvalue);
                    if (user.param.userID == this.userID) {
                        console.log("set chips bet",chips)

                        this.chips = chips;
                        this.gameStateObj.mybetOnDesk = betvalue
                    };
                } else {
                    console.log("ERROR: can't find user, userid:",data.from);
                }

                if(betType == this.CONST.BetType_Raise) {
                    // 当 raise 后 wait button 发生变化

                    //跟注或看牌，取消掉
                    if(this.waitSelected2 === true) {
                        this.waitOnClick2()
                    }
                }

            }
            break;
            //弃牌
            case this.CONST.BetType_Fold:
                user.setGiveUp(true);
                if (user.param.userID == this.userID) {
                    this._resetGameRoundStatus()
                }
                break;
            //看牌
            case this.CONST.BetType_Check:
                break;
            default:
                console.log("ERROR: betType not a vaid value:",betType);
                break;
        }


    },

    handleShowDown:function(data)
    {
        // console.log("showdown:",data);

        if(this.userProgressObj != undefined) {
            this.userProgressObj.stop();
            this.userProgressObj.clean();
            //this.animation.stopShake = true; 
        }

        var roomInfo = data.room;
        var playerList = roomInfo.occupants;

        var maxHand = 0
        var maxHandIndex = 0

        // 如果都没有hand说明只有一个人下注，没有翻牌的情况
        var lastHasCardsIndex = -1; //保存最后一个出牌的人index
        var hashand = false;
        
        
        for (var i = playerList.length - 1; i >= 0; i--) {
            var occupantInfo = playerList[i]

            if(!occupantInfo) {
                continue;
            }

            if (occupantInfo.cards) {
                lastHasCardsIndex = i 
            }

            if (occupantInfo.hand) {
                hashand = true
            }

            var hand = occupantInfo.hand
            if (maxHand < hand) {
                maxHand = hand
                maxHandIndex = i
            }
        };

        //只有一个人下注，没有翻牌的情况
        if (!hashand && lastHasCardsIndex!=-1) {
           maxHandIndex = lastHasCardsIndex
        } 

        var winOccupantItem = playerList[maxHandIndex]


        if (winOccupantItem != undefined && winOccupantItem != null) {
                 var winUser = this._userByUserID(winOccupantItem.id)
                 if(winOccupantItem.chips > 0 && winOccupantItem.id == this.userID) {
                    this.chips = winOccupantItem.chips;
                 }

                 winUser.setChips(this.chips);
                 // console.log("winner is ",winUser)

                if (winOccupantItem.action != "fold") {
                    if(winOccupantItem.cards != null && winOccupantItem.cards != undefined) {
                        winUser.setWinCard(winOccupantItem.cards[0], winOccupantItem.cards[1]);

                        // console.log("winner card  is ",winOccupantItem.cards)

                        // if(winOccupantItem.id != this.userID) {
                        //     this._playSound(this.soundLost);
                        // } else {
                        //     this._playSound(this.soundWin);
                        // }

                        var hand = winOccupantItem.hand;
                        // console.log("winner card  is ",winOccupantItem.cards,"hand",hand);

                        if(hand != undefined && hand != null) {
                            var type = (hand >>> 16)
                            if(type > 10) {
                                type = 0
                            }
                            if(winOccupantItem.id !== this.userID) {
                                // console.log("win card type is ",type)
                                winUser.setUserTitle(this.CONST.CardTypeNames[type])
                            }
                        }
                    }

            }

            var seatNum = winUser.param["seatNum"];
            var point = this._userPositionBySeatNum(seatNum)

            for(i = 0; i < this.chipPoolCoins.length; i++) {
                this._playSound(this.chipsmoving)
                this.animation.showChipMove(this.game,this.chipPoolCoins[i], point.x, point.y, 500)
            }
        }
        for (var i = this.userList.length - 1; i >= 0; i--) {
            this.userList[i].setUseCoin("");
        };
    },

    handleState:function(data) {
        // console.log("handle state",JSON.stringify(data));
        var roomInfo = data.room;
        var playerList = roomInfo.occupants;

        this.roomID = roomInfo.id;
        this.bb = roomInfo.bb;
        this.sb = roomInfo.sb;
        this.blinds.setText("$" + this.sb + " / $" + this.bb);
        //this.currentBettinglines = roomInfo.bet;
        this.timeoutMaxCount = roomInfo.timeout;
        var publicCards = roomInfo.cards;
        if(!publicCards)
        {
            publicCards = [];
        }
        console.log("public cards",publicCards)
        //初始化公共牌
        var lstCardID = [];
        var lstCardImage = [];
        for(var i = 0; i < publicCards.length; i++) {
            this.publicCards[i].visible = true;
            let frame = this.game.textures.get(publicCards[i]);
            this.publicCards[i].setTexture(frame);
            // this.publicCards[i].load.image(publicCards[i], this.publicCards[i].frame);
        }
        for(var i = publicCards.length; i < this.publicCards.length; i++) {
            if (this.publicCards[i].visible) {
                this.publicCards[i].visible = false;
                // this.publicCards[i].load.image("cardBK", this.publicCards[i].frame);
                let frame = this.game.textures.get("cardBK");
                this.publicCards[i].setTexture(frame);
            }
        }

        //初始化筹码池
        var chipPoolCount = 0;

        if(!roomInfo.pot) {
            roomInfo.pot = []
        }

        for(var i = 0; i < roomInfo.pot.length; i++)
        {
            chipPoolCount += roomInfo.pot[i];
        }
        this.chipPool.setText(chipPoolCount);
        this.gameStateObj.bankerPos = roomInfo.button;

        //初始化玩家
        var occupants = roomInfo.occupants;
        for (var i = 0; i < this.userList.length; i++)
        {
            var user = this.userList[i];
            user.setParam(null, null, "");
        }
        //计算座位偏移量，以自己为5号桌计算
        var isSendCard = true;
        var playerOffset = 0;
        for(var i = 0; i < occupants.length; i++) {
            var userInfo = occupants[i];
            if(userInfo && userInfo.id == this.userID)
            {
                var arrayCards = userInfo.cards;
                if(arrayCards != undefined && arrayCards != null ) {
                    this._loadSelfCard(arrayCards);
                } else {
                    isSendCard = false;
                }
                playerOffset = (this.userList.length - 1) / 2 - userInfo.index;
                console.log("set chips ",userInfo.chips)
                this.chips = userInfo.chips
                break;
            }
        }
        for(var i = 0; i < occupants.length; i++)
        {
            var userInfo = occupants[i];
            if(!userInfo)
            {
                continue;
            }
            var index = userInfo.index + playerOffset;
            if(index >= this.userList.length)
            {
                index -= this.userList.length;
            }
            else if(index < 0)
            {
                index += this.userList.length;
            }
            var user = this.userList[index];
            if(userInfo.profile && userInfo.profile != "")
            {
                this.game.load.image("userImage" + index, userInfo.profile, true);
                // this.game.load.start();
            }
            user.setParam(userInfo.name, null, userInfo.chips, (userInfo.id == this.userID));
            user.param.seatNum = userInfo.index;
            user.param.userID = userInfo.id;
            user.setVisible(true);

            if(user.dcard != undefined  && user.dcard != null) {
                 user.dcard.visible = true;
            }

        }
    },


    _loadSelfCard:function(arrayCards) {
        for(var i = 0; i < this.selfCards.length; i++) {
            var card = this.selfCards[i];
            card.visible = false;
            let frame = this.game.textures.get(arrayCards[i]);
            card.setTexture(frame);
        }
    },


    _betTypeByBetTypeNames:function(name) {
        for (var i = this.CONST.BetTypeNames.length - 1; i >= 0; i--) {
            if (this.CONST.BetTypeNames[i] == name) {
                return i;
            }
        };
        return -1;
    },

    _userByUserParam:function(key, value) {
        for (var i =0;  i < this.userList.length;  i++) {
            var obj = this.userList[i];
            if (obj.param[key] == value) {
                return [obj, i];
            }
        }
        return null
    },

    _userByUserID:function(userid) {
        var ret = this._userByUserParam("userID", userid)
        if(ret) {
            return ret[0]
        }
        return null
    },

    _userBySeatNum:function(seatnum) {
        var ret = this._userByUserParam("seatNum", seatnum)
        if(ret) {
            return ret[0]
        }
    },

    _userIndexBySeatNum:function(seatnum) {
        var ret = this._userByUserParam("seatNum", seatnum)
        if(ret) {
            return ret[1]
        }
        return -1;
    },


    _currentPlayButtonUpdate:function(isCurrentPlayer) {
        this._setWaitButtonsVisible(!isCurrentPlayer)
        this._setBetButtonsVisible(isCurrentPlayer);
    },

    _drawUserProgress:function(left, width, top, height) {

            if(this.userProgressObj != undefined) {
                this.userProgressObj.stop()
                this.userProgressObj.clean();
                //this.animation.stopShake = true;
            }

            var user = this._userBySeatNum(this.gameStateObj.playerSeatNum)
            var that = this; 
            this.userProgressObj = user.createProgressObject(
                this.game,
                this.timeoutMaxCount,function(){
            var user = that._userBySeatNum(that.gameStateObj.playerSeatNum)
            if(user.param["userID"] == that.userID) {
                that.animation.showShake(that.game,that.selfCards[0]);
                that.animation.showShake(that.game,that.selfCards[1]);
            }

            }, 
            function(blComplete) {
                that.animation.stopShake = true;
                if(blComplete == true) {
                    that._playSound(that.soundDing)
                    that.chipboxGroup.visible=false;
                    that.chipboxGroup.setVisible(false);
                    that.lbCallEvery.setText("Raise")
                } 
            })

            this.userProgressObj.draw()

        this.animation.showLight(this.game,left + width / 2, top + height / 2);
    },

    /*

    _stopDrawUserProgress:function() {

        this.animation.stopShake = true;

        var user = this._userBySeatNum(this.gameStateObj.playerSeatNum)
        user.stopDrawWaitingImage()

        user.cleanWaitingImage()
    },
    */

    _initNewRound:function() {
        for (var i =0;  i < this.userList.length;  i++) {
            var user = this.userList[i]
            if (user.param.seatNum != -1) {
                console.log("=====UserName:", user.param.userName);
                if((!user.param.userName) || 
                    user.param.userName == null) {
                    console.log("initNewRound null username");
                }
            }else{
                continue
            }
            // console.log(user.param);

            this.selfCards[0].visible = false;
            this.selfCards[1].visible = false;

            user.reset()
        }

       this._clearWaitButtons();
       this._setBetButtonsVisible(false);
       this._setWaitButtonsVisible(false);
       this._resetGameRoundStatus();
       this._resetPublicCard();
       this._clearChipPoolCoins();

       this.gameStateObj.mybet = this.bb
       this.chipPool.setText("0");
       this.autoCall = 0;
    },

    _clearWaitButtons:function() {
        this.waitSelected1 = false;
        this.waitSelected2 = false;
        this.waitSelected3 = false;

        this.lbCallWait.setText("Call");
        this.lbLookorGiveupWait.setText("Check/Fold")
        this.lbCallEveryWait.setText("Call Any")

        this._betWaitButtonCheckOn(this.imgLookorGiveupWait, false);
        this._betWaitButtonCheckOn(this.imgCallWait, false);
        this._betWaitButtonCheckOn(this.imgCallEveryWait, false);
    }, 

    _setBetButtonsVisible: function(blVisible) {
        this.buttonGroup1.setVisible(blVisible);
        this.buttonGroup2.setVisible(blVisible);
        this.buttonGroup3.setVisible(blVisible);

        if(blVisible == false) {
            this.chipboxGroup.visible=false;
            this.chipboxGroup.setVisible(false);
        }

    },

    _setWaitButtonsVisible:function(blVisible) {
        this.waitButtonGroup1.setVisible(blVisible);
        this.waitButtonGroup2.setVisible(blVisible);
        this.waitButtonGroup3.setVisible(blVisible);
    },

    _disconnectReset:function() {
        for (var i =0;  i < this.userList.length;  i++) {
            this.userList[i].clean();
        }

        if(this.light)
        {
            this.light.visible = false;
        }
        // TOD Reconnect...
    },

    _autoAction:function() {
        // 看或弃牌
        var user = this._userByUserID(this.userID)

        if (this.waitSelected1) {
            this.actionOnClick1()
            this.waitSelected1 = false;
        // 自动看牌/自动跟注
        } else if(this.waitSelected2) {
            this.actionOnClick2()
            this.waitSelected2 = false;
        // 跟任何注
        } else if(this.waitSelected3) {
            //this.actionOnClick3()
            var bet = this.currentBet - this.gameStateObj.mybetOnDesk
            if(bet > this.chips) {
                bet = this.chips;
            }

            this._raseAction(bet)
            this.waitSelected3 = false;
        }

        this._clearWaitButtons();
        this._setWaitButtonsVisible(false);
    },

    _resetGameRoundStatus:function() {
        this.gameStateObj.mybet = 0;     //当前玩家需要下注额下
        this.gameStateObj.mybetOnDesk = 0;
    },

    _flopAnimation:function(card1, card2, card3) {
        var deskCardIDs = []
        //var arrayCards = data.class.split(",");
        //var publicCards = [arrayCards[0], arrayCards[1], arrayCards[2]];
        var publicCards = [card1, card2, card3];

        var lstCardImage = [];
        for (var i = 0; i < publicCards.length; i++) {
            this.animation.publicCards[i].visible = true;
            deskCardIDs.push(i);
            lstCardImage.push(publicCards[i]);
        }
        var that = this;
        this.animation.showPublicCard(this.game,deskCardIDs, lstCardImage, true, function(){
            that._playSound(that.soundSendCard);
        });
    },

    _turnAnimation:function(card) {
        //this.animation.publicCards.push(card)

        var deskCardIDs = [3]
        var lstCardImage = [card]
        this.animation.publicCards[deskCardIDs].visible = true;
        this.animation.showPublicCard(this.game,deskCardIDs, lstCardImage, false);
        this._playSound(this.soundSendCard);
    },

    _riverAnimation:function(card) {
        //this.animation.publicCards.push(card)

        var deskCardIDs = [4]
        var lstCardImage = [card]
        this.animation.publicCards[deskCardIDs].visible = true;
        this.animation.showPublicCard(this.game,deskCardIDs, lstCardImage, false);
        this._playSound(this.soundSendCard);
    },

    _resetPublicCard:function() 
    {
        for(var i = 0; i < this.publicCards.length; i++)
        {
            this.publicCards[i].visible = false;
            this.publicCards[i].setFrame( this.publicCards[i].frame);
        }
        for(var i = this.publicCards.length; i < this.publicCards.length; i++)
        {
            this.publicCards[i].visible = false;
            this.publicCards[i].setFrame( this.publicCards[i].frame);
        }
    },

    _setSliderRange:function(minNum, maxNum)
    {
        if(minNum != undefined)
        {
            this.sliderMinNum = minNum;
        }
        if(maxNum != undefined)
        {
            this.sliderMaxNum = maxNum;
        }

        this.chipboxTextSlider.setText(this.sliderMinNum);
        this.chipboxSliderHandle.y = this.chipboxSliderGroove.y + this.chipboxSliderGroove.height * 0.5 - this.chipboxSliderHandle.height * 0.5;
    },

    _setSliderValue:function(value) {
        this.chipboxTextSlider.setText(value);
        this.chipboxSliderHandle.y = this.chipboxSliderGroove.y + this.chipboxSliderGroove.height * 0.5 - this.chipboxSliderHandle.height * 0.5;
    },

    _betWaitButtonCheckOn:function(buttonCheckImage, blOn) {
        var imgid = blOn?"checkOn":"checkOff";
        let frame = this.game.textures.get(imgid);
        buttonCheckImage.setTexture(frame);
    },

    _betWaitButtonChecked:function() 
    {
        return this.waitSelected1 || this.waitSelected2 || this.waitSelected3
    },

    _setBetCardType:function(cardType) {
        var carTypeName = this.CONST.CardTypeNames[parseInt(cardType)]
        var user = this._userByUserID(this.userID)
        user.setUserTitle(carTypeName);
    },

    _clearChipPoolCoins:function() {
        for (var i = this.chipPoolCoins.length - 1; i >= 0; i--) {
            this.chipPoolCoins[i].destroy()
        }

        this.chipPoolCoins = []
    },

    _updatePoolChipValue:function(minChip) {

        //this.gameStateObj.chipboxValue1 = minChip;
        //this.gameStateObj.chipboxValue2 = minChip * 2;
        //this.gameStateObj.chipboxValue3 = minChip * 4;

        //var chip1 = minChip;
        var chip1 = 20;  // 不动态变化了，只固定 20 40
        var chip2 =  chip1 * 2;
        var chip3 = chip2 * 2;
        this.gameStateObj.chipboxValue1 = chip1;
        this.gameStateObj.chipboxValue2 = chip2;
        this.gameStateObj.chipboxValue3 = chip3;

        this.chipboxText4.setText(chip1);
         
        this.chipboxText3.setText(chip2);
         
        this.chipboxText2.setText(chip3);

        if(chip3 >= this.chips) {
            this.chipboxButton2.visible = false;
            this.chipboxText2.visible = false;
        } else {
            this.chipboxButton2.visible = true;
            this.chipboxText2.visible = true;
        }

        if(chip2 >= this.chips) {
            this.chipboxButton3.visible = false;
            this.chipboxText3.visible = false;
        } else {
            this.chipboxButton3.visible = true;
            this.chipboxText3.visible = true;
        }
        

        if(chip1 >= this.chips) {
            this.chipboxButton4.visible = false;
            this.chipboxText4.visible = false;
        } else {
            this.chipboxButton4.visible = true;
            this.chipboxText4.visible = true;
        }

    },

    _resetPool: function() {
        _updatePoolChipValue(this.bb)
    },

    _userPositionBySeatNum: function(seatNum) {
        var userindex = -1;
        for (var i = this.userList.length - 1; i >= 0; i--) {
            if (this.userList[i].param["seatNum"] == seatNum) {
                userindex = i;
                break;
            }
        }

        if (userindex == -1) {
            console.log("user not find");
            return;
        }
        console.log("user index:", userindex);

        return {x:this.userPosRate[userindex].x * this.game.width , y:this.userPosRate[userindex].y * this.game.height }
    },
    
    _sendCardAnimation:function() {
        var sendPoint ={x:this.chipPoolBK.x + this.chipPoolBK.width * 0.14, y:this.chipPoolBK.y + this.chipPoolBK.height * 0.5}
        var userList = []
        for(var i = 0; i < this.userList.length; i++) {
            if (this.userList[i].param.userID != undefined &&
                this.userList[i].param.userID != null &&
                this.userList[i].param.userID != "") {
                userList.push(this.userList[i]);
            }
        }
        var game = this.game
        var currentIndex = 0;
        var that = this
        var sendCard = function(){
            that._playSound(that.soundSendCard)
            var user = userList[currentIndex++]
            if (user == undefined || user == null) {
                console.log("user not find!!index:", currentIndex);
                return
            }
            var dcard = game.add.sprite(sendPoint.x, sendPoint.y, "dcardBK");
            dcard.setScale(0.5, 0.5);
            dcard.setVisible(false);
            dcard.visible = false
            var x ;
            var y ;
            if(that.userID == user.param.userID) {
                x = that.selfCards[0].x;
                y = that.selfCards[0].y
            }else{
                x = user.dcard.x;
                y = user.dcard.y;
            }
            var tweens = game.tweens.add({
                targets: dcard,   // 目标对象
                x: x,            // 目标属性值
                y:y,
                duration: 500,    // 持续时间（毫秒）
                ease: 'Linear',    // 缓动函数（支持字符串或函数）
                onComplete: () => {
                    if(that.userID === user.param.userID) {
                        that.selfCards[0].setVisible(true);
                        that.selfCards[1].setVisible(true);
                    } else {
                        user.dcard.visible = true;
                    }
                    // user.dcard.visible = true;
                    dcard.destroy();
                    if(currentIndex < userList.length ) {
                        sendCard();
                    }

                    if(user.imagebody.visible == false) {
                        if(user.dcard != undefined  && user.dcard != null) {
                            user.dcard.visible = true;
                        }
                    }
                }
            });
        }
        
        sendCard();
    },

    _playSound: function(sound, onStopCallback, allowMultPlay) {
        if(onStopCallback != undefined && onStopCallback != null) {
            sound.onStop.addOnce(onStopCallback, this);
        }
        /*
        if(allowMultPlay == undefined) {
            sound.allowMultiple = true
        } else {
            sound.allowMultiple = allowMultPlay;
        }
        */

        if(sound != undefined || sound != null) {
            sound.play()
        } else {
            console.log("sound is undefined");
        }
    },
    /*
    _sendCardAnimation:function() {
        var sendPoint ={x:this.chipPoolBK.x + this.chipPoolBK.width * 0.14, y:this.chipPoolBK.y + this.chipPoolBK.height * 0.5}
        
        for (var i = this.userList.length - 1; i >= 0; i--) {
            var user = this.userList[i]
            if(user.param.userID == this.userID) {
                continue;
            }
            
            var dcardSprite = game.add.sprite(sendPoint.x, sendPoint.y, "dcardBK");
            (function(user,dcard) {
             var tweens = game.tweens.add(dcard)
             tweens.to({x:user.dcard.x, y:user.dcard.y},500,
                       Phaser.Easing.Linear.None, true);
             tweens.onComplete.add(function() {
                                   //user.dcard.visible = true;
                                   dcard.visible = false;
                                   dcard.destroy();
                                   }, this);
            })(user, dcardSprite)
            

        }
        
    }*/

};

export default MainState
