attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uPosMatrix;
varying vec4 pos3D;
varying vec3 vColor;

void main(void) {
    pos3D = uPosMatrix * vec4(aVertexPosition,1.0);
	pos3D = uMVMatrix * pos3D;
    vColor = vec3(1.0);
	gl_Position = uPMatrix * pos3D;
}

