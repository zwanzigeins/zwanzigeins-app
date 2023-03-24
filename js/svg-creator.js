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
        this.chartMarginBottom = 250;
        this.chartMarginLeft = 25;
        
        this.svgHeight = this.chartHeight + this.chartMarginTop + this.chartMarginBottom;
        
        this.svgWidth = this.chartMarginLeft + this.chartWidth;
        
        this.lineColor = 'green';
    }

    createStatisticsSvg() {

        let svg = "";

        svg += this.getSvgDiagramHeader();
        svg += this.getSvgDiagramStyleDeclaration();        
        svg += this.createSvgDiagramScala();
        svg += this.createSvgDataPoints(this.gameScores);
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
            </style>`;
       
        return style;     
    }

    createSvgDiagramScala() {

        let diagramScala =
            "<path d='M" + this.chartMarginLeft + " " + this.chartMarginTop + " " +
            "l0 " + this.chartHeight + " " +
            "l" + this.chartWidth + " 0' " +
            "stroke='black' stroke-linecap='square' stroke-width='1px' fill='none'/>";
        
        for(let i = 0; i < this.yStepsCount; i++) {
			
			let curY = this.chartMarginTop + (i * this.yStepHeight);

            diagramScala += 
                "<path d='M" + (this.chartMarginLeft + 2) + " " + curY + " " +
                	"l" + this.chartWidth + " " + 0 + "' stroke='grey' stroke-width='0.5px' stroke-dasharray='5,5' fill='none'/>" +
                "<text class='steps' text-anchor='end' alignment-baseline='central' x='" + (this.chartMarginLeft - 5) + "' " + 
                	"y='" + curY + "'>" +
                	(100 - (i * 10)) + 
                "</text>";
        }

        return diagramScala;
    }

    createSvgDataPoints(gameScores) {

        let svgDataPoints = "";
        let previousPointX = 0;
        let previousPointY = 0;
        let averageElapsedTime = this.getAverageElapsedTime(gameScores);

        //first create all paths

        for(let i = 0; i < gameScores.length; i++) {

            let gameScoreEntry = gameScores[i];
            let scorePoint = this.getScorePoints(gameScoreEntry, averageElapsedTime);
            let unitPerScorePoint = this.chartHeight / 100;
            let pointX = this.chartMarginLeft + this.xStepWidth * (i + 1);
            let pointY = (this.chartMarginTop + this.chartHeight) - (scorePoint * unitPerScorePoint);

            if(previousPointX != 0) {

                svgDataPoints +=
                "<path d='M" + previousPointX + " " + previousPointY + " " +
                "L" + pointX + " " + pointY + "' " + 
                "stroke='" + this.lineColor + "' stroke-linecap='square' stroke-width='1px' fill='none'/>";
            }

            previousPointX = pointX;
            previousPointY = pointY;
        }

        //create circles on top

        for(let i = 0; i < gameScores.length; i++) {
            
            let gameScoreEntry = gameScores[i];
            let scorePoint = this.getScorePoints(gameScoreEntry, averageElapsedTime);
            let timeStampOutput = this.getTimeStampOutput(gameScoreEntry);
            let unitPerScorePoint = this.chartHeight / 100;
            let pointX = this.chartMarginLeft + this.xStepWidth * (i + 1);
            let pointY = (this.svgHeight - this.chartMarginBottom) - (scorePoint * unitPerScorePoint);

            svgDataPoints += 
                "<circle cx='" + pointX + "' cy='" + pointY + "' r='2px'></circle>" +
                "<text class='timeStamp' alignment-baseline='central' " + 
                "transform='translate(" + pointX + ", " + (this.svgHeight - this.chartMarginBottom + 5) + ") rotate(90)'>" + 
                timeStampOutput + "</text>";
        }

        return svgDataPoints;
    }

    getScorePoints(gameScoreEntry, averageElapsedTime) {

        let secondsPerPoint = averageElapsedTime / 50;
        let gameScoreEntryPoints = this.getElapsedTimeInSeconds(gameScoreEntry) / secondsPerPoint;

        return 100 - gameScoreEntryPoints;
    }

    getAverageElapsedTime(gameScores) {

        let averageElapsedTime = 0;

        for(var i = 0; i < gameScores.length; i++) {

            let gameScoreEntry = gameScores[i];
            averageElapsedTime += Utils.parseTimeToSeconds(gameScoreEntry.elapsedTime);
        }

        averageElapsedTime = averageElapsedTime / gameScores.length;

        return averageElapsedTime;
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
            case 'traditionell verdreht': speechModeOutput = "TV"; break;
            case 'zehneins(endnull)': speechModeOutput = "ZE0"; break;
            case 'zwanzigeins(endnull)': speechModeOutput =" ZWE0"; break;
        }

        let timeStampOutput =
        	"Date:" + germanDateString + 
            ", Mode:" + speechModeOutput + 
            ", Time:" + gameScoreEntry.elapsedTime + 
            ", Errors:" + gameScoreEntry.numErrors;
        
        return timeStampOutput;
    }
    
}