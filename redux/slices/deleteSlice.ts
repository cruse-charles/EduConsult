import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// slice: deleteSlice.ts
interface DeleteItemState {
  confirmAction: (() => Promise<void>) | null
}

const initialState: DeleteItemState = { confirmAction: null }

const deleteItemSlice = createSlice({
  name: 'deleteItem',
  initialState,
  reducers: {
    openConfirm: (state, action: PayloadAction<() => Promise<void>>) => {
      state.confirmAction = action.payload
    },
    closeConfirm: (state) => {
      state.confirmAction = null
    },
  }
})

export const { openConfirm, closeConfirm } = deleteItemSlice.actions
export default deleteItemSlice.reducer