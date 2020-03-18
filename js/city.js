function City(parent=null, options={}, interactive = false) {

	this.params = {};
	copyObject(GlobalParams, this.params);
	copyObject(options, this.params);
	if (!this.params.hiddenFields) this.params.hiddenFields = [];
	City.setSilentParams(this.params);
	
	//---Layout--------------------------------
	
	this.block = createDiv("cityBlock", parent);
	
	if (this.params.name) {
		var title = addP( this.block, this.params.name, "h3");
		title.setAttribute("class", "cityName");
	}
	
	this.contentBlock = createDiv("cityContentBlock", this.block);
	
	//----------Simulation----------------------------
	this.simBlock = createDiv("simBlock", this.contentBlock);
	this.simInfoBlock = createDiv("simInfoBlock", this.simBlock);
	this.dataBlock = createDiv("dataBlock", this.simInfoBlock);
	this.buttonsBlock = createDiv("buttonsBlock", this.simInfoBlock);

	this.canvas = document.createElement("canvas");
	this.canvas.setAttribute("class", "city");
	this.canvas.setAttribute("width", this.params.canvasWidth);
	this.canvas.setAttribute("height", this.params.canvasHeight);
	this.simBlock.appendChild(this.canvas);
	
	//----------Statistics---------------------
	
	this.statBlock = createDiv("statBlock", this.contentBlock);
	
	this.statCanvas = document.createElement("canvas");
	this.statCanvas.setAttribute("class", "stat");
	
	this.statCanvas.setAttribute("width", City.StatCanvasWidth);
	this.statCanvas.setAttribute("height", City.StatCanvasHeight);
	
	this.statBlock.appendChild(this.statCanvas);
	this.statDataBlock = createDiv("statDataBlock", this.statBlock);

	this.infoBlock = createDiv("currentStat", this.statDataBlock);

	this.generalStatBlock = createDiv("generalStat", this.statDataBlock);

	
	//-----------------------------------------

	
	
	if (interactive) {
		this.initialParams = {};
		copyObject(this.params, this.initialParams);
		this.controlPanel = new ControlPanel(this);
		var cp = this.controlPanel;
		cp.hide();
		this.optionsButton = addButton("Settings", this.buttonsBlock, function () {cp.show()});
	}
	
	this.curCareCapacity = this.params.careCapacity;
	
	
	this.dataBlock.valueFields = [];
	var displayData = this.getDisplayData();
	for (var i = 0; i < displayData.length; i++) {
			var infoLine = createDiv("infoLine", this.dataBlock);
			var paramName = addP(infoLine, displayData[i].name + ": ", "span");
			paramName.setAttribute("class", "paramName");
			var paramVal = addP(infoLine, displayData[i].value, "span");
			paramVal.setAttribute("class", "paramValue");
			this.dataBlock.valueFields[i] = paramVal;
	}
	
	
	
	this.plotTimeStep = this.statCanvas.width/this.params.maxSimTime;
	this.numScale = this.statCanvas.height/this.params.numParticles;
	
	

	this.ctx = this.canvas.getContext("2d");
	this.statCtx = this.statCanvas.getContext("2d");
	
	this.particles = [];
	
	this.curTime = 0;
	this.statData = new Object();
	this.statNodes = new Object();
	for (var i = 0; i < Particle.STATES_SORTED.length; i++) {
			var state = Particle.STATES_SORTED[i];
			this.statData[state] = 0;
			var infoLine = createDiv("infoLine", this.infoBlock);
			var stateName = addP(infoLine, state + ": ", "span");
			stateName.setAttribute("class", "stateName");
			var stateNum = addP(infoLine, "0", "span");
			stateNum.setAttribute("class", "stateNum");
			infoLine.style.color = Particle.STATE_COLORS[state];
			this.statNodes[state] = stateNum;
	}
	
	//function addButton (value, parent, clickHandler, id, className) {
	var that = this;
	this.finished = true;
	this.started = false;
	function start() {
		that.finished = false;
		startBtn.classList.add("hidden");
		restartBtn.classList.remove("hidden");	
		that.started = true;
	}
	var startBtn = addButton("Start", this.buttonsBlock, start);
	this.startBtn = startBtn;
	
	function restart() {
		that.restart.call(that);
	}
	var restartBtn = addButton("Restart",this.buttonsBlock, restart);
	restartBtn.classList.add("hidden");
	this.restartBtn = restartBtn;
	
	this.populate();
	this.initGeneralStatistic();
}

