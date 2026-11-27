/** Supported versions of Standard for institusjonell sektorgruppering. */
export type SektorkodeStandard = 1987 | 2012;

/** Sector code and its hierarchy as returned by Syfoperson. */
export interface SektorkodeHierarki {
  standard: number;
  hierarki: {
    code: string;
    name: string;
    parentCode: string | null;
    level: number;
  }[];
}
