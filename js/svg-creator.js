export default class SvgCreator {

    constructor() { 

        this.minWidthDiagram = 550.0;
        this.heightDiagram = 400.0;
        this.marginTopDiagram = 10.0;
        this.marginBottomDiagram = 100.0;
        this.marginLeftDiagram = 25.0;
        this.actualVerticalSpace = this.heightDiagram - this.marginBottomDiagram - this.marginTopDiagram;
        this.actualHorizontalSpace = this.minWidthDiagram - this.marginLeftDiagram;
        this.heightSteps = 10;
        this.heightStepUnit = this.actualVerticalSpace / this.heightSteps; 
        this.widthStepUnit = 20.0;  
        
        this.lineColor = 'green';
    }

    createStatisticsSvg(gameScores) {

        let gameScoresLength = gameScores.length;       
        let svg = "";

        svg += this.getSvgDiagramHeader(gameScoresLength);
        svg += this.getSvgDiagramStyleDeclaration();        
        svg += this.createSvgDiagramScala(gameScoresLength);
        svg += this.createSvgDataPoints(gameScores);
        svg += "</svg>";

        return svg;
    }

    getSvgDiagramHeader(gameScoresLength) {

        let svgDiagramHeader = "<svg xmlns='http://www.w3.org/2000/svg' ";

        if((gameScoresLength * this.widthStepUnit) > this.actualHorizontalSpace) {

            let neededSpaceWidth = this.marginLeftDiagram + (gameScoresLength * this.widthStepUnit);

            svgDiagramHeader += 
                "width='" + neededSpaceWidth + "' " +
                "height='" + this.heightDiagram + "' " +
                "viewbox='0 0 " + neededSpaceWidth + " " + this.heightDiagram + "'>";
        }
        else {

            svgDiagramHeader += 
                "width='" + this.minWidthDiagram + "' " +
                "height='" + this.heightDiagram + "' " +
                "viewbox='0 0 " + this.minWidthDiagram + " " + this.heightDiagram + "'>";
        }

        return  svgDiagramHeader;
    }

    getSvgDiagramStyleDeclaration() {

        return  "<style>" +
                    ".steps {" +
                            "font: bold 10px sans-serif;" +
                            "}" +
                    ".timeStamp {" +
                            "font: bold 4px sans-serif;" +
                            "}" +
                "</style>"
    }

    createSvgDiagramScala(gameScoresLength) {

        let diagramScala = 
            "<path d='M" + this.marginLeftDiagram + " " + this.marginTopDiagram + " " +
            "L" + this.marginLeftDiagram + " " + (this.heightDiagram - this.marginBottomDiagram - this.marginTopDiagram) + " ";

        if((gameScoresLength * this.widthStepUnit) > this.actualHorizontalSpace) {

            let neededSpaceWidth = this.marginLeftDiagram + (gameScoresLength * this.widthStepUnit);

            diagramScala += 
                "L" + (neededSpaceWidth - this.marginLeftDiagram) + " " + (this.heightDiagram - this.marginBottomDiagram - this.marginTopDiagram) + "' " +
                "stroke='black' stroke-linecap='square' stroke-width='1px' fill='none'/>";
        }
        else {

            diagramScala += 
                "L" + (this.minWidthDiagram - this.marginLeftDiagram) + " " + (this.heightDiagram - this.marginBottomDiagram - this.marginTopDiagram) + "' " +
                "stroke='black' stroke-linecap='square' stroke-width='1px' fill='none'/>";
        }

        for(var i = 0; i < this.heightSteps; i++) {

            diagramScala += 
                "<path d='M" + (this.marginLeftDiagram + 2) + " " + (this.marginTopDiagram + (i * this.heightStepUnit)) + " ";

                if((gameScoresLength * this.widthStepUnit) > this.actualHorizontalSpace) {

                    let neededSpaceWidth =  this.marginLeftDiagram + (gameScoresLength * this.widthStepUnit);

                    diagramScala += 
                        "L" + (neededSpaceWidth - this.marginLeftDiagram) + " " + (this.marginTopDiagram + (i * this.heightStepUnit)) + "' ";
                }
                else {

                    diagramScala += 
                        "L" + (this.minWidthDiagram - this.marginLeftDiagram) + " " + (this.marginTopDiagram + (i * this.heightStepUnit)) + "' ";
                }

                diagramScala += 
                    "stroke='grey' stroke-width='0.5px' stroke-dasharray='5,5' fill='none'/>" +
                    "<text class='steps' text-anchor='end' alignment-baseline='central' x='" + (this.marginLeftDiagram - 5) + "' " + 
                    "y='" + (this.marginTopDiagram + (i * this.heightStepUnit)) + "'>" +
                    (100 - (i * 10)) + "</text>";
        }

        return diagramScala;
    }

    createSvgDataPoints(gameScores) {

        let svgDataPoints = "";
        let previousPointX = 0;
        let previousPointY = 0;
        let averageElapsedTime = this.getAverageElapsedTime(gameScores);

        //first create all paths

        for(var i = 0; i < gameScores.length; i++) {

            let gameScoreEntry = gameScores[i];
            let scorePoint = this.getScorePoints(gameScoreEntry, averageElapsedTime);
            let unitPerScorePoint = this.actualVerticalSpace / 100;
            let pointX = this.marginLeftDiagram + this.widthStepUnit * (i + 1);
            let pointY = (this.heightDiagram - this.marginBottomDiagram) - (scorePoint * unitPerScorePoint);

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

        for(var i = 0; i < gameScores.length; i++) {
            
            let gameScoreEntry = gameScores[i];
            let scorePoint = this.getScorePoints(gameScoreEntry, averageElapsedTime);
            let timeStampOutput = this.getTimeStampOutput(gameScoreEntry);
            let unitPerScorePoint = this.actualVerticalSpace / 100;
            let pointX = this.marginLeftDiagram + this.widthStepUnit * (i + 1);
            let pointY = (this.heightDiagram - this.marginBottomDiagram) - (scorePoint * unitPerScorePoint);

            svgDataPoints += 
                "<circle cx='" + pointX + "' cy='" + pointY + "' r='2px'></circle>" +
                "<text class='timeStamp' alignment-baseline='central' " + 
                "transform='translate(" + pointX + ", " + (this.heightDiagram - this.marginBottomDiagram + 5) + ") rotate(90)'>" + 
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
            averageElapsedTime += this.getElapsedTimeInSeconds(gameScoreEntry);
        }

        averageElapsedTime = averageElapsedTime / gameScores.length;

        return averageElapsedTime;
    }

    getElapsedTimeInSeconds(gameScoreEntry) {
        
        let elapsedSeconds = 0;

        let elapsedTimeString = gameScoreEntry.elapsedTime; 
        let elapsedTimeArray = elapsedTimeString.split(':');

        let minutes = parseInt(elapsedTimeArray[0]);
        let seconds = parseInt(elapsedTimeArray[1]);

        elapsedSeconds = (minutes * 60) + seconds;

        return elapsedSeconds
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

        let timeStampOutput =   "Date:" + germanDateString + 
                                ", Mode:" + speechModeOutput + 
                                ", Time:" + gameScoreEntry.elapsedTime + 
                                ", Errors:" + gameScoreEntry.numErrors;
        
        return timeStampOutput;
    }
}