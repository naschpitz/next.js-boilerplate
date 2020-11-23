import React, { useEffect, useState } from 'react';

import Fetcher from '../../fetcher/fetcher';

export default function useUser(origin)  {
  const [ user, setUser ] = useState(null);

  useEffect(() => (loadUser()), []);

  async function loadUser(user) {
    if (user) {
      setUser(user);
      return;
    }

    const url = '/api/users/info';

    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }

    const response = await Fetcher.fetch(url, options, origin);

    if (!response.ok)
      return;

    const json = await response.json();
    setUser(json);
  }

  function clearUser() {
    setUser(null);
  }

  return [ user, loadUser, clearUser ];
}