const Logger = require('../dist/logger.cjs');
const fs = require('fs');

describe('Logger', () => {
    let logger;
    let consoleLogSpy;

    beforeEach(() => {
        logger = new Logger();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    
    afterAll(() => {
        var logger = new Logger();
        logger.deleteLogs();
    })

    describe('logMessage', () => {
        it('should log message to the console', () => {
            const message = 'Hello World';
            logger.logMessage(message);
            // expect console.log to have been called with string: 'timestamp - [INFO] - Hello World'
            expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringMatching(/.* - \[INFO\] - Hello World/));
        });

        it('should write message to file', () => {
            const message = 'Hello World';
            const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
            logger.logMessage(message);
            expect(writeSpy).toHaveBeenCalledWith(expect.any(String), expect.stringMatching(/.* - \[INFO\] - Hello World/), expect.any(Object));
        });
    })
});