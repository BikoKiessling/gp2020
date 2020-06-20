import * as gp2020updateparticipantlistlib from '../gp2020_update-participant-list_lib';
import * as gp2020answerformatterlib from "../gp2020_answer-formatter-lib";

enum CAMPING_SELECTION {
  TENT = "Habe ein Zelt",
  PLACE = "Brauche einen Zelt Schlafplatz",
  HOUSE = "Schlafe im Haus (Rücksprache Biko)",
  ETC = "Sonstiges (Hängematte (Rücksprache), Freiluft, Auto, etc.)",
}

class answer {
  nickname: string;
  type: CAMPING_SELECTION;
  places?: number;
}

class formattedAnswer{
  nickname: string;
  type: string;
  places?: number;
}


const ss = SpreadsheetApp.open(
  DriveApp.getFileById("1JdP2tqC3TSpuZJ1gsEftjfgV00a1iU6Y1AZHTsnEjAc")
);

const form = FormApp.openByUrl(ss.getFormUrl());

const CAMPING_SHEET_NAME = "camping";
const CAMPING_SHEET_DATARANGE = "A2:C";
const campingSheet = ss.getSheetByName(CAMPING_SHEET_NAME);

const ANSWERS_SHEET_NAME = "form";
const ANSWERS_SHEET_DATARANGE = "B2:D";
const answersSheet = ss.getSheetByName(ANSWERS_SHEET_NAME);


const toFormattedAnswer = ([nickname, type, places]): formattedAnswer => {
  const keys = Object.keys(CAMPING_SELECTION);
  return {
    nickname,
    type: keys.some(key => key === type) ? type : keys.find(key => CAMPING_SELECTION[key] === type ),
    places,
  }

};

const globalConfig = {toFormattedAnswer,answerSheetDataRange: ANSWERS_SHEET_DATARANGE, targetSheetDataRange: CAMPING_SHEET_DATARANGE,filterUndefinedByProperty: "type", identifyingProperty: "nickname", insertRowPolicy: {type: 'next'}, nrOfAnswerProperties: 3};

const onFormSubmit = (e) => {
  const formatAnswer = new gp2020answerformatterlib.FormatAnswer(answersSheet,campingSheet,globalConfig);
  formatAnswer.writeFormattedAnswerToSheet();
  updateParticipantList();
};

const updateParticipantList = () =>{
  const formatAnswer = new gp2020answerformatterlib.FormatAnswer(answersSheet,campingSheet,globalConfig);
  gp2020updateparticipantlistlib.updateParticipantItemListOfForm({form,options: {alreadyAnsweredParticipants: {alreadyAnsweredParticipants: formatAnswer.getAnsweredParticipantsByIdentifyingProperty(), identifyingProperty: 'nickname'},onlyOneAnswerPerParticipantPolicy: true,}});
}

