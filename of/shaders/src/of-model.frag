#version 120

uniform sampler2DRect srcTex;
uniform vec2 resolution;

varying vec2 uv;

void main() {

	// vec2 ruv = uv * 2.0;


	// if ( ruv.x >= 1.0 ) {
	// 	ruv.x = 1.0 - ruv.x;
	// }

	// if ( ruv.y >= 1.0 ) {
	// 	ruv.y = 1.0 - ruv.y;
	// }

	vec4 c = texture2DRect(srcTex, fract(uv * 4.0) * resolution);

	// vec4 c = vec4(ruv.x, ruv.y, 0.0, 1.0);

	gl_FragColor = c;
	// gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}