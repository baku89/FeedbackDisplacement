#version 120
#define GLSLIFY 1
vec3 ajustSaturation(vec3 rgb, float adjustment)
{
    // Algorithm from Chapter 16 of OpenGL Shading Language
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

vec3 blendDifference(vec3 base, vec3 blend) {
	return abs(base-blend);
}

vec3 blendDifference(vec3 base, vec3 blend, float opacity) {
	return (blendDifference(base, blend) * opacity + blend * (1.0 - opacity));
}

uniform sampler2DRect tex0;
uniform sampler2DRect maskTex;

uniform vec2 resolution;
uniform vec2 texResolution;

uniform vec3 fillColor;

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

	// add fill color
	color = blendDifference(color, fillColor);

	// saturation
  color = ajustSaturation(color, saturation + 1.0);

  // color += vec3(displaceIntensity, displaceIntensity, displaceIntensity);
  // color = min(color, vec3(0.9, 1.0, 1.0));

	gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}