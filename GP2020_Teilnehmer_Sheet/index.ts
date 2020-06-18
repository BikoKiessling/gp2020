import Item = GoogleAppsScript.Forms.Item;
import ListItem = GoogleAppsScript.Forms.ListItem;

const ITEM_TITLE = "Wer bist du?";

const PARTICIPANT_SPREADHSEET_ID = "1I-Vuv7KM4FhRSB7gVFSyYgeoDOgiQW-1idDK40k-Rro";
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

const toAnswer = ([
  nickname,
  nightCount,
  dayOfArrival,
  relativeAlcoholconsumption,
  name,
]): answer => ({
  name,
  nickname,
  dayOfArrival,
  nightCount,
  relativeAlcoholconsumption,
});

const getAnswers = (): answer[] => {
  const answersTable = answersSheet
    .getRange(ANSWERS_SHEET_DATARANGE)
    .getValues();
  return answersTable.map(toAnswer).filter((answer) => answer.dayOfArrival);
};
const getLatestAnswer = (): answer => {
  const answers = getAnswers();
  return answers[answers.length - 1];
};

//central hook
const onFormSubmit = (e) => {
  writeLatestAnswerToParticipantsSheet();
  updateParticipantItemListFromForm();
};

const getParticipantRowIndex = (identifyingName: string) =>
  getIdentifyingParticipantNames().findIndex(
    ([name]) => name === identifyingName
  ) + 2;

//if the nickname already exists, append identifyingName to avoid duplicate names
const getValidNickname = (answer: answer): string =>
  answer.nickname
      ? getFormattedAnswers().find(
          (formattedAnswer) => formattedAnswer.nickname === answer.nickname
        )
        ? `${answer.nickname}(${answer.name})`
      : answer.nickname
    : answer.name;

const writeLatestAnswerToParticipantsSheet = () => {
  const latestAnswer = getLatestAnswer();

  latestAnswer.nickname = getValidNickname(latestAnswer);

  // + 2 because it starts at A2
  const participantRowIndex = getParticipantRowIndex(latestAnswer.name);

  participantsSheet
    .getRange(`B${participantRowIndex}:E${participantRowIndex}`)
    .setValues([
      [
        latestAnswer.nickname,
        latestAnswer.dayOfArrival,
        latestAnswer.nightCount,
        latestAnswer.relativeAlcoholconsumption,
      ],
    ]);
};

const getIdentifyingParticipantNames = (): any[] => {
  let values = participantsSheet.getRange("A2:A").getValues();
  return values.filter(([name]) => name);
};

const getFormattedAnswers = () =>
  participantsSheet
    .getRange(PARTICPANTIS_SHEET_DATARANGE)
    .getValues()
    .map(toFormattedAnswer)
    .filter((answer) => answer.name);

//formatted answers are those saved in the 'Teilnehmer' sheet
const toFormattedAnswer = ([
  name,
  nickname,
  dayOfArrival,
  nightCount,
  relativeAlcoholconsumption,
]): answer => ({
  name,
  nickname,
  dayOfArrival,
  nightCount,
  relativeAlcoholconsumption,
});

const getParticipantListItem = (): ListItem =>
  form
    .getItems()
    .find((item: Item) => item.getTitle() === ITEM_TITLE)
    .asListItem();

//participant list has to be created manually before with name of const ITEM_TITLE and type dropdown
const updateParticipantItemListFromForm = () => {
  const listItem = getParticipantListItem();

  listItem.setRequired(true);
  listItem.setChoices(
    getFormattedAnswers()
      .filter((answer) => !answer.dayOfArrival)
      .map((answer) => listItem.createChoice(answer.name))
  );
};

const getNotYetAnsweredNicknames = () => {};
