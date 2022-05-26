
precision mediump float;

varying vec2 tCoords;

uniform sampler2D uSampler;
uniform float alpha;
uniform float threshold;

void main(void) {

	vec4 col;
	col[0]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r;
	col[0]=col[0]*(-1.0);
	col[0]=col[0]+1.0;
	col[1]=col[0];
	col[2]=col[1];
	if(col[0] < threshold) {
		col[3]=texture2D(uSampler, vec2(tCoords.s, tCoords.t)).r*alpha;
	}else{
		col[3]=0.0;
	}
	
	gl_FragColor = col;
	
}

