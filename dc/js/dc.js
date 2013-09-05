$().ready(function(){
	(function(){
		var canvas = document.getElementById("game");
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "rgba(20, 200, 100, .6)";
	//	ctx.beginPath();
	//	ctx.arc(200, 100, 100 , degreeToRadian(0), degreeToRadian(60), true);
	//	ctx.closePath();
	//	ctx.fill();
		drawCircle(210,110,100,0,60,false,ctx);
		drawCircle(200,100,100,0,60,true,ctx);
		ctx.fillStyle = "red";
		drawCircle(420,100,100,90,270,true,ctx);
		drawCircle(410,100,100,90,270,false,ctx);
		
		drawCircle(630,100,100,135,315,false,ctx);
		drawCircle(640,110,100,135,315,true,ctx);
	})();


//	(function(){
/*		var canvas = $('#game2')[0],
			ctx = canvas.getContext('2d'),
			r = 10,
			width = canvas.width,
			height = canvas.height;
		var circlesCount = 5;
		for(var i = 0;i < circlesCount; i++){
			var x = Math.random()*width,
				y = Math.random()*height;
			ctx.fillStyle = 'rgba(200,200,100,.9)';
			drawCircle(x,y,r,0,360,false,ctx);
			untangleGame.circles.push(new Circle(x,y,r));
		}
*/		
		setupclvl();
		// connectCircles();
		// var $game2 = $('#game2');
		$('#layers').mousedown(function(e){
			var canvasPos = $(this).offset(),
			//	mX = e.layerX || 0,
			//	mY = e.layerY || 0;
				mX = e.pageX - canvasPos.left || 0,
				mY = e.pageY - canvasPos.top || 0;
			for (var i = untangleGame.circles.length - 1; i >= 0; i--) {
				var cX = untangleGame.circles[i].x,
					cY = untangleGame.circles[i].y,
					r = untangleGame.circles[i].r;
				if(Math.pow(mX-cX,2)+Math.pow(mY-cY,2)<Math.pow(r,2)){
					untangleGame.targetCircle = i;
					break;
				}
			};

		});
		$('#layers').mousemove(function(e){
			if(untangleGame.targetCircle != undefined){
				var canvasPos = $(this).offset(),
				//	mX = e.layerX || 0,
				//	mY = e.layerY || 0,
					mX = e.pageX - canvasPos.left || 0,
					mY = e.pageY - canvasPos.top || 0,
					r = untangleGame.circles[untangleGame.targetCircle].r;
				untangleGame.circles[untangleGame.targetCircle] = new Circle(mX,mY,r);
			}
			connectCircles();
			updateLineIntersection();
			updateLevelProgress();
		});
		$('#layers').mouseup(function(e){
			untangleGame.targetCircle = undefined;
			// on every mouse up, check if the untangle puzzle is solved.
			checkLevelCompleteness();
		});
		// setInterval(gameLoop,20);

		// draw a splash screen when loading the game background
		// draw gradients background
		// var bgGradient = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
		// bgGradient.addColorStop(0, "#b48484");
		// bgGradient.addColorStop(1, "#b48484");
		//  ctx.fillStyle = '#B6C2CC';
		//  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		// // draw the loading text
		// ctx.font = "34px 'Rock Salt'";
		// ctx.textAlign = "center";
		// ctx.fillStyle = "#333333";
		// ctx.fillText("loading...",ctx.canvas.width/2,canvas.height/2);
		// load the background image
		untangleGame.background = new Image();
		untangleGame.background.onload = function() {
			drawLayerBG();
			// setup an interval to loop the game loop
			setInterval(gameLoop, 30);
		}
		untangleGame.background.onerror = function() {
			console.log("Error loading the image.");
		}
		untangleGame.background.src = "images/board.png";
		
		// draw the image background
		// ctx.drawImage(untangleGame.background, 0, 0);

		untangleGame.guide = new Image();
		untangleGame.guide.onload = function(){
			untangleGame.guideReady = true;
			untangleGame.guideFrame = 0;
			setInterval(function guideNextFrame(){
				untangleGame.guideFrame ++;
				if(untangleGame.guideFrame > 5){
					untangleGame.guideFrame = 0;
				}
			},500);
		}
		untangleGame.guide.src="images/guide_sprite.png";
//	})();
});
function drawLayerBG () {
	var ctx = untangleGame.layers[0];
	clear(ctx);
	ctx.drawImage(untangleGame.background,0,0);
}
function gameLoop(){
	drawLayerGuide();
	drawLayerGame();
	drawLayerUI();

	// fillLineGradient(ctx);
	// draw the image background
	// ctx.drawImage(untangleGame.background, 0, 0);

}
function drawLayerUI(){
	var ctx = untangleGame.layers[3];
	clear(ctx);
	
	// draw the title text
	// ctx.font = "26px Arial";
	ctx.font = "26px 'Rock Salt'";
	// ctx.textAlign = "center";
	ctx.fillStyle = "#dddddd";
	// ctx.fillText("Untangle Game",ctx.canvas.width/2,100);
	// draw the level progress text
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillText("Puzzle "+untangleGame.clvl+", Completeness:" + untangleGame.pp + "%",60,ctx.canvas.height-80);

	var isOverlapperdWithCircle = false;
	for(var i in untangleGame.circles){
		var p = untangleGame.circles[i];
		if(p.y > 310){
			isOverlapperdWithCircle = true;
		}
	}
	if(isOverlapperdWithCircle){
		$('#ui').addClass('dim');
	}else{
		$('#ui').removeClass('dim');
	}
}
function drawLayerGame(){
	var ctx = untangleGame.layers[2];
	clear(ctx);
	for (var i = untangleGame.lines.length - 1; i >= 0; i--) {
		var line = untangleGame.lines[i],
			sp = line.sp,
			ep = line.ep,
			t = line.t;
		drawLine(ctx,sp.x,sp.y,ep.x,ep.y,t);
	};
	for (var i = untangleGame.circles.length - 1; i >= 0; i--) {
		var c = untangleGame.circles[i];
		ctx.fillStyle = 'rgba(200,200,100,.9)';
		drawCircle(c.x,c.y,c.r,0,360,false,ctx);
	
	};
}
function drawLayerGuide (){
	ctx = untangleGame.layers[1];
	clear(ctx);
	if(untangleGame.guideReady){
		var nextFrameX = untangleGame.guideFrame * 80;
		ctx.drawImage(untangleGame.guide,nextFrameX,0,80,130,325,130,80,130);
	}
	if(untangleGame.clvl == 1){
		$('#guide').addClass('fadeout');
	}
}
function drawCircle(x,y,r,sD,eD,isC,ctx){
	// ctx.fillStyle = '#fff';
	// ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
	// ctx.globalCompositeOperation = 'destination-atop';
	// prepare the radial gradients fill style
	var cGradient = ctx.createRadialGradient(x,y,1,x,y,r);
	cGradient.addColorStop(0, "#fff");
	cGradient.addColorStop(1, "#f33");
	ctx.fillStyle = cGradient;
	ctx.beginPath();
	ctx.arc(x, y, r , degreeToRadian(sD), degreeToRadian(eD),isC);
	ctx.closePath();
	ctx.fill();
	// actually fill the circle path
	// ctx.fill();
}
function degreeToRadian(degree){
	return Math.PI*degree/180;
}
function Circle(x,y,r){
	this.x = x;
	this.y = y;
	this.r = r;
}
function Line(sp,ep,t){
	this.sp = sp;
	this.ep = ep;
	this.t = t;
}
var untangleGame = {
	circles : [],
	tT : 1,
	bT : 5,
	lines : [],
	clvl : 0,
	pp : 0
};
untangleGame.levels =[
{
	"level" : 0,
	"circles" : [
		{"x" : 400, "y" : 156},
		{"x" : 381, "y" : 241},
		{"x" : 84, "y" : 233},
		{"x" : 88, "y" : 73}],
	"relationship" : {
		"0" : {"connectedPoints" : [1,2]},
		"1" : {"connectedPoints" : [0,3]},
		"2" : {"connectedPoints" : [0,3]},
		"3" : {"connectedPoints" : [1,2]}
	}
},
{
	"level" : 1,
	"circles" : [
		{"x" : 401, "y" : 73},
		{"x" : 400, "y" : 240},
		{"x" : 88, "y" : 241},
		{"x" : 84, "y" : 72}],
	"relationship" : {
		"0" : {"connectedPoints" : [1,2,3]},
		"1" : {"connectedPoints" : [0,2,3]},
		"2" : {"connectedPoints" : [0,1,3]},
		"3" : {"connectedPoints" : [0,1,2]}
	}
},
{
	"level" : 2,
	"circles" : [
		{"x" : 192, "y" : 155},
		{"x" : 353, "y" : 109},
		{"x" : 493, "y" : 156},
		{"x" : 490, "y" : 236},
		{"x" : 348, "y" : 276},
		{"x" : 195, "y" : 228}],
	"relationship" : {
		"0" : {"connectedPoints" : [2,3,4]},
		"1" : {"connectedPoints" : [3,5]},
		"2" : {"connectedPoints" : [0,4,5]},
		"3" : {"connectedPoints" : [0,1,5]},
		"4" : {"connectedPoints" : [0,2]},
		"5" : {"connectedPoints" : [1,2,3]}
	}
}];
untangleGame.layers = [
	$('#bg')[0].getContext("2d"),
	$('#guide')[0].getContext("2d"),
	$('#game2')[0].getContext("2d"),
	$('#ui')[0].getContext("2d")
];
function setupclvl() {
	untangleGame.circles = [];
	var level = untangleGame.levels[untangleGame.clvl];
	for (var i=0; i<level.circles.length; i++) {
	untangleGame.circles.push(new Circle(level.circles[i].x, level.
	circles[i].y, 10));
	}
	// setup line data after setup the circles.
	connectCircles();
	updateLineIntersection();
}
function checkLevelCompleteness() {
	if ($("#progress").html() == "100") {
		if (untangleGame.clvl+1 < untangleGame.levels.length){
			untangleGame.clvl++;
		}else{
			alert('you win, game over');
		}
		setupclvl();
	}
}
function drawLine(ctx,x1,y1,x2,y2,t){
	// ctx.fillStyle = '#fff';
	// ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
	// ctx.globalCompositeOperation = 'destination-atop';
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = t;
	ctx.strokeStyle = "#cfc";
	ctx.stroke();
}
function clear(ctx){
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
}
function connectCircles(){
	var level = untangleGame.levels[untangleGame.clvl];
	untangleGame.lines.length = 0;
/*		for(var i = 0;i < untangleGame.circles.length; i++){
		var sp = untangleGame.circles[i];
		for(var j = 0;j < i;j++){
			var ep = untangleGame.circles[j];
		//	drawLine(ctx,sp.x,sp.y,ep.x,ep.y,1);
			untangleGame.lines.push(new Line(sp,ep,untangleGame.tT));
		}
	}
*/
	for (var i in level.relationship) {
		var connectedPoints = level.relationship[i].connectedPoints;
		var startPoint = untangleGame.circles[i];
		for (var j in connectedPoints) {
			var endPoint = untangleGame.circles[connectedPoints[j]];
			untangleGame.lines.push(new Line(startPoint, endPoint,untangleGame.tT));
		}
	}
}
function updateLevelProgress(){
	// check the untangle progress of the level
	var progress = 0;
	for (var i=0;i<untangleGame.lines.length;i++) {
		if (untangleGame.lines[i].t == untangleGame.tT) {
			progress++;
		}
	}
	var progressPercentage = Math.floor(progress/untangleGame.lines.
	length*100);
	$("#progress").html(progressPercentage);
	untangleGame.pp = progressPercentage;
	// display the current level
	$("#level").html(untangleGame.clvl);
}
function isIntersect (l1,l2) {
	var a1 = l1.ep.y - l1.sp.y,
		b1 = l1.sp.x - l1.ep.x,
		c1 = a1*l1.sp.x+b1*l1.sp.y;

	var a2 = l2.ep.y - l2.sp.y,
		b2 = l2.sp.x - l2.ep.x,
		c2 = a2*l2.sp.x+b2*l2.sp.y;

	var d = a1*b2 - a2*b1;

	if(d == 0){
		return false;
	}else{
		var x = (b2*c1 - b1 *c2)/d;
		var y = (a1*c2 - a2 *c1)/d;
	}
	if( (isInBetween(l1.sp.x,x,l1.ep.x) || isInBetween(l1.sp.y,y,l1.ep.y)) &&
		(isInBetween(l2.sp.x,x,l2.ep.y) || isInBetween(l1.sp.y,y,l1.ep.y)) ){
		return true;
	}else{
		return false;
	}
}
function isInBetween (a,b,c) {
	if (Math.abs(a-b) < 0 || Math.abs(b-c) < 0) {
		return false;
	}
	return (a < b && b < c) || (c < b && b < a);
}
function updateLineIntersection () {
	for (var i = untangleGame.lines.length - 1; i >= 0; i--) {
		for (var j = i-1; j >= 0; j--) {
		// for (var j = untangleGame.lines.length - 1; j >= 0; j--) {
		//	if(j == i){break;}
			var l1 = untangleGame.lines[i];
			var l2 = untangleGame.lines[j];
			if(isIntersect(l1,l2)){
				l1.t = untangleGame.bT;
				l2.t = untangleGame.bT;
			}
		};
	};
}
function fillLineGradient (ctx) {
	var w = ctx.canvas.width,
		h = ctx.canvas.height,
		sp = {x : w/2 - h*h/2/w, y : 0},
		ep = {x : w/2 + h*h/2/w, y : h};
	var bgGradient = ctx.createLinearGradient(sp.x,sp.y,ep.x,ep.y);
		bgGradient.addColorStop(0, "#789abc");
		bgGradient.addColorStop(1, "#ffffff");
		ctx.fillStyle = bgGradient;
		ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

}