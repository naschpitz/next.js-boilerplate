export default class Fetcher {
  static fetch(path, options, origin) {
    return fetch(`${origin}${path}`, options);
  }
}
