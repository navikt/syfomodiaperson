/** Supported versions of Standard for naringsgruppering. */
export type NaringskodeStandard = 1994 | 2002 | 2007 | 2025;

/** An SSB naringskode and its immediate parent. */
export interface Naringskode {
  code: string;
  name: string;
  parentCode: string | null;
  shortName?: string | null;
}

/** A naringskode followed by its ancestors for the selected standard. */
export interface NaringskodeHierarki {
  standard: NaringskodeStandard;
  hierarki: Naringskode[];
}
