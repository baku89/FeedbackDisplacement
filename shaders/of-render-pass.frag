#version 120

uniform sampler2DRect tex0;
uniform float brightness;
uniform float saturation;

vec3 ajustSaturation(vec3 rgb, float adjustment)
{
    // Algorithm from Chapter 16 of OpenGL Shading Language
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

void main() {
	vec2 pos = gl_TexCoord[0].st;

	vec3 color = texture2DRect(tex0, pos).rgb;

  color = ajustSaturation(color, saturation + 1.0);

	gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}