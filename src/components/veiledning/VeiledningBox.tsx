import { Box, VStack } from "@navikt/ds-react";

export function VeiledningBox({ children }: { children: React.ReactNode }) {
  return (
    <Box background="default" padding="space-24">
      <VStack gap="space-16">{children}</VStack>
    </Box>
  );
}
