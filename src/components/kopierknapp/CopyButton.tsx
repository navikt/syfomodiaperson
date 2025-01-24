import React, { useRef, useState } from "react";
import styled from "styled-components";
import { CopyImage } from "../../../img/ImageComponents";
import { Popover } from "@navikt/ds-react";

interface CopyButtonProps {
  message: string;
  value: string;
}

const StyledButton = styled.button`
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  img {
    margin-right: 0;
  }
`;

const CopyButton = ({ message, value }: CopyButtonProps) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <StyledButton
        ref={buttonRef}
        onClick={(event) => {
          event.stopPropagation();
          setShowPopover(!showPopover);
          if (value) {
            navigator.clipboard.writeText(value);
          }
        }}
      >
        <img alt="kopier" src={CopyImage} />
      </StyledButton>
      <Popover
        open={showPopover}
        onClose={() => setShowPopover(false)}
        anchorEl={buttonRef.current}
      >
        <Popover.Content>{message}</Popover.Content>
      </Popover>
    </div>
  );
};

export default CopyButton;
