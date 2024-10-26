# Logosaurus (_log-o-saurus_)

Logosaurus is a simple logger made to be used as a middleware in ExpressJS applications. It is designed to be simple to use and easy to understand. It is also designed to be easily extensible and customizable.

## Installation

```bash
npm install logosaurus
```

## Usage

```javascript
const express = require('express');
const Logger = require('logosaurus');

const app = express();
const logger = new Logger();

app.use(logger.logRequest.bind(logger));

logger.info('Hello, World!');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  logger.info('Server is running on port 3000');
});
```

Running the code above will log the following messages:

```
2021-07-01T00:00:00.000Z - [INFO] - Logger initialized with UTC offset -03:00

2021-07-01T00:00:00.000Z - [INFO] - Server is running on port 3000

2021-07-01T00:00:00.000Z - [INFO] - Hello, World!

2021-07-01T00:00:00.000Z - [INFO] - [GET] / - ::1

2021-07-01T00:00:00.000Z - [INFO] - [GET] / - ::1 - 200 - 0ms
```

The logs will also be saved to a file in the `logs` folder (or the folder you especified) with the following format:

```
2021-07-01T00:00:00.000Z - [INFO] - Logger initialized with UTC offset -03:00
2021-07-01T00:00:00.000Z - [INFO] - Server is running on port 3000
2021-07-01T00:00:00.000Z - [INFO] - Hello, World!
2021-07-01T00:00:00.000Z - [INFO] - [GET] / - ::1
2021-07-01T00:00:00.000Z - [INFO] - [GET] / - ::1 - 200 - 0ms
```

## Customization

Logosaurus is designed to be easily customizable. You can customize the logger by passing an options object to the constructor. The options object can have the following properties:

- `fileLogging`: A boolean that determines whether or not to log to a file. Default is `true`.
- `consoleLogging`: A boolean that determines whether or not to log to the console. Default is `true`.
- `logFolder`: A string that specifies the folder to log to. Default is `logs`.
- `utcOffset`: A string that specifies the UTC offset to use when logging. Default is `-03:00`.
- `startMessage`: A boolean that determines whether or not to log a start message. Default is `true`.

Here is an example of how to customize the logger:

```javascript
const logger = new Logger({
  fileLogging: true,
  consoleLogging: true,
  logFolder: 'logs',
  utcOffset: '-03:00',
  startMessage: true
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
