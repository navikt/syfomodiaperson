import React, { ReactNode } from "react";
import { Textarea, TextareaProps } from "@navikt/ds-react";
import { ReferatInfoBox } from "@/sider/dialogmoter/components/referat/ReferatInfoBox";

interface ReferatTextAreaProps extends TextareaProps {
  infoBox?: ReactNode;
}

const ReferatTextArea = (props: ReferatTextAreaProps) => {
  const { infoBox, ...rest } = props;
  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <Textarea size="small" {...rest} />
      </div>
      <div className="flex-[0.5] mt-12">
        {infoBox && <ReferatInfoBox>{infoBox}</ReferatInfoBox>}
      </div>
    </div>
  );
};

export default ReferatTextArea;
