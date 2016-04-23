#version 120
#define GLSLIFY 1
#define GLSLIFY 1

uniform sampler2DRect colorTex;
uniform sampler2DRect depthTex;

uniform vec2 resolution;
uniform float bgIntensity;

varying vec2 uv;
varying vec2 coord;

const vec4 BLACK = vec4(0.0, 0.0, 0.0, 1.0);

//---------------------------------------------

void main() {

	vec4 c = texture2DRect(colorTex, coord);
	float d = texture2DRect(depthTex, coord).r;

	vec4 originalBg = texture2DRect(colorTex, vec2(0.0));
	originalBg += vec4(0.6, 0.6, 0.6, 0.0);
	vec4 bg = mix(BLACK, originalBg, bgIntensity);
					 
	d = smoothstep(0.85, 1.0, d);
	c = mix(c, bg, d);

	gl_FragColor = c;
}