City.prototype = new Object();

var cp = City.prototype;

cp.isCareFull = function () {
	return this.curCareCapacity < this.statData[Particle.STATES.CRITICAL];
}

cp.addParticle = function (particle) {
	this.particles.push(particle);
	this.statData[particle.state] ++;
}

cp.update = function() {
	//console.log("update city");
	if (!this.finished) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.isCareFull()) {
			this.ctx.fillStyle="#ffeeee";
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
		for (var i = 0; i < this.particles.length - 1; i++) {
			for (var j = i+1; j < this.particles.length; j++) {
				this.particles[i].checkCollision(this.particles[j]);
			}
		}
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].update();
		}
		this.updateStatistics();
		this.curTime ++;
		this.curCareCapacity = Math.max(Math.min(this.curCareCapacity + this.params.careGrowthRate/City.TaktsPerDay, this.params.numParticles*this.params.criticalPart*1.1), this.params.careCapacity);
		//console.log(this.curCareCapacity, City.TaktsPerDay, this.params.careCapacityRate);
	}
}

cp.updateStatData = function() {
	for (var f in this.statData) {
		if (this.statData.hasOwnProperty(f)) this.statData[f] = 0;
	}
	for (var i = 0; i < this.particles.length; i++) {
		this.statData[this.particles[i].state] ++;
	}
}

cp.updateStatistics = function() {
	this.updateStatData();
	for (var f in this.statData) {
		if (this.statData.hasOwnProperty(f)) this.statNodes[f].innerHTML = this.statData[f];
	}
	
	if (this.statData[Particle.STATES.SICK] == 0 && this.statData[Particle.STATES.CRITICAL] == 0) this.finished = true;
	
	var curX = this.curTime*this.plotTimeStep;
	var curY = this.particles.length*this.numScale;//!!!!!!!!!
	for (var i = 0; i < Particle.STATES_SORTED.length; i++) {
		var state = Particle.STATES_SORTED[i];
		var height = this.statData[state]*this.numScale;
		curY -= height;
		this.statCtx.fillStyle = Particle.STATE_COLORS[state];
		//console.log(this.curTime, this.plotTimeStep, curY, this.statCtx.fillStyle, height);
		this.statCtx.fillRect(curX, curY, this.plotTimeStep, height);
	}
	this.statCtx.fillStyle = "magenta";
	this.statCtx.fillRect(curX, this.statCanvas.height - this.curCareCapacity*this.numScale, this.plotTimeStep, 1);
	if (this.finished && this.started) this.updateGeneralStatistic(); 

}

cp.populate = function () {

	for (var i = 0; i < this.params.numParticles-1; i++) {
		var p = new Particle(this, Particle.STATES.HEALTHY, Math.random() < this.params.responsibility);
		p.update();
	}
	pSick = new Particle(this, Particle.STATES.SICK, false);
	pSick.update();
	
	this.updateStatistics();


}

cp.resetStat = function () {
	for (var f in this.statData) {
		if (this.statData.hasOwnProperty(f)) this.statData[f] = 0;
	}
	for (var f in this.statData) {
		if (this.statData.hasOwnProperty(f)) this.statNodes[f].innerHTML = 0;
	}
	
	this.statCtx.clearRect(0, 0, this.statCanvas.width, this.statCanvas.height);

}


cp.restart = function () {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	if (this.paramsChanged) {
		this.canvas.width = this.params.canvasWidth;
		this.canvas.height = this.params.canvasHeight;
		this.plotTimeStep = this.statCanvas.width/this.params.maxSimTime;
		this.numScale = this.statCanvas.height/this.params.numParticles;

		this.clearGeneralStatistics();
		this.updateDisplayData();
		this.restartBtn.classList.add("hidden");
		this.startBtn.classList.remove("hidden");
	} 
	this.particles.delete;
	this.particles = [];
	this.curTime = 0;
	this.resetStat();
	this.populate();
	this.curCareCapacity = this.params.careCapacity;
	if (this.paramsChanged) {
	 	this.finished = true;
	 	this.started = false;
	 	this.paramsChanged = false;
	 } else {
		this.finished = false;
	}
	this.generalStatisticUpdated = false;
}

