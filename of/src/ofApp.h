#pragma once

#include "ofMain.h"

#include "ofxOSC.h"
#include "ofxSyphon.h"
#include "ofxDatGui.h"
#include "ofxXmlSettings.h"
#include "ofxAubio.h"


#include "BrushPass.h"
#include "RenderPass.h"

#define PORT 1234
#define SYPHON_COAT "Coat"
#define SYPHON_MASK "Mask"
#define SYPHON_APP "VDMX5"

#define SOUND_DEVICE_ID 6
#define SOUND_DEVIDE_NAME "Soundflower (2ch)"

//#define MASK_NOTHING    0
//#define MASK_COAT       1
//#define MASK_DISPLACE   2
//
//static const vector<string> MASK_NAME = {
//    "mask nothing",
//    "mask coat",
//    "mask displace"
//};

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
    
    void audioIn(float * input, int bufferSize, int nChannels);
    
    void beatEvent(float & time);
    void onsetEvent(float & time);
    
    
    //---------------------------------------------
    stringstream ss;
    
    
    int width, height;
    
    BrushPass brushPass;
    RenderPass renderPass;
    
    ofxOscReceiver receiver;
    ofxSyphonClient coatTex;
    ofxSyphonClient maskTex;
	
	ofxDatGui* gui;
    ofxDatGui2dPad* guiPickPos;
    ofxDatGuiToggle* guiEnableDisplace;
    
    // toggle
    bool enableDisplace = false;
    
    // audio analyse
    ofSoundStream soundStream;
    
    ofxAubioBeat beat;
    ofxAubioOnset onset;
    
    bool gotBeat = false;
    bool gotOnset = false;
    
    float volume = 0;
    float onsetVolume = 0;
    float beatVolume = 0;
    
    ofPoint pickPos;

    
};
