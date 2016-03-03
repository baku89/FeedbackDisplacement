precision mediump float;

uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 pos;

void main() {

	// gl_FragColor = vec4(pos.x, pos.y, 0.0, 1.0);

	gl_FragColor = texture2D(texture, pos);

}
