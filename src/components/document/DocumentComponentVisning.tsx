import { ReactElement } from "react";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { FlexRow, PaddingSize } from "@/components/Layout";
import { BodyLong, Box, Heading, Label, Link, List } from "@navikt/ds-react";
import { DocumentComponentHeaderH1 } from "@/components/document/DocumentComponentHeaderH1";

const DocumentComponentLink = (texts: string[], title?: string) => {
  const link = texts.length === 0 ? "" : texts[0];
  return (
    <div className="my-[1em] whitespace-pre-wrap">
      <Label size="small">{title ?? ""}</Label>
      <br />
      <Link target="_blank" rel="noopener noreferrer" href={link}>
        {link}
      </Link>
    </div>
  );
};

const DocumentComponentHeaderH2 = (texts: string[]) => {
  const header = texts.length === 0 ? "" : texts[0];
  return (
    <FlexRow topPadding={PaddingSize.SM}>
      <Heading size="medium">{header}</Heading>
    </FlexRow>
  );
};

const DocumentComponentHeaderH3 = (texts: string[]) => {
  const header = texts.length === 0 ? "" : texts[0];
  return (
    <FlexRow topPadding={PaddingSize.SM}>
      <Heading level="3" size="small">
        {header}
      </Heading>
    </FlexRow>
  );
};

const DocumentComponentParagraph = (texts: string[], title?: string) => {
  const paragraphText = (
    <>
      {texts.map((text, index) => (
        <BodyLong size="small" key={index}>
          {text}
          <br />
        </BodyLong>
      ))}
    </>
  );

  return title ? (
    <div className="my-[1em] whitespace-pre-wrap">
      <Label size="small">{title}</Label>
      {paragraphText}
    </div>
  ) : (
    <div className="mb-[1em] whitespace-pre-wrap">{paragraphText}</div>
  );
};

function DocumentComponentBulletPoints(texts: string[]) {
  return (
    <Box marginBlock="space-12" asChild>
      <List size="small">
        {texts.map((text, index) => (
          <List.Item key={index}>{text}</List.Item>
        ))}
      </List>
    </Box>
  );
}

interface Props {
  documentComponent: DocumentComponentDto;
}

export default function DocumentComponentVisning({
  documentComponent: { type, title, texts },
}: Props): ReactElement {
  switch (type) {
    case DocumentComponentType.HEADER: {
      return DocumentComponentHeaderH2(texts);
    }
    case DocumentComponentType.HEADER_H1: {
      return <DocumentComponentHeaderH1 text={texts[0] ?? ""} />;
    }
    case DocumentComponentType.HEADER_H2: {
      return DocumentComponentHeaderH2(texts);
    }
    case DocumentComponentType.HEADER_H3: {
      return DocumentComponentHeaderH3(texts);
    }
    case DocumentComponentType.LINK: {
      return DocumentComponentLink(texts, title);
    }
    case DocumentComponentType.PARAGRAPH: {
      return DocumentComponentParagraph(texts, title);
    }
    case DocumentComponentType.BULLET_POINTS: {
      return DocumentComponentBulletPoints(texts);
    }
  }
}
