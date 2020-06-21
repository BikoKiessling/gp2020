import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import Range = GoogleAppsScript.Spreadsheet.Range;

const RESULTS_SHEET_NAME = "formattedResults";
const RESULTS_SHEET_DATARANGE = "A2:C";

//TODO: split projects into equipment, equipment sheet & equipment lib (for shared functionality between the other two)
class FormattedAnswer {
  nickname: string;
  thing: string;
  amount: number;
}

const toFormattedAnswer = ([nickname, thing, amount]): FormattedAnswer => ({
  nickname,
  thing,
  amount,
});

//sheet function
const getCoveredAmount = (thing: string, range: any[][]) =>
  range
    .map(toFormattedAnswer)
    .filter((formattedAnswer) => formattedAnswer.thing === thing)
    .reduce((previous, current) => previous + current.amount, 0);
