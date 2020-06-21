import Item = GoogleAppsScript.Forms.Item;
import ListItem = GoogleAppsScript.Forms.ListItem;

const ITEM_TITLE = "Wer bist du?";

const PARTICIPANT_SPREADHSEET_ID =
  "1I-Vuv7KM4FhRSB7gVFSyYgeoDOgiQW-1idDK40k-Rro";
const ss = SpreadsheetApp.open(
  DriveApp.getFileById(PARTICIPANT_SPREADHSEET_ID)
);
const form = FormApp.openByUrl(ss.getFormUrl());

const PARTICIPANTS_SHEET_NAME = "Teilnehmer";
const PARTICPANTIS_SHEET_DATARANGE = `A2:E`;
const participantsSheet = ss.getSheetByName(PARTICIPANTS_SHEET_NAME);

let ANSWERS_SHEET_NAME = "form";
const ANSWERS_SHEET_DATARANGE = "B2:F";
const answersSheet = ss.getSheetByName(ANSWERS_SHEET_NAME);

//central hook
const onFormSubmit = (e) => {
  const formatAnswer = new gp2020answerformatterlib.FormatAnswer(
    answersSheet,
    participantsSheet,
    {
      toFormattedAnswer,
      answerSheetDataRange: ANSWERS_SHEET_DATARANGE,
      targetSheetDataRange: PARTICPANTIS_SHEET_DATARANGE,
      filterUndefinedByProperty: "dayOfArrival",
      identifyingProperty: "name",
      insertRowPolicy: { type: "byColumnValue", answerProperty: "name" },
      nrOfAnswerProperties: 5,
    }
  );
  formatAnswer.writeFormattedAnswerToSheet();
  gp2020updateparticipantlistlib.updateParticipantItemListOfForm({
    form,
    options: {
      alreadyAnsweredParticipants: {
        alreadyAnsweredParticipants: formatAnswer.getAnsweredParticipantsByIdentifyingProperty(),
        identifyingProperty: "name",
      },
      onlyOneAnswerPerParticipantPolicy: true,
    },
  });
  updateParticipantListOfOtherForms();
};

const updateParticipantListOfOtherForms = () => {
  gp2020zeltenform.updateParticipantList();
  gp2020fahrgemeinschaftenform.updateParticipantList();
  gp2020workshopsform.updateParticipantList();
  gp2020equipmentform.updateParticipantList();
  gp2020ideasform.updateParticipantList();
};

//formatted answers are those saved in the 'Teilnehmer' sheet
const toFormattedAnswer = (
  [name, nickname, dayOfArrival, nightCount, relativeAlcoholconsumption],
  answers: any[][]
): answer => {
  return {
    name,
    nickname: nickname ? `${nickname} (${name})` : name,
    dayOfArrival,
    nightCount,
    relativeAlcoholconsumption,
  };
};
