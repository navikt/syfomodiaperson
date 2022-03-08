import nock from "nock";
import { FASTLEGEREST_ROOT } from "@/apiConstants";
import { fastlegerMock } from "../../mock/fastlegerest/fastlegerMock";

export const stubFastlegerApi = (scope: nock.Scope) => {
  scope.get(`${FASTLEGEREST_ROOT}/fastleger`).reply(200, () => fastlegerMock);
};
