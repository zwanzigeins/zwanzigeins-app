import Options from './options.js';

/**
	temporary solution to prevent superfluos level-options-output in CSV-export
*/
export default class MentalArithmeticGameOptions extends Options {

	getPayloadObject() {

		let payloadObj = super.getPayloadObject();

		this.cleanSuperfluosDataItems('addition', payloadObj);
		this.cleanSuperfluosDataItems('subtraction', payloadObj);
		this.cleanSuperfluosDataItems('multiplication', payloadObj);
		this.cleanSuperfluosDataItems('division', payloadObj);

		return payloadObj;
	}

	cleanSuperfluosDataItems(operatorName, payloadObj) {

		let enabledPropertyKey = operatorName + '-enabled';

		if (!payloadObj[enabledPropertyKey]) {

			delete payloadObj[enabledPropertyKey];
			delete payloadObj[operatorName + '-operand1-from'];
			delete payloadObj[operatorName + '-operand1-to'];
			delete payloadObj[operatorName + '-operand2-from'];
			delete payloadObj[operatorName + '-operand2-to'];
		}
	}

}