export {};

declare global {
  interface Umami {
    identify: (id: string) => Promise<void> | void;
    track: (
      eventName: string,
      eventData?: Record<string, unknown>
    ) => Promise<void> | void;
  }

  const umami: Umami;

  interface Window {
    umami?: Umami;
  }
}
