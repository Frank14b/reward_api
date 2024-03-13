const rfs = require('rotating-file-stream');

const { streamWriter } = require('./common');

module.exports = ({ version, ...options }) => {
  return rfs.createStream(streamWriter('info', version), {
    ...options,
    interval: '1d',
  });
};
