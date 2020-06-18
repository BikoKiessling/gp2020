import ListItem = GoogleAppsScript.Forms.ListItem;
import Item = GoogleAppsScript.Forms.Item;

class answer {
  nickname: string;
  title: string;
  description: string;
  maxParticipants: number;
  duration: number;
  startDateTime: Date;
  places?: number;
}

const ITEM_TITLE = "Wer bist du?";

const WORKSHOP_SPREADSHEET_ID = "1Yx_IHiQcnbkuFD6tu1WtXi5EqsaDtjzjlxIqzYodgYs";
const ss = SpreadsheetApp.open(DriveApp.getFileById(WORKSHOP_SPREADSHEET_ID));

const form = FormApp.openByUrl(ss.getFormUrl());

const ANSWERS_SHEET_NAME = "form";
const ANSWERS_SHEET_DATARANGE = "B2:D";
const answersSheet = ss.getSheetByName(ANSWERS_SHEET_NAME);

const onFormSubmit = (e) => {
  updateParticipantItemListFromForm();
};

//participant list has to be created manually before with name of const ITEM_TITLE and type dropdown
const updateParticipantItemListFromForm = () => {
  const listItem = getParticipantListItem();

  listItem.setRequired(true);
  const nicknames = gp2020teilnehmerlib.getNicknames() as string[];
  listItem.setChoices(
    nicknames.map((nickname) => listItem.createChoice(nickname))
  );
};

const getParticipantListItem = (): ListItem =>
  form
    .getItems()
    .find((item: Item) => item.getTitle() === ITEM_TITLE)
    .asListItem();
