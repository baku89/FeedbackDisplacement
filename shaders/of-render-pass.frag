#version 120
#pragma glslify: ajustSaturation = require(./ajust-saturation.glsl);


uniform sampler2DRect tex0;
uniform sampler2DRect maskTex;

uniform vec2 resolution;
uniform vec2 texResolution;

uniform float displaceIntensity;
uniform float brightness;
uniform float saturation;

// uv is normalized coord: [0, 1] [0, 1]
// pos is normalized while retains aspected uv: [0, 1] [0, f]
// coord is pixel coord: [0, width] [0, height]

varying vec2 uv;
varying vec2 pos;

void main() {
	vec2 srcCoord  = uv * resolution;
	vec2 maskCoord = uv * texResolution;

	vec2 originalColor = texture2DRect(tex0, srcCoord).xy;

	// vec2 mask = texture2DRect(maskTex, maskCoord).xy;
	// vec2 offsetCoord = originalColor * displaceIntensity * resolution;
	

	vec3 color = texture2DRect(tex0, srcCoord).rgb;
  color = ajustSaturation(color, saturation + 1.0);

  color += vec3(displaceIntensity, displaceIntensity, displaceIntensity);
  // color = min(color, vec3(0.9, 1.0, 1.0));

	gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}