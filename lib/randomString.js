const randomString = function (length) {
  length = typeof(length) == 'number' && length > 0 ? length : false;

  if (length) {
    const possibleCharacters = 'abcdefghijklmopqrstuvwxyzABCDEFGHIJKLMNOPQRTSUVWXYZ0123456789';

    let string = '';

    for (let i = 0; i < length; i++) {
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

      string += randomCharacter;
    }

    return string;
  }

  else
    return false;
};

export default randomString;