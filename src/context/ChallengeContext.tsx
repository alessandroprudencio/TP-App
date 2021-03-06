import React, { createContext, useContext, useState } from 'react';

export const ChallengeContext = createContext({
  // selectedChallenge: {},
  // setSelectedChallenge: (_params: IChallenge) => {},
  isRefreshChallenges: false,
  setIsRefreshChallenges: (_value: boolean) => {},
});

export const ChallengeProvider = ({ children }: any) => {
  const [isRefreshChallenges, setIsRefreshChallenges] = useState<boolean>(false);

  return (
    <ChallengeContext.Provider
      value={{
        // selectedChallenge: {},
        // setSelectedChallenge: (params: IChallenge) => selectedChallenge(params),
        isRefreshChallenges: isRefreshChallenges,
        setIsRefreshChallenges: (value) => setIsRefreshChallenges(value),
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => useContext(ChallengeContext);
