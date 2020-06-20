import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

class insertRowPolicy {
  type: "next" | "byColumnValue";
  answerProperty: string;
}

type identifyingProperty = "name" | "nickname";
class FormatAnswerOptions {
  answerSheetDataRange: string;
  targetSheetDataRange: string;
  filterUndefinedByProperty: string;
  identifyingProperty: identifyingProperty;
  insertRowPolicy: insertRowPolicy;
  nrOfAnswerProperties: number;
  toFormattedAnswer: (fields: string[], answerRows: any[][]) => any;
}
export class FormatAnswer {
  answerSheet: Sheet;
  targetSheet: Sheet;
  options: FormatAnswerOptions;

  constructor(
    answerSheet: GoogleAppsScript.Spreadsheet.Sheet,
    targetSheet: GoogleAppsScript.Spreadsheet.Sheet,
    options: FormatAnswerOptions
  ) {
    this.answerSheet = answerSheet;
    this.targetSheet = targetSheet;
    this.options = options;
  }

  writeFormattedAnswerToSheet() {
    const latestAnswer = this.getLatestAnswer();
    const rowIndex = this.getRowIndex(latestAnswer);
    this.targetSheet
      .getRange(
        `A${rowIndex}:${String.fromCharCode(
          this.options.nrOfAnswerProperties + 64
        )}${rowIndex}`
      )
      .setValues([Object.values(latestAnswer)]);
  }

  getRowIndex(latestAnswer) {
    switch (this.options.insertRowPolicy.type) {
      case "byColumnValue":
        return this.getRowIndexByFirstColumnValue(
          latestAnswer[this.options.insertRowPolicy.answerProperty]
        );
      case "next":
        return this.getNextRowIndex();
      default:
        throw Error("invalid insertRowPolicy");
    }
  }

  getAnsweredParticipantsByIdentifyingProperty(): string[] {
    let formattedAnswers = this.getFormattedAnswers();
    return formattedAnswers.map(
      (formattedAnswer) => formattedAnswer[this.options.identifyingProperty]
    );
  }

  private getFormattedAnswerRows() {
    return this.targetSheet
      .getRange(this.options.targetSheetDataRange)
      .getValues();
  }

  private getFormattedAnswers() {
    const formattedAnswerRows = this.getFormattedAnswerRows();
    return formattedAnswerRows
      .map((row) => this.options.toFormattedAnswer(row, formattedAnswerRows))
      .filter(
        (formattedAnswer) =>
          formattedAnswer[this.options.filterUndefinedByProperty]
      );
  }

  private getAnswers(): any {
    return this.answerSheet
      .getRange(this.options.answerSheetDataRange)
      .getValues()
      .map((row) =>
        this.options.toFormattedAnswer(row, this.getFormattedAnswerRows())
      )
      .filter((answer) => answer[this.options.filterUndefinedByProperty]);
  }

  private getLatestAnswer(): any {
    const answers = this.getAnswers();
    return answers[answers.length - 1];
  }

  private getNextRowIndex(): number {
    return this.getFormattedAnswers().length + 2;
  }

  private getFirstColumnValues(): string[] {
    return this.targetSheet
      .getRange("A2:A")
      .getValues()
      .map(([value]) => value)
      .filter((value) => value);
  }

  getRowIndexByFirstColumnValue = (firstColumnValue: string): number => {
    const value = this.getFirstColumnValues();
    return value.findIndex((name) => name === firstColumnValue) + 2;
  };
}
