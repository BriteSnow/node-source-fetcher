
### v0.1.6

  - Increase timeout from 300ms to 2000ms. 
  
### v0.1.5

  - Fix bug when file was empty (silently fail)

### v0.1.4
  - added `yaml|html|tmpl` scanned file extensions. 
  - add support for `# <origin src="..." />` comment tag.
  - add support for `<!-- <origin src="..." />` comment tag.
  
### v0.1.3

- Only write file when content changed.
- Console log - Only list files replaced or with errors.
- Console log - Add number replaced, error, and total processed.