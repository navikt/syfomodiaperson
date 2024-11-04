import { DialogmoteStatus } from "@/data/dialogmote/types/dialogmoteTypes";

export interface DialogmoteStatusEndringDTO {
  uuid: string;
  createdAt: Date;
  dialogmoteId: number;
  dialogmoteOpprettetAv: string;
  status: DialogmoteStatus;
  statusEndringOpprettetAv: string;
}
