import { useEffect, useState } from 'react';

export const useOverlayVisibleAfterTimeout = (
  visibleStart = false,
  ms = 1000
) => {
  const [visible, setVisible] = useState(false);
  const [savingTimeout, setSavingTimeout] = useState(null);

  useEffect(() => {
    if (visibleStart) {
      const timeoutID = setTimeout(() => {
        setVisible(true);
      }, ms);
      setSavingTimeout(timeoutID);
    } else {
      clearTimeout(savingTimeout);
      setVisible(false);
    }
  }, [visibleStart]);

  return visible;
};
