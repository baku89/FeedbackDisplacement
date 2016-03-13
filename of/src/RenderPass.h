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
        shader.linkProgram();
    }
    
    void setSize(int w, int h) {
        dst.allocate(w, h);
    }
    
    void reload() {
        ofLog(OF_LOG_NOTICE, "upate shader");
        shader.load("brush-pass.vert", "brush-pass.frag");
    };
    
    void update() {
        dst.begin();
        shader.begin();
        shader.setUniform1f("brightness", brightness);
        shader.setUniform1f("saturation", saturation);
        
        src->draw(0, 0);
    
        shader.end();
        dst.end();
    }
    
    void draw() {
        dst.draw(0, 0);
    }
    
    
    
    ofFbo dst;
    ofTexture *src;
    ofShader shader;
    float saturation = 0.0;
    float brightness = 0.0;
};