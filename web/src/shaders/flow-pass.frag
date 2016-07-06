precision highp float;
precision highp int;

uniform sampler2D prevTexture;

varying vec2 pos;

void main() {

	// vec4 color = texture2D(prevTexture, pos);
	gl_FragColor = vec4(pos.x, pos.y, 0.0, 1.0);
}
