import React, { ReactNode, useEffect } from "react";
import Personkort from "../components/personkort/Personkort";
import DocumentTitle from "react-document-title";
import {
  GlobalNavigasjon,
  Menypunkter,
} from "@/components/globalnavigasjon/GlobalNavigasjon";
import { isDecember, isEaster, isPride } from "@/utils/festiveUtils";
import { Easter } from "@/components/festive/Easter";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { OversiktLenker } from "@/components/personkort/OversiktLenker";
import { Pride } from "@/components/festive/Pride";
import { Oppfolgingsoppgave } from "@/components/oppfolgingsoppgave/Oppfolgingsoppgave";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { TildeltVeileder } from "@/components/TildeltVeileder";
import { Santa } from "@/components/Santa";

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

  useEffect(() => {
    Amplitude.logEvent({
      type: EventType.PageView,
      data: { url: window.location.href, sidetittel: tittel },
    });
  }, [tittel]);
  const isFlexjarVisible = diskresjonskode !== "6" && diskresjonskode !== "7";

  return (
    <DocumentTitle
      title={tittel + (tittel.length > 0 ? " - Sykefravær" : "Sykefravær")}
    >
      <div className="mx-6 flex flex-col">
        <div className="flex flex-col" id={MODIA_HEADER_ID}>
          <div className="flex flex-row mt-4 mb-2 w-full">
            <OversiktLenker />
            {isDecember() && <Santa />}
            <TildeltVeileder />
          </div>
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
