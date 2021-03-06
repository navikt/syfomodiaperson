import {
  validerBegrunnelser,
  validerInnkallingFritekster,
  validerReferatTekster,
} from "../../src/utils/valideringUtils";
import { MAX_LENGTH_INNKALLING_FRITEKST } from "../../src/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { expect } from "chai";
import { MAX_LENGTH_AVLYS_BEGRUNNELSE } from "../../src/components/dialogmote/avlys/AvlysDialogmoteBegrunnelse";
import { MAX_LENGTH_SITUASJON } from "../../src/components/dialogmote/referat/Situasjon";
import { MAX_LENGTH_KONKLUSJON } from "../../src/components/dialogmote/referat/Konklusjon";
import { MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE } from "../../src/components/dialogmote/referat/ArbeidsgiversOppgave";
import { MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE } from "../../src/components/dialogmote/referat/ArbeidstakersOppgave";
import { MAX_LENGTH_VEILEDERS_OPPGAVE } from "../../src/components/dialogmote/referat/VeiledersOppgave";

const maxMessage = (max: number) => `Maks ${max} tegn tillatt`;
const getTooLongText = (max: number) => "t".repeat(max + 1);

describe("valideringUtils", () => {
  it("validerer maks lengde på fritekster til innkalling", () => {
    const tooLongFritekst = getTooLongText(MAX_LENGTH_INNKALLING_FRITEKST);
    const feil = validerInnkallingFritekster({
      fritekstArbeidsgiver: tooLongFritekst,
      fritekstArbeidstaker: tooLongFritekst,
    });
    expect(feil).to.deep.equal({
      fritekstArbeidsgiver: maxMessage(MAX_LENGTH_INNKALLING_FRITEKST),
      fritekstArbeidstaker: maxMessage(MAX_LENGTH_INNKALLING_FRITEKST),
    });
  });

  it("validerer maks lengde på begrunnelse for avlysning", () => {
    const tooLongBegrunnelse = getTooLongText(MAX_LENGTH_AVLYS_BEGRUNNELSE);
    const feil = validerBegrunnelser({
      begrunnelseArbeidstaker: tooLongBegrunnelse,
      begrunnelseArbeidsgiver: tooLongBegrunnelse,
    });
    expect(feil).to.deep.equal({
      begrunnelseArbeidstaker: maxMessage(MAX_LENGTH_AVLYS_BEGRUNNELSE),
      begrunnelseArbeidsgiver: maxMessage(MAX_LENGTH_AVLYS_BEGRUNNELSE),
    });
  });

  it("validerer maks lengde på fritekster i referat", () => {
    const feil = validerReferatTekster({
      situasjon: getTooLongText(MAX_LENGTH_SITUASJON),
      konklusjon: getTooLongText(MAX_LENGTH_KONKLUSJON),
      arbeidsgiversOppgave: getTooLongText(MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE),
      arbeidstakersOppgave: getTooLongText(MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE),
      veiledersOppgave: getTooLongText(MAX_LENGTH_VEILEDERS_OPPGAVE),
    });
    expect(feil).to.deep.equal({
      situasjon: maxMessage(MAX_LENGTH_SITUASJON),
      konklusjon: maxMessage(MAX_LENGTH_KONKLUSJON),
      arbeidsgiversOppgave: maxMessage(MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE),
      arbeidstakersOppgave: maxMessage(MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE),
      veiledersOppgave: maxMessage(MAX_LENGTH_VEILEDERS_OPPGAVE),
    });
  });
});
