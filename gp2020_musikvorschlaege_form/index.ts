const MUSIKVORSCHLAEGE_SPREADSHEET_ID =
  "1QQVIfQQsX4AvqIpz_7BHsblDrZSUUNRKJIpPf1XX5KI";
const ss = SpreadsheetApp.open(
  DriveApp.getFileById(MUSIKVORSCHLAEGE_SPREADSHEET_ID)
);

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
