#!/bin/bash

param=$(< deploy-param.txt)
scp zwanzigeins-app.html $param/index.html
scp zwanzigeins-app.css $param
scp src/zwanzigeins-app.js $param/src/
scp -r img $param
