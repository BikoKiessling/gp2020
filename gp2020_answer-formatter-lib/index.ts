import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

class FormatAnswerOptions {
  answerSheetDataRange: string;
  targetSheetDataRange: string;
  filterUndefinedByProperty: string;
  nickNameProperty: string;
  toFormattedAnswer: (fields: string[]) => any;
  toAnswer: (fields: string[]) => any;
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
    this.targetSheet
      .getRange(`A${this.getNextRowIndex()}:C${this.getNextRowIndex()}`)
      .setValues([[Object.values(latestAnswer)]]);
  }

  getAnsweredParticipantNicknames(): string[] {
    return this.getFormattedAnswers().map(
      (formattedAnswer) => formattedAnswer[this.options.nickNameProperty]
    );
  }

  private getFormattedAnswers() {
    return this.targetSheet
      .getRange(this.options.targetSheetDataRange)
      .getValues()
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
      .map(this.options.toAnswer)
      .filter((answer) => answer.type);
  }

  private getLatestAnswer(): any {
    const answers = this.getAnswers();
    return answers[answers.length - 1];
  }

  private getNextRowIndex(): number {
    return this.getFormattedAnswers().length + 2;
  }
}
