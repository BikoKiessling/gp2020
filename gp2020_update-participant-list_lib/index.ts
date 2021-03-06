import Form = GoogleAppsScript.Forms.Form;
import ListItem = GoogleAppsScript.Forms.ListItem;
import Item = GoogleAppsScript.Forms.Item;
import * as gp2020teilnehmerlib from "../gp2020_teilnehmer_lib";

class alreadyAnsweredParticipants {
  identifyingProperty: string;
  alreadyAnsweredParticipants: string[];
}
class UpdateParticipantListOptions {
  onlyOneAnswerPerParticipantPolicy: boolean;
  alreadyAnsweredParticipants: alreadyAnsweredParticipants;
}
class ObservingForm {
  form: Form;
  options: UpdateParticipantListOptions;
}

const observingForms: ObservingForm[] = [];
const ITEM_TITLE = "Wer bist du?";

const getDataList = (observingForm: ObservingForm) => {
  switch (
    observingForm.options.alreadyAnsweredParticipants.identifyingProperty
  ) {
    case "name":
      return gp2020teilnehmerlib.getNames();
    case "nickname":
      return gp2020teilnehmerlib.getNicknames();
    default:
      throw Error("invalid identifyingProperty");
  }
};
const updateParticipantItemListOfForm = (observingForm: ObservingForm) => {
  const listItem = getParticipantListItem(observingForm.form);

  listItem.setChoices(
    getDataList(observingForm)
      .filter((currentIdentifier) =>
        observingForm.options.onlyOneAnswerPerParticipantPolicy
          ? participantHasNotYetSubmitted(
              currentIdentifier,
              observingForm.options.alreadyAnsweredParticipants
                .alreadyAnsweredParticipants
            )
          : true
      )
      .map((nickname) => listItem.createChoice(nickname))
  );
};

const participantHasNotYetSubmitted = (
  name: string,
  alreadyAnsweredParticipants: string[]
) => !alreadyAnsweredParticipants.some((identifier) => identifier === name);

const getParticipantListItem = (form: Form): ListItem =>
  form
    .getItems()
    .find((item: Item) => item.getTitle() === ITEM_TITLE)
    .asListItem();
