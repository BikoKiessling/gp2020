const initZelten = () => {
  const form = FormApp.getActiveForm();

  GP2020TeilnehmerSheet.deleteParticipantItemListFomForm(form);
  GP2020TeilnehmerSheet.addParticipantItemListToForm(form);
};
