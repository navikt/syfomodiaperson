import mockEreg from "@/mocks/ereg/mockEreg";
import { mockSykepengedagerInformasjon } from "@/mocks/sykepengerdager-informasjon/mockSykepengedagerInformasjon";
import { mockFastlegerest } from "@/mocks/fastlegerest/mockFastlegerest";
import { mockFlexjar } from "@/mocks/flexjar/mockFlexjar";
import { mockVeilarboppfolging } from "@/mocks/veilarboppfolging/mockVeilarboppfolging";
import { mockIsaktivitetskrav } from "@/mocks/isaktivitetskrav/mockIsaktivitetskrav";
import { mockIsarbeidsuforhet } from "@/mocks/isarbeidsuforhet/mockIsarbeidsuforhet";
import { mockIsbehandlerdialog } from "@/mocks/isbehandlerdialog/mockIsbehandlerdialog";
import { mockUnleashEndpoint } from "@/mocks/unleashMocks";
import { mockIsdialogmelding } from "@/mocks/isdialogmelding/mockIsdialogmelding";
import { mockIsdialogmote } from "@/mocks/isdialogmote/mockIsdialogmote";
import { mockIsdialogmotekandidat } from "@/mocks/isdialogmotekandidat/mockIsdialogmotekandidat";
import { mockIsfrisktilarbeid } from "@/mocks/isfrisktilarbeid/mockIsfrisktilarbeid";
import { mockIsmanglendemedvirkning } from "@/mocks/ismanglendemedvirkning/mockIsmanglendemedvirkning";
import { mockIsmeroppfolging } from "@/mocks/ismeroppfolging/mockIsmeroppfolging";
import { mockIsnarmesteleder } from "@/mocks/isnarmesteleder/mockIsnarmesteleder";
import { mockIsoppfolgingstilfelle } from "@/mocks/isoppfolgingstilfelle/mockIsoppfolgingstilfelle";
import { mockIspengestopp } from "@/mocks/ispengestopp/mockIspengestopp";
import { mockSykepengesoknadBackend } from "@/mocks/sykepengesoknad/mockSykepengesoknadBackend";
import { mockSyfoveileder } from "@/mocks/syfoveileder/mockSyfoveileder";
import { mockSyfosmregister } from "@/mocks/syfosmregister/mockSyfosmregister";
import { mockSyfooppfolgingsplanservice } from "@/mocks/syfooppfolgingsplanservice/mockSyfooppfolgingsplanservice";
import { mockIspersonoppgave } from "@/mocks/ispersonoppgave/mockIspersonoppgave";
import { mockIstilgangskontroll } from "@/mocks/istilgangskontroll/mockIstilgangskontroll";
import { mockLpsOppfolgingsplanerMottak } from "@/mocks/lpsoppfolgingsplanmottak/mockLpsOppfolgingsplanMottak";
import { mockMerOppfolging } from "@/mocks/meroppfolging-backend/merOppfolgingMock";
import { mockModiacontextholder } from "@/mocks/modiacontextholder/mockModiacontextholder";
import { mockSyfoperson } from "@/mocks/syfoperson/mockSyfoperson";
import { mockSyfooversiktsrv } from "@/mocks/syfooversiktsrv/mockSyfooversiktsrv";
import { mockSyfomotebehov } from "@/mocks/syfomotebehov/mockSyfomotebehov";
import { mockSyfobehandlendeenhet } from "@/mocks/syfobehandlendeenhet/mockSyfobehandlendeenhet";
import { mockIshuskelapp } from "@/mocks/oppfolgingsoppgave/mockOppfolgingsoppgave";
import { http, HttpResponse } from "msw";

const handlers = [
  http.post("https://amplitude.nav.no/collect", () => {
    return HttpResponse.text("mocked amplitude");
  }),
  mockUnleashEndpoint,
  mockEreg,
  mockSykepengedagerInformasjon,
  mockFastlegerest,
  mockFlexjar,
  ...mockIsaktivitetskrav,
  ...mockIsarbeidsuforhet,
  ...mockIsbehandlerdialog,
  ...mockIsdialogmelding,
  ...mockIsdialogmote,
  ...mockIsdialogmotekandidat,
  ...mockIsfrisktilarbeid,
  ...mockIsmanglendemedvirkning,
  ...mockIsmeroppfolging,
  mockIsnarmesteleder,
  mockIsoppfolgingstilfelle,
  ...mockIspengestopp,
  ...mockIspersonoppgave,
  mockIstilgangskontroll,
  ...mockSyfooppfolgingsplanservice,
  ...mockLpsOppfolgingsplanerMottak,
  mockMerOppfolging,
  ...mockModiacontextholder,
  ...mockSyfoperson,
  ...mockSyfooversiktsrv,
  ...mockSyfomotebehov,
  ...mockSyfobehandlendeenhet,
  ...mockIshuskelapp,
  mockSyfosmregister,
  ...mockSyfoveileder,
  mockSykepengesoknadBackend,
  mockVeilarboppfolging,
];

export default handlers;
