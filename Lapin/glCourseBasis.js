
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var distCENTER;
// =====================================================

var OBJS= [];
var PLANE = null;

// =====================================================
// ColorChanger, pour les changement de couleur des objets
// =====================================================

class IHMColorChanger {

	// --------------------------------------------
	constructor(obj, idd) {
		this.idd= idd;
		this.colortester = document.getElementById(idd);
		this.owner = obj;
	}

	// --------------------------------------------
	ressetColors(hex) {
		
		var res = this.hexToRgb(hex);
		this.owner.setR(res.r/255);
		this.owner.setG(res.g/255);
		this.owner.setB(res.b/255);
	}

	// --------------------------------------------
	hexToRgb(hex) {
		
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
		} : null;
	}
}

// =====================================================
// Slider, pour les variations des paramétres des objets
// =====================================================

class IHMSlider {

	// --------------------------------------------
	constructor(obj, rangeIdd, varIdd, param) {

		this.rangeName = rangeIdd;
		this.varName = varIdd;
		this.slider = document.getElementById(rangeIdd);
		this.output = document.getElementById(varIdd);
		this.owner = obj;
		this.pset = param;
	}

	// --------------------------------------------
	getRangeName(){
		return(this.rangeName)
	}

	// --------------------------------------------
	react(val) {
		this.slider.value=val;
		this.output.innerHTML = this.slider.value/100;
		switch(this.pset) {
			case "alpha":
				this.owner.setalpha(this.slider.value/100);
				break;
			case "X":
				this.owner.setPosX(this.slider.value/100);
				break;
			case "Y":
				this.owner.setPosY(this.slider.value/100);
				break;				
			default : 
				this.owner.setalpha(this.slider.value/100);
				break;
		}
	}
	reset(){
		this.slider = document.getElementById(this.rangeName);
		this.output = document.getElementById(this.varName);
		this.output.innerHTML = this.slider.value/100;		
	}
}

// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

class objmesh {

	// --------------------------------------------
	constructor(objFName, pos, indice) {
		this.objName = objFName;
		this.shader1= null;
		this.shader2= null;
		this.wireShaderName = 'wire';
		this.loaded = -1;
		this.shaderName = 'obj';
		this.faceDisplay = true;
		this.wireDisplay = false;
		this.mesh = null;
		this.pos= pos;
		this.alpha = 0.8;
		this.ks= 0.5;
		this.n = 100.0;
		this.r = 1.0;
		this.g = 1.0;
		this.b = 1.0;
		this.num = indice;
		this.colorChanger = new IHMColorChanger(this,"colorObj"+String(this.num));
		this.sliders=[];

		loadObjFile(this);
		loadShaders(this);
		this.shader1 = { shaderName:'obj'};
		loadShadersNEW(this.shader1);
		this.shader2 = { shaderName:'wire'};
		loadShadersNEW(this.shader2);	
	}

	// --------------------------------------------
	setalpha(newVal){
		this.alpha=newVal;
	}

	// --------------------------------------------
	setR(newVal){
		this.r=newVal;
	}

	// --------------------------------------------
	setG(newVal){
		this.g=newVal;
	}

	// --------------------------------------------
	setB(newVal){
		this.b=newVal;
	}

	// --------------------------------------------
	setPosX(newVal){
		this.pos[0]=newVal;
	}

	// --------------------------------------------
	setPosY(newVal){
		this.pos[1]=newVal;
	}

	// --------------------------------------------
	setWireDisplay(){
		if (this.wireDisplay==true){
			this.wireDisplay=false;
		}
		else{
			this.wireDisplay=true;
		}
	}

	// --------------------------------------------
	setFaceDisplay(){
		if (this.faceDisplay==true){
			this.faceDisplay=false;
		}
		else{
			this.faceDisplay=true;
		}
	}

	// --------------------------------------------
	setShadersParams() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);

		gl.useProgram(this.shader1.shader);

		this.shader1.vAttrib = gl.getAttribLocation(this.shader1.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader1.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader1.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader1.nAttrib = gl.getAttribLocation(this.shader1.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader1.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader1.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader1.rMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uRMatrix");
		this.shader1.mvMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uMVMatrix");
		this.shader1.pMatrixUniform = gl.getUniformLocation(this.shader1.shader, "uPMatrix");
		gl.uniformMatrix4fv(this.shader1.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader1.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader1.pMatrixUniform, false, pMatrix);

		gl.uniform1f(this.shader1.uAlpha, this.alpha);
		gl.uniform3fv(this.shader1.pos, this.pos);
		gl.uniform1f(this.shader1.ks, this.ks);
		gl.uniform1f(this.shader1.n, this.n);
		gl.uniform1f(this.shader1.r, this.r);
		gl.uniform1f(this.shader1.g, this.g);
		gl.uniform1f(this.shader1.b, this.b);

		this.shader1.uAlpha = gl.getUniformLocation(this.shader1.shader, "uAlpha");
		this.shader1.pos = gl.getUniformLocation(this.shader1.shader, "uObjPos");
		this.shader1.ks = gl.getUniformLocation(this.shader1.shader, "Ks");
		this.shader1.n = gl.getUniformLocation(this.shader1.shader, "n");
		this.shader1.r = gl.getUniformLocation(this.shader1.shader, "r");
		this.shader1.g = gl.getUniformLocation(this.shader1.shader, "g");
		this.shader1.b = gl.getUniformLocation(this.shader1.shader, "b");
	}

	// --------------------------------------------
	setShadersParamsWire() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);

		gl.useProgram(this.shader2.shader);
		this.shader2.vAttrib = gl.getAttribLocation(this.shader2.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader2.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader2.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader2.rMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uRMatrix");
		this.shader2.mvMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uMVMatrix");
		this.shader2.pMatrixUniform = gl.getUniformLocation(this.shader2.shader, "uPMatrix");
		gl.uniformMatrix4fv(this.shader2.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader2.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader2.pMatrixUniform, false, pMatrix);
		
		this.shader2.pos = gl.getUniformLocation(this.shader2.shader, "uObjPos");
		gl.uniform3fv(this.shader2.pos, this.pos);
	}
	
	// --------------------------------------------
	draw() {
		if(this.shader1.shader &&  this.mesh != null && this.faceDisplay==true) {
			this.setShadersParams();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
		if(this.shader2.shader &&  this.mesh != null && this.wireDisplay==true) {	
			this.setShadersParamsWire();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.wireIndex);
			gl.drawElements(gl.LINES, this.mesh.wireIndex.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
}



// =====================================================
// PLAN 3D, Support géométrique
// =====================================================

class plane {
	
	// --------------------------------------------
	constructor() {
		this.shaderName='plane';
		this.loaded=-1;
		this.shader=null;
		this.initAll();
	}
		
	// --------------------------------------------
	initAll() {
		var size=1.0;
		var vertices = [
			-size, -size, 0.0,
			 size, -size, 0.0,
			 size, size, 0.0,
			-size, size, 0.0
		];

		var texcoords = [
			0.0,0.0,
			0.0,1.0,
			1.0,1.0,
			1.0,0.0
		];

		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 4;

		this.tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		this.tBuffer.itemSize = 2;
		this.tBuffer.numItems = 4;

		loadShadersNEW(this);
	}
	
	
	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
		gl.enableVertexAttribArray(this.shader.tAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

		
	}


	// --------------------------------------------
	setMatrixUniforms() {
			mat4.identity(mvMatrix);
			mat4.translate(mvMatrix, distCENTER);
			mat4.multiply(mvMatrix, rotMatrix);
			gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
			gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);

	}

	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();
			this.setMatrixUniforms(this);
			
			gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
			gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
		}
	}
}


// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================



// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.7, 0.7, 0.7, 1.0);
		gl.clearDepth(1.0);

		gl.enable(gl.DEPTH_TEST);

		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.enable(gl.FOG);
		fogcolor=[1.0, 1.0, 1.0, 1.0];
		gl.fogi(gl.FOG_MODE, gl.EXP);
		gl.fogfv(gl.FOG_COLOR, fogcolor);
		gl.fogf(gl.FOG_DENSITY, 0.5);
		gl.hint(gl.FOG_HINT, gl.NICEST);
		gl.fogf(gl.FOG_START, 1.0);
		gl.fogf(gl.FOG_END, 5.0);
		gl.clearColor(fogcolor);

		gl.depthMask(gl.TRUE);
		gl.depthFunc(gl.LEQUAL);
		
		gl.depthRange(0.0, 1.0);
		 
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}


