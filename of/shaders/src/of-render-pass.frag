#version 120
#pragma glslify: ajustSaturation = require(./ajust-saturation.glsl);

uniform sampler2DRect tex0;

uniform vec2 resolution;
uniform vec2 texResolution;

uniform float brightness;
uniform float saturation;

varying vec2 uv;
varying vec2 coord;

void main() {

	vec3 c = texture2DRect(tex0, coord).rgb;

	// saturation
  c = ajustSaturation(c, saturation + 1.0);

	gl_FragColor = vec4(c, 1.0);
}