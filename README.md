# Obsidian Frontmatter Variables

Use the frontmatter properties as variables in the document body.

### How to install
### How to use

```
---
env: development
---

Deploy to {{env}}.
```

This plugin uses the MarkdownPostProcessor to convert the placeholders into the property values defined in the frontmatter when switching to Reading Mode.

### Development


### TODO
- [ ] Fix support for language code blocks
- [ ] Fix bug where lines are repeated when a blank line is present between checklist items
