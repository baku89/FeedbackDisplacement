#version 120
#define GLSLIFY 1
vec3 ajustSaturation(vec3 rgb, float adjustment)
{
    // Algorithm from Chapter 16 of OpenGL Shading Language
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

uniform sampler2DRect tex0;

uniform vec2 resolution;
uniform vec2 texResolution;

uniform float brightness;
uniform float saturation;

varying vec2 uv;
varying vec2 coord;

void main() {

	vec3 c = texture2DRect(tex0, coord).rgb;

	// saturation
  c = ajustSaturation(c, saturation + 1.0);

	gl_FragColor = vec4(c, 1.0);
}