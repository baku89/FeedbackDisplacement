precision highp float;
precision highp int;

uniform sampler2D prevPass;

varying vec2 uv;

void main() {
	vec4 c = texture2D(prevPass, uv);
	gl_FragColor = vec4(c);

}
