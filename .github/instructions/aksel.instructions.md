---
applyTo: "src/**/*.{tsx,ts,css,less}"
---

# Aksel v8 Styling Rules

## Spacing Tokens

Use `space-` prefix in all Aksel component props (Box, VStack, HStack, HGrid):

| Token      | px  | Token       | px  |
| ---------- | --- | ----------- | --- |
| `space-0`  | 0   | `space-20`  | 20  |
| `space-1`  | 1   | `space-24`  | 24  |
| `space-2`  | 2   | `space-32`  | 32  |
| `space-4`  | 4   | `space-40`  | 40  |
| `space-6`  | 6   | `space-48`  | 48  |
| `space-8`  | 8   | `space-64`  | 64  |
| `space-12` | 12  | `space-80`  | 80  |
| `space-16` | 16  | `space-128` | 128 |

## Background Tokens

Root: `"default"`, `"input"`, `"raised"`, `"sunken"`

Semantic: `"neutral-soft"`, `"accent-soft"`, `"success-soft"`, `"warning-soft"`, `"danger-soft"`, `"info-soft"`
Strong: `"accent-strong"`, `"success-strong"`, `"warning-strong"`, `"danger-strong"`, `"info-strong"`

## Border Radius

Numeric strings only: `"0"`, `"2"`, `"4"`, `"8"`, `"12"`, `"16"`, `"full"`

## Shadow

Only `"dialog"` is valid. No `"small"`, `"medium"`, or `"large"`.

## Color Variants

Use `data-color` attribute (not `variant` for color):

```tsx
<Button data-color="danger" variant="primary">Slett</Button>
<Tag data-color="warning" variant="outline" size="small">Frist</Tag>
```

## Tailwind

- Aksel token classes are used via Tailwind utilities: `bg-ax-bg-default`, `text-ax-text-neutral`, `border-ax-border-neutral-subtle`
- Standard Tailwind layout utilities are fine: `flex`, `w-full`, `max-w-[50rem]`
- Standard Tailwind spacing (`p-4`, `gap-4`) is acceptable for simple cases
- Prefer Aksel props for spacing on Aksel components (Box, VStack, HStack, HGrid)

## CSS Classes

All Aksel classes use `.aksel-` prefix (not `.navds-`).

## ❌ Never Use (v7 tokens)

- `surface-default`, `surface-subtle`, `bg-subtle` → use `"default"`, `"neutral-soft"`
- `borderRadius="large"` / `"medium"` → use `"8"`, `"4"`
- Numeric gap/padding (`gap="4"`, `padding="6"`) → use `gap="space-16"`, `padding="space-24"`
- `shadow="large"` → use `shadow="dialog"`
- `.navds-*` classes → use `.aksel-*`
- `BoxNew` → use `Box`
