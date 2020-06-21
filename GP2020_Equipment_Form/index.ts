import ListItem = GoogleAppsScript.Forms.ListItem;
import Item = GoogleAppsScript.Forms.Item;

class FormattedAnswer {
  nickname: string;
  thing: string;
  amount: number;
}

class Equipment {
  thing: string;
  type: string;
  details: string;
  needed: number;
  provided: number;
}

const ss = SpreadsheetApp.open(
  DriveApp.getFileById("1lFmFpHZ3JpRFCfetl6FdvnG3KmRp5WMT5BLVSFlIQdc")
);

const form = FormApp.openByUrl(ss.getFormUrl());

const RESULTS_SHEET_NAME = "formattedResults";
const RESULTS_SHEET_DATARANGE = "A2:C";
const resultsSheet = ss.getSheetByName(RESULTS_SHEET_NAME);

const ANSWERS_SHEET_NAME = "form";
const ANSWERS_SHEET_DATARANGE = "B2:D";
const answersSheet = ss.getSheetByName(ANSWERS_SHEET_NAME);

const EQUIPMENT_SHEET_NAME = "equipment";
const EQUIPMENT_SHEET_DATARANGE = "A2:E";
const equipmentSheet = ss.getSheetByName(EQUIPMENT_SHEET_NAME);

const EQUIPMENT_LIST_TITLE = "Was kannst du mitbringen?";
const AMOUNT_LIST_TITLE = "Wie viel Stück?";

const toFormattedAnswer = ([nickname, thing, amount]): FormattedAnswer => ({
  nickname,
  thing,
  amount,
});

const toEquipment = ([thing, type, details, needed, provided]): Equipment => ({
  thing,
  type,
  details,
  needed,
  provided,
});

const globalConfig = {
  toFormattedAnswer,
  answerSheetDataRange: ANSWERS_SHEET_DATARANGE,
  targetSheetDataRange: RESULTS_SHEET_DATARANGE,
  filterUndefinedByProperty: "thing",
  identifyingProperty: "nickname",
  insertRowPolicy: { type: "next" },
  nrOfAnswerProperties: 3,
};

const onFormSubmit = (e) => {
  const formatAnswer = new gp2020answerformatterlib.FormatAnswer(
    answersSheet,
    resultsSheet,
    globalConfig
  );
  formatAnswer.writeFormattedAnswerToSheet();
  updateParticipantList();
  setNeededEquipmentToEquipmentList();
  setMaxAmountToAmountList();
  equipmentSheet.
};

const updateParticipantList = () => {
  const formatAnswer = new gp2020answerformatterlib.FormatAnswer(
    answersSheet,
    resultsSheet,
    globalConfig
  );
  gp2020updateparticipantlistlib.updateParticipantItemListOfForm({
    form,
    options: {
      alreadyAnsweredParticipants: {
        alreadyAnsweredParticipants: formatAnswer.getAnsweredParticipantsByIdentifyingProperty(),
        identifyingProperty: "nickname",
      },
      onlyOneAnswerPerParticipantPolicy: false,
    },
  });
};

const setNeededEquipmentToEquipmentList = () => {
  const listItem = getListItem(EQUIPMENT_LIST_TITLE);
  listItem.setChoices(
    getNeededEquipment().map((equipment) =>
      listItem.createChoice(equipment.thing)
    )
  );
};

const getNeededEquipment = () =>
  equipmentSheet
    .getRange(EQUIPMENT_SHEET_DATARANGE)
    .getValues()
    .map(toEquipment)
    .filter((equipment) => equipment.needed > (equipment.provided || 0));

const getListItem = (listName: string): ListItem =>
  form
    .getItems()
    .find((item: Item) => item.getTitle() === listName)
    .asListItem();

const getMeanAmountNeeded = () =>
  Math.max(
    ...getNeededEquipment().map(
      (equipment) => equipment.needed - (equipment.provided || 0)
    )
  );

const setMaxAmountToAmountList = () => {
  const listItem = getListItem(AMOUNT_LIST_TITLE);
  listItem.setChoices(
    [...Array(getMeanAmountNeeded()).keys()]
      .map((value) => value + 1)
      .map((amount) => listItem.createChoice(amount.toString()))
  );
};
