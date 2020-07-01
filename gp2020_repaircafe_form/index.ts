const REPAIRCAFE_SPREADSHEET_ID =
  "1N7PY1rRe-1OcK1AaDLfgctrZqW2OsoaRxOqoziONOPw";
const ss = SpreadsheetApp.open(DriveApp.getFileById(REPAIRCAFE_SPREADSHEET_ID));

const form = FormApp.openByUrl(ss.getFormUrl());

const updateParticipantList = () => {
  gp2020updateparticipantlistlib.updateParticipantItemListOfForm({
    form,
    options: {
      alreadyAnsweredParticipants: {
        identifyingProperty: "nickname",
        alreadyAnsweredParticipants: null,
      },
      onlyOneAnswerPerParticipantPolicy: false,
    },
  });
};
