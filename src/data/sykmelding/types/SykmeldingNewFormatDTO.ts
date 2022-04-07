import { BehandlingsutfallDTO } from "./BehandlingsutfallDTO";
import { ArbeidsgiverDTO } from "./ArbeidsgiverDTO";
import { SykmeldingsperiodeDTO } from "./SykmeldingsperiodeDTO";
import { SykmeldingStatusDTO } from "./SykmeldingStatusDTO";
import { MedisinskVurderingDTO } from "./MedisinskVurderingDTO";
import { PrognoseDTO } from "./PrognoseDTO";
import { SporsmalSvarDTO } from "./SporsmalSvarDTO";
import { MeldingTilNavDTO } from "./MeldingTilNavDTO";
import { KontaktMedPasientDTO } from "./KontaktMedPasientDTO";
import { SykmeldingBehandlerDTO } from "./SykmeldingBehandlerDTO";
import { MerknadDTO } from "./MerknadDTO";

export interface SykmeldingNewFormatDTO {
  readonly id: string;
  readonly mottattTidspunkt: string;
  readonly behandlingsutfall: BehandlingsutfallDTO;
  readonly legekontorOrgnummer?: string;
  readonly arbeidsgiver?: ArbeidsgiverDTO;
  readonly sykmeldingsperioder: SykmeldingsperiodeDTO[];
  readonly sykmeldingStatus: SykmeldingStatusDTO;
  readonly medisinskVurdering?: MedisinskVurderingDTO;
  readonly skjermesForPasient: boolean;
  readonly prognose?: PrognoseDTO;
  readonly utdypendeOpplysninger: Map<string, Map<string, SporsmalSvarDTO>>;
  readonly tiltakArbeidsplassen?: string;
  readonly tiltakNAV?: string;
  readonly andreTiltak?: string;
  readonly meldingTilNAV?: MeldingTilNavDTO;
  readonly meldingTilArbeidsgiver?: string;
  readonly kontaktMedPasient: KontaktMedPasientDTO;
  readonly behandletTidspunkt: string;
  readonly behandler: SykmeldingBehandlerDTO;
  readonly syketilfelleStartDato?: string;
  readonly navnFastlege?: string;
  readonly egenmeldt?: boolean;
  readonly papirsykmelding?: boolean;
  readonly harRedusertArbeidsgiverperiode?: boolean;
  readonly merknader?: MerknadDTO[];
}
