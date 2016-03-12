#version 110

uniform vec2 resolution;
uniform vec2 coatResolution;
uniform float opacity;

// flow attribute
uniform float speed;
uniform float offset;
uniform int flowType;

#pragma glslify: flow = require(./flow.glsl, flowType=flowType, speed=speed, offset=offset);

uniform sampler2DRect prevTex;
uniform sampler2DRect coatTex;

// uv is normalized coord: [0, 1] [0, 1]
// pos is normalized while retains aspected uv: [0, 1] [0, f]
// coord is pixel coord: [0, width] [0, height]

varying vec2 uv;
varying vec2 pos;

void main() {
	
	vec2 prevCoord = uv * resolution;
	vec2 coatCoord = uv * coatResolution;
	
	// get original color
	vec4 prev = texture2DRect(prevTex, prevCoord);
	vec4 coat = texture2DRect(coatTex, coatCoord);
	
	// get flow
	prevCoord += flow(prev, coat, pos) * vec2(resolution.x, resolution.x);
	prev = texture2DRect(prevTex, prevCoord);

	vec3 color = mix(prev.rgb, coat.rgb, opacity);

  gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}