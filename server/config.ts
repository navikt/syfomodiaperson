import dotenv from "dotenv";

dotenv.config();

interface EnvVarType {
  name: any;
  defaultValue?: any;
}

const envVar = ({ name, defaultValue }: EnvVarType): any => {
  const fromEnv = process.env[name];
  if (fromEnv) {
    return fromEnv;
  }
  if (typeof defaultValue === "string") {
    return defaultValue;
  } else if (typeof defaultValue === "object") {
    if (isDev && typeof defaultValue.dev === "string") {
      return defaultValue.dev;
    }
    if (isProd && typeof defaultValue.prod === "string") {
      return defaultValue.prod;
    }
  }
  throw new Error(`Missing required environment variable ${name}`);
};

export const isDev = envVar({ name: "NODE_ENV" }) === "development";
export const isProd = envVar({ name: "NODE_ENV" }) === "production";

// Config used internally in the server
export const server = {
  host: envVar({ name: "HOST", defaultValue: "localhost" }),
  port: Number.parseInt(envVar({ name: "PORT", defaultValue: "8080" })),
  logLevel: envVar({ name: "LOG_LEVEL", defaultValue: "info" }),
};

export interface ExternalAppConfig {
  applicationName: string;
  clientId: string;
  host: string;
  tokenSetId?: any;
  removePathPrefix?: boolean;
}

