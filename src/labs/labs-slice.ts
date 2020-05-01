import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Lab from '../model/Lab'
import LabRepository from '../clients/db/LabRepository'
import SortRequest from '../clients/db/SortRequest'
import { AppThunk } from '../store'

interface LabsState {
  isLoading: boolean
  labs: Lab[]
  statusFilter: 'requested' | 'completed' | 'canceled' | 'all'
}

const sortRequest: SortRequest = {
  sorts: [
    {
      field: 'requestedOn',
      direction: 'desc',
    },
  ],
}

const initialState: LabsState = {
  isLoading: false,
  labs: [],
  statusFilter: 'all',
}

const startLoading = (state: LabsState) => {
  state.isLoading = true
}

const labsSlice = createSlice({
  name: 'labs',
  initialState,
  reducers: {
    fetchLabsStart: startLoading,
    fetchLabsSuccess(state, { payload }: PayloadAction<Lab[]>) {
      state.isLoading = false
      state.labs = payload
    },
    setStatusFilter(state, { payload }: PayloadAction<string>) {
      state.statusFilter =
        payload === 'requested'
          ? 'requested'
          : payload === 'completed'
          ? 'completed'
          : payload === 'canceled'
          ? 'canceled'
          : 'all'
    },
  },
})
export const { fetchLabsStart, fetchLabsSuccess, setStatusFilter } = labsSlice.actions

export const setFilter = (selection: string): AppThunk => async (dispatch) => {
  dispatch(setStatusFilter(selection))
}

export const fetchLabs = (): AppThunk => async (dispatch) => {
  dispatch(fetchLabsStart())
  const labs = await LabRepository.findAll(sortRequest)
  dispatch(fetchLabsSuccess(labs))
}

export const searchLabs = (text: string): AppThunk => async (dispatch, getState) => {
  dispatch(fetchLabsStart())

  let labs
  const status = !getState() ? 'all' : getState().labs.statusFilter

  if (text.trim() === '' && status === initialState.statusFilter) {
    labs = await LabRepository.findAll(sortRequest)
  } else {
    labs = await LabRepository.search({
      text,
      status,
      sortRequest,
    })
  }

  dispatch(fetchLabsSuccess(labs))
}

export default labsSlice.reducer
