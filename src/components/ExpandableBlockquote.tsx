import { ReactNode, RefObject, useLayoutEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";

const texts = {
  readMore: "Vis mer",
  readLess: "Vis mindre",
};

interface ExpandableBlockquoteProps {
  className?: string;
  children: ReactNode;
}

export const ExpandableBlockquote = ({
  className,
  children,
}: ExpandableBlockquoteProps) => {
  const [viewAll, setViewAll] = useState<boolean>(false);
  const ref = useRef(null) as RefObject<any>;
  const isOverflow = useIsOverflow(ref, () => {
    /*noop*/
  });
  const showButton = isOverflow || viewAll;
  const maxHeight = viewAll ? "max-h-full" : "max-h-24";

  return (
    <div className="grid grid-cols-1 place-items-center">
      <blockquote
        className={`${className} ${maxHeight} mb-2 overflow-hidden w-full`}
        ref={ref}
      >
        {children}
      </blockquote>
      {showButton && (
        <ExpandButton setOpen={setViewAll} isOverflow={!!isOverflow} />
      )}
    </div>
  );
};

interface ExpandButtonProps {
  setOpen: (value: boolean) => void;
  isOverflow: boolean;
}

const ExpandButton = ({ setOpen, isOverflow }: ExpandButtonProps) => {
  const text = isOverflow ? texts.readMore : texts.readLess;

  return (
    <Button
      size="xsmall"
      variant="tertiary"
      className="flex items-center"
      onClick={() => setOpen(isOverflow)}
      icon={isOverflow ? <ChevronDownIcon /> : <ChevronUpIcon />}
    >
      {text}
    </Button>
  );
};

const useIsOverflow = (
  ref: RefObject<HTMLDivElement>,
  callback: (hasOverflow: boolean) => void,
) => {
  const [isOverflow, setIsOverflow] = useState<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const { current } = ref;
    if (!current) return;

    const hasOverflow = current.scrollHeight > current.clientHeight;
    setIsOverflow(hasOverflow);

    if (callback) callback(hasOverflow);
  }, [callback, ref]);

  return isOverflow;
};
