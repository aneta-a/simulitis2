var ControlPanel = function (city) {
	this.block = createDiv("controlPanel", city.block);
	this.city = city;
	this.defaultValues = {};
	copyObject(city.initialParams, this.defaultValues);
	
	this.curParams = {};
	copyObject(this.defaultValues, this.curParams);
	if (this.curParams.name) this.titleLine = addP(this.block, this.curParams.name, "h2");
	
	this.diseaseBlock = createDiv("sliders-block", this.block);
	this.cityBlock = createDiv("sliders-block", this.block);
	this.reactionBlock = createDiv("sliders-block", this.block);
	
	this.initSliders(ControlPanel.DISEASE_NAME, ControlPanel.DISEASE_PARAMS, this.diseaseBlock);
	this.initSliders(ControlPanel.CITY_NAME, ControlPanel.CITY_PARAMS, this.cityBlock);
	this.initSliders(ControlPanel.REACTION_NAME, ControlPanel.REACTION_PARAMS, this.reactionBlock);
	
	//function addButton (value, parent, clickHandler, id, className) {
	
	function applyHandler(ev) {
		if (ev.target.panel) ev.target.panel.applyImpl.call(ev.target.panel);
	}
	var applyBtn = addButton("Apply", this.block, applyHandler, "", "applyButton");
	applyBtn.panel = this;
	
	function canсelHandler(ev) {
		ev.target.panel.hide();
	}
	var closeBtn = addButton("Canсel", this.block, canсelHandler, "", "canсelButton");
	closeBtn.panel = this;
	
}

ControlPanel.prototype = new Object();
var cbp = ControlPanel.prototype;

cbp.applyImpl = function () {
	this.hide();
	this.city.updateParams(this.curParams);

	
}
cbp.hide = function () { this.block.classList.add("hidden");}
cbp.show = function () {this.block.classList.remove("hidden");}
cbp.createSlider = function (dataObj, block) {
	//function setSlider (name, mn, mx, startVal, postfix="", parent = document.body, int= false) {
	var nameString = dataObj.hasOwnProperty("nameString") ? dataObj.nameString : (dataObj.name.charAt(0).toUpperCase() + dataObj.name.slice(1));
	var minVal = dataObj.m01 ? 0 : dataObj.min;
	var maxVal = dataObj.m01 ? 1 : dataObj.max;
	
	var slider = setSlider(nameString, minVal, maxVal, this.city.params[dataObj.name], dataObj.postfix, block, !dataObj.m01);
	slider.paramName = dataObj.name;
	slider.panel = this;
	
	slider.addEventListener("change", function (ev) {
		var sl = ev.target;
		if (sl.panel) {
			sl.panel.updateParam.call(sl.panel, sl.paramName, Number(sl.value));
		}
	})
}

cbp.initSliders = function (name, data, block) {
	var dataBlockName = addP(block, name, "h3");
	dataBlockName.setAttribute("class", "controlBlockName");
	for(var i = 0; i < data.length; i++) {
		this.createSlider(data[i], block);
	}
}

cbp.updateParam =  function (name, value) {
	this.curParams[name] = value;
}

/*var GlobalParams = {numParticles: 100, particleSize: 10, canvasWidth: 700, canvasHeight: 500, speed:3, 
					recoveryDays: 15, criticalStart: 0, criticalPart: 0.2, criticalDays: 25,
					careCapacity: 10, careGrowthRate: 2, caredDeathPart: 0.1, nonCaredDeathPart: 0.8,  
					responsibility: 0.7};
*/

ControlPanel.CITY_NAME = "City";
ControlPanel.CITY_PARAMS = [
	{name: "numParticles", min: 10, max: 2000, step: 10, nameString: "Population"},
	/*{name: "canvasWidth", min: 400, max: 2000, step: 10, nameString: "Width"},
	{name: "canvasHeight", min: 300, max: 2000, step: 10, nameString: "Height"},*/
	{name: "particleSize", min: 2, max: 20, nameString: "Size of a \"particle\""},
	{name: "speed", min: 1, max: 10},
];

ControlPanel.DISEASE_NAME = "Disease";
ControlPanel.DISEASE_PARAMS = [
		{name: "recoveryDays", min: 1, max: 100, nameString: "Recovery time", postfix: "days"},
	{name: "criticalStart", min: 0, max: 100, bound: {max: "recoveryDays"}, nameString: "Possible start of critical state", postfix: "days"},
	{name: "criticalPart", m01: true, nameString: "Part of patients in critical state"},
	{name: "criticalDays", min: 2, max: 100, nameString: "Critical state time", postfix: "days"},
	{name: "caredDeathPart", m01: true, bound: {max: "nonCaredDeathPart"}, nameString: "Death rate with medical attention"},
	{name: "nonCaredDeathPart", m01: true, bound: {min: "caredDeathPart"}, nameString: "Death rate without medical attention"}

];

ControlPanel.REACTION_NAME = "Reaction";
ControlPanel.REACTION_PARAMS = [
	{name: "careCapacity", min: 0, max: 5000, bound: {max: "numParticles"}, nameString: "Start health care capacity"},
	{name: "careGrowthRate", min: 0, max: 20, nameString: "health care growth rate", postfix: "per day"},
	{name: "responsibility", m01: true}/*,
	{name: "quarantineDays", min: 1, max: 1000, nameString: "Quarantine time", postfix: "days"}*/
];
