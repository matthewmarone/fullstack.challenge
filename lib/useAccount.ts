import { useState } from 'react'

import Account from 'src/models/Account'
import createAccount from 'lib/createAccount'

import getUpdatedAccount from './getUpdatedAccount'

const initialAccountValue = createAccount()

const useAccount = (): [Account, () => Promise<void>, Error] => {
  const [account, setAccount] = useState<Account>(initialAccountValue)
  const [error, setError] = useState<Error | null>(null)
  const refreshAccount = async () => {
    try {
      const newAccount = await getUpdatedAccount(account)
      setAccount(newAccount)
      setError(null)
    } catch (e) {
      setError(e)
    }
  }

  return [account, refreshAccount, error]
}

export default useAccount
