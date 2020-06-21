const IDEAS_SPREADSHEET_ID = "1ZfguCCgmPMxn6s6ROrxbwNetSOG9FZbVcL_spAJXgP8";
const ss = SpreadsheetApp.open(DriveApp.getFileById(IDEAS_SPREADSHEET_ID));

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
