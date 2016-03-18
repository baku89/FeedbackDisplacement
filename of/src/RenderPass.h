//
//  RenderPass.h
//  of
//
//  Created by Baku Hashimoto on 3/13/16.
//
//

#pragma once

#include "ofMain.h"

class RenderPass {
public:
    
    void allocate(int w, int h) {
        setSize(w, h);
        shader.setupShaderFromFile(GL_FRAGMENT_SHADER, "render-pass.frag");
        shader.setupShaderFromFile(GL_VERTEX_SHADER, "brush-pass.vert");
        shader.linkProgram();
    }
    
    void setSize(int w, int h) {
        width = w;
        height = h;
        dst.allocate(w, h, GL_RGB);
    }
    
    void reload() {
        ofLog(OF_LOG_NOTICE, "upate shader");
        shader.load("brush-pass.vert", "brush-pass.frag");
    };
    
    void begin() {
        shader.begin();
        shader.setUniform2f("resolution", width, height);
        shader.setUniform2f("texResolution", 1280, 720);
		
        shader.setUniform1f("brightness", brightness);
		shader.setUniform1f("saturation", saturation);
		shader.setUniform1f("displaceIntensity", displaceIntensity);
		shader.setUniform3f("fillColor", fillColor.r, fillColor.g, fillColor.b);
		
        shader.setUniformTexture("maskTex", *mask, 1);
    }
    
    void end() {
        shader.end();
    }
    
    void update() {
        dst.begin();
        begin();
        src->draw(0, 0);
        end();
        dst.end();
    }
    
    void draw() {
        dst.draw(0, 0);
    }
    
    ofFbo dst;
    ofTexture *src;
    ofTexture *mask;
    ofShader shader;
    int width, height;
    float saturation = 0.0;
    float brightness = 0.0;
    float displaceIntensity = 0.0;
	ofFloatColor fillColor = ofFloatColor(0.0, 0.0, 0.0);
};