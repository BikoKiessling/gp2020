import ListItem = GoogleAppsScript.Forms.ListItem;
import Item = GoogleAppsScript.Forms.Item;

enum TRANSPORT_SELECTION {
  CAR = "Komme mit Auto",
  SEAT = "Brauche eine Mitfahrgelegenheit",
  TRAIN = "Komme mit Zug",
  ETC = "Sonstiges (Fahrrad, zu Fuß, etc.)",
}
class answer {
  nickname: string;
  type: TRANSPORT_SELECTION;
  places?: number;
}

const ITEM_TITLE = "Wer bist du?";

const ss = SpreadsheetApp.open(
    DriveApp.getFileById("1rKNNL3NbUxewpaPbBt-f8fjJa0mHaG_jdPzO6UfwIqo")
);

const form = FormApp.openByUrl(ss.getFormUrl());

const TRANSPORT_SHEET_NAME = "fahrgemeinschaften";
const TRANSPORT_SHEET_DATARANGE = "A2:C";
const transportSheet = ss.getSheetByName(TRANSPORT_SHEET_NAME);

const ANSWERS_SHEET_NAME = "form";
const ANSWERS_SHEET_DATARANGE = "B2:D";
const answersSheet = ss.getSheetByName(ANSWERS_SHEET_NAME);

const toFormattedAnswer = ([nickname, type, places]): answer => ({
  nickname,
  type,
  places,
});

const globalConfig = {
  toFormattedAnswer,
  answerSheetDataRange: ANSWERS_SHEET_DATARANGE,
  targetSheetDataRange: TRANSPORT_SHEET_DATARANGE,
  filterUndefinedByProperty: "type",
  identifyingProperty: "nickname",
  insertRowPolicy: { type: "next" },
  nrOfAnswerProperties: 3,
};

const onFormSubmit = (e) => {
  const formatAnswer = new gp2020answerformatterlib.FormatAnswer(
      answersSheet,
      transportSheet,
      globalConfig
  );
  formatAnswer.writeFormattedAnswerToSheet();
  updateParticipantList();
};

const updateParticipantList = () => {
  const formatAnswer = new gp2020answerformatterlib.FormatAnswer(
      answersSheet,
      transportSheet,
      globalConfig
  );
  gp2020updateparticipantlistlib.updateParticipantItemListOfForm({
    form,
    options: {
      alreadyAnsweredParticipants: {
        alreadyAnsweredParticipants: formatAnswer.getAnsweredParticipantsByIdentifyingProperty(),
        identifyingProperty: "nickname",
      },
      onlyOneAnswerPerParticipantPolicy: true,
    },
  });
};
