#include "ofMain.h"
#include "ofApp.h"

#include "Config.h"

//========================================================================
int main( ){
    
    
    ofGLFWWindowSettings settings;
	
    settings.setGLVersion(1,0);
	settings.width = SCREEN_WIDTH;
	settings.height = SCREEN_HEIGHT;
	settings.setPosition(ofVec2f(DISPLAY_WIDTH - SCREEN_WIDTH, 0));
	settings.resizable = true;
	shared_ptr<ofAppBaseWindow> mainWindow = ofCreateWindow(settings);
	
	settings.width = GUI_WIDTH;
	settings.height = SCREEN_HEIGHT;
	settings.setPosition(ofVec2f(DISPLAY_WIDTH - GUI_WIDTH, SCREEN_HEIGHT + 80));
	settings.resizable = true;
	// uncomment next line to share main's OpenGL resources with gui
	//settings.shareContextWith = mainWindow;
	shared_ptr<ofAppBaseWindow> guiWindow = ofCreateWindow(settings);
	guiWindow->setVerticalSync(false);
	
	shared_ptr<ofApp> mainApp(new ofApp);
	mainApp->setupGui();
	ofAddListener(guiWindow->events().draw,mainApp.get(),&ofApp::drawGui);
	
	ofRunApp(mainWindow, mainApp);
	ofRunMainLoop();
	
}
