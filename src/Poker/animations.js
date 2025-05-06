'use strict';

var Animations = function() {

	this.offsetX = 0;
	this.offsetY = 0;
	this.widthBK = 0;
	this.heightBK = 0;

	this.publicCards = [];
	this.light;
	this.stopShake = true;
}

Animations.prototype = {

	setPosParam:function(width, height, offsetX, offsetY) {
		this.widthBK = width;
		this.heightBK = height;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
	},

	setPublicCard:function(lstPublicCard) {
		this.publicCards = lstPublicCard;
	},

	showPublicCard:function(lstIndex, lstKey, showBK, callback) {
		if(lstIndex.length > this.publicCards.length)
		{
			return;
		}

		var nIndex = 0;
		var animationTime = 100;
		var that = this;
		var showAnimation = function (index, key, showBK) {
			var cardWidth = that.publicCards[index].width;
			if(showBK)
			{
				that.publicCards[index].loadTexture("cardBK", that.publicCards[index].frame);
				var tween = game.tweens.add(that.publicCards[index]);
				tween.to({ width:0 }, animationTime, Phaser.Easing.Linear.None, true);
				tween.onComplete.add(function() {
					that.publicCards[index].loadTexture(key, that.publicCards[index].frame);
					var tween2 = game.tweens.add(that.publicCards[index]);
					tween2.to({ width:cardWidth }, animationTime, Phaser.Easing.Linear.None, true);
					nIndex++;
					if(nIndex < lstIndex.length)
					{
						tween2.onComplete.add(function() {
							showAnimation(lstIndex[nIndex], lstKey[nIndex], showBK);
						}, that);
					}
				}, that);
			}
			else
			{
				that.publicCards[index].width = 0;
				that.publicCards[index].loadTexture(key, that.publicCards[index].frame);
				var tween = game.tweens.add(that.publicCards[index]);
				tween.to({ width:cardWidth }, animationTime, Phaser.Easing.Linear.None, true);
				nIndex++;
				if(nIndex < lstIndex.length)
				{
					tween.onComplete.add(function() {
						showAnimation(lstIndex[nIndex], lstKey[nIndex], showBK);
					}, that);
				}
			}
		};

		if(callback != undefined) {
			callback();
		}

		showAnimation(lstIndex[nIndex], lstKey[nIndex], showBK);
	},

	//this.animation.showShake(this.selfCards[0]);
	//this.animation.showShake(this.selfCards[1]);
	//this.animation.stopShake = true;

	showShake:function(target, time, frequency, offset) {
		var shakeTime = 20000;
		if(time)
		{
			shakeTime = time;
		}
		var shakeFrequency = 10;
		if(frequency)
		{
			shakeFrequency = frequency;
		}
		var shakeOffset = Math.min(target.width, target.height) / 50;
		if(offset)
		{
			shakeOffset = offset;
		}

		this.stopShake = false;
		var that = this;
		var targetX = target.x;
		var targetY = target.y;
		var pt = [{x:targetX - shakeOffset, y:targetY - shakeOffset}
				, {x:targetX, y:targetY - shakeOffset}
				, {x:targetX + shakeOffset, y:targetY - shakeOffset}
				, {x:targetX - shakeOffset, y:targetY}
				, {x:targetX + shakeOffset, y:targetY}
				, {x:targetX - shakeOffset, y:targetY + shakeOffset}
				, {x:targetX, y:targetY + shakeOffset}
				, {x:targetX + shakeOffset, y:targetY + shakeOffset}];

		var nCount = 0;
		var showAnimation = function () {
			var tween = game.tweens.add(target);
			var nextPt = pt[Math.floor(Math.random() * pt.length)];
			tween.to({ x:nextPt.x, y: nextPt.y }, shakeFrequency, Phaser.Easing.Linear.None, true);
			nCount++;
			tween.onComplete.add(function() {



				if(nCount * shakeFrequency <= shakeTime && !that.stopShake)
				{
					showAnimation();
				}
				else
				{
					target.x = targetX;
					target.y = targetY;
				}
			}, this);
		};

		showAnimation(nCount);
	},

	setLight:function(light) {
		this.light = light;
	},

	showLight:function(game,targetX, targetY)
	{
		var animationTime = 500;
		var xOffset = this.offsetX;
		var yOffset = this.offsetY;
		var length = Math.sqrt((this.light.x - targetX) * (this.light.x - targetX) + (this.light.y - targetY) * (this.light.y - targetY));
		var angleFinal = Math.atan2((targetY - this.light.y), (targetX - this.light.x)) * 180 / 3.1415926;

		while(angleFinal < this.light.angle)
		{
			angleFinal += 360;
		}
		if(angleFinal - this.light.angle > 180)
		{
			angleFinal -= 360;
		}
		if(!this.light.visible)
		{
			this.light.visible = true;
			this.light.width = length;
			this.light.angle = angleFinal;
		}
		else
		{
			// tween.to({ width:length, angle: angleFinal }, animationTime, Phaser.Easing.Linear.None, true);
			var tween = game.tweens.add({
				targets: this.light,   // 目标对象
				// x: targetX,            // 目标属性值
				// y:targetY,
				angle: angleFinal,
				duration: animationTime,    // 持续时间（毫秒）
				ease: 'Linear',    // 缓动函数（支持字符串或函数）
				yoyo: true,        // 是否反向播放
				onComplete: () => { /* 动画完成回调 */ }
			});
		}
	},

	showChipMove:function(game,target, targetX, targetY, time)
	{
		var animationTime = 100;
		if(time != undefined && time != null) {
			animationTime = time
		}
		
		var tween = game.tweens.add({
			targets: target,   // 目标对象
			x: targetX,            // 目标属性值
			y:targetY,
			duration: animationTime,    // 持续时间（毫秒）
			ease: 'Linear',    // 缓动函数（支持字符串或函数）
			yoyo: true,        // 是否反向播放
			onComplete: () => { /* 动画完成回调 */ }
		});
	},

	//this.chipPoolCoins = this.animation.showCollectChip(this.userList, this.chipPoolBK.x + this.chipPoolBK.width * 0.14, this.chipPoolBK.y + this.chipPoolBK.height * 0.5, this.chipPoolCoins);

	showCollectChip:function(game,userList, targetX, targetY, existCoin)
	{
		var animationTime = 50;
		var coinSpace = 0.1111;
		var totalCoins = [];
		for(var i = 0; i < userList.length; i++)
		{
			var user = userList[i];
			for(var j = 0; j < user.imageCoin.length; j++)
			{
				var coin = user.imageCoin[user.imageCoin.length - 1 - j];
				totalCoins.push(coin);
			}
			user.imageCoin = [];
		}


		var nIndex = 0;
		var showAnimation = function (index) {
			if (totalCoins.length <= index) {
				return
			};

			totalCoins[index].setDepth(10);
			nIndex++;
			var tween = game.tweens.add({
				targets: totalCoins[index],   // 目标对象
				x: targetX,            // 目标属性值
				y:targetY - (index + existCoin.length) * totalCoins[index].height * coinSpace,
				duration: animationTime,    // 持续时间（毫秒）
				ease: 'Linear',    // 缓动函数（支持字符串或函数）
				onComplete: () => {
					if(nIndex < totalCoins.length) {
						showAnimation(nIndex);
					}
				}
			});
		};

		showAnimation(nIndex);

		return existCoin.concat(totalCoins);
	},

	//Demo
	demoShowPublicCard:function() {
		var publicCards = ["SA", "H2", "C3"];
		var lstCardID = [];
		var lstCardImage = [];
		for (var i = 0; i < publicCards.length; i++) {
			this.publicCards[i].visible = true;
			lstCardID.push(i);
			lstCardImage.push(publicCards[i]);
		}
		this.showPublicCard(lstCardID, lstCardImage, true);
	}
}


export default Animations