// =====================================================
loadObjFile = function(OBJ3D)
{
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var tmpMesh = new OBJ.Mesh(xhttp.responseText);
			OBJ.initMeshBuffers(gl,tmpMesh);
			OBJ3D.mesh=tmpMesh;
			var wire=[];
			var displayable= new Map;
			for (var i = 0; i<tmpMesh.indices.length; i+=3) {
				if (tmpMesh.indices[i]<tmpMesh.indices[i+1]) {
					insertUnpresent(wire, displayable, tmpMesh.indices[i], tmpMesh.indices[i+1]);
				}
				else{
					insertUnpresent(wire, displayable, tmpMesh.indices[i+1], tmpMesh.indices[i]);
				}
				
				if (tmpMesh.indices[i]<tmpMesh.indices[i+2]) {
					insertUnpresent(wire, displayable, tmpMesh.indices[i], tmpMesh.indices[i+2]);
				}
				else{
					insertUnpresent(wire, displayable, tmpMesh.indices[i+2], tmpMesh.indices[i]);
				}

				if (tmpMesh.indices[i+1]<tmpMesh.indices[i+2]) {
					insertUnpresent(wire, displayable, tmpMesh.indices[i+1], tmpMesh.indices[i+2]);
				}
				else{
					insertUnpresent(wire, displayable, tmpMesh.indices[i+2], tmpMesh.indices[i+1]);
				}
				
			}
			OBJ3D.mesh.wireIndex = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OBJ3D.mesh.wireIndex);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(wire), gl.STATIC_DRAW);
			OBJ3D.mesh.wireIndex.itemSize = 1;
			OBJ3D.mesh.wireIndex.numItems = wire.length;
		}
	}

	

	xhttp.open("GET", OBJ3D.objName, true);
	xhttp.send();
}

// =====================================================
function insertUnpresent(vertice, map, val1, val2) {
	var key= String(val1)+String(val2);
	if (!map.has(key)) {
		vertice.push(val1);
		vertice.push(val2);
		map.set(key);
	}

}

// =====================================================
function loadShadersNEW(shader) {
	loadShaderTextNEW(shader,'.vs');
	loadShaderTextNEW(shader,'.fs');
}


// =====================================================
function loadShaderTextNEW(shader,ext) {   // lecture asynchrone...
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { shader.vsTxt = xhttp.responseText; shader.loaded ++; }
			if(ext=='.fs') { shader.fsTxt = xhttp.responseText; shader.loaded ++; }
			if(shader.loaded==2) {
				shader.loaded ++;
				compileShaders(shader);
				shader.loaded ++;
				console.log("Shader '"+shader.shaderName + "' COMPILED !");
			}
		}
	}

	shader.loaded = 0;
	xhttp.open("GET", shader.shaderName+ext, true);
	xhttp.send();
}


// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(Obj3D.loaded==2) {
			Obj3D.loaded ++;
			compileShaders(Obj3D);
			Obj3D.loaded ++;
		}
	}
  }
  
  Obj3D.loaded = 0;
  xhttp.open("GET", Obj3D.shaderName+ext, true);
  xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.shaderName+".vs");
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
	}

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.shaderName+".fs");
		console.log(gl.getShaderInfoLog(Obj3D.fshader));
	}

	Obj3D.shader = gl.createProgram();
	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);
	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getShaderInfoLog(Obj3D.shader));
	}
}


// =====================================================
function webGLStart() {
	
	var canvas = document.getElementById("WebGL-test");

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	canvas.onwheel = handleMouseWheel;

	initGL(canvas);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	
	mat4.identity(rotMatrix);
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

	distCENTER = vec3.create([0,-0.2,-3]);
	
	PLANE = new plane();

	addObj('Drinou.obj');
	addObj('Skull.obj', [0.5, 0.0, 0.0]);	

	tick();
}

