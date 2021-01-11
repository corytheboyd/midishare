# Icons

React versions of icons from https://heroicons.com.

Probably a bit wasteful w.r.t. tree shaking or something. Fight me.

## Usage

```tsx
<Icon name="chevron-double-left" size="sm" />
```

## Adding Icons

After finding the perfect icon from https://heroicons.com:

1. Copy source as `JSX` as opposed to `SVG`
1. Add both `sm` and `md` versions to respective directories
1. Follow the same naming convention for both the file and exported object

**Naming convention**: Canonical names like `chevron-left` become capitalized camel case like `ChevronLeft`.

## Publishing

As suggested in the [Heroicons README](https://github.com/tailwindlabs/heroicons), I am not pulling down their NPM package for this, and instead copying things into source code as needed.

### Seriously?!

Yes. Just follow the conventions in place and stop worrying about things being perfect. You're already perfect <3

If in this monorepo we need to use icons in another tailwind project, consider extracting, but still for internal use only. Someone will probably come along and formalize this at some point.
