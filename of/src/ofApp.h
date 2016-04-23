#pragma once

#include "ofMain.h"

#include "ofxOSC.h"
#include "ofxSyphon.h"
#include "ofxDatGui.h"
#include "ofxXmlSettings.h"

#include "Config.h"
#include "BrushPass.h"
//#include "RenderPass.h"
#include "ModelPass.h"

#include "DispPass.h"
#include "AudioSync.h"

class ofApp : public ofBaseApp{

public:
    void setup();
	void setupGui();
    void update();
    void draw();
	void exit();
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
	
    //---------------------------------------------
    stringstream ss;
	
	// for render
	
	int opacityCount = 4;
	bool opacityReset = false;
	
	// audio-sync
	AudioSync audio;
	float volume = 0;
	float onsetVolume = 0;
	float beatVolume = 0;
	
	// param
	bool enableModel = false;
	bool enableOpacity = false;
	
	// render pass
    BrushPass brushPass;
//    RenderPass renderPass;
	DispPass dispPass;
	ModelPass modelPass;
	
	// interface with other application
    ofxOscReceiver receiver;
    ofxSyphonClient coatTex;
//    ofxSyphonClient maskTex;
	
	// gui
	ofxDatGui* gui;
	
	ofImage img;
	

    
};
