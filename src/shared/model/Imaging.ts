import AbstractDBModel from './AbstractDBModel'

export default interface Imaging extends AbstractDBModel {
  code: string
  patient: string
  type: string
  status: 'requested' | 'completed' | 'canceled'
  visitId: string
  requestedOn: string
  requestedBy: string // will be the currently logged in user's id
  completedOn?: string
  canceledOn?: string
  notes?: string
}
