import {
  harEndringer,
  isAktivtDialogmote,
  isPersonoppgaveCompletedAfterLastMoteEndring,
} from "@/utils/dialogmoteUtils";
import { describe, expect, it } from "vitest";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import dayjs from "dayjs";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { EndreSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";

describe("dialogmoteutils", () => {
  describe("isAktivtDialogmote", () => {
    it("returns true if status is innkalt", () => {
      const dialogmote = {
        status: DialogmoteStatus.INNKALT,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.true;
    });

    it("returns true if status is endring", () => {
      const dialogmote = {
        status: DialogmoteStatus.ENDRET,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.true;
    });

    it("returns false if status is avlyst", () => {
      const dialogmote = {
        status: DialogmoteStatus.AVLYST,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.false;
    });

    it("returns false if status is ferdigstilt", () => {
      const dialogmote = {
        status: DialogmoteStatus.FERDIGSTILT,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.false;
    });

    it("returns false if status is lukket", () => {
      const dialogmote = {
        status: DialogmoteStatus.LUKKET,
      } as DialogmoteDTO;

      const isActive = isAktivtDialogmote(dialogmote);

      expect(isActive).to.be.false;
    });
  });

  describe("isPersonoppgaveCompletedAfterLastMoteEndring", () => {
    const TODAY = new Date();
    const YESTERDAY = dayjs(TODAY).subtract(1, "day").toDate();

    it("returns true if oppgave was behandlet after last varsel to arbeidstaker was created", () => {
      const oppgave = {
        behandletTidspunkt: TODAY,
      } as PersonOppgave;
      const dialogmote = {
        arbeidstaker: {
          varselList: [
            {
              createdAt: YESTERDAY,
            },
          ],
        },
      } as unknown as DialogmoteDTO;

      const isCompletedAfter = isPersonoppgaveCompletedAfterLastMoteEndring(
        oppgave,
        dialogmote,
      );

      expect(isCompletedAfter).to.be.true;
    });

    it("returns false if oppgave was behandlet before last varsel to arbeidstaker was created", () => {
      const oppgave = {
        behandletTidspunkt: YESTERDAY,
      } as PersonOppgave;
      const dialogmote = {
        arbeidstaker: {
          varselList: [
            {
              createdAt: TODAY,
            },
          ],
        },
      } as unknown as DialogmoteDTO;

      const isCompletedAfter = isPersonoppgaveCompletedAfterLastMoteEndring(
        oppgave,
        dialogmote,
      );

      expect(isCompletedAfter).to.be.false;
    });

    it("returns false if oppgave is not behandlet", () => {
      const oppgave = {
        behandletTidspunkt: null,
      } as PersonOppgave;
      const dialogmote = {
        arbeidstaker: {
          varselList: [
            {
              createdAt: TODAY,
            },
          ],
        },
      } as unknown as DialogmoteDTO;

      const isCompletedAfter = isPersonoppgaveCompletedAfterLastMoteEndring(
        oppgave,
        dialogmote,
      );

      expect(isCompletedAfter).to.be.false;
    });

    it("returns false if no varsler is sent to arbeidstaker (no oppgave should actually exist in this state)", () => {
      const oppgave = {
        behandletTidspunkt: TODAY,
      } as PersonOppgave;
      const dialogmote = {
        arbeidstaker: {
          varselList: [],
        },
      } as unknown as DialogmoteDTO;

      const isCompletedAfter = isPersonoppgaveCompletedAfterLastMoteEndring(
        oppgave,
        dialogmote,
      );

      expect(isCompletedAfter).to.be.false;
    });
  });

  describe("harEndringer", () => {
    const dialogmote = {
      tid: "2030-05-10T09:00:00",
      sted: "Nav-kontoret",
      videoLink: "https://video.nav.no/abc",
    } as DialogmoteDTO;
    const uendretValues: EndreSkjemaValues = {
      dato: "2030-05-10",
      klokkeslett: "09:00",
      sted: "Nav-kontoret",
      videoLink: "https://video.nav.no/abc",
      begrunnelseArbeidstaker: "Begrunnelse",
      begrunnelseArbeidsgiver: "Begrunnelse",
    };

    it("returns false when only begrunnelser are filled in", () => {
      expect(harEndringer(dialogmote, uendretValues)).to.be.false;
    });

    it("returns false when videoLink only differs by whitespace", () => {
      const values = {
        ...uendretValues,
        videoLink: "  https://video.nav.no/abc ",
      };

      expect(harEndringer(dialogmote, values)).to.be.false;
    });

    it("treats missing and empty videoLink as equal", () => {
      const dialogmoteUtenVideoLink = { ...dialogmote, videoLink: undefined };
      const values = { ...uendretValues, videoLink: "" };

      expect(harEndringer(dialogmoteUtenVideoLink, values)).to.be.false;
    });

    it("returns true when dato is changed", () => {
      const values = { ...uendretValues, dato: "2030-05-11" };

      expect(harEndringer(dialogmote, values)).to.be.true;
    });

    it("returns true when klokkeslett is changed", () => {
      const values = { ...uendretValues, klokkeslett: "10:00" };

      expect(harEndringer(dialogmote, values)).to.be.true;
    });

    it("returns true when sted is changed", () => {
      const values = { ...uendretValues, sted: "Arbeidsplassen" };

      expect(harEndringer(dialogmote, values)).to.be.true;
    });

    it("returns true when videoLink is changed", () => {
      const values = {
        ...uendretValues,
        videoLink: "https://video.nav.no/xyz",
      };

      expect(harEndringer(dialogmote, values)).to.be.true;
    });

    it("returns true when ny behandler is added", () => {
      const values = { ...uendretValues, nyBehandler: {} as BehandlerDTO };

      expect(harEndringer(dialogmote, values)).to.be.true;
    });
  });
});
