#!/bin/zsh

open .

open ./vdmx/vdmx-proj.vdmx5
open /Applications/CamTwist/CamTwist.app

subl .

export NODE_ENV='dev'
gulp
