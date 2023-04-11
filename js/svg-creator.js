import Utils from './utils.js';

export default class SvgCreator {

    constructor(gameScores) { 
		
		this.gameScores = gameScores;
		
        this.xStepWidth = 20;
        
        this.chartWidth = gameScores.length * this.xStepWidth;
        
        if(this.chartWidth < 400){
			this.chartWidth = 400;
		}
		
		this.chartHeight = 400;
        
        this.yStepsCount = 10;               
        this.yStepHeight = this.chartHeight / this.yStepsCount;  
        
        this.chartMarginTop = 10;
        this.chartMarginBottom = 150;
        this.chartMarginLeft = 25;
        
        this.svgHeight = this.chartHeight + this.chartMarginTop + this.chartMarginBottom;
        
        this.svgWidth = this.chartMarginLeft + this.chartWidth;
        
        this.lineColor = 'green';
    }

    createStatisticsSvg() {
		
		let minMax = this.findMinMaxElapsedTimes();
		let minSeconds = minMax.minSeconds;
		let maxSeconds = minMax.maxSeconds;

        let svg = "";

        svg += this.getSvgDiagramHeader();
        svg += this.getSvgDiagramStyleDeclaration();        
        svg += this.createSvgDiagramScala(minSeconds, maxSeconds);
        svg += this.createSvgDataPoints(this.gameScores, minSeconds, maxSeconds);
        svg += "</svg>";

        return svg;
    }

    getSvgDiagramHeader() {

        let svgDiagramHeader = 
        	"<svg xmlns='http://www.w3.org/2000/svg' " +
            "width='" + this.svgWidth + "' " +
            "height='" + this.svgHeight + "' " +
            "viewbox='0 0 " + this.svgWidth + " " + this.svgHeight + "'>";

        return  svgDiagramHeader;
    }

    getSvgDiagramStyleDeclaration() {
		
		let style =`
           	<style>
                .steps {
                	font: bold 10px sans-serif;
                }
                .timeStamp {
                	font: bold 10px sans-serif;
                }
                text {
					white-space: pre;
				}
            </style>`;
       
        return style;     
    }
    
    findMinMaxElapsedTimes() {
		
		let firstGameScore = this.gameScores[0];
		
		let seconds = Utils.parseTimeToSeconds(firstGameScore.elapsedTime);
		
		let minSeconds = seconds; 
		let maxSeconds = seconds;
		
		for(let i = 1; i < this.gameScores.length; i++) {
			
			let gameScore = this.gameScores[i];
			let elapsedSeconds = Utils.parseTimeToSeconds(gameScore.elapsedTime);
			if(elapsedSeconds < minSeconds){
				minSeconds = elapsedSeconds;
			}
			else if(elapsedSeconds > maxSeconds){
				maxSeconds = elapsedSeconds;
			}
		}
		
		return {minSeconds, maxSeconds};		
	}

    createSvgDiagramScala(minSeconds, maxSeconds) {

        let diagramScala =
            "<path class='chartAxis' " + 
	            "d='M" + this.chartMarginLeft + " " + this.chartMarginTop + " " +
	            "l0 " + this.chartHeight + " " +
	            "l" + this.chartWidth + " 0' " +
	            "stroke='black' stroke-linecap='square' stroke-width='1px' fill='none'/>";
            
        let variance = maxSeconds - minSeconds;
        let varianceStep = variance / this.yStepsCount;
        
        let i = 0;
		                
        for(; i < this.yStepsCount; i++) {
			
			let curY = this.chartMarginTop + (i * this.yStepHeight);

			let yStepLabel = maxSeconds - (i * varianceStep);
			yStepLabel = Math.round(yStepLabel * 10) / 10;

            diagramScala += 
                "<path d='M" + (this.chartMarginLeft + 2) + " " + curY + " " +
                	"l" + this.chartWidth + " " + 0 + "' stroke='grey' stroke-width='0.5px' stroke-dasharray='5,5' fill='none'/>" +
                "<text class='steps' text-anchor='end' alignment-baseline='central' x='" + (this.chartMarginLeft - 5) + "' " + 
                	"y='" + curY + "'>" +
                	yStepLabel +
                "</text>";
        }
        
        let curY = this.chartMarginTop + (i * this.yStepHeight);
        diagramScala += 
	        "<text class='steps' text-anchor='end' alignment-baseline='central' x='" + (this.chartMarginLeft - 5) + "' " +
            	"y='" + curY + "'>" +
            	minSeconds +
            "</text>";

        return diagramScala;
    }
    
    createSvgDataPoints(gameScores, minSeconds, maxSeconds) {

        let svgDataPoints = "";
        let previousPointX = 0;
        let previousPointY = 0;
        
        let variance = maxSeconds - minSeconds;

        //first create all paths
        
        let points = [];

        for(let i = 0; i < gameScores.length; i++) {

            let gameScoreEntry = gameScores[i];
            
            let elapsedSeconds = Utils.parseTimeToSeconds(gameScoreEntry.elapsedTime);
			
            let pointX = this.chartMarginLeft + this.xStepWidth * (i + 1);
            let pointY = this.chartMarginTop + this.chartHeight * ((elapsedSeconds - minSeconds) / variance);
            
            points.push({x: pointX, y: pointY});

            if(previousPointX != 0) {

                svgDataPoints +=
                "<path d='M" + previousPointX + " " + previousPointY + " " +
                "L" + pointX + " " + pointY + "' " + 
                "stroke='" + this.lineColor + "' stroke-linecap='square' stroke-width='2px' fill='none'/>";
            }

            previousPointX = pointX;
            previousPointY = pointY;
            
            let timeStampOutput = this.getTimeStampOutput(gameScoreEntry);            

			svgDataPoints +=                 
                "<text class='timeStamp' alignment-baseline='central' " + 
	                "transform='translate(" + pointX + ", " + (this.svgHeight - this.chartMarginBottom + 5) + ") rotate(90)'>" + 
	                timeStampOutput + "</text>";
        }
        
        // draw circles later so they cover the paths
        for(let point of points) {			
			svgDataPoints += "<circle cx='" + point.x + "' cy='" + point.y + "' r='2px'></circle>";
		}
        

        return svgDataPoints;
    }

    getElapsedTimeInSeconds(gameScoreEntry) {
		
		return Utils.parseTimeToSeconds(gameScoreEntry.elapsedTime);
	}

    getTimeStampOutput(gameScoreEntry) {

        let timeStamp = gameScoreEntry.timeStamp;
        let lastLetterIdx = timeStamp.lastIndexOf('T');
        let isoDateString = timeStamp.substring(0, lastLetterIdx);
        let dateStringArray = isoDateString.split('-').reverse();
        let germanDateString = dateStringArray.join('.');
        let twistedSpeechMode = gameScoreEntry.twistedSpeechMode;
        let speechModeOutput = "";

        switch(twistedSpeechMode) {
            case 'zehneins': speechModeOutput = "ZE"; break;
            case 'zwanzigeins': speechModeOutput = "ZWE"; break;
            case 'traditionellVerdreht': speechModeOutput = "TV"; break;
            case 'zehneinsEndnull': speechModeOutput = "ZE0"; break;
            case 'zwanzigeinsEndnull': speechModeOutput =" ZWE0"; break;
        }

        let timeStampOutput =
        	' ' + germanDateString + 
            ', ' + speechModeOutput + 
            ', ' + gameScoreEntry.numErrors + ' Fehler';
        
        return timeStampOutput;
    }
    
}