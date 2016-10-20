precision highp float;
precision highp int;

uniform sampler2D prevTexture;
uniform sampler2D initialTexture;

uniform float frequency;
uniform float speed;
uniform float seed;
uniform float angle;
uniform float aspect; // height / width

varying vec2 uv;

vec2 displace(vec4 i, vec4 c) { return vec2(0.0); }

void main() {

	vec2 pos = uv * vec2(1.0, aspect);

	vec4 i = texture2D(initialTexture, uv);
	vec4 c = texture2D(prevTexture, uv);

	vec2 offset = displace(i, c, uv, pos);
	vec4 color = texture2D(prevTexture, uv + offset * speed);

	gl_FragColor = color;
}
