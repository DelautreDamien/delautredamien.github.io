var color = ["#e66465"];

// ==============================================================
// =====CLASSES==================================================
// ==============================================================

class quad {
	constructor(zPos, tex){
		this.zPos=zPos;
		this.tex=tex;
		this.charCol=[0.0,0.0,0.0]
	}
}

class serie {
	constructor() {
		this.serie = serie;
		this.faussecouleur = true;
		this.col = [1.0, 1.0, 1.0];
		this.quads= new Map;
	}
}


// ==============================================================
// =====FUNCTIONS================================================
// ==============================================================

/**
 * transformer une expression hexadécimale en RGB
 * @param hex
 * @returns {{r: number, b: number, g: number}|null}
 */
function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

/**
 * afficher ou non un block
 * @param name
 * @param display
 */
function displayOrNot(name, display){
	if(display) {
		document.getElementById(name).style.display = "block";
	}
	else {
		document.getElementById(name).style.display = "none";
	}
}

/**
 * pour le bouton checkbox qui gère les fausses couleurs
 */
function onoffFC() {
	var isChecked = document.getElementById("myCheckbox").checked;
	console.log(isChecked);
	if (isChecked) {
		console.log("off");
		serie.faussecouleur = false;
		loadShaders("shaderSC");
		displayOrNot("color", false);
		displayOrNot("transparency", true);
	}
	else {
		console.log("on");
		serie.faussecouleur = true;
		loadShaders("shaderFC");
		displayOrNot("color", true);
		displayOrNot("transparency", false);
	}
}

/**
 * gère la transparence des quads
 * @param target
 */
function valSeuildensité(target) {
	target.nextElementSibling.value = target.value;
	treshold = target.value;
	/*if (treshold > 0.5) {
		document.getElementById("myCheckboxColor6").checked = true;
		document.getElementById("myCheckboxColor6").disabled = true;
		onoffColorTransparency("myCheckboxColor6", 5);
	}
	else {
		document.getElementById("myCheckboxColor6").checked = false;
		document.getElementById("myCheckboxColor6").disabled = false;
		onoffColorTransparency("myCheckboxColor6", 5);
	}

	if (treshold > 0.6) {
		document.getElementById("myCheckboxColor5").checked = true;
		document.getElementById("myCheckboxColor5").disabled = true;
		onoffColorTransparency("myCheckboxColor5", 4);
	}
	else {
		document.getElementById("myCheckboxColor5").checked = false;
		document.getElementById("myCheckboxColor5").disabled = false;
		onoffColorTransparency("myCheckboxColor5", 4);
	}

	if (treshold > 0.7) {
		document.getElementById("myCheckboxColor4").checked = true;
		document.getElementById("myCheckboxColor4").disabled = true;
		onoffColorTransparency("myCheckboxColor4", 3);
	}
	else {
		document.getElementById("myCheckboxColor4").checked = false;
		document.getElementById("myCheckboxColor4").disabled = false;
		onoffColorTransparency("myCheckboxColor4", 3);
	}

	if (treshold > 0.8) {
		document.getElementById("myCheckboxColor3").checked = true;
		document.getElementById("myCheckboxColor3").disabled = true;
		onoffColorTransparency("myCheckboxColor3", 2);
	}
	else {
		document.getElementById("myCheckboxColor3").checked = false;
		document.getElementById("myCheckboxColor3").disabled = false;
		onoffColorTransparency("myCheckboxColor3", 2);
	}

	if (treshold > 0.9) {
		document.getElementById("myCheckboxColor2").checked = true;
		document.getElementById("myCheckboxColor2").disabled = true;
		onoffColorTransparency("myCheckboxColor2", 1);
	}
	else {
		document.getElementById("myCheckboxColor2").checked = false;
		document.getElementById("myCheckboxColor2").disabled = false;
		onoffColorTransparency("myCheckboxColor2", 1);
	}*/

}

/**
 * changer la couleur des fausses couleurs
 * @param target
 * @param vec
 */
function changeColor(target, vec) {
	var rgb = hexToRgb(target.value)
	fColorTab[vec][0] = rgb.r/255;
	fColorTab[vec][1] = rgb.g/255;
	fColorTab[vec][2] = rgb.b/255;
}

/**
 * afficher ou non une couleur
 * @param target
 * @param num
 */
function onoffColorTransparency(target, num) {
	var isChecked = document.getElementById(target.id).checked;
	console.log(isChecked);
	if (isChecked) {
		console.log("off");
		fColorAlpha[num] = 0.0;
	}
	else {
		console.log("on");
		fColorAlpha[num] = 1.0;
	}
}

/**
 * gère la transparence des quads
 * @param target
 */
function transparence(target) {
	target.nextElementSibling.value = target.value;
	alpha = target.value;
}

/**
 * pour le bouton checkbox qui gère le frame 3D ou 2D
 */
function onoffFrame() {
	var isChecked = document.getElementById("myCheckbox2").checked;
	console.log(isChecked);
	if (isChecked) {
		console.log("off");
		soloFrame = true;
		displayOrNot("sliderSoloFrame", true);
		displayOrNot("nbrFrame", false);
	}
	else {
		console.log("on");
		soloFrame = false;
		displayOrNot("sliderSoloFrame", false);
		displayOrNot("nbrFrame", true);
	}
}

/**
 * change la frame min à afficher
 * @param target
 */
function frameMinimum(target) {
	target.nextElementSibling.value = target.value;
	if (target.valueAsNumber < end) {
		start = target.valueAsNumber-1;
	}
	else {
		alert("WARNING : The minimum frame must be lower than the maximum frame.")
	}
}

/**
 * change le frame maximum à afficher
 * @param target
 */
function frameMaximum(target) {
	target.nextElementSibling.value = target.value;
	if (start < target.valueAsNumber) {
 		end = target.valueAsNumber;
	} else {
		alert("WARNING : The maximum frame must be higher than the minimum frame.")
	}
}

/**
 * si le checkbox Frame est à ON, donne la frame à afficher
 * @param target
 */
function singleFrame(target) {
	target.nextElementSibling.value = target.value;
	single = target.value;
}


// --------------------------------------------
function loadAShaders(){
	if (serie.faussecouleur) {
		loadShaders("shaderFC");
	}
	else {
		loadShaders("shaderSC");
	}
}

