precision mediump float;

uniform sampler2D texture;

varying vec2 pos;

void main() {

	// vec4 color = texture2D(texture, pos);
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

}
