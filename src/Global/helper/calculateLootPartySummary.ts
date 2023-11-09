import moment from "moment";
import { MemberType } from "../../PartyTimeTracker";
import calculateLootPartyPercentage from "./calculateLootPartyPercentage";

const calculateLootPartySummary = (memberList: MemberType[]) => {
  let temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
  temp = temp.map((v) => {
    let calculatedTimePlayed = 0;
    if (!v.statusLog) return v;
    for (let i = 0; i < v.statusLog?.length; i++) {
      if (v.statusLog[i].status === "Active") {
        const prevStatusLogTime = v.statusLog[i].time;
        const nextStatusLogTime = v.statusLog[i + 1]
          ? v.statusLog[i + 1].time
          : moment().toISOString();
        calculatedTimePlayed += moment(nextStatusLogTime).diff(
          moment(prevStatusLogTime),
          "second"
        );
      }
    }
    return Object.assign(v, { timePlayed: calculatedTimePlayed });
  });
  temp = calculateLootPartyPercentage(temp);
  return temp;
};

export default calculateLootPartySummary;
