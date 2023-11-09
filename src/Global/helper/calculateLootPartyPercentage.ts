import _ from "lodash";
import { MemberType } from "../../PartyTimeTracker";

const calculateLootPartyPercentage = (memberList: MemberType[]) => {
  let temp: MemberType[] = JSON.parse(JSON.stringify(memberList));
  let totalMemberTimePlayed = 0;
  memberList.map((v) => {
    totalMemberTimePlayed += v.timePlayed;
  });
  temp = temp.map((v, i) => {
    return _.assign(v, {
      no: i + 1,
      splitPercentage: (v.timePlayed / totalMemberTimePlayed) * 100,
    });
  });
  return temp;
};

export default calculateLootPartyPercentage;
