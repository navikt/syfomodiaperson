import { genererDato } from "@/sider/dialogmoter/utils";
import { containsWhiteSpace } from "@/utils/stringUtils";

const validVideoLinks = ["https://video.nav.no", "https://videosamtale.nav.no"];

export const texts = {
  timeMissing: "Vennligst angi klokkeslett",
  timePassed: "Tidspunktet har passert",
  invalidVideoLink: `Lenken må begynne med ${validVideoLinks.join(" eller ")}`,
  whiteSpaceInVideoLink: "Lenken kan ikke inneholde mellomrom",
};

export function validerKlokkeslett(
  dato: string | undefined,
  klokkeslett: string | undefined
): string | undefined {
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
}

export function validerVideoLink(videoLink?: string): string | undefined {
  if (!videoLink) {
    return undefined;
  }

  try {
    const trimmedVideoLink = videoLink.trim();
    const url = new URL(trimmedVideoLink);
    if (!validVideoLinks.includes(url.origin)) {
      return texts.invalidVideoLink;
    }
    if (containsWhiteSpace(trimmedVideoLink)) {
      return texts.whiteSpaceInVideoLink;
    }
  } catch (err) {
    return texts.invalidVideoLink;
  }

  return undefined;
}
