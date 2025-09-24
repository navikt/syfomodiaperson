import { erProd } from "@/utils/miljoUtil";
// import { EventType } from "@/utils/amplitude";
import { Oppfolgingsgrunn } from "@/data/oppfolgingsoppgave/types";
import { IkkeAktuellArsak } from "@/data/aktivitetskrav/aktivitetskravTypes";

/**
 * TODO:
 See documentation for naming guidelines: https://github.com/navikt/analytics-taxonomy
 Other documentation on Aksel: https://aksel.nav.no/god-praksis/artikler/mal-brukeratferd-med-amplitude
 */
export enum EventType {
  PageView = "besøk",
  ButtonClick = "knapp trykket",
  Navigation = "navigere", //TODO: Muligens noe feil med hvordan denne er implementert. Ser ut til å sende forrige side info
  AccordionOpen = "accordion åpnet",
  OppfolgingsgrunnSendt = "oppfolgingsgrunn sendt",
  OppfolgingsoppgaveEdited = "oppfolgingsoppgave endret",
  OppfolgingsgrunnEdited = "oppfolgingsgrunn endret",
  IkkeAktuellVurderingArsak = "Ikke aktuell vurdering arsak",
  ViewPortAndScreenResolution = "viewport og skjermstørrelse",
  OptionSelected = "alternativ valgt",
  LinkClick = "lenke klikket",
  SenFaseFlexjarSubmitted = "flexjar sen fase sendt",
  HistorikkFlexjarSubmitted = "flexjar historikk sendt",
}

type EventPageView = {
  type: EventType.PageView;
  data: {
    url: string;
    sidetittel: string;
  };
};

type EventButtonClick = {
  type: EventType.ButtonClick;
  data: {
    url: string;
    tekst: string;
  };
};

type Navigation = {
  type: EventType.Navigation;
  data: {
    lenketekst: string;
    destinasjon: string;
  };
};

type EventAccordionOpen = {
  type: EventType.AccordionOpen;
  data: {
    url: string;
    tekst: string;
  };
};

type OppfolgingsgrunnSendt = {
  type: EventType.OppfolgingsgrunnSendt;
  data: {
    url: string;
    oppfolgingsgrunn: Oppfolgingsgrunn;
  };
};

type OppfolgingsoppgaveEdited = {
  type: EventType.OppfolgingsoppgaveEdited;
  data: {
    url: string;
    oppfolgingsgrunn: Oppfolgingsgrunn;
    fieldsEdited: string[];
  };
};

type OppfolgingsgrunnEdited = {
  type: EventType.OppfolgingsgrunnEdited;
  data: {
    url: string;
    oldOppfolgingsgrunn: Oppfolgingsgrunn;
    newOppfolgingsgrunn: Oppfolgingsgrunn;
  };
};

type IkkeAktuellVurderingArsak = {
  type: EventType.IkkeAktuellVurderingArsak;
  data: {
    arsak: IkkeAktuellArsak;
  };
};

type ViewPortAndScreenResolution = {
  type: EventType.ViewPortAndScreenResolution;
  data: {
    viewport: {
      width: number;
      height: number;
    };
    screenResolution: {
      width: number;
      height: number;
    };
  };
};

type OptionSelected = {
  type: EventType.OptionSelected;
  data: {
    url: string;
    tekst: string;
    option: string;
  };
};

type LinkClick = {
  type: EventType.LinkClick;
  data: {
    sideUrl: string;
    destinasjonUrl: string;
  };
};

type SenFaseFlexjarSubmitted = {
  type: EventType.SenFaseFlexjarSubmitted;
  data: {
    url: string;
    optionSelected: string;
    hasFirstFeedbackValue: boolean;
    hasSecondFeedbackValue: boolean;
  };
};

type HistorikkFlexjarSubmitted = {
  type: EventType.HistorikkFlexjarSubmitted;
  data: {
    url: string;
    optionSelected: string;
    hasFeedbackValue: boolean;
  };
};

type Event =
  | EventPageView
  | EventButtonClick
  | Navigation
  | EventAccordionOpen
  | ViewPortAndScreenResolution
  | OppfolgingsgrunnSendt
  | OppfolgingsoppgaveEdited
  | OppfolgingsgrunnEdited
  | IkkeAktuellVurderingArsak
  | OptionSelected
  | LinkClick
  | SenFaseFlexjarSubmitted
  | HistorikkFlexjarSubmitted;

export const logEvent = (event: Event) =>
  umami.track(event.type, { ...event.data });
// umami.track(props => ({
//   ...props,
//   name: 'signup-button',
//   data: {
//     name: 'newsletter',
//     id: 123,
//   },
// }));

export function logViewportAndScreenSize() {
  umami.track(EventType.ViewPortAndScreenResolution, {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screenResolution: {
      width: screen.width,
      height: screen.height,
    },
  });
}

// umami.init(getApiKey(), undefined, {
//   serverUrl: "https://amplitude.nav.no/collect",
// });
