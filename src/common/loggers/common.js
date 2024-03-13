const fs = require('fs');

function pad(num) {
  return (num > 9 ? '' : '0') + num;
}

module.exports.streamWriter = function (severity, version) {
  return function (time) {
    const pathVersion = `v${version ?? '1'}`;

    const date = time ?? new Date();
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    const dir = `logs/${pathVersion}/${severity}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return `${dir}/${year}-${month}-${day}.log`;
  };
};
