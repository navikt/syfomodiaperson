import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { useNotification } from "@/context/notification/NotificationContext";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

type AktivitetskravStatusSuccess =
  | AktivitetskravStatus.OPPFYLT
  | AktivitetskravStatus.UNNTAK
  | AktivitetskravStatus.IKKE_OPPFYLT
  | AktivitetskravStatus.INNSTILLING_OM_STANS
  | AktivitetskravStatus.IKKE_AKTUELL;

export const useAktivitetskravNotificationAlert = () => {
  const { navn: brukersNavn } = useNavBrukerData();
  const { setNotification, notification } = useNotification();
  const today = tilLesbarDatoMedArUtenManedNavn(new Date());

  const getText = (status: AktivitetskravStatusSuccess) => {
    switch (status) {
      case AktivitetskravStatus.OPPFYLT: {
        return `Det er vurdert at ${brukersNavn} er i aktivitet ${today}.`;
      }
      case AktivitetskravStatus.UNNTAK: {
        return `Det er vurdert unntak for ${brukersNavn} ${today}.`;
      }
      case AktivitetskravStatus.IKKE_OPPFYLT: {
        return `Det er vurdert at aktivitetskravet ikke er oppfylt for ${brukersNavn} ${today}.`;
      }
      case AktivitetskravStatus.INNSTILLING_OM_STANS: {
        return `Det er vurdert innstilling om stans for aktivitetskravet for ${brukersNavn} ${today}.`;
      }
      case AktivitetskravStatus.IKKE_AKTUELL: {
        return `Det er vurdert at aktivitetskravet ikke er aktuelt for ${brukersNavn} ${today}.`;
      }
    }
  };

  return {
    displayNotification: (status: AktivitetskravStatusSuccess) => {
      setNotification({
        message: getText(status),
      });
    },
    notification,
  };
};
