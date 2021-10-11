import nock from "nock";
import { FASTLEGEREST_ROOT } from "@/apiConstants";
import { fastlegerMock } from "../../mock/fastlegerest/fastlegerMock";

export const stubFastlegerApi = (scope: nock.Scope, fnr: string) => {
  scope
    .get(`${FASTLEGEREST_ROOT}/fastleger?fnr=${fnr}`)
    .reply(200, () => fastlegerMock);
};
