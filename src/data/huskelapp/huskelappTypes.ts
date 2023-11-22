import { Oppfolgingsgrunn } from "@/data/huskelapp/Oppfolgingsgrunn";

export interface HuskelappRequestDTO {
  oppfolgingsgrunn: Oppfolgingsgrunn;
}

export interface HuskelappResponseDTO {
  uuid: string;
  createdBy: string;
  oppfolgingsgrunn: Oppfolgingsgrunn;
}
