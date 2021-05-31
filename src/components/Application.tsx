import React, { ReactElement, useEffect } from 'react'

import runEvery from 'lib/runEvery'
import useAccount from 'lib/useAccount'
import AccountContext from 'src/context/accountContext'

import Agenda from './Agenda'

const REAL_TIME_UPDATES_INTERVAL = 10000

const Application = (): ReactElement => {
  const [account, refreshAccount, error] = useAccount()

  useEffect(
    () => runEvery(REAL_TIME_UPDATES_INTERVAL, refreshAccount),
    [refreshAccount],
  )

  if (error)
    console.log('Unable to refreshe account, will try again soon', error)

  return (
    <AccountContext.Provider value={account}>
      <Agenda
        globalMessage={
          !error ? undefined : 'Unable to refresh account... trying again.'
        }
      />
    </AccountContext.Provider>
  )
}

export default Application