// =====================================================
function addObj(name, pos) {

	if (pos === undefined) {
		pos = [0.0, 0.0, 0.0];
	}

	//Creation de l'objet
	if (name === undefined){
		OBJS.push(new objmesh(document.getElementById("fileName").value ,pos, OBJS.length));
	}
	else{
		OBJS.push(new objmesh(name, pos, OBJS.length));
	}
	newObj = OBJS[OBJS.length-1];

	//creation de l'interface
	objInterface = document.createElement("div");
	objInterface.className = "IHM";

	//titre de l'interface
	objInterface.appendChild(newIhmTitle());

	//Section 1 Titre
	objInterface.appendChild(newTitle("Transparence"));

	// Section 1 Slider container
	section1Sliders = document.createElement("div");
	section1Sliders.className = "slidecontainer";

	// Section 1 Slider 1 input
	section1Sliders.appendChild(addSlider(newObj, "rangeObj"+newObj.num+"Alpha", "obj"+newObj.num+"Alpha", "Alpha", 0, 100, newObj.alpha));

	// Section 1 Slider 1 output
	section1Sliders.appendChild(addOutput("obj"+newObj.num+"Alpha"));
	
	//ajout de la section 1 à l'interface
	objInterface.appendChild(section1Sliders);
	
	//Section 2 Titre
	objInterface.appendChild(newTitle("Coordonnee"));

	// Section 2 Slider container
	section2Sliders = document.createElement("div");
	section2Sliders.className = "slidecontainer";

	// Section 2 Slider 1 input
	section2Slider1Title = newTitle("X :");
	section2Slider1Title.appendChild(addSlider(newObj, "rangeObj"+newObj.num+"X", "obj"+newObj.num+"X", "X", -100, 100, newObj.pos[0]));
	section2Sliders.appendChild(section2Slider1Title);

	// Section 2 Slider 1 output
	section2Sliders.appendChild(addOutput("obj"+newObj.num+"X"));

	// Section 2 Slider 2 input
	section2Slider2Title = newTitle("Y: ");
	section2Slider2Title.appendChild(addSlider(newObj, "rangeObj"+newObj.num+"Y", "obj"+newObj.num+"Y", "Y", -100, 100, newObj.pos[1]));
	section2Sliders.appendChild(section2Slider2Title);

	// Section 2 Slider 2 output
	section2Sliders.appendChild(addOutput("obj"+newObj.num+"Y"));

	objInterface.appendChild(section2Sliders);
	
	// Section 3 Titre
	objInterface.appendChild(newTitle("Reflectance"));

	// Section 3 the container
	section3 = document.createElement("div");

	// Section 3 colorChanger
	colorInput = document.createElement("input");
	colorInput.setAttribute("type", "color");
	colorInput.setAttribute("id", "colorObj"+newObj.num);
	colorInput.setAttribute("oninput", "OBJS["+newObj.num+"].colorChanger.ressetColors(this.value)");
	
	section3.appendChild(colorInput);

	objInterface.appendChild(section3);

	// Section 4 checkboxs
	boxDiv = document.createElement("div");
	boxDiv.appendChild(document.createElement("br"));
	boxContainer1 = newTitle("Faces: ")
	box1 = document.createElement("input");
	box1.setAttribute("type", "checkbox" );
	box1.setAttribute("checked", true);
	box1.setAttribute("onclick", "OBJS["+newObj.num+"].setFaceDisplay()");

	boxContainer1.appendChild(box1);
	boxDiv.appendChild(boxContainer1);

	boxContainer2 = newTitle("Fil de fer: ")
	box2 = document.createElement("input");
	box2.setAttribute("type", "checkbox" );
	box2.setAttribute("onclick", "OBJS["+newObj.num+"].setFaceDisplay()");

	boxContainer2.appendChild(box2);
	boxDiv.appendChild(boxContainer2);

	objInterface.appendChild(boxDiv);


	insertLocation=document.getElementById("interface");
	insertLocation.appendChild(objInterface);

	for(i=0; i<newObj.sliders.length; i++){
		newObj.sliders[i].reset();
	}
	
// 	<div>
// 		</br>
// 		<p>Faces: <input type="checkbox" checked onclick=OBJS[1].setFaceDisplay()></p>
//      <p>Fil de fer: <input type="checkbox" onclick=OBJS[1].setWireDisplay()></p>
// 	</div>
// </div>'
}

// =====================================================
function addSlider(obj, rangeIdd, varIdd, param, min, max, value) {
	obj.sliders.push(new IHMSlider (obj, rangeIdd, varIdd, param));
	newSlider = document.createElement("INPUT");
	newSlider.setAttribute("type", "range");
	newSlider.setAttribute("min", min);
	newSlider.setAttribute("max", max);
	newSlider.setAttribute("value", 100*value);
	newSlider.setAttribute("step","1");
	newSlider.setAttribute("class","slider");
	newSlider.setAttribute("id",rangeIdd);
	newSlider.setAttribute("oninput","OBJS["+obj.num+"].sliders["+(obj.sliders.length-1)+"].react(this.value)");
	return newSlider;
}

// =====================================================
function addOutput( varIdd){
	sliderNameOutput = document.createTextNode("Value: ");
	sliderTitleOutput = document.createElement("p");
	sliderTitleOutput.appendChild(sliderNameOutput);
	newSliderOutput = document.createElement("span");
	newSliderOutput.setAttribute("id", varIdd);
	sliderTitleOutput.appendChild(newSliderOutput);
	return sliderTitleOutput;
}

// =====================================================
function newIhmTitle() {
	interFaceTitle = document.createElement("p");
	objFrontName = document.createTextNode("objet "+String(OBJS.length));
	interFaceTitle.appendChild(objFrontName);
	
	return interFaceTitle;
}

// =====================================================
function newTitle(titre) {
title = document.createElement("p");
sectionName = document.createTextNode(titre);
title.appendChild(sectionName);
return title
}

// =====================================================
function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	PLANE.draw();
	for( i=0; i<OBJS.length; i++){
		OBJS[i].draw();
	}
}