cp.getDisplayData = function () {
	var displayData = [];
	console.log("get display data", this.params);
	displayData.push({name: "Population", value: this.params.numParticles});
	displayData.push({name: "Contacts per day", value: (this.params.numParticles*this.params.speed*this.params.particleSize*City.TaktsPerDay/this.params.canvasWidth/this.params.canvasHeight).toFixed(2)});
	if (this.params.hiddenFields.indexOf("responsibility") == -1)
		displayData.push({name: "Responsibility", value: this.params.responsibility.toFixed(2)});
	if (this.params.hiddenFields.indexOf("careCapacity") == -1)
		displayData.push({name: "Start health care capacity", value: this.params.careCapacity});
	if (this.params.hiddenFields.indexOf("careGrowthRate") == -1)
		displayData.push({name: "Health care capacity growth rate", value: this.params.careGrowthRate});
	return displayData;

}

cp.updateDisplayData = function () {
	var displayData = this.getDisplayData();
	console.log("updat display data", displayData);
	for (var i = 0; i < displayData.length; i++) {
		this.dataBlock.valueFields[i].innerHTML = displayData[i].value;
	}
}

cp.initGeneralStatistic = function () {
	this.generalStatistic = [];
	this.generalStatisticUpdated = false;
	
	this.generalStatLines = {};
	var fields = ["Trials", "Dead", "Healthy", "Recovered"];
	for (var i = 0; i < fields.length; i++) {
		this.generalStatLines[fields[i]] = createDiv("generalStatLine", this.generalStatBlock);
		this.generalStatLines[fields[i]].nameLine = addP(this.generalStatLines[fields[i]], fields[i] + ": ", "span");
		this.generalStatLines[fields[i]].valueLine = addP(this.generalStatLines[fields[i]], "0", "span");
	}
	
}

cp.clearGeneralStatistics = function () {
	for (var ff in this.generalStatLines) {
		this.generalStatLines[ff].valueLine.innerHTML = 0	}
	this.generalStatistic = [];
	this.generalStatisticUpdated = false;
}

cp.updateGeneralStatistic = function () {
	if (!this.generalStatisticUpdated) {
		this.generalStatistic.push({Dead: this.statData[Particle.STATES.DEAD], Healthy: this.statData[Particle.STATES.HEALTHY], Recovered: this.statData[Particle.STATES.RECOVERED] });
		this.generalStatistic.average = {};
		var n = this.generalStatistic.length;
		var av={}, disp = {};
		for (var i = 0; i < n; i++) {
			for (var f in this.generalStatistic[i]) {
				if (this.generalStatistic[i].hasOwnProperty(f)) {
					if (!av.hasOwnProperty(f)) av[f] = 0;
					if (!disp.hasOwnProperty(f)) disp[f] = 0;
					av[f] += this.generalStatistic[i][f];
					disp[f] += this.generalStatistic[i][f]**2;
				}
			}
		}
		
		for (var ff in av) {
			if (av.hasOwnProperty(ff)) {
				av[ff]/=n;
				disp[ff]/=n;
				disp[ff] = Math.sqrt(disp[ff] - av[ff]**2);	
				this.generalStatistic.average[ff] = {av: av[ff], disp: disp[ff]}		
				this.generalStatLines[ff].valueLine.innerHTML = av[ff].toFixed(0) + " &plusmn; " + disp[ff].toFixed(0); 
			}
		}
		this.generalStatisticUpdated = true;
		this.generalStatLines.Trials.valueLine.innerHTML = n;

	}
}

cp.updateParams = function (paramsObj) {
	this.paramsChanged = true;
	copyObject(paramsObj, this.params);
	City.setSilentParams(this.params);
	this.finished = true;
	this.started = false;
	this.restart();
}

City.TaktsPerDay = 42;
City.StatCanvasWidth = 700;
City.StatCanvasHeight = 500;
City.setSilentParams = function (obj) {
	obj.recoveryTime = obj.recoveryDays*City.TaktsPerDay;
	obj.criticalTime = obj.criticalDays*City.TaktsPerDay;
	obj.maxSimTime = obj.criticalTime*3;
	obj.criticalRate = 1-(1-obj.criticalPart)**(1/(obj.recoveryTime-obj.criticalStart));
	obj.caredFatality = 1-(1-obj.caredDeathPart)**(1/obj.criticalTime);
	obj.nonCaredFatality = 1-(1-obj.nonCaredDeathPart)**(1/obj.criticalTime);
	obj.contactsPerDay =  obj.numParticles*obj.speed*obj.particleSize*City.TaktsPerDay/obj.canvasWidth/obj.canvasHeight;
}


