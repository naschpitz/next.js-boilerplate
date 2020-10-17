import crypto from 'crypto';

const hash = function (string) {
  if (typeof(string) == 'string' && string.length > 0)
    return crypto.createHmac('sha256', process.env.APP_SECRET).update(string).digest('hex');

  else
    return false;
};

export default hash;