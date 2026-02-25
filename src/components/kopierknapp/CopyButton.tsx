import React, { useRef, useState } from "react";
import { CopyImage } from "../../../img/ImageComponents";
import { Popover } from "@navikt/ds-react";
import styled from "styled-components";

interface Props {
  message: string;
  value: string;
}

// Uses <span> instead of <button> to avoid nested <button> when rendered inside accordion headers
const StyledCopyTrigger = styled.span`
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;

  img {
    margin-right: 0;
  }
`;

export function CopyButton({ message, value }: Props) {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  function handleCopy(event: React.SyntheticEvent) {
    event.stopPropagation();
    setShowPopover(!showPopover);
    if (value) {
      navigator.clipboard.writeText(value);
    }
  }

  return (
    <div>
      <StyledCopyTrigger
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
        <img alt="kopier" src={CopyImage} />
      </StyledCopyTrigger>
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
