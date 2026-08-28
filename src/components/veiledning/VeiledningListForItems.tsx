import { List } from "@navikt/ds-react";
import { VeiledningList } from "./VeiledningList";

type TextContent = string | React.ReactNode;

export type NestableListItem =
  | TextContent
  | {
      text: TextContent;
      subItems: NestableListItem[];
    };

function VeiledningListItem({ item }: { item: NestableListItem }) {
  function isItemWithSubItems(item: NestableListItem): item is {
    text: TextContent;
    subItems: NestableListItem[];
  } {
    return typeof item === "object" && item !== null && "subItems" in item;
  }

  return isItemWithSubItems(item) ? (
    <List.Item>
      {item.text}

      {item.subItems.length > 0 && (
        <List as="ul" size="small">
          {item.subItems.map((child, index) => (
            <VeiledningListItem key={index} item={child} />
          ))}
        </List>
      )}
    </List.Item>
  ) : (
    <List.Item>{item}</List.Item>
  );
}

export function VeiledningListForItems({
  items,
}: {
  items: NestableListItem[];
}) {
  return (
    <VeiledningList as="ul">
      {items.map((item, index) => (
        <VeiledningListItem item={item} key={index} />
      ))}
    </VeiledningList>
  );
}
