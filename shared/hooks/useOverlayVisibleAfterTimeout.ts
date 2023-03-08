import { useEffect, useState } from 'react';

export const useOverlayVisibleAfterTimeout = (
  visibleStart = false,
  ms = 1000
) => {
  const [visible, setVisible] = useState(false);
  const [savingTimeout, setSavingTimeout] = useState(null);

  useEffect(() => {
    if (visibleStart) {
      const timeout = setTimeout(() => {
        setVisible(true);
      }, ms);
      setSavingTimeout(timeout);
    } else {
      clearTimeout(savingTimeout);
      setVisible(false);
    }
  }, [visibleStart]);

  return visible;
};
