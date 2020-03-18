var ControlsBlock = function (city) {
	this.block = createDiv("controlsBlock", city.block);
	this.city = city;
	
}

ControlsBlock.prototype = new Object();
var cbp = ControlsBlock.prototype;

/*var GlobalParams = {numParticles: 100, particleSize: 10, canvasWidth: 700, canvasHeight: 500, speed:3, 
					recoveryDays: 15, criticalStart: 0, criticalPart: 0.2, criticalDays: 25,
					careCapacity: 10, careGrowthRate: 2, caredDeathPart: 0.1, nonCaredDeathPart: 0.8,  
					responsibility: 0.7};
*/

ControlsBolck.PARAMS = [
	{name: "numParticles", min: 10, max: 5000, step: 10},
	{name: "canvasWidth", min: 50, max: 2000, step: 10},
	{name: "canvasHeight"
];
