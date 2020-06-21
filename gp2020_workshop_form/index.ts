const WORKSHOP_SPREADSHEET_ID = "1Yx_IHiQcnbkuFD6tu1WtXi5EqsaDtjzjlxIqzYodgYs";
const ss = SpreadsheetApp.open(DriveApp.getFileById(WORKSHOP_SPREADSHEET_ID));

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
