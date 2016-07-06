precision highp float;
precision highp int;

uniform sampler2D prevPass;

varying vec2 pos;

void main() {
	vec4 c = texture2D(prevPass, pos);
	gl_FragColor = vec4(c);

}
