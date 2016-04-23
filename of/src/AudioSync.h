//
//  AubioInterface.hpp
//  SmudgeVJ
//
//  Created by 麦 on 4/20/16.
//
//

#pragma once

#include "ofMain.h"
#include "ofxAubio.h"

#include <math.h>

#define SOUND_DEVICE_ID 0

class AudioSync : ofBaseApp {
	
public:
	
	void init();
	void beatEvent(float &time);
	void onsetEvent(float &time);
	void audioIn(float *input, int bufferSize, int nChannels);
	void refresh();
	
	//--------------------------------------------------------------
	
	// audio analyse
	ofSoundStream soundStream;
	
	float volume;
	ofxAubioBeat beat;
	ofxAubioOnset onset;
	
	bool gotBeat = false;
	bool gotOnset = false;
	
};