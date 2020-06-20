import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

type insertRowPolicy = "next" | "byColumnValue";
class FormatAnswerOptions {
  answerSheetDataRange: string;
  targetSheetDataRange: string;
  filterUndefinedByProperty: string;
  nickNameProperty: string;
  insertRowPolicy: insertRowPolicy;
  toFormattedAnswer: (fields: string[]) => any;
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
      .getRange(`A${rowIndex}:C${rowIndex}`)
      .setValues([Object.values(latestAnswer)]);
  }

  getRowIndex(latestAnswer) {
    switch (this.options.insertRowPolicy) {
      case "byColumnValue":
        this.getRowIndexByFirstColumnValue(
          latestAnswer[this.options.nickNameProperty]
        );
        break;
      case "next":
        this.getNextRowIndex();
        break;
      default:
        throw Error("invalid insertRowPolicy");
    }
  }
  getAnsweredParticipantNicknames(): string[] {
    let formattedAnswers = this.getFormattedAnswers();

    return formattedAnswers.map(
      (formattedAnswer) => formattedAnswer[this.options.nickNameProperty]
    );
  }

  private getFormattedAnswers() {
    let values = this.targetSheet
      .getRange(this.options.targetSheetDataRange)
      .getValues();

    return values
      .map(this.options.toFormattedAnswer)
      .filter(
        (formattedAnswer) =>
          formattedAnswer[this.options.filterUndefinedByProperty]
      );
  }

  private getAnswers(): any {
    return this.answerSheet
      .getRange(this.options.answerSheetDataRange)
      .getValues()
      .map(this.options.toFormattedAnswer)
      .filter((answer) => answer.type);
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

  getRowIndexByFirstColumnValue = (firstColumnValue: string): number =>
    this.getFirstColumnValues().findIndex((name) => name === firstColumnValue) +
    2;
}
