const FEEDBACK_SPREADSHEET_ID = "1n7zSB7ju0xVfwMEZoOBaagblWKRcbprywrtF8-FlW_k";
const ss = SpreadsheetApp.open(DriveApp.getFileById(FEEDBACK_SPREADSHEET_ID));

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
