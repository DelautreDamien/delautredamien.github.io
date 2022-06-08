
precision mediump float;

varying vec4 pos3D;
varying vec3 N;
uniform float uAlpha ;
vec3 LumPow= vec3(10.0);
vec3 LumPos= vec3(0.0,0.0,0.0);
float PI=3.141592653589793;
uniform float Ks ;
uniform float n ;
varying vec3 Kd ;

// ==============================================
float minODot (vec3 a, vec3 b)
{
	return (max(dot(a,b),0.0));
}

// ==============================================
void main(void)
{	
	vec3 Vo = normalize(- vec3(pos3D));
	vec3 Vi = normalize(LumPos - vec3(pos3D));

	vec3 ViPrime = reflect(-Vi,N);
	float cosAn = pow( minODot(ViPrime,Vo), n);
	vec3 phong=((1.0-Ks)*Kd)/PI + ((n+2.0)/(2.0*PI))*Ks*cosAn;
	float cosTi = minODot(N,Vi);
	vec3 col = LumPow * phong * cosTi;
	
	gl_FragColor = vec4(col,uAlpha);
}




