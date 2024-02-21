import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useContext, useCallback, createContext } from 'react';

import { useParams } from 'src/routes/hook';
import { useAuthContext } from 'src/auth/hooks';

export const QrMenuContext = createContext();

export const useQrMenuContext = () => {
  const qrMenu = useContext(QrMenuContext);
  if (!qrMenu) throw Error('This is not a QR Menu Context');

  return qrMenu;
};

export function QrMenuContextProvider({ children }) {
  const { userID } = useParams();
  const { fsGetUser } = useAuthContext();
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: user = {} } = useQuery({
    queryKey: ['user', userID],
    queryFn: () => fsGetUser(userID),
    enabled: userID !== undefined,
  });

  const [selectedLanguage, setLanguage] = useState(user?.defaultLanguage || 'en');

  const setLabel = useCallback(
    (labelID) => {
      setLoading(true);
      // Remove labelID if it exists in the array
      setLabels((state) => state.filter((label) => label !== labelID));
      // Add labelID if it doesn't exist in the array
      if (!labels.includes(labelID)) {
        setLabels((state) => [...new Set([...state, labelID])]);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    },
    [labels]
  );

  const reset = useCallback(() => setLabels([]), []);

  const memoizedValue = useMemo(
    () => ({
      setLabel,
      labels,
      reset,
      loading,
      user,
      selectedLanguage,
      setLanguage,
    }),
    [labels, setLabel, reset, loading, user, selectedLanguage, setLanguage]
  );
  return <QrMenuContext.Provider value={memoizedValue}>{children}</QrMenuContext.Provider>;
}

QrMenuContextProvider.propTypes = { children: PropTypes.node };
