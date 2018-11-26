#!/bin/bash

param=$(< deploy-param.txt)
scp zwanzigeins-app.html $param/index.html
scp -r css $param
scp -r js $param
scp -r img $param
