import { TidStedDto } from "@/sider/dialogmoter/types/dialogmoteTypes";
import { genererDato } from "@/sider/dialogmoter/utils";
import { TidStedSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";

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
