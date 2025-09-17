import { createContext } from 'react'

export type DeleteConfirmFn = () => Promise<void> | void

interface DeleteConfirmContextValue {
  openConfirm: (fn: DeleteConfirmFn) => void
}

export const DeleteConfirmContext = createContext<DeleteConfirmContextValue>({
  openConfirm: () => {},
})