#version 120
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform sampler2DRect srcTex;
uniform float time;
uniform vec2 resolution;
uniform float displacement;
uniform float volume;

varying vec2 uv;

float brightness(vec4 c) {
	return (c.r + c.g + c.b) / 3.0;
}

void main(){

	vec3 normal = gl_Normal;
	uv = (gl_TextureMatrix[0] * gl_MultiTexCoord0).xy;

	// vec4 c = texture2DRect(srcTex, coord);

	vec4 pos =  gl_Vertex;
	// pos.xyz += normal * brightness(c) * 10.0;

	float disp = displacement * volume * 10.0;

	pos.xyz += normal * snoise3(pos.xyz / 20.0 + time * 0.5) * disp;

	gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * pos;
}
