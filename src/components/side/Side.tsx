import React, { ReactNode, useEffect } from "react";
import Personkort from "../personkort/Personkort";
import DocumentTitle from "react-document-title";
import GlobalNavigasjon from "@/components/globalnavigasjon/GlobalNavigasjon";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { isEaster, isPride } from "@/utils/festiveUtils";
import { Easter } from "@/components/festive/Easter";
import * as Amplitude from "@/utils/amplitude";
import * as Umami from "@/utils/umami";
import { EventType } from "@/utils/amplitude";
import { OversiktLenker } from "@/components/personkort/OversiktLenker";
import { Pride } from "@/components/festive/Pride";
import Oppfolgingsoppgave from "@/components/oppfolgingsoppgave/Oppfolgingsoppgave";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import TildeltVeileder from "@/components/side/tildeltveileder/TildeltVeileder";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { InaktivPersonident } from "@/components/InaktivPersonident";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";

export const MODIA_HEADER_ID = "modia-header";

interface Props {
  tittel: string;
  aktivtMenypunkt: Menypunkter;
  flexjar?: ReactNode;
  children: ReactNode;
}

export default function Side({
  tittel,
  aktivtMenypunkt,
  flexjar,
  children,
}: Props) {
  const { data: diskresjonskode } = useDiskresjonskodeQuery();
  const { isInaktivPersonident } = useBrukerinfoQuery();
  const veilederinfo = useAktivVeilederinfoQuery().data;

  useEffect(() => {
    // TODO: Flytte et sentralisert sted. Mulig det holder å sette denne en gang
    // TODO: Hashe ident
    umami.identify(veilederinfo?.ident ?? "anonymous");
    Amplitude.logEvent({
      type: EventType.PageView,
      data: { url: window.location.href, sidetittel: tittel },
    });
    Umami.logEvent({
      type: EventType.PageView,
      data: { url: window.location.href, sidetittel: tittel },
    });
  }, [tittel, veilederinfo]); //TODO: La til veilederinfo her, men tror ikke det er riktig. Funker i hvert fall
  const isFlexjarVisible = diskresjonskode !== "6" && diskresjonskode !== "7";

  return (
    <DocumentTitle
      title={tittel + (tittel.length > 0 ? " - Sykefravær" : "Sykefravær")}
    >
      <div className="mx-6 flex flex-col">
        <div className="flex flex-col gap-2" id={MODIA_HEADER_ID}>
          <div className="flex flex-row w-full bg-surface-default">
            <OversiktLenker />
            <TildeltVeileder />
          </div>
          {isInaktivPersonident && <InaktivPersonident />}
          {isPride() && <Pride>&nbsp;</Pride>}
          <Personkort />
        </div>
        <div className={"flex -md:flex-wrap"}>
          <nav className="-md:w-full min-w-[15rem] w-[15rem] md:mr-2">
            <GlobalNavigasjon aktivtMenypunkt={aktivtMenypunkt} />
            <Oppfolgingsoppgave />
            {isEaster() && <Easter />}
          </nav>
          <div className="w-full">{children}</div>
        </div>
        {isFlexjarVisible && flexjar}
      </div>
    </DocumentTitle>
  );
}
