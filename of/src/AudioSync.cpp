//
//  AudioSync.cpp
//  SmudgeVJ
//
//  Created by 麦 on 4/20/16.
//
//

#include "AudioSync.h"


void AudioSync::init() {
	// aubio
	int bufferSize = 256;
	
	beat.setup();
	ofAddListener(beat.gotBeat, this, &AudioSync::beatEvent);
	
	onset.setup();
	ofAddListener(onset.gotOnset, this, &AudioSync::onsetEvent);
	
//	soundStream.printDeviceList();
	soundStream.setDeviceID(SOUND_DEVICE_ID);
	
	soundStream.setup(this, 0, 2, 44100, bufferSize, 4);
}

//--------------------------------------------------------------
void AudioSync::beatEvent(float &time) {
	gotBeat = true;
}

//--------------------------------------------------------------
void AudioSync::onsetEvent(float &time) {
	gotOnset = true;
}

//--------------------------------------------------------------
void AudioSync::audioIn(float *input, int bufferSize, int nChannels) {
	beat.audioIn(input, bufferSize, nChannels);
	onset.audioIn(input, bufferSize, nChannels);
	
	float v = 0.0;
//	volume = 0.0;
	
	for (int i = 0; i < bufferSize; i++) {
		v += input[i] * input[i];
	}
	
	v /= bufferSize;
	
	if (volume <= v) {
		volume = v;
	} else {
		volume *= 0.96;
	}
}

//--------------------------------------------------------------
void AudioSync::refresh() {
	gotBeat = false;
	gotOnset = false;
}
