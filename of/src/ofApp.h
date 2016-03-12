#pragma once

#include "ofMain.h"
#include "BrushPass.h"

#include "ofxOSC.h"
#include "ofxSyphon.h"
#include "ofxDatGui.h"

#define PORT 1234
#define SYPHON_SERVER "Coat"
#define SYPHON_APP "VDMX5"

class ofApp : public ofBaseApp{

public:
    void setup();
	void setupGui();
    void update();
    void draw();
	void drawGui(ofEventArgs & args);

    void keyPressed(int key);
    void keyReleased(int key);
    void mouseMoved(int x, int y );
    void mouseDragged(int x, int y, int button);
    void mousePressed(int x, int y, int button);
    void mouseReleased(int x, int y, int button);
    void mouseEntered(int x, int y);
    void mouseExited(int x, int y);
    void windowResized(int w, int h);
    void dragEvent(ofDragInfo dragInfo);
    void gotMessage(ofMessage msg);
    
    int width, height;
    
    BrushPass brushPass;
    
    ofxOscReceiver receiver;
    ofxSyphonClient syphon;
	
	ofxDatGui* gui;

    
};
