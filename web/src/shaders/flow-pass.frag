precision highp float;
precision highp int;

uniform sampler2D prevTexture;

varying vec2 uv;

void main() {

	// vec4 color = texture2D(prevTexture, uv);
	gl_FragColor = vec4(uv.x, uv.y, 0.0, 1.0);
}
