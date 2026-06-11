import React, { useRef, useState } from "react";
import { CopyImage } from "../../../img/ImageComponents";
import { Popover } from "@navikt/ds-react";

interface Props {
  message: string;
  value: string;
}

export function CopyButton({ message, value }: Props) {
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
    <div>
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
        <img alt="kopier" src={CopyImage} className="h-5" />
      </span>
      <Popover
        open={showPopover}
        onClose={() => setShowPopover(false)}
        anchorEl={triggerRef.current}
      >
        <Popover.Content>{message}</Popover.Content>
      </Popover>
    </div>
  );
}
