'use strict';

var gFontScale = 1.0;


function _fontString(size, fontname) {
	if (fontname == undefined) {
		//fontname = "Impact"
		fontname = "Apple LiSung Light"
	};

	return (size * gFontScale)+"px " + fontname
}

var User = function(game) {
	this.game = game;
	this.rect = {left:0, top:0, width:0, height:0};
	this.coinRect = {left:0, top:0, width:0, height:0};
	this.coinTextRect = {left:0, top:0};
	this.param = {userName:"", userImage:"defaultUserImage", userCoin:"", isPlayer:"", userID:"", seatNum:-1};
	this.scale = 0.8;
	this.giveUp = false;
	this.animation;

	this.group;
	this.userGroup;
	this.lbname;
	this.imagebody;
	this.lbcoin;
	this.containerplayer;
	this.containeruser;
	this.containerblank;
	this.containerwin;
	this.containerwinEffect;
	this.imageCoin = [];
	this.textCoin;
	this.winCards = [];
	this.winLightDot = [];
	this.winGroup;
	this.dcard;
	this.waitingLine;
	this.waitingAngel = 0;
	this.tweenDrawWaiting;
	// this.mask;
	this.startTrigerWillCompleteEvent;

	this.userTitleStyle = { font: _fontString(20), fill: "#ffffff", wordWrap: false, wordWrapWidth: this.rect.width, align: "center" }
	this.timerEventProgress
    this.userClickedLisenger
}

