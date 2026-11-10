import ErrorBoundary from "@/components/ErrorBoundary";
import { ApiErrorException } from "@/api/errors";
import { Tag } from "@navikt/ds-react";
import { usePersonkortHeaderTags } from "@/components/personkort/PersonkortHeader/hooks/usePersonkortHeaderTags";

const texts = {
  fetchDiskresjonskodeFailed: "Klarte ikke hente diskresjonskode for brukeren.",
};

export function PersonkortHeaderTags() {
  const { tags, diskresjonskodeError } = usePersonkortHeaderTags();

  return (
    <ErrorBoundary
      apiError={
        diskresjonskodeError instanceof ApiErrorException
          ? diskresjonskodeError.error
          : undefined
      }
      errorMessage={texts.fetchDiskresjonskodeFailed}
    >
      <div className="flex flex-1 h-fit justify-end">
        {tags.length > 0 && (
          <ul className="flex gap-2 flex-wrap items-center justify-end list-none m-0 p-0">
            {tags.map(({ key, label, color, icon }) => (
              <li key={key} className="flex">
                <Tag
                  data-color={color}
                  variant="outline"
                  size="small"
                  icon={icon}
                >
                  {label}
                </Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ErrorBoundary>
  );
}
