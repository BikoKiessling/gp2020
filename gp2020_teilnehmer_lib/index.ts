const PARTICIPANT_SPREADHSEET_ID =
  "1I-Vuv7KM4FhRSB7gVFSyYgeoDOgiQW-1idDK40k-Rro";

const ss = SpreadsheetApp.open(
  DriveApp.getFileById(PARTICIPANT_SPREADHSEET_ID)
);

const PARTICIPANTS_SHEET_NAME = "Teilnehmer";
const PARTICPANTIS_SHEET_NICKNAME_DATARANGE = `B2:B`;
const PARTICPANTIS_SHEET_NAME_DATARANGE = `A2:A`;
const participantsSheet = ss.getSheetByName(PARTICIPANTS_SHEET_NAME);

const getNicknames = (): string[] =>
  participantsSheet
    .getRange(PARTICPANTIS_SHEET_NICKNAME_DATARANGE)
    .getValues()
    .map(([nickname]) => nickname)
    .filter((nickname) => nickname);

const getNames = (): string[] =>
  participantsSheet
    .getRange(PARTICPANTIS_SHEET_NAME_DATARANGE)
    .getValues()
    .map(([name]) => name)
    .filter((name) => name);
