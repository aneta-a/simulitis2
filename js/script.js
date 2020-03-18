var qs;
var sideMenu, mainPage;
var GlobalParams = {numParticles: 100, particleSize: 10, canvasWidth: 700, canvasHeight: 500, speed:3, 
					recoveryDays: 15, criticalStart: 0, criticalPart: 0.2, criticalDays: 25,
					careCapacity: 10, careGrowthRate: 2, caredDeathPart: 0.1, nonCaredDeathPart: 0.8,  
					responsibility: 0.7};
//var TaktsPerDay = 42;

var cities = [];


function pageInit() {
	//sideMenu = document.getElementById("list");
	mainPage = document.getElementById("main");
	showWait();

	qs = parseQueryString();
	setGlobalVars(qs);
	//if (qs.hasOwnProperty("showSideMenu") && qs.showSideMenu && qs.showSideMenu.toLowerCase() != "no" && qs.showSideMenu.toLowerCase() != "false")
		//showSideMenu();
	
	//initDefaultCity();
	
	var Diycity = {};
	copyObject(Brownburg, Diycity);
	Diycity.name = "Diycity";
	
	//addButton (value, parent, clickHandler, id, className)
	addButton("RU", mainPage, function() {changeLocale("ru");}, "ruLocaleButton", "localeButton");
	addButton("EN", mainPage, function() {changeLocale("en");}, "enLocaleButton", "localeButton");
	
	addP(mainPage, getString("Title"), "h1");
	addP(mainPage, getString("Intro"));
	addP(mainPage, getString("pBrownien"));
	initCity(Brownien);
	addP(mainPage, getString("pBrownille"));
	initCity(Brownville);
	addP(mainPage, getString("pBrownhrad"));
	initCity(Brownhrad);
	addP(mainPage, getString("pBrowntown"));
	initCity(Browntown);
	addP(mainPage, getString("pBrownburg"));
	initCity(Brownburg);
	addP(mainPage, getString("pDiycity"));
	initCity(Diycity, true);
	addP(mainPage, getString("Resume"));
	
	hideWait();
	
	animate();
	
}

function setGlobalVars (qs) {
	for (var f in qs) 
		if (qs.hasOwnProperty(f))
			GlobalParams[f] = qs[f];
	City.setSilentParams(GlobalParams);
	if (qs.hasOwnProperty("locale")) CurLocale = qs.locale.toLowerCase();
}

function changeLocale(locale){
	if (qs.hasOwnProperty("locale") && qs.locale == locale) {
		return;
	} else {
		qs.locale = locale;
		var qs_str = createQueryString(qs);
		window.location.assign(window.location.href.split("?")[0] + "?" + qs_str);
	}
		
}



function initCity(options, interactive=false) {
	var defOptions = {};
	copyObject(GlobalParams, defOptions);
	copyObject(options, defOptions);
	console.log("initCity", defOptions);
	var newCity = new City(mainPage, defOptions, interactive);
	cities.push(newCity);
}

function initDefaultCity() {
	initCity(GlobalParams);
}

function updateCity(city){
	city.update();
}

//-----------Layout-------------------------
/*function hideSideMenu() {
	document.getElementById('list').style.width = '0';
  	document.getElementById('main').style.marginLeft = '0';
  	document.getElementById('menuButton').style.display='inline-block';
  	document.getElementById('hideMenuButton').style.display='none';
}

function showSideMenu() {
	document.getElementById('list').style.width = '250px';
  	document.getElementById('main').style.marginLeft = '250px'; 
  	document.getElementById('menuButton').style.display='none'
  	document.getElementById('hideMenuButton').style.display='inline-block'
}*/

function showWait() {
	var pleaseWait = document.getElementById("pleaseWaitWindow");
	if (!pleaseWait) {
		pleaseWait = createDiv("overAll", mainPage);
		addP(pleaseWait, "Please, wait...");
		pleaseWait.setAttribute("id", "pleaseWaitWindow");
	}
	pleaseWait.classList.remove("hidden");
}

function hideWait() {
	document.getElementById("pleaseWaitWindow").classList.add("hidden");
}


//-----------------------------------------------

function animate()
{
    //if (nightViewChanged) onNightViewChanged();
    for (var i = 0; i < cities.length; i++)
    	updateCity(cities[i]);
    requestAnimationFrame ( animate ); 
}


