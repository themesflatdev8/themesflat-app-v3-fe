import { useEffect, useState } from "react";

const useDebounce = (value: string, delay = 500) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const debounceHandler = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(debounceHandler);
    // eslint-disable-next-line
  }, [value]);

  return debounceValue;
};

export default useDebounce;