User.prototype = {

	create:function(game,userName, userImage, userCoin, isPlayer) {

		this.param["userName"] = userName;
		this.param["userImage"] = userImage;
		this.param["userCoin"] = userCoin;
		this.param["isPlayer"] = isPlayer;

		this.containerplayer = game.add.image(this.rect.left + this.rect.width / 2, this.rect.top + this.rect.height / 2, "playerBK");
		this.containeruser = game.add.image(this.rect.left + this.rect.width / 2, this.rect.top + this.rect.height / 2, "userBK");

		this.containerblank = game.add.image(this.rect.left + this.rect.width / 2, this.rect.top + this.rect.height / 2, "blankBK");

		this.containerwin = game.add.image(this.rect.left + this.rect.width / 2, this.rect.top + this.rect.height / 2, "winBK");

		this.containerwinEffect = game.add.image(this.rect.left + this.rect.width / 2, this.rect.top + this.rect.height / 2, "winBKFrame");
		// this.containerplayer.setOrigin(0.5,0.5);
		// this.containeruser.setOrigin(0.5,0.5);
		// this.containerblank.setOrigin(0.5,0.5);
		// this.containerwin.setOrigin(0.5,0.5);
		// this.containerwinEffect.setOrigin(0.5,0.5);
		this.containerplayer.setScale(this.scale, this.scale);
		this.containeruser.setScale(this.scale, this.scale);
		this.containerblank.setScale(this.scale, this.scale);
		this.containerwin.setScale(this.scale, this.scale);
		this.containerwinEffect.setScale(this.scale, this.scale);
		this.winLightDot[0] = game.add.sprite(this.containerwin.x - this.containerwin.width * 0.41, this.containerwin.y + this.containerwin.height * 0.3, "winLight");
		this.winLightDot[0].setScale(this.scale, this.scale);
		this.winLightDot[1] = game.add.sprite(this.containerwin.x + this.containerwin.width * 0.41, this.containerwin.y - this.containerwin.height * 0.3, "winLight");
		this.winLightDot[1].setScale(this.scale, this.scale);
		this.winLightDot[0].setOrigin(0.5);
		this.winLightDot[1].setOrigin(0.5);

		this.winCards[0] = game.add.image(this.rect.left + this.rect.width * 0.05, this.rect.top + this.rect.height * 0.26, "cardBK");
		this.winCards[0].setScale(this.scale * 0.75, this.scale * 0.75);
		this.winCards[1] = game.add.image(this.rect.left + this.rect.width * 0.4, this.rect.top + this.rect.height * 0.26, "cardBK");
		this.winCards[1].setScale(this.scale * 0.75, this.scale * 0.75);

		this.winGroup = game.add.group();
		this.winGroup.add(this.containerwin);
		this.winGroup.add(this.containerwinEffect);
		this.winGroup.add(this.winLightDot[0]);
		this.winGroup.add(this.winLightDot[1]);
		this.winGroup.add(this.winCards[0]);
		this.winGroup.add(this.winCards[1]);
		this.containerwinEffect.alpha = 1;

		this.containerplayer.setVisible(false);
		this.containeruser.setVisible(false);
		this.containerblank.setVisible(true);
		this.winGroup.setVisible(false);
		if(this.param["userName"] && this.param["userName"] != "")
		{
			this.containerplayer.setVisible(false);
			this.containeruser.setVisible(true);
			this.containerblank.setVisible(false);
			this.winGroup.setVisible(false);
		}
		var style = { font: _fontString(20), fill: "#ffffff", wordWrap: false, wordWrapWidth: this.rect.width, align: "center" };
		if(isPlayer)
		{
			this.containerplayer.setVisible(true);
			this.containeruser.setVisible(false);
			this.containerblank.setVisible(false);
			this.winGroup.setVisible(false);
			style = { font: _fontString(20), fill: "#000000", wordWrap: false, wordWrapWidth: this.rect.width, align: "center" };
		}
		this.lbname = game.add.text(this.rect.left + this.rect.width / 2, this.rect.top + this.rect.height * 0.1, this.param["userName"], style);
		this.lbname.setOrigin(0.5);
		this.lbname.setScale(this.scale, this.scale);
        var userProfile = this.param["userImage"]
        if(userProfile == undefined || userProfile == "" || userProfile == null) {
            userProfile = "defaultProfile"
        }
        this.imagebody = game.add.sprite(this.rect.left + this.rect.width * 0.5, this.rect.top + this.rect.height * 0.5, userProfile);
        this.imagebody.inputEnabled = true;
        var that = this
        // this.imagebody.events.onInputDown.add(function(){
        //         if(that.userClickedLisenger != undefined && that.userClickedLisenger != null) {
        //                 that.userClickedLisenger(that);
        //         }
        // }, this);
        
		this.imagebody.setScale(this.rect.width * 0.9 / this.imagebody.width, this.rect.height * 0.595 / this.imagebody.height);
		this.lbcoin = game.add.text(this.rect.left + this.rect.width / 2, this.rect.top + this.rect.height * 0.9, this.param["userCoin"], style);
		this.lbcoin.setOrigin(0.5);
		// this.lbcoin.setScale(this.scale, this.scale);

		style = { font: _fontString(20), fill: "#FFFF00"};
		this.textCoin = game.add.text(this.coinTextRect.left, this.coinTextRect.top, "", style);

		// this.textCoin.setScale(this.scale, this.scale);
		if(this.coinTextRect.left < this.coinRect.left) {
			this.textCoin.x = this.coinRect.left - this.textCoin.width - this.coinRect.width * 0.9;
		}
		this.textCoin.setVisible(true);

		this.waitingLine = game.add.image(this.rect.left + this.rect.width / 2, this.rect.top + this.rect.height / 2, "waitingRound");
		this.waitingLine.setOrigin(0.5);
		this.waitingLine.setScale(this.scale, this.scale);
		this.waitingLine.setVisible(false);
		// this.mask = game.add.graphics(0, 0);

		this.groupUser = game.add.group();
		this.groupUser.add(this.containerplayer);
		this.groupUser.add(this.containeruser);
		this.groupUser.add(this.containerblank);
		this.groupUser.add(this.winGroup);
		this.groupUser.add(this.lbname);
		this.groupUser.add(this.imagebody);
		this.groupUser.add(this.lbcoin);
		this.groupUser.add(this.waitingLine);
		for(var i = 0; i < this.imageCoin.length; i++) {
			this.groupUser.add(this.imageCoin[i]);
		}
		this.groupUser.add(this.textCoin);
		this.groupUser.setVisible(false)
		this.groupUser.visible = false
	},


	setUserTitle:function(title) {

		if (title == undefined || title == null) {
			return
		}

        this.lbname.style = this.userTitleStyle
	    
		this.lbname.setScale(this.scale, this.scale);
		console.log(title)
		// this.lbname.add.text(title)
		// this.lbname.setText(title);

	},

	setUserName:function(name) {
		if(name == null) {
			return;
		}

		this.param.userName = name;
		this.setUserTitle(name);
	},
    
    setOnClickListener:function(listener) {
        this.userClickedLisenger = listener;
    },

	setRect:function(x, y, width, height) {

		this.rect = {left:x, top:y, width:width, height:height};
	},

	setCoinRect:function(x, y, width, height) {

		this.coinRect = {left:x, top:y, width:width, height:height};
	},

	setCoinTextPos:function(x, y) {

		this.coinTextRect = {left:x, top:y};
	},

	setParam:function(userName, userImage, userCoin, isPlayer)
	{
		this.setIsPlayer(isPlayer);
		this.setUserName(userName)
		this.setUserImage(userImage);
		this.setChips(userCoin);


		this.containerplayer.setVisible(false);
		this.containeruser.setVisible(false);
		this.containerblank.setVisible(true);
		this.winGroup.setVisible(false);

		if(this.param["userName"] && this.param["userName"] != "")
		{
			this.containerplayer.setVisible(false);
			this.containeruser.setVisible(true);
			this.containerblank.setVisible(false);
			this.winGroup.setVisible(false);
		}
		if(this.param["isPlayer"])
		{
			this.containerplayer.setVisible(true);
			this.containeruser.setVisible(false);
			this.containerblank.setVisible(false);
			this.winGroup.setVisible(false);

		}
	},

	setChips:function(chip) {
		if (chip == null) {
			return
		}

		this.param["userCoin"] = chip;
		// if(this.lbcoin){
		// 	this.lbcoin.setText(chip);
		// 	this.lbcoin.setStyle(this.userTitleStyle);
		// }
		this.lbcoin.text = chip
		this.lbcoin.fill = this.userTitleStyle.fill;
		this.lbcoin.font = this.userTitleStyle.font;
		this.lbcoin.wordWrap = this.userTitleStyle.wordWrap;
		this.lbcoin.wordWrapWidth = this.userTitleStyle.wordWrapWidth;
		this.lbcoin.align = this.userTitleStyle.align;

	},

	setUseCoin:function(usedCoin)
	{
		this.textCoin.text = usedCoin
		// this.textCoin.setText(usedCoin);
		if(this.coinTextRect.left < this.coinRect.left)
		{
			// this.textCoin.x = this.coinRect.left - this.textCoin.width - this.coinRect.width * 0.9;
		}
		if(usedCoin != "") {
			this.textCoin.visible = true;
			var coin = this.game.add.image(this.rect.width / 2,  this.rect.height / 2, "chip01");
			coin.setOrigin(0.5);
			coin.setScale(0.3, 0.3)
			coin.width = this.coinRect.width;
			coin.height = this.coinRect.height;
			this.imageCoin.push(coin);
			this.group.add(coin);
			this.animation.showChipMove(this.game,coin, this.coinRect.left, this.coinRect.top - this.imageCoin.length * coin.height * 0.1111);
		}
		else
		{
			this.textCoin.visible = false;
			for(var i = 0; i < this.imageCoin.length; i++)
			{
				this.imageCoin[i].destroy();
			}
			this.imageCoin = [];
		}
	},

	//this.userList[Math.round(Math.random() * 8)].showGetCoins(this.chipPoolBK.x + this.chipPoolBK.width * 0.14, this.chipPoolBK.y + this.chipPoolBK.height * 0.5);
	showGetCoins:function(srcX, srcY)
	{
		var coin = game.add.image(srcX, srcY, "chip01");
		coin.setOrigin(0.5);
		coin.setScale(this.scale,this.scale)
		coin.width = this.coinRect.width;
		coin.height = this.coinRect.height;

		var animationTime = 200;
		var tween = game.tweens.add(coin);
		tween.to({ x:this.rect.left + this.rect.width / 2, y: this.rect.top + this.rect.height / 2 }, animationTime, Phaser.Easing.Linear.None, true);
		tween.onComplete.add(function() {
			coin.destroy();
		}, this);
	},

	setScale:function(scale)
	{
		this.scale = scale;
	},

	setAnimation:function(animation)
	{
		this.animation = animation;
	},

	setVisible:function(blVisable) {
		this.groupUser.visible = blVisable
		if (this.dcard != null && this.dcard != undefined) {
            if(blVisable == false) {
				console.log("set dcard visible",blVisable)
                this.dcard.visible = blVisable
            }
		};
	},

	addUserToGroup:function(group)
	{
		this.group = group;
		this.group.add(this.groupUser);
	},

	addToUserGroup:function(item) 
	{
		this.groupUser.add(item)
	},

	setDcard:function(dcard) {
		this.dcard = dcard;
		console.log("set dcard visible",false)

		dcard.visible = false
	},

	setIsPlayer:function(isPlayer) {
		if (isPlayer == undefined || isPlayer == null) {
			return
		}

		this.param.isPlayer = isPlayer
		if(isPlayer) {
	        this.userTitleStyle = { font: _fontString(20), fill: "#000000", wordWrap: false, wordWrapWidth: this.rect.width, align: "center" };
		} else {
			this.userTitleStyle = { font: _fontString(20), fill: "#ffffff", wordWrap: false, wordWrapWidth: this.rect.width, align: "center" };
		}
	},

	setUserImage:function(imageid) {
		if (imageid == null || imageid == undefined) {
			return
		}

		if(imageid == "") {
			imageid = "defaultProfile"
		}
		this.param["userImage"] = imageid;
	    this.imagebody.setScale(1, 1);
		let userImage = this.game.textures.get(imageid);
		this.imagebody.setTexture(userImage)

		// this.imagebody.setScale(this.rect.width * 0.9 / this.imagebody.width, this.rect.height * 0.595 / this.imagebody.height);
	},

	setGiveUp:function(bGiveUp)
	{
		var alpha = 1;
		this.giveUp = bGiveUp;

		if(bGiveUp)
		{
			alpha = 0.5;
		}

		if(this.group)
		{
			this.containerplayer.alpha = alpha;
			this.containeruser.alpha = alpha;
			this.containerblank.alpha = alpha;
			this.winGroup.alpha = alpha;
			this.lbname.alpha = alpha;
			this.imagebody.alpha = alpha;
			this.lbcoin.alpha = alpha;
			this.textCoin.alpha = alpha;
			for(var i = 0; i < this.imageCoin.length; i++)
			{
				this.imageCoin[i].alpha = alpha;
			}
		}
	},

	setWinCard:function(key1, key2)
	{
		var that = this;
		var animationTime = 500;
		this.winGroup.setVisible(true);
		this.imagebody.visible = false;
		this.winCards[0].setTexture(this.game.textures.get(key1));
		// this.winCards[0].setVisible(true);
		this.winCards[1].setTexture(this.game.textures.get(key2));
		// this.winCards[1].setVisible(true);
		this.winLightDot[0].y = this.containerwin.y + this.containerwin.height * 0.3;
		this.winLightDot[1].y = this.containerwin.y - this.containerwin.height * 0.3;

		this.containerwinEffect.setScale(this.scale, this.scale);
		this.winLightDot[0].setVisible(true);
		this.winLightDot[1].setVisible(true);
		this.containerwinEffect.alpha = 1;

		var tween1 = this.game.tweens.add({
			targets: this.winLightDot[0],   // 目标对象
			y:this.containerwin.y - this.containerwin.height * 0.3,
			duration: animationTime,    // 持续时间（毫秒）
			ease: 'Linear',    // 缓动函数（支持字符串或函数）
			onComplete: () => {
				that.winLightDot[0].visible = false;
			}
		});

		var tween2 = this.game.tweens.add({
			targets: this.winLightDot[1],   // 目标对象
			y:this.containerwin.y - this.containerwin.height * 0.3,
			duration: animationTime,    // 持续时间（毫秒）
			ease: 'Linear',    // 缓动函数（支持字符串或函数）
			onComplete: () => {
				that.winLightDot[1].setVisible(false);
				this.winGroup.setVisible(false);
			}
		});


		this.lbname.fill = "#ffffff";
		this.lbname.font = _fontString(20);
		this.lbname.wordWrap = false
		this.lbname.wordWrapWidth = this.rect.width;
		this.lbname.align = "center";


		this.lbcoin.fill = "#ffffff";
		this.lbcoin.font = _fontString(20);
		this.lbcoin.wordWrap = false
		this.lbcoin.wordWrapWidth = this.rect.width;
		this.lbcoin.align = "center";
	},

	reset:function()
	{
	    this.winGroup.visible = false;
	    this.setGiveUp(false);
		console.log("imagebody visible")
	    this.imagebody.visible = true;
	    this.setUseCoin("");

	    if(this.dcard != undefined && this.dcard != null) {
			console.log("set dcard visible",false)
			this.dcard.visible = false;
	    }

	    if (this.param["userName"] == "") {
	    	console.log("error:error here!")
	    }
	    this.setUserTitle(this.param["userName"]);
	},

	update:function()
	{

	},

	clean:function() 
	{
		this.winGroup.visible = false;
		this.imagebody.visible = false;
		this.param["userID"] = "";
        this.param["userName"] = "";
		this.param["userCoin"] = "";
		this.setParam("", "defaultProfile", "");
		this.setGiveUp(false);
		this.setUseCoin("");
	},

	cleanWaitingImage:function()
	{
		this.waitingLine.visible = false;
	},

	//for(var i = 0; i < this.userList.length; i++)
	//{
		//this.userList[i].drawWaitingImage(15);
	//}
	drawWaitingImage:function(game,timeout, willCompleteCallBack, didCompleteCallBack)
	{
		this.groupUser.visible = true;
		this.waitingLine.visible = true;
		this.waitingAngel = 0;
		// this.waitingLine.mask = this.mask;
		//
		// var maskWidth = Math.sqrt(this.waitingLine.width * this.waitingLine.width + this.waitingLine.height * this.waitingLine.height);
		// this.mask.x = this.waitingLine.x - maskWidth;
		// this.mask.y = this.waitingLine.y - maskWidth;

		var offsetAngel = 30;

		var that = this;

		this.start = game.time.startTime;

		var totalTime = timeout * 1000;

		this.timerEventProgress = game.time.addEvent({
			delay: 50,         // 间隔 1 秒
			callback: () =>  {
				var elapsed = game.time.now - that.start;

				var angel =   (elapsed * 1000) * 360 / totalTime


				if(angel >= 180 && willCompleteCallBack && that.startTrigerWillCompleteEvent == false)
				{
					willCompleteCallBack();
					this.startTrigerWillCompleteEvent = true
				}

				// that.mask.clear();
				// that.mask.moveTo(maskWidth, maskWidth);
				// that.mask.lineTo(maskWidth - Math.tan(offsetAngel * Math.PI / 180) * maskWidth, 0);
				// that.mask.arc(maskWidth, maskWidth, maskWidth, - Math.PI / 2 - offsetAngel * Math.PI / 180, (angel * Math.PI) / 180 - Math.PI / 2 - offsetAngel * Math.PI / 180,true);
				// that.mask.lineTo(maskWidth, maskWidth);

				if(angel >= 360) {
					didCompleteCallBack(true);
					game.time.removeEvent(this.timerEventProgress)
				}
			},
			loop: true           // 无限循环
		});

        // this.timerEventProgress = game.time.events.loop(50, function() {
		//
        // 	var elapsed = game.time.now - that.start;
		//
        // 	var angel =   (elapsed * 1000) * 360 / totalTime
		//
		//
		// 	if(angel >= 180 && willCompleteCallBack && that.startTrigerWillCompleteEvent == false)
		// 	{
		// 		willCompleteCallBack();
		// 		this.startTrigerWillCompleteEvent = true
		// 	}
		//
		// 	that.mask.clear();
		// 	that.mask.moveTo(maskWidth, maskWidth);
		// 	that.mask.lineTo(maskWidth - Math.tan(offsetAngel * Math.PI / 180) * maskWidth, 0);
		// 	that.mask.arc(maskWidth, maskWidth, maskWidth, - Math.PI / 2 - offsetAngel * Math.PI / 180, (angel * Math.PI) / 180 - Math.PI / 2 - offsetAngel * Math.PI / 180,true);
		// 	that.mask.lineTo(maskWidth, maskWidth);
        //
        //     if(angel >= 360) {
        //         didCompleteCallBack(true);
        //         game.time.events.remove(that.timerEventProgress)
        //     }
		// }, this);
        
		
	},

	stopDrawWaitingImage:function()
	{
		if(this.timerEventProgress != null && this.timerEventProgress != undefined)
		{
			this.game.time.removeEvent(this.timerEventProgress)
		}
	},

	createProgressObject:function(game,timeout, willCompleteCallBack, didCompleteCallBack) {
		var that = this;
		this.startTrigerWillCompleteEvent = false;
		return {
			draw:function() {
				that.drawWaitingImage(game,timeout, willCompleteCallBack, didCompleteCallBack);
			},
			stop:function() {
				didCompleteCallBack(false);
				that.stopDrawWaitingImage();
			},
			clean:function() {
				that.cleanWaitingImage();
			}
		}
	},
}

export default User
