import { CSSProperties, ReactNode } from "react";
import cx from "classnames";

export enum JustifyContentType {
  CENTER = "center",
  FLEX_END = "flex-end",
  FLEX_START = "flex-start",
  SPACE_BETWEEN = "space-between",
}

const justifyContentClasses: Record<JustifyContentType, string> = {
  [JustifyContentType.CENTER]: "justify-center",
  [JustifyContentType.FLEX_END]: "justify-end",
  [JustifyContentType.FLEX_START]: "justify-start",
  [JustifyContentType.SPACE_BETWEEN]: "justify-between",
};

interface FlexColumnProps {
  children?: ReactNode;
  className?: string;
  justifyContent?: JustifyContentType;
  flex?: number;
}

export function FlexColumn({
  children,
  className,
  justifyContent = JustifyContentType.FLEX_START,
  flex,
}: FlexColumnProps) {
  const style: CSSProperties | undefined = flex ? { flex } : undefined;
  return (
    <div
      className={cx(
        "flex flex-col",
        justifyContentClasses[justifyContent],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export enum FlexGapSize {
  SM = "1em",
  MD = "2em",
  LG = "3em",
}

const columnGapClasses: Record<FlexGapSize, string> = {
  [FlexGapSize.SM]: "gap-x-[1em]",
  [FlexGapSize.MD]: "gap-x-[2em]",
  [FlexGapSize.LG]: "gap-x-[3em]",
};

export enum PaddingSize {
  NONE = "",
  SM = "1em",
  MD = "2em",
  LG = "3em",
}

const topPaddingClasses: Record<PaddingSize, string> = {
  [PaddingSize.NONE]: "",
  [PaddingSize.SM]: "pt-[1em]",
  [PaddingSize.MD]: "pt-[2em]",
  [PaddingSize.LG]: "pt-[3em]",
};

const bottomPaddingClasses: Record<PaddingSize, string> = {
  [PaddingSize.NONE]: "",
  [PaddingSize.SM]: "pb-[1em]",
  [PaddingSize.MD]: "pb-[2em]",
  [PaddingSize.LG]: "pb-[3em]",
};

const leftPaddingClasses: Record<PaddingSize, string> = {
  [PaddingSize.NONE]: "",
  [PaddingSize.SM]: "pl-[1em]",
  [PaddingSize.MD]: "pl-[2em]",
  [PaddingSize.LG]: "pl-[3em]",
};

export interface RowProps {
  children?: ReactNode;
  className?: string;
  columnGap?: FlexGapSize;
  topPadding?: PaddingSize;
  bottomPadding?: PaddingSize;
  leftPadding?: PaddingSize;
  justifyContent?: JustifyContentType;
}

export function FlexRow({
  children,
  className,
  columnGap,
  topPadding = PaddingSize.NONE,
  bottomPadding = PaddingSize.NONE,
  leftPadding = PaddingSize.NONE,
  justifyContent = JustifyContentType.FLEX_START,
}: RowProps) {
  return (
    <div
      className={cx(
        "flex flex-row flex-wrap w-full",
        columnGap && columnGapClasses[columnGap],
        topPaddingClasses[topPadding],
        bottomPaddingClasses[bottomPadding],
        leftPaddingClasses[leftPadding],
        justifyContentClasses[justifyContent],
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ButtonRowProps {
  children?: ReactNode;
  className?: string;
  topPadding?: PaddingSize;
  bottomPadding?: PaddingSize;
}

export function ButtonRow({
  children,
  className,
  topPadding = PaddingSize.NONE,
  bottomPadding = PaddingSize.NONE,
}: ButtonRowProps) {
  return (
    <div
      className={cx(
        "flex justify-start flex-row flex-wrap gap-[1em]",
        topPaddingClasses[topPadding],
        bottomPaddingClasses[bottomPadding],
        className,
      )}
    >
      {children}
    </div>
  );
}
