import Form = GoogleAppsScript.Forms.Form;
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;
import Item = GoogleAppsScript.Forms.Item;

const ITEM_TITLE = "Wer bist du?";

const getParticipants = (sheet: Sheet): any[] =>
  sheet
    .getRange("A2:A")
    .getValues()
    .filter(([name]) => name);

const addParticipantItemListToForm = (form: Form) => {
  const ss = SpreadsheetApp.open(
    DriveApp.getFileById("1I-Vuv7KM4FhRSB7gVFSyYgeoDOgiQW-1idDK40k-Rro")
  );
  const sheet = ss.getSheetByName("Teilnehmer");
  const listItem = form.addListItem();

  listItem.setRequired(true);
  listItem.setTitle(ITEM_TITLE);
  form.moveItem(3, 0);
  listItem.setChoices(
    getParticipants(sheet).map((thing) => listItem.createChoice(thing))
  );
};

const deleteParticipantItemListFomForm = (form: Form) => {
  const participantItemListIndex = form
    .getItems()
    .findIndex((item: Item) => item.getTitle() === ITEM_TITLE);
  form.deleteItem(participantItemListIndex);
};
