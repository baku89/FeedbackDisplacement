uniform sampler2D prevTexture;

varying vec2 pos;

void main() {

	vec4 color = texture2D(prevTexture, pos);
	gl_FragColor = color + vec4(0.01, 0.01, 0.01, 0.0);
}
