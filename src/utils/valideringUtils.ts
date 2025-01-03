import { genererDato } from "@/sider/dialogmoter/utils";
import { containsWhiteSpace } from "@/utils/stringUtils";

export const texts = {
  timeMissing: "Vennligst angi klokkeslett",
  timePassed: "Tidspunktet har passert",
  invalidVideoLink: "Lenken må begynne med https://video.nav.no",
  whiteSpaceInVideoLink: "Lenken kan ikke inneholde mellomrom",
};

export const validerKlokkeslett = (
  dato: string | undefined,
  klokkeslett: string | undefined
): string | undefined => {
  if (!klokkeslett) {
    return texts.timeMissing;
  }
  if (dato && klokkeslett) {
    const today = new Date();
    const generertDato = genererDato(dato, klokkeslett);

    if (new Date(generertDato) < today) {
      return texts.timePassed;
    }
  }
};

export const validerVideoLink = (videoLink?: string): string | undefined => {
  if (!videoLink) {
    return undefined;
  }

  try {
    const trimmedVideoLink = videoLink.trim();
    const url = new URL(trimmedVideoLink);
    if (url.origin !== "https://video.nav.no") {
      return texts.invalidVideoLink;
    }
    if (containsWhiteSpace(trimmedVideoLink)) {
      return texts.whiteSpaceInVideoLink;
    }
  } catch (err) {
    return texts.invalidVideoLink;
  }

  return undefined;
};
