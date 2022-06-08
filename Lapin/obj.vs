attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;


uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 uObjPos;
varying vec3 Kd;
varying vec4 pos3D;
varying vec3 N;
uniform float r;
uniform float g;
uniform float b;

void main(void) {
	pos3D = uMVMatrix * vec4(aVertexPosition+uObjPos,1.0);
	N = vec3(uRMatrix * vec4(aVertexNormal,1.0));
	Kd = vec3(r,g,b);
	gl_Position = uPMatrix * pos3D;
}
