#version 120
#pragma glslify: ajustSaturation = require(./ajust-saturation.glsl);
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

uniform sampler2DRect srcTex;

uniform vec2 resolution;
uniform float time;
uniform float amp;
uniform float saturation;
uniform float brightness;

varying vec2 uv;
varying vec2 coord;

void main() {

	vec2 duv = uv;

	duv.x += snoise2((uv + vec2(time)) * 2.0) * 0.5 * amp;

	vec2 dcoord = duv * resolution;

	vec4 c = texture2DRect(srcTex, dcoord);

	// saturation
	c.rgb = ajustSaturation(c.rgb, saturation + 1.0);

	c.rgb = pow(c.rgb, vec3(mix(1.0, 0.5, brightness)));

	gl_FragColor = c;
}