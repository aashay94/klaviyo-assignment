const winston = require('winston');

const getLogger = () => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      /* If an error is caught, it will create two new files in the root directory called `error.log` and `combined.log`.
         If the level of the error is equal to `error` it will be stored inside error.log and combined.log.
         All other errors will always be saved to combined.log.
      */
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  return logger;
};

module.exports = getLogger;
