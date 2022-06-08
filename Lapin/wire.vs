attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 uObjPos;
varying vec4 pos3D;
varying vec3 vColor;

void main(void) {
    pos3D = uMVMatrix * vec4(aVertexPosition+uObjPos,1.0);
    vColor = vec3(1.0);
	gl_Position = uPMatrix * pos3D;
}

