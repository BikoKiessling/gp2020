import Form = GoogleAppsScript.Forms.Form;
import ListItem = GoogleAppsScript.Forms.ListItem;
import Item = GoogleAppsScript.Forms.Item;
import * as gp2020teilnehmerlib from "../gp2020_teilnehmer_lib";

class UpdateParticipantListOptions {
  onlyOneAnswerPerParticipantPolicy: boolean;
  alreadyAnsweredParticipants: string[];
}
class ObservingForm {
  form: Form;
  options: UpdateParticipantListOptions;
}

const observingForms: ObservingForm[] = [];
const ITEM_TITLE = "Wer bist du?";

const onParticipantListChanged = () => {
  observingForms.forEach(updateParticipantItemListOfForm);
};

const updateParticipantItemListOfForm = (observingForm: ObservingForm) => {
  const listItem = getParticipantListItem(observingForm.form);

  listItem.setRequired(true);
  listItem.setChoices(
    gp2020teilnehmerlib
      .getNicknames()
      .filter((currentNickname) =>
        observingForm.options.onlyOneAnswerPerParticipantPolicy
          ? participantHasNotYetSubmitted(
              currentNickname,
              observingForm.options.alreadyAnsweredParticipants
            )
          : true
      )
      .map((nickname) => listItem.createChoice(nickname))
  );
};

const participantHasNotYetSubmitted = (
  nickname: string,
  alreadyAnsweredParticipants: string[]
) =>
  !alreadyAnsweredParticipants.some(
    (currentNickname) => currentNickname === nickname
  );

const getParticipantListItem = (form: Form): ListItem =>
  form
    .getItems()
    .find((item: Item) => item.getTitle() === ITEM_TITLE)
    .asListItem();
