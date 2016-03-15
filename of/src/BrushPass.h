//
//  BrushPass.hpp
//  of
//
//  Created by Baku Hashimoto on 3/12/16.
//
//

#pragma once

#include "ofMain.h"
#include "ofxSwapBuffer.h"

#include <math.h>

#define STRINGIFY(A) #A

#define MIN_FLOW 0.3
#define SPEED_AMP 0.05


class BrushPass {
public:
    
    void allocate(int w, int h) {
        setSize(w, h);
        shader.load("brush-pass.vert", "brush-pass.frag");
    };
    
    void setSize(int w, int h) {
        width = w;
        height = h;
        pingPong.allocate(width, height, GL_RGB);
    };
    
    void update() {
        pingPong.dst->begin();
        
        shader.begin();
        
        shader.setUniform2f("resolution", width, height);
        shader.setUniform2f("texResolution", 1280, 720);
        shader.setUniform1f("maskOpacity", maskOpacity);
        shader.setUniform1f("opacity", opacity);
        shader.setUniform1f("speed", speed);
        shader.setUniform1f("offset", offset);
        shader.setUniform1f("fade", fade);
		shader.setUniform1i("flowType", flowType);
        shader.setUniformTexture("prevTex", pingPong.src->getTexture(), 0);
        shader.setUniformTexture("coatTex", *coat, 1);
        shader.setUniformTexture("maskTex", *mask, 2);
        
        ofDrawRectangle(0, 0, width, height);
        
        shader.end();
        pingPong.dst->end();
        
        pingPong.swap();
    };
	
	void reload() {
        ofLog(OF_LOG_NOTICE, "upate shader");
        shader.load("brush-pass.vert", "brush-pass.frag");
	};
    
    ofTexture& getTexture() {
        return pingPong.dst->getTexture();
    };
    
    void draw() {
        pingPong.dst->draw(0, 0);
    }
    
    ofShader shader;
    ofxSwapBuffer pingPong;
    int width, height;
    
    // uniforms
    float opacity = 0.0;
    float offset = 0.0;
	int flowType = 0;
	float speed = 0.0;
    float fade = 1.0;
    float maskOpacity = 0.0;
	
    ofTexture *coat, *mask;
    
    
};


