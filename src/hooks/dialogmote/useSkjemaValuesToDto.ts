import { TidStedDto } from "@/data/dialogmote/types/dialogmoteTypes";
import { genererDato } from "@/components/mote/utils";
import { TidStedSkjemaValues } from "@/data/dialogmote/types/skjemaTypes";

export const useSkjemaValuesToDto = () => {
  return {
    toTidStedDto: (values: TidStedSkjemaValues): TidStedDto => {
      return {
        sted: values.sted,
        tid: genererDato(values.dato, values.klokkeslett),
        videoLink: values.videoLink?.trim(),
      };
    },
  };
};
