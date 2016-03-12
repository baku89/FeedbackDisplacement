#version 110

uniform vec2 resolution;
uniform vec2 coatResolution;
uniform float opacity;
uniform float speed;
uniform float offset;

uniform sampler2DRect prevTex;
uniform sampler2DRect coatTex;

varying vec2 pos;

void main() {
	// vec3 prev = texture2DRect(prevTex, (pos + vec2(0.002, 0.0)) * resolution).rgb;
	// vec3 coat = texture2DRect(coatTex, pos * coatResolution).rgb;

	// vec3 color = mix(prev, coat, opacity);

	vec3 color = texture2D(coatTex, pos).rgb;

  gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}