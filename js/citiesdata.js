var CommonData = {numParticles: 1000, particleSize: 12, canvasWidth: 700, canvasHeight: 500, speed:2, 
					recoveryDays: 15, criticalStart: 0, criticalPart: 0.2, criticalDays: 25,
					careCapacity: 5, careGrowthRate: 4, caredDeathPart: 0.1, nonCaredDeathPart: 0.8,  
					responsibility: 0.85};
var Brownien ={};
copyObject(CommonData, Brownien);
Brownien.responsibility = 0;
Brownien.careCapacity = Brownien.numParticles;
Brownien.careGrowthRate = 0;
Brownien.name = "Brownien";
Brownien.hiddenFields = ["responsibility", "careCapacity", "careGrowthRate"];

var Brownville ={};
copyObject(CommonData, Brownville);
Brownville.responsibility = 0;
Brownville.careCapacity = 5;
Brownville.careGrowthRate = 0;
Brownville.name = "Brownville";
Brownville.hiddenFields = ["responsibility", "careGrowthRate"];

var Brownhrad ={};
copyObject(CommonData, Brownhrad);
Brownhrad.responsibility = 0.9;
Brownhrad.careCapacity = 5;
Brownhrad.careGrowthRate = 0;
Brownhrad.name = "Brownhrad";
Brownville.hiddenFields = ["careGrowthRate"];

var Browntown = {};
copyObject(CommonData, Browntown);
Browntown.responsibility = 0.0;
Browntown.careCapacity = 5;
Browntown.careGrowthRate = 5;
Browntown.name = "Browntown";

var Brownburg = {};
copyObject(CommonData, Brownburg);
Brownburg.responsibility = 0.85;
Brownburg.careCapacity = 5;
Brownburg.careGrowthRate = 4;
Brownburg.name = "Brownburg";





