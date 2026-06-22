import React, { useRef, useState } from "react";
import { Popover } from "@navikt/ds-react";
import { FilesIcon } from "@navikt/aksel-icons";

interface Props {
  message: string;
  value: string;
  iconTitle: string;
}

export function CopyButton({ message, value, iconTitle }: Props) {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  function handleCopy(event: React.SyntheticEvent) {
    event.stopPropagation();
    setShowPopover(!showPopover);
    if (value) {
      navigator.clipboard?.writeText(value);
    }
  }

  return (
    <span className="relative z-2">
      {/*Uses <span> instead of <button> to avoid nested <button> when rendered inside accordion headers*/}
      <span
        className="m-0 cursor-pointer"
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onClick={handleCopy}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCopy(event);
          }
        }}
      >
        <FilesIcon title={iconTitle} fontSize="1.5rem" className="inline" />
      </span>
      <Popover
        open={showPopover}
        onClose={() => setShowPopover(false)}
        anchorEl={triggerRef.current}
      >
        <Popover.Content>{message}</Popover.Content>
      </Popover>
    </span>
  );
}