// For auth
export const auth = {
  texas: {
    introspectionEndpoint: envVar({
      name: "NAIS_TOKEN_INTROSPECTION_ENDPOINT",
    }),
    tokenExchangeEndpoint: envVar({
      name: "NAIS_TOKEN_EXCHANGE_ENDPOINT",
    }),
  },

  fastlegerest: {
    applicationName: "fastlegerest",
    clientId: envVar({
      name: "FASTLEGEREST_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "FASTLEGEREST_HOST",
    }),
  },
  isaktivitetskrav: {
    applicationName: "isaktivitetskrav",
    clientId: envVar({
      name: "ISAKTIVITETSKRAV_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISAKTIVITETSKRAV_HOST",
    }),
    removePathPrefix: true,
  },
  isarbeidsuforhet: {
    applicationName: "isarbeidsuforhet",
    clientId: envVar({
      name: "ISARBEIDSUFORHET_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISARBEIDSUFORHET_HOST",
    }),
    removePathPrefix: true,
  },
  isbehandlerdialog: {
    applicationName: "isbehandlerdialog",
    clientId: envVar({
      name: "ISBEHANDLERDIALOG_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISBEHANDLERDIALOG_HOST",
    }),
    removePathPrefix: true,
  },
  isdialogmelding: {
    applicationName: "isdialogmelding",
    clientId: envVar({
      name: "ISDIALOGMELDING_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISDIALOGMELDING_HOST",
    }),
    removePathPrefix: true,
  },
  isdialogmote: {
    applicationName: "isdialogmote",
    clientId: envVar({
      name: "ISDIALOGMOTE_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISDIALOGMOTE_HOST",
    }),
    removePathPrefix: true,
  },
  isdialogmotekandidat: {
    applicationName: "isdialogmotekandidat",
    clientId: envVar({
      name: "ISDIALOGMOTEKANDIDAT_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISDIALOGMOTEKANDIDAT_HOST",
    }),
    removePathPrefix: true,
  },
  isfrisktilarbeid: {
    applicationName: "isfrisktilarbeid",
    clientId: envVar({
      name: "ISFRISKTILARBEID_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISFRISKTILARBEID_HOST",
    }),
    removePathPrefix: true,
  },
  ishuskelapp: {
    applicationName: "ishuskelapp",
    clientId: envVar({
      name: "ISHUSKELAPP_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISHUSKELAPP_HOST",
    }),
    removePathPrefix: true,
  },
  ismeroppfolging: {
    applicationName: "ismeroppfolging",
    clientId: envVar({
      name: "ISMEROPPFOLGING_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISMEROPPFOLGING_HOST",
    }),
    removePathPrefix: true,
  },
  isnarmesteleder: {
    applicationName: "isnarmesteleder",
    clientId: envVar({
      name: "ISNARMESTELEDER_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISNARMESTELEDER_HOST",
    }),
    removePathPrefix: true,
  },
  isoppfolgingstilfelle: {
    applicationName: "isoppfolgingstilfelle",
    clientId: envVar({
      name: "ISOPPFOLGINGSTILFELLE_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISOPPFOLGINGSTILFELLE_HOST",
    }),
    removePathPrefix: true,
  },
  isoppfolgingsplan: {
    applicationName: "isoppfolgingsplan",
    clientId: envVar({
      name: "ISOPPFOLGINGSPLAN_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISOPPFOLGINGSPLAN_HOST",
    }),
    removePathPrefix: true,
  },
  ispengestopp: {
    applicationName: "ispengestopp",
    clientId: envVar({
      name: "ISPENGESTOPP_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISPENGESTOPP_HOST",
    }),
    removePathPrefix: true,
  },
  ispersonoppgave: {
    applicationName: "ispersonoppgave",
    clientId: envVar({
      name: "ISPERSONOPPGAVE_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISPERSONOPPGAVE_HOST",
    }),
    removePathPrefix: true,
  },
  modiacontextholder: {
    applicationName: "modiacontextholder",
    clientId: envVar({
      name: "MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "MODIACONTEXTHOLDER_HOST",
    }),
    removePathPrefix: true,
  },
  syfobehandlendeenhet: {
    applicationName: "syfobehandlendeenhet",
    clientId: envVar({
      name: "SYFOBEHANDLENDEENHET_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOBEHANDLENDEENHET_HOST",
    }),
    removePathPrefix: true,
  },
  ereg: {
    applicationName: "ereg",
    clientId: "",
    host: envVar({
      name: "EREG_HOST",
    }),
  },
  syfomotebehov: {
    applicationName: "syfomotebehov",
    clientId: envVar({
      name: "SYFOMOTEBEHOV_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOMOTEBEHOV_HOST",
    }),
  },
  syfooppfolgingsplanservice: {
    applicationName: "syfooppfolgingsplanservice",
    clientId: envVar({
      name: "SYFOOPPFOLGINGSPLANSERVICE_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOOPPFOLGINGSPLANSERVICE_HOST",
    }),
  },
  syfoOppfolgingsplanBackend: {
    applicationName: "syfo-oppfolgingsplan-backend",
    clientId: envVar({
      name: "SYFO_OPPFOLGINGSPLAN_BACKEND_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFO_OPPFOLGINGSPLAN_BACKEND_HOST",
    }),
    removePathPrefix: true,
  },
  lpsOppfolgingsplanMottak: {
    applicationName: "lps-oppfolgingsplan-mottak",
    clientId: envVar({
      name: "LPS_OPPFOLGINGSPLAN_MOTTAK_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "LPS_OPPFOLGINGSPLAN_MOTTAK_HOST",
    }),
    removePathPrefix: true,
  },
  syfoperson: {
    applicationName: "syfoperson",
    clientId: envVar({
      name: "SYFOPERSON_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOPERSON_HOST",
    }),
  },
  syfooversiktsrv: {
    applicationName: "syfooversiktsrv",
    clientId: envVar({
      name: "SYFOOVERSIKTSRV_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOOVERSIKTSRV_HOST",
    }),
  },
  syfosmregister: {
    applicationName: "syfosmregister",
    clientId: envVar({
      name: "SYFOSMREGISTER_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOSMREGISTER_HOST",
    }),
    removePathPrefix: true,
  },
  sykepengesoknadBackend: {
    applicationName: "sykepengesoknad-backend",
    clientId: envVar({
      name: "SYKEPENGESOKNAD_BACKEND_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYKEPENGESOKNAD_BACKEND_HOST",
    }),
    removePathPrefix: true,
  },
  istilgangskontroll: {
    applicationName: "istilgangskontroll",
    clientId: envVar({
      name: "ISTILGANGSKONTROLL_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISTILGANGSKONTROLL_HOST",
    }),
    removePathPrefix: true,
  },
  syfoveileder: {
    applicationName: "syfoveileder",
    clientId: envVar({
      name: "SYFOVEILEDER_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOVEILEDER_HOST",
    }),
  },
  meroppfolgingBackend: {
    applicationName: "meroppfolging-backend",
    clientId: envVar({
      name: "MEROPPFOLGING_BACKEND_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "MEROPPFOLGING_BACKEND_HOST",
    }),
    removePathPrefix: true,
  },
  sykepengedagerinformasjon: {
    applicationName: "sykepengedager-informasjon",
    clientId: envVar({
      name: "SYKEPENGEDAGER_INFORMASJON_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYKEPENGEDAGER_INFORMASJON_HOST",
    }),
    removePathPrefix: true,
  },
  flexjar: {
    applicationName: "flexjar-backend",
    clientId: envVar({
      name: "FLEXJAR_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "FLEXJAR_HOST",
    }),
    removePathPrefix: true,
  },
  lumiApi: {
    applicationName: "lumi-api",
    clientId: envVar({
      name: "LUMI_API_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "LUMI_API_HOST",
    }),
    removePathPrefix: true,
  },
  veilarboppfolging: {
    applicationName: "veilarboppfolging",
    clientId: envVar({
      name: "VEILARBOPPFOLGING_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "VEILARBOPPFOLGING_HOST",
    }),
  },
  ismanglendemedvirkning: {
    applicationName: "ismanglendemedvirkning",
    clientId: envVar({
      name: "ISMANGLENDEMEDVIRKNING_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISMANGLENDEMEDVIRKNING_HOST",
    }),
    removePathPrefix: true,
  },
  pensjonPenUfore: {
    applicationName: "pensjon-pen",
    clientId: envVar({
      name: "PENSJON_PEN_UFOREGRAD_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "PENSJON_PEN_UFOREGRAD_HOST",
    }),
    removePathPrefix: true,
  },
};

export const valkey = {
  uri: envVar({ name: "VALKEY_URI_CACHE", defaultValue: "" }).replace(
    "valkeys",
    "rediss"
  ),
  username: envVar({ name: "VALKEY_USERNAME_CACHE", defaultValue: "" }),
  password: envVar({ name: "VALKEY_PASSWORD_CACHE", defaultValue: "" }),
  database: 18,
};

export const unleash: { serverApiUrl: string; serverApiToken: string } = {
  serverApiUrl: envVar({ name: "UNLEASH_SERVER_API_URL" }),
  serverApiToken: envVar({ name: "UNLEASH_SERVER_API_TOKEN" }),
};

const Config = {
  auth,
  isDev,
  isProd,
  valkey,
  unleash,
  server,
};

export default Config;
