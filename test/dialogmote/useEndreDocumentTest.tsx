import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import dayjs from "dayjs";
import { useEndreDocument } from "@/hooks/dialogmote/document/useEndreDocument";
import { Malform, MalformContext } from "@/context/malform/MalformContext";
import {
  getCommonTexts,
  getEndreTexts,
} from "@/sider/dialogmoter/hooks/dialogmoteTexts";
import { EndreSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import { queryClientWithMockData } from "../testQueryClient";
import { behandler, dialogmote, dialogmoteMedBehandler } from "./testData";

interface Props {
  children: ReactNode;
}

describe.each([Malform.BOKMAL, Malform.NYNORSK])(
  "useEndreDocument (%s)",
  (malform) => {
    let queryClient: QueryClient;
    const texts = getEndreTexts(malform);
    const commonTexts = getCommonTexts(malform);
    const tidspunktParagraph = texts.endretTidspunkt.replace(
      "{tidspunkt}",
      tilDatoMedManedNavnOgKlokkeslettWithComma(dialogmote.tid),
    );
    const wrapper = ({ children }: Props) => (
      <QueryClientProvider client={queryClient}>
        <MalformContext.Provider value={{ malform, setMalform: () => void 0 }}>
          {children}
        </MalformContext.Provider>
      </QueryClientProvider>
    );

    beforeEach(() => {
      queryClient = queryClientWithMockData();
    });

    describe.each([
      {
        change: "neither date nor time",
        dato: "2021-05-10",
        klokkeslett: "09:00",
        hasEndretTidspunkt: false,
      },
      {
        change: "date only",
        dato: "2021-05-11",
        klokkeslett: "09:00",
        hasEndretTidspunkt: true,
      },
      {
        change: "time only",
        dato: "2021-05-10",
        klokkeslett: "10:00",
        hasEndretTidspunkt: true,
      },
      {
        change: "date and time",
        dato: "2021-05-11",
        klokkeslett: "10:00",
        hasEndretTidspunkt: true,
      },
    ])("$change changed", ({ dato, klokkeslett, hasEndretTidspunkt }) => {
      it.each([
        { hasNyBehandler: false, hasEndretSted: false },
        { hasNyBehandler: false, hasEndretSted: true },
        { hasNyBehandler: true, hasEndretSted: false },
        { hasNyBehandler: true, hasEndretSted: true },
      ])(
        "describes changes with new behandler: $hasNyBehandler, changed location: $hasEndretSted",
        ({ hasNyBehandler, hasEndretSted }) => {
          const { result } = renderHook(() => useEndreDocument(dialogmote), {
            wrapper,
          });
          const values: Partial<EndreSkjemaValues> = {
            dato,
            klokkeslett,
            sted: hasEndretSted ? "Nytt motested" : dialogmote.sted,
            nyBehandler: hasNyBehandler ? behandler : undefined,
          };

          const documents = [
            result.current.getEndreDocumentArbeidstaker(values),
            result.current.getEndreDocumentArbeidsgiver(values),
          ];

          documents.forEach((document) => {
            const paragraphs = document.flatMap((component) => component.texts);
            expect(paragraphs).toContain(texts.intro);
            expect(paragraphs.includes(tidspunktParagraph)).toBe(
              hasEndretTidspunkt,
            );
            expect(paragraphs.join(" ")).not.toContain("{tidspunkt}");
            expect(paragraphs.includes(texts.lagtTilBehandler)).toBe(
              hasNyBehandler,
            );
            const introIndex = document.findIndex(
              (component) => component.texts[0] === texts.intro,
            );
            const moteTidIndex = document.findIndex(
              (component) => component.title === commonTexts.moteTidTitle,
            );
            expect(
              document
                .slice(introIndex, moteTidIndex)
                .flatMap((component) => component.texts),
            ).toEqual([
              texts.intro,
              ...(hasEndretTidspunkt ? [tidspunktParagraph] : []),
              ...(hasEndretSted ? [texts.endretSted] : []),
              ...(hasNyBehandler ? [texts.lagtTilBehandler] : []),
            ]);
            expect(document).toContainEqual(
              expect.objectContaining({
                title: commonTexts.moteTidTitle,
                texts: [
                  tilDatoMedUkedagOgManedNavnOgKlokkeslett(
                    `${dato}T${klokkeslett}:00`,
                    malform,
                  ),
                ],
              }),
            );
            expect(paragraphs).toContain(values.sted);
          });
        },
      );

      it.each([false, true])(
        "describes changes for an existing behandler, changed location: %s",
        (hasEndretSted) => {
          const { result } = renderHook(
            () => useEndreDocument(dialogmoteMedBehandler),
            { wrapper },
          );
          const values: Partial<EndreSkjemaValues> = {
            dato,
            klokkeslett,
            sted: hasEndretSted ? "Nytt motested" : dialogmoteMedBehandler.sted,
            behandler: dialogmoteMedBehandler.behandler,
          };

          const documents = [
            result.current.getEndreDocumentArbeidstaker(values),
            result.current.getEndreDocumentArbeidsgiver(values),
            result.current.getEndreDocumentBehandler(values),
          ];

          documents.forEach((document) => {
            const paragraphs = document.flatMap((component) => component.texts);
            expect(paragraphs.includes(tidspunktParagraph)).toBe(
              hasEndretTidspunkt,
            );
            expect(paragraphs).not.toContain(texts.lagtTilBehandler);
            expect(paragraphs.includes(texts.endretSted)).toBe(hasEndretSted);
          });
        },
      );
    });

    it("does not describe a location change when only the video link changes", () => {
      const { result } = renderHook(
        () => useEndreDocument(dialogmoteMedBehandler),
        { wrapper },
      );
      const values: Partial<EndreSkjemaValues> = {
        dato: dayjs(dialogmoteMedBehandler.tid).format("YYYY-MM-DD"),
        klokkeslett: dayjs(dialogmoteMedBehandler.tid).format("HH:mm"),
        sted: dialogmoteMedBehandler.sted,
        videoLink: "https://video.nav.no/ny-lenke",
      };

      const documents = [
        result.current.getEndreDocumentArbeidstaker(values),
        result.current.getEndreDocumentArbeidsgiver(values),
        result.current.getEndreDocumentBehandler(values),
      ];

      documents.forEach((document) => {
        const paragraphs = document.flatMap((component) => component.texts);
        expect(paragraphs).not.toContain(texts.endretSted);
        expect(paragraphs).not.toContain(tidspunktParagraph);
        expect(paragraphs).toContain(values.videoLink);
      });
    });

    it("compares the date and time in the same local format as the form", () => {
      const mote = { ...dialogmote, tid: "2026-10-29T08:30:45.000Z" };
      const { result } = renderHook(() => useEndreDocument(mote), { wrapper });

      const document = result.current.getEndreDocumentArbeidstaker({
        dato: dayjs(mote.tid).format("YYYY-MM-DD"),
        klokkeslett: dayjs(mote.tid).format("HH:mm"),
      });

      expect(document.flatMap((component) => component.texts)).not.toContain(
        texts.endretTidspunkt.replace(
          "{tidspunkt}",
          tilDatoMedManedNavnOgKlokkeslettWithComma(mote.tid),
        ),
      );
    });
  },
);
