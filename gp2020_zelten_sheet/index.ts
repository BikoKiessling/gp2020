import ListItem = GoogleAppsScript.Forms.ListItem;
import Item = GoogleAppsScript.Forms.Item;

enum CAMPING_SELECTION {
  TENT = "Habe ein Zelt",
  PLACE = "Brauche einen Zelt Schlafplatz",
  HOUSE = "Schlafe im Haus (Rücksprache Biko)",
  ETC = "Sonstiges (Hängematte (Rücksprache), Freiluft, Auto, etc.)",
}

class answer {
  nickname: string;
  type: CAMPING_SELECTION;
  places?: number;
}

const ITEM_TITLE = "Wer bist du?";

const ss = SpreadsheetApp.open(
  DriveApp.getFileById("1JdP2tqC3TSpuZJ1gsEftjfgV00a1iU6Y1AZHTsnEjAc")
);

const form = FormApp.openByUrl(ss.getFormUrl());

const CAMPING_SHEET_NAME = "camping";
const CAMPING_SHEET_DATARANGE = "A2:C";
const campingSheet = ss.getSheetByName(CAMPING_SHEET_NAME);

const ANSWERS_SHEET_NAME = "form";
const ANSWERS_SHEET_DATARANGE = "B2:D";
const answersSheet = ss.getSheetByName(ANSWERS_SHEET_NAME);

const onFormSubmit = (e) => {
  gp2020teilnehmerlib.onUpdateParticipantListChanged(form);
  gp2020teilnehmerlib.onUpdateParticipantListChanged(form);
  updateParticipantItemListFromForm();
};

const toAnswer = ([nickname, type, places]): answer => ({
  nickname,
  type,
  places,
});
const getAnswers = (): answer[] =>
  answersSheet
    .getRange(ANSWERS_SHEET_DATARANGE)
    .getValues()
    .map(toAnswer)
    .filter((answer) => answer.type);

const getLatestAnswer = (): answer => {
  const answers = getAnswers();
  return answers[answers.length - 1];
};

const writeLatestAnswerToCampingSheet = () => {
  const latestAnswer = getLatestAnswer();
  campingSheet
    .getRange(`A${getNextRowIndex()}:C${getNextRowIndex()}`)
    .setValues([
      [
        latestAnswer.nickname,
        Object.keys(CAMPING_SELECTION).find(
          (key) => CAMPING_SELECTION[key] === latestAnswer.type
        ),
        latestAnswer.places,
      ],
    ]);
};

const toFormattedAnswer = ([nickname, type, places]): answer => ({
  nickname,
  type,
  places,
});

const getFormattedAnswers = () =>
  campingSheet
    .getRange(CAMPING_SHEET_DATARANGE)
    .getValues()
    .map(toFormattedAnswer)
    .filter((formattedAnswer) => formattedAnswer.type);
