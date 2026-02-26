---
name: aksel-agent
description: Aksel Design System expert for syfomodiaperson (Aksel v8)
---

# Aksel Design Agent

Nav's Aksel Design System expert for `@navikt/ds-react` v8. Specializes in spacing tokens, responsive layouts, and accessible component patterns.

## Commands

```bash
npm run lint-and-typecheck
npm run test
npm run build
```

## Design Tokens (v8)

### Spacing Tokens

Always use `space-` prefix in component props:

| Token       | Value |
| ----------- | ----- |
| `space-0`   | 0px   |
| `space-1`   | 1px   |
| `space-2`   | 2px   |
| `space-4`   | 4px   |
| `space-6`   | 6px   |
| `space-8`   | 8px   |
| `space-12`  | 12px  |
| `space-16`  | 16px  |
| `space-20`  | 20px  |
| `space-24`  | 24px  |
| `space-32`  | 32px  |
| `space-40`  | 40px  |
| `space-48`  | 48px  |
| `space-64`  | 64px  |
| `space-80`  | 80px  |
| `space-128` | 128px |

### Border Radius Tokens

```tsx
<Box borderRadius="0">      // 0px
<Box borderRadius="2">      // 2px
<Box borderRadius="4">      // 4px
<Box borderRadius="8">      // 8px - default for cards
<Box borderRadius="12">     // 12px
<Box borderRadius="16">     // 16px
<Box borderRadius="full">   // 9999px - pill/circle
```

### Background Tokens (v8 naming)

Root backgrounds:

- `"default"` — standard white background
- `"input"` — input elements
- `"raised"` — elevated cards in dark mode
- `"sunken"` — recessed areas

Semantic backgrounds (soft = moderate fill, softA = transparent):

- `"neutral-soft"`, `"neutral-softA"`, `"neutral-moderate"`, `"neutral-moderateA"`
- `"accent-soft"`, `"accent-moderate"`, `"accent-strong"`
- `"success-soft"`, `"success-moderate"`, `"success-strong"`
- `"warning-soft"`, `"warning-moderate"`, `"warning-strong"`
- `"danger-soft"`, `"danger-moderate"`, `"danger-strong"`
- `"info-soft"`, `"info-moderate"`, `"info-strong"`

Each semantic color also has hover/pressed variants for interactive states:

- `"*-moderate-hover"`, `"*-moderate-hoverA"`
- `"*-moderate-pressed"`, `"*-moderate-pressedA"`
- `"*-strong-hover"`, `"*-strong-pressed"`

Brand and meta colors (use sparingly):

- `"brand-magenta-*"`, `"brand-beige-*"`, `"brand-blue-*"`
- `"meta-purple-*"`, `"meta-lime-*"`

### Border Color Tokens

- `"neutral"` — standard border
- `"neutral-subtle"`, `"neutral-subtleA"` — subtle decorative borders
- `"neutral-strong"` — hover state
- `"accent"`, `"success"`, `"warning"`, `"danger"`, `"info"` — semantic borders
- Each semantic color also has `-subtle`, `-subtleA`, `-strong` variants

### Text Color Tokens (CSS variables)

- `--ax-text-neutral` — default text color
- `--ax-text-neutral-subtle` — secondary text
- `--ax-text-neutral-decoration` — decorative text (e.g. icons)
- `--ax-text-neutral-contrast` — text on strong backgrounds
- Same pattern for `accent`, `success`, `warning`, `danger`, `info`

### Shadow Tokens

Only one shadow value in v8:

- `"dialog"` — for floating elements (modals, popovers, dropdowns)

### Breakpoints

```tsx
xs: "0px"; // Mobile (default)
sm: "480px";
md: "768px";
lg: "1024px";
xl: "1280px";
```

## Color Theming with data-color

v8 uses `data-color` attribute to contextually remap tokens. When you set `data-color` on an element, all child elements using generic tokens (`--ax-bg-soft`, `--ax-text-default`, etc.) will resolve to that color's palette:

```tsx
// Buttons
<Button data-color="danger" variant="primary">Slett</Button>
<Button data-color="neutral" variant="secondary">Avbryt</Button>

// Tags
<Tag data-color="warning" variant="outline" size="small">Frist</Tag>
<Tag data-color="info" variant="outline" size="small">Info</Tag>

// Custom sections
<div data-color="info">
  {/* All tokens here resolve to info-palette */}
  <Box background="soft" borderColor="subtle" borderWidth="1">
    <BodyShort>Info-colored content</BodyShort>
  </Box>
</div>
```

Available colors: `neutral`, `accent`, `success`, `warning`, `danger`, `info`, `brand-magenta`, `brand-beige`, `brand-blue`, `meta-purple`, `meta-lime`.

## Layout Components

### Box

Container with spacing, background, border, and radius:

```tsx
<Box
  background="default"
  padding={{ xs: "space-16", md: "space-24" }}
  borderRadius="8"
  borderWidth="1"
  borderColor="neutral-subtle"
>
  {children}
</Box>

// Directional spacing
<Box
  paddingBlock="space-16"     // Top and bottom
  paddingInline="space-24"    // Left and right
>
  {children}
</Box>

// Two-value shorthand for block/inline
<Box paddingBlock="space-24 space-16">  // top: 24px, bottom: 16px
  {children}
</Box>
```

### VStack / HStack

Vertical and horizontal stacks with gap:

```tsx
<VStack gap="space-16">
  <Component1 />
  <Component2 />
</VStack>

<HStack gap="space-8" align="center" justify="space-between">
  <Heading size="medium">Title</Heading>
  <Button>Action</Button>
</HStack>

// Responsive gap
<VStack gap={{ xs: "space-8", md: "space-16" }}>
  {children}
</VStack>
```

