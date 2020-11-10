import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

function useQuery() {
  const location = useLocation();
  const history = useHistory();
  return [
    location.search,
    (search) => history.replace({ ...location, search: search.toString() })
  ];
}

export default function QueryStringUpdater({ init, ...props }) {
  const [queryString, setQueryString] = useQuery();
  const [mounted, setMounted] = useState(false);
  const queryParams = new URLSearchParams(queryString);
  const jsonProps = JSON.stringify(props);
  console.log("ZZZZ", jsonProps);

  useEffect(() => {
    if (!mounted) {
      init(queryParams);
      setMounted(true);
      return;
    }
    const newParams = new URLSearchParams(queryString);
    Object.entries(props).forEach(([key, value]) => {
      newParams.set(key, Array.isArray(value) ? value.join(",") : value);
    });
    setQueryString(newParams);
    // eslint-disable-next-line
  }, [jsonProps]);

  return <></>;
}
