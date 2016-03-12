#include "ofMain.h"
#include "ofApp.h"

//========================================================================
int main( ){
//	ofSetupOpenGL(1024,768,OF_WINDOW);			// <-------- setup the GL context

	// this kicks off the running of my app
	// can be OF_WINDOW or OF_FULLSCREEN
	// pass in width and height too:
//	ofRunApp(new ofApp());
    
//    ofSetLogLevel(OF_LOG_VERBOSE);
    int windowWidth = 1024;
    int windowHeight = 500;
    
    
    ofGLWindowSettings settings;
    settings.setGLVersion(1,0);
    ofCreateWindow(settings);
    ofRunApp(new ofApp());
    
}
