#version 120

uniform vec2 resolution;
uniform vec2 texResolution;
// uniform float maskOpacity;
uniform float opacity;

// flow attribute

uniform float speed;
uniform float offset;
uniform float fade;
uniform int flowType;

#pragma glslify: flow = require(./flow.glsl, flowType=flowType, speed=speed, offset=offset);

uniform sampler2DRect prevTex;
uniform sampler2DRect coatTex;
// uniform sampler2DRect maskTex;

varying vec2 uv;
varying vec2 coord;

float brightness (vec4 c) {
	return (c.r + c.g + c.b) / 3.0;
}

void main() {
	
	// get original color
	vec4 prev = texture2DRect(prevTex, coord);
	vec4 coat = texture2DRect(coatTex, coord);
	// float mask = texture2DRect(maskTex, coord).r;
	
	// get flow and offset point of prev
	vec2 duv = uv;
	duv += flow(prev, coat, uv);
	duv = mod(duv, resolution);

	vec2 dcoord = duv * resolution;

	prev = texture2DRect(prevTex, dcoord) * vec4(fade, fade, fade, 1.0);

	// mix
	vec3 c = prev.rgb;

	if (1.0 - opacity < brightness(coat)) {
		c = coat.rgb;
	}

	// c = mix(c, coat.rgb, mask * maskOpacity);

  gl_FragColor = vec4(c.r, c.g, c.b, 1.0);
}