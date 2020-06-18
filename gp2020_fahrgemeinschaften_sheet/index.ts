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

const onFormSubmit = (e) => {
  writeLatestAnswerToTransportSheet();
  updateParticipantItemListFromForm();
};

const participantsThatHaveNotYetSubmitted = (nickname: string) =>
  !getFormattedAnswers().some(
    (formattedAnswer) => formattedAnswer.nickname === nickname
  );

//participant list has to be created manually before with name of const ITEM_TITLE and type dropdown
const updateParticipantItemListFromForm = () => {
  const listItem = getParticipantListItem();

  listItem.setRequired(true);
  const nicknames = gp2020teilnehmerlib.getNicknames() as string[];
  listItem.setChoices(
    nicknames
      .filter(participantsThatHaveNotYetSubmitted)
      .map((nickname) => listItem.createChoice(nickname))
  );
};

const getParticipantListItem = (): ListItem =>
  form
    .getItems()
    .find((item: Item) => item.getTitle() === ITEM_TITLE)
    .asListItem();

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

const writeLatestAnswerToTransportSheet = () => {
  const latestAnswer = getLatestAnswer();
  transportSheet
    .getRange(`A${getNextRowIndex()}:C${getNextRowIndex()}`)
    .setValues([
      [
        latestAnswer.nickname,
        Object.keys(TRANSPORT_SELECTION).find(
          (key) => TRANSPORT_SELECTION[key] === latestAnswer.type
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
  transportSheet
    .getRange(TRANSPORT_SHEET_DATARANGE)
    .getValues()
    .map(toFormattedAnswer)
    .filter((formattedAnswer) => formattedAnswer.type);
const getNextRowIndex = (): number => getFormattedAnswers().length + 2;
