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


	function drawCircle(x,y,r,sD,eD,isC,ctx){
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
		ctx.fill();
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
		clvl : 0
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
		//	"1" : {"connectedPoints" : [0,3]},
		//	"2" : {"connectedPoints" : [0,3]},
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
			{"x" : 92, "y" : 85},
			{"x" : 253, "y" : 13},
			{"x" : 393, "y" : 86},
			{"x" : 390, "y" : 214},
			{"x" : 248, "y" : 275},
			{"x" : 95, "y" : 216}],
		"relationship" : {
			"0" : {"connectedPoints" : [2,3,4]},
			"1" : {"connectedPoints" : [3,5]},
			"2" : {"connectedPoints" : [0,4,5]},
			"3" : {"connectedPoints" : [0,1,5]},
			"4" : {"connectedPoints" : [0,2]},
			"5" : {"connectedPoints" : [1,2,3]}
		}
	}];
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
	(function(){
		var canvas = $('#game2')[0],
			ctx = canvas.getContext('2d'),
			r = 10,
			width = canvas.width,
			height = canvas.height;
/*		var circlesCount = 5;
		for(var i = 0;i < circlesCount; i++){
			var x = Math.random()*width,
				y = Math.random()*height;
			ctx.fillStyle = 'rgba(200,200,100,.9)';
			drawCircle(x,y,r,0,360,false,ctx);
			untangleGame.circles.push(new Circle(x,y,r));
		}
*/		
		setupclvl();
		connectCircles();
		var $game2 = $('#game2');
		$game2.mousedown(function(e){
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
		$game2.mousemove(function(e){
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
		$game2.mouseup(function(e){
			untangleGame.targetCircle = undefined;
			// on every mouse up, check if the untangle puzzle is solved.
			checkLevelCompleteness();
		});
		setInterval(function(){
		//	var canvas = $game2[0],
		//		ctx = canvas.getContext('2d');
			clear(ctx);
			fillLineGradient(ctx);

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
		},20);
	})();
	
	function fillLineGradient (ctx) {
		var w = ctx.canvas.width,
			h = ctx.canvas.height,
			sp = {x : w/2 - h*h/2/w, y : 0},
			ep = {x : w/2 + h*h/2/w, y : h};
		var bg_gradient = ctx.createLinearGradient(sp.x,sp.y,ep.x,ep.y);
			bg_gradient.addColorStop(0, "#789abc");
			bg_gradient.addColorStop(1, "#ffffff");
			ctx.fillStyle = bg_gradient;
			ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

	}
	
	
	
	
	
	
	
});