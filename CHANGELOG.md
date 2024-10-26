## 10/25/2024 - Version 1.0.0
Initial release of Logosaurus.

## 10/26/2024 - Version 1.1.0

### Added
- Added the methods: `info`, `warn`, `error`, `debug`, `trace` and `fatal` to the **Logger** class, to log messages with different levels of severity.

### Removed
- Made the `logMessage` method private.

### Changes
- Made the `deleteLogs` method more secure by checking if the `logFolder` property is set before deleting the logs and removing the `force: true` option from the `fs.rm` method.