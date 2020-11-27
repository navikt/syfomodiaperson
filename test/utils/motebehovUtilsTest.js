import { expect } from "chai";
import {
  erMotebehovBehandlet,
  erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker,
  erOppfolgingstilfelleSluttDatoPassert,
  finnArbeidstakerMotebehovSvar,
  finnNyesteMotebehovsvarFraHverDeltaker,
  harArbeidstakerSvartPaaMotebehov,
} from "../../src/utils/motebehovUtils";
import { ANTALL_MS_DAG } from "../../src/utils/datoUtils";

describe("motebehovUtils", () => {
  describe("finnNyesteMotebehovsvarFraHverDeltaker", () => {
    it("Skal gi en liste med det nyeste møtebehovsvaret fra hver person, fra en liste med møtebehov sortert på dato", () => {
      const dato1 = "2019-01-02T13:53:57.047+01:00";
      const dato2 = "2019-01-155T13:53:57.047+01:00";
      const dato3 = "2019-02-07T13:53:57.047+01:00";
      const motebehovData = [
        {
          aktorId: "1",
          opprettetAv: "1",
          opprettetDato: dato2,
        },
        {
          aktorId: "1",
          opprettetAv: "1",
          opprettetDato: dato3,
        },
        {
          aktorId: "1",
          opprettetAv: "2",
          opprettetDato: dato1,
        },
        {
          aktorId: "1",
          opprettetAv: "2",
          opprettetDato: dato2,
        },
      ];

      const filtrertMotebehov = finnNyesteMotebehovsvarFraHverDeltaker(
        motebehovData
      );

      expect(filtrertMotebehov.length).to.equal(2);
      expect(filtrertMotebehov[0].opprettetDato).to.equal(dato2);
      expect(filtrertMotebehov[1].opprettetDato).to.equal(dato1);
    });
  });
  describe("finnArbeidstakerMotebehovSvar", () => {
    it("skal returnere møtebehovsvaret sendt inn av arbeidstakeren", () => {
      const arbeidstakerAktorId = "1";
      const leder1AktorId = "9";
      const leder2AktorId = "8";
      const leder3AktorId = "7";

      const motebehovData = [
        {
          aktorId: "1",
          opprettetAv: leder1AktorId,
        },
        {
          aktorId: "1",
          opprettetAv: leder2AktorId,
        },
        {
          aktorId: "1",
          opprettetAv: arbeidstakerAktorId,
        },
        {
          aktorId: "1",
          opprettetAv: leder3AktorId,
        },
      ];

      const arbeidstakersMotebehov = finnArbeidstakerMotebehovSvar(
        motebehovData
      );

      expect(arbeidstakersMotebehov.opprettetAv).to.equal(arbeidstakerAktorId);
    });
  });
  describe("erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker", () => {
    it("skal gi true hvis startdatoen på oppfølgingstilfellet er mellom 16 og 26 uker siden", () => {
      const attenUkerMs = ANTALL_MS_DAG * 7 * 18;
      const startOppfolgingsdato = new Date(Date.now() - attenUkerMs);

      const erStartDatoMellom16Og26UkerGammel = erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker(
        startOppfolgingsdato
      );

      expect(erStartDatoMellom16Og26UkerGammel).to.equal(true);
    });
    it("skal gi false hvis startdatoen på oppfølgingstilfellet er mindre enn 16 uker siden", () => {
      const tiUkerMs = ANTALL_MS_DAG * 7 * 10;
      const startOppfolgingsdato = new Date(Date.now() - tiUkerMs);

      const erStartDatoMellom16Og26UkerGammel = erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker(
        startOppfolgingsdato
      );

      expect(erStartDatoMellom16Og26UkerGammel).to.equal(false);
    });
    it("skal gi false hvis startdatoen på oppfølgingstilfellet er mer enn 26 uker siden", () => {
      const trettiUkerMs = ANTALL_MS_DAG * 7 * 30;
      const startOppfolgingsdato = new Date(Date.now() - trettiUkerMs);

      const erStartDatoMellom16Og26UkerGammel = erOppfoelgingsdatoPassertMed16UkerOgIkke26Uker(
        startOppfolgingsdato
      );

      expect(erStartDatoMellom16Og26UkerGammel).to.equal(false);
    });
  });
  describe("erOppfolgingstilfelleSluttDatoPassert", () => {
    it("skal returnere false, dersom sluttdatoen på oppfolgingstilfellet er etter i dag", () => {
      const toDagerMs = ANTALL_MS_DAG * 2;
      const sluttDato = new Date(Date.now() + toDagerMs);

      const erSluttDatoPassert = erOppfolgingstilfelleSluttDatoPassert(
        sluttDato
      );

      expect(erSluttDatoPassert).to.equal(false);
    });
    it("skal returnere false, dersom sluttdatoen på oppfolgingstilfellet i dag", () => {
      const sluttDato = new Date(Date.now());

      const erSluttDatoPassert = erOppfolgingstilfelleSluttDatoPassert(
        sluttDato
      );

      expect(erSluttDatoPassert).to.equal(false);
    });
    it("skal returnere true, dersom sluttdatoen på oppfolgingstilfellet var før i dag", () => {
      const enUkeMs = ANTALL_MS_DAG * 7;
      const sluttDato = new Date(Date.now() - enUkeMs);

      const erSluttDatoPassert = erOppfolgingstilfelleSluttDatoPassert(
        sluttDato
      );

      expect(erSluttDatoPassert).to.equal(true);
    });
  });
  describe("harArbeidstakerSvartPaaMotebehov", () => {
    it("Skal gi true hvis arbeidstaker har sendt inn møtebehovsvar", () => {
      const arbeidstakerAktorId = "1";
      const leder1AktorId = "9";
      const leder3AktorId = "7";

      const motebehovData = [
        {
          aktorId: "1",
          opprettetAv: leder1AktorId,
        },
        {
          aktorId: "1",
          opprettetAv: arbeidstakerAktorId,
        },
        {
          aktorId: "1",
          opprettetAv: leder3AktorId,
        },
      ];

      const harArbeidstakerSvart = harArbeidstakerSvartPaaMotebehov(
        motebehovData
      );

      expect(harArbeidstakerSvart).to.equal(true);
    });
    it("Skal gi false hvis arbeidstaker ikke har sendt inn møtebehovsvar", () => {
      const arbeidstakerAktorId = "1";
      const leder1AktorId = "9";
      const leder3AktorId = "7";

      const motebehovData = [
        {
          aktorId: "1",
          opprettetAv: leder1AktorId,
        },
        {
          aktorId: "1",
          opprettetAv: leder3AktorId,
        },
      ];

      const harArbeidstakerSvart = harArbeidstakerSvartPaaMotebehov(
        motebehovData
      );

      expect(harArbeidstakerSvart).to.equal(false);
    });
  });

  describe("erMotebehovBehandlet", () => {
    const motebehovMedBehovBehandlet = {
      motebehovSvar: {
        harMotebehov: true,
      },
      behandletTidspunkt: new Date(),
      behandletVeilederIdent: "Z990000",
    };
    const motebehovMedBehovUbehandlet = {
      motebehovSvar: {
        harMotebehov: true,
      },
      behandletTidspunkt: null,
      behandletVeilederIdent: null,
    };
    const motebehovUtenBehovUbehandlet = {
      motebehovSvar: {
        harMotebehov: false,
      },
      behandletTidspunkt: null,
      behandletVeilederIdent: null,
    };

    describe("med motebehovsvar", () => {
      it("er true, med 1 behandlet svar med behov", () => {
        const exp = erMotebehovBehandlet([motebehovMedBehovBehandlet]);
        expect(exp).to.equal(true);
      });

      it("er false, med 1 ubehandlet svar med behov", () => {
        const exp = erMotebehovBehandlet([motebehovMedBehovUbehandlet]);
        expect(exp).to.equal(false);
      });

      it("er true, med 1 ubehandlet svar uten behov", () => {
        const exp = erMotebehovBehandlet([motebehovUtenBehovUbehandlet]);
        expect(exp).to.equal(true);
      });

      it("er false, med 1 behandlet svar med behov, 1 ubehandlet svar med behov", () => {
        const exp = erMotebehovBehandlet([
          motebehovMedBehovBehandlet,
          motebehovMedBehovUbehandlet,
        ]);
        expect(exp).to.equal(false);
      });

      it("er false, med 1 ubehandlet svar med behov og 1 ubehandlet svar uten behov", () => {
        const exp = erMotebehovBehandlet([
          motebehovMedBehovUbehandlet,
          motebehovUtenBehovUbehandlet,
        ]);
        expect(exp).to.equal(false);
      });

      it("er true, med 1 behandlet svar med behov og 1 ubehandlet svar uten behov", () => {
        const exp = erMotebehovBehandlet([
          motebehovMedBehovBehandlet,
          motebehovUtenBehovUbehandlet,
        ]);
        expect(exp).to.equal(true);
      });

      it("er false, med 1 behandlet svar med behov, 1 ubehandlet svar med behov, 1 ubehandlet svar uten behov", () => {
        const exp = erMotebehovBehandlet([
          motebehovMedBehovBehandlet,
          motebehovMedBehovUbehandlet,
          motebehovUtenBehovUbehandlet,
        ]);
        expect(exp).to.equal(false);
      });
    });

    describe("uten motebehov", () => {
      it("er true, om det er ingen motebehov", () => {
        const exp = erMotebehovBehandlet([]);
        expect(exp).to.equal(true);
      });
    });
  });
});
