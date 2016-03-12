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

class BrushPass {
public:
    
    void allocate(int w, int h) {
        setSize(w, h);
        shader.load("brush-pass.vert", "brush-pass.frag");
        
        glEnable(GL_TEXTURE_2D);
    };
    
    void setSize(int w, int h) {
        width = w;
        height = h;
        pingPong.allocate(width, height, GL_RGB);
    }
    
    void update() {
        pingPong.dst->begin();
        
        shader.begin();
        
        shader.setUniform2f("resolution", width, height);
        shader.setUniform2f("coatResolution", coat->getWidth(), coat->getHeight());
        shader.setUniform1f("opacity", opacity);
        shader.setUniform1f("speed", speed);
        shader.setUniform1f("offset", offset);
        shader.setUniformTexture("prevTex", pingPong.src->getTexture(), 0);
        shader.setUniformTexture("coatTex", *coat, 1);
        
        
        ofDrawRectangle(0, 0, width, height);
        shader.end();
        pingPong.dst->end();
        
        pingPong.swap();
    };
    
    void draw() {
        pingPong.dst->draw(0, 0);
    };
    
    ofShader shader;
    ofxSwapBuffer pingPong;
    int width, height;
    
    // uniforms
    float opacity = 0.0;
    float speed = 1.0;
    float offset = 0.0;
    
    ofTexture *coat;
    bool isCoatAllocated = false;
    void setCoat(ofTexture &_coat) {
        coat = &_coat;
    }
    
    
};