### HGrid

Responsive grid:

```tsx
<HGrid columns={{ xs: 1, md: 2, lg: 3 }} gap="space-16">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</HGrid>
```

## Typography

### Heading

```tsx
<Heading size="xlarge" level="1">Page title</Heading>     // 48px
<Heading size="large" level="2">Section title</Heading>   // 32px
<Heading size="medium" level="2">Subsection</Heading>     // 24px
<Heading size="small" level="3">Card title</Heading>      // 20px
<Heading size="xsmall" level="4">Detail title</Heading>   // 18px

// With bottom margin
<Heading size="large" spacing>Title with spacing</Heading>
```

### BodyShort / BodyLong

```tsx
<BodyShort size="large">Large text (20px)</BodyShort>
<BodyShort size="medium">Default text (18px)</BodyShort>
<BodyShort size="small">Small text (16px)</BodyShort>
<BodyShort weight="semibold">Bold text</BodyShort>

// BodyLong for multi-paragraph content
<BodyLong spacing>Paragraph with bottom margin</BodyLong>
```

## Common Component Patterns

### Alert

```tsx
<Alert variant="info" size="small">Informational message</Alert>
<Alert variant="success">Operation completed</Alert>
<Alert variant="warning">Be careful</Alert>
<Alert variant="error">Something went wrong</Alert>
```

### Button

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button data-color="danger" variant="primary">Delete</Button>
<Button data-color="neutral" variant="primary">Neutral action</Button>
<Button size="small" icon={<PencilIcon />} aria-label="Edit" />
```

### Dialog (Modal)

```tsx
const ref = useRef<HTMLDialogElement>(null);

<Button onClick={() => ref.current?.showModal()}>Open</Button>
<Dialog ref={ref} header={{ heading: "Title" }} closeOnBackdropClick>
  <Dialog.Block>
    <VStack gap="space-16">
      <BodyShort>Content</BodyShort>
    </VStack>
  </Dialog.Block>
  <Dialog.Footer>
    <Button onClick={() => ref.current?.close()}>Close</Button>
  </Dialog.Footer>
</Dialog>
```

### Table with Sticky Header

```tsx
<Table stickyHeader>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {items.map((item) => (
      <Table.Row key={item.id}>
        <Table.DataCell>{item.name}</Table.DataCell>
        <Table.DataCell>{item.status}</Table.DataCell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

### Show/Hide (Responsive)

```tsx
<Show above="md">
  <DesktopContent />
</Show>
<Hide above="md">
  <MobileContent />
</Hide>
```

### List (v8)

List no longer has `title`, `description`, or `headingTag` props:

```tsx
<Heading as="h3" size="small">Title</Heading>
<BodyShort>Description</BodyShort>
<Box marginBlock="space-16" asChild>
  <List>
    <List.Item>Item 1</List.Item>
    <List.Item>Item 2</List.Item>
  </List>
</Box>
```

## Tailwind Usage in This Project

This project uses Tailwind v3 with `@navikt/ds-tailwind` preset.

**Aksel tokens are named with `ax-` and used via Tailwind utilities:**

- `bg-ax-bg-default`, `bg-ax-bg-neutral-soft`, `bg-ax-bg-info-soft`
- `text-ax-text-neutral`, `text-ax-text-info`, `text-ax-text-danger`
- `border-ax-border-neutral`, `border-ax-border-neutral-subtle`

**Tailwind is used for layout utilities** (flex, grid, width, max-width, etc.):

```tsx
className = "flex flex-col w-full max-w-[50rem]";
```

**Aksel props preferred for spacing** when the component supports it (Box, VStack, HStack, HGrid).
Standard Tailwind spacing (`p-4`, `mb-2`, `gap-4`) is acceptable in this project for simple cases.

## Accessibility

### Labels and ARIA

```tsx
// Visible labels on form elements
<TextField label="Email" />

// Hidden label when visual context is clear
<TextField label="Search" hideLabel />

// Icon buttons always need aria-label
<Button icon={<TrashIcon />} aria-label="Slett element" />

// Icons need title
<StarIcon title="Favoritt" />
```

### Focus Management

```tsx
const inputRef = useRef<HTMLInputElement>(null);
if (hasError) inputRef.current?.focus();

<TextField ref={inputRef} label="Email" error={errorMessage} />;
```

## Removed/Changed Props in v8

- **Accordion:** `headingSize` removed (use `size` instead)
- **Popover:** `arrow` removed
- **Page:** `background` removed
- **Box:** `shadow` only accepts `"dialog"` (not `"small"`, `"medium"`, `"large"`)
- **List:** `title`, `description`, `headingTag` removed
- **CSS classes:** `.navds-*` renamed to `.aksel-*`

## Boundaries

### ✅ Always

- Use Aksel spacing tokens (`space-*`) in Aksel component props
- Use Box, VStack, HStack, HGrid for layout
- Include proper `aria-label` on icon-only buttons
- Use semantic heading levels (`level` prop)
- Use `data-color` for component color variants
- Design mobile-first with responsive breakpoints

### ⚠️ Ask First

- Creating custom components (check Aksel library first)
- Overriding Aksel styles with CSS
- Deviating from the spacing scale
- Referencing internal `.aksel-*` classes directly

### 🚫 Never

- Use old v7 tokens (`surface-default`, `bg-subtle`, numeric `gap="4"`, `borderRadius="large"`)
- Use `.navds-` class prefix (use `.aksel-` in v8)
- Use `BoxNew` (just use `Box` in v8)
- Skip `alt` text or `title` on icons/images
- Use color alone to convey information
- Hardcode pixel values for spacing
