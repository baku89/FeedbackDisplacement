precision mediump float;

uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 pos;

void main() {

	gl_FragColor = texture2D(texture, pos);

}
