import Form = GoogleAppsScript.Forms.Form;
import ListItem = GoogleAppsScript.Forms.ListItem;
import Item = GoogleAppsScript.Forms.Item;

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

const onParticipantsListChanged = () => {
  observingForms.forEach(updateParticipantItemListOfForm);
};

const notifyOnParticipantListChanged = (
  form: Form,
  options: UpdateParticipantListOptions
) => {
  observingForms.push({ form, options });
};

const participantHasNotYetSubmitted = (
  nickname: string,
  alreadyAnsweredParticipants: string[]
) =>
  !alreadyAnsweredParticipants.some(
    (currentNickname) => currentNickname === nickname
  );

const updateParticipantItemListOfForm = (observingForm: ObservingForm) => {
  const listItem = getParticipantListItem(observingForm.form);

  listItem.setRequired(true);
  const nicknames = gp2020teilnehmerlib.getNicknames() as string[];
  listItem.setChoices(
    nicknames
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

const getParticipantListItem = (form: Form): ListItem =>
  form
    .getItems()
    .find((item: Item) => item.getTitle() === ITEM_TITLE)
    .asListItem();
