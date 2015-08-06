# Very Large Image Database

This meteor project is designed to watch e.g. a networked folder of images and display them in an easily scannable & filterable interface.

### Setup:
- Create `settings.json` with a path to the directory you want to watch like so:
```
{
  "public": {
    "imgdir": "/Users/matt/Desktop/imagebank/"
  }
}
```
- Symlink that directory into your `/public` directory as `/public/imagebank`
- run `meteor run --settings settings.json`
