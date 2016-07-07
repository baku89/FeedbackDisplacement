precision highp float;
precision highp int;

uniform sampler2D prevTexture;
uniform sampler2D initialTexture;

uniform float frequency;
uniform float speed;
uniform float seed;

varying vec2 uv;

// #pragma glslify: snoise3 = require(glsl-noise/simplex/3d)


// vec2 simple(vec4 i, vec4 c) {
// 	return vec2(0.001, 0.001) * c.r;
// }

vec2 displace(vec4 i, vec4 c) { return vec2(0.0); }

void main() {

	vec4 i = texture2D(initialTexture, uv);
	vec4 c = texture2D(prevTexture, uv);

	vec2 offset = displace(i, c);

	vec4 color = texture2D(prevTexture, uv + offset * speed);

	gl_FragColor = color;
}
