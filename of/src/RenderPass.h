//
//  RenderPass.h
//  of
//
//  Created by Baku Hashimoto on 3/13/16.
//
//

#pragma once

#include "ofMain.h"

#include "Config.h"

class RenderPass {
public:
    
    void allocate(int w, int h) {
		setSize(w, h);
		reload();
    }
    
    void setSize(int w, int h) {
        width = w;
        height = h;
        dst.allocate(w, h, GL_RGB);
    }
    
    void reload() {
		ofLog(OF_LOG_NOTICE, "update RenderPass shader");
        shader.load("shaders/passthru.vert", "shaders/render-pass.frag");
    };
    
    void begin() {
        shader.begin();
        shader.setUniform2f("resolution", width, height);
        shader.setUniform2f("texResolution", CANVAS_WIDTH, CANVAS_HEIGHT);
		
        shader.setUniform1f("brightness", brightness);
		shader.setUniform1f("saturation", saturation);
    }
    
    void end() {
        shader.end();
    }
	
	void bind() {
		dst.bind();
	}
	
	void unbind() {
		dst.unbind();
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
	
	ofTexture *src;
    ofFbo dst;
    ofShader shader;
    int width, height;
    float saturation = 0.0;
    float brightness = 0.0;
};