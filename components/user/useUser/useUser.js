import React, { useEffect, useState } from 'react';

import Fetcher from '../../fetcher/fetcher';

export default function useUser(origin)  {
  const [ user, setUser ] = useState(null);

  useEffect(() => (updateUser()), []);

  function updateUser() {
    Fetcher.fetch('/api/user/info', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, origin).then((response) => {
      if (!response.ok)
        return;

      response.json().then((result) => (setUser(result.user)));
    });
  }

  function clearUser() {
    setUser(null);
  }

  return [ user, updateUser, clearUser ];
}