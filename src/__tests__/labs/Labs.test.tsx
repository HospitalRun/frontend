import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Labs from '../../labs/Labs'
import NewLabRequest from '../../labs/requests/NewLabRequest'
import ViewLab from '../../labs/ViewLab'
import LabRepository from '../../shared/db/LabRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Lab from '../../shared/model/Lab'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Labs', () => {
  jest.spyOn(LabRepository, 'findAll').mockResolvedValue([])
  jest
    .spyOn(LabRepository, 'find')
    .mockResolvedValue({ id: '1234', requestedOn: new Date().toISOString() } as Lab)
  jest
    .spyOn(PatientRepository, 'find')
    .mockResolvedValue({ id: '12345', fullName: 'test test' } as Patient)

  const setup = async (initialEntry: string, permissions: Permissions[]) => {
    const store = mockStore({
      user: { permissions },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[initialEntry]}>
            <Labs />
          </MemoryRouter>
        </Provider>,
      )
    })

    return { wrapper: wrapper as ReactWrapper }
  }

  describe('routing', () => {
    describe('/labs/new', () => {
<<<<<<< HEAD
      it('should render the new lab request screen when /labs/new is accessed', () => {
        const store = mockStore({
          title: 'test',
          user: { permissions: [Permissions.RequestLab] },
          breadcrumbs: { breadcrumbs: [] },
          components: { sidebarCollapsed: false },
        } as any)

        const wrapper = mount(
          <Provider store={store}>
            <MemoryRouter initialEntries={['/labs/new']}>
              <Labs />
            </MemoryRouter>
          </Provider>,
        )
=======
      it('should render the new lab request screen when /labs/new is accessed', async () => {
        const { wrapper } = await setup('/labs/new', [Permissions.RequestLab])
>>>>>>> 81b32d25... refactor(labs): use react query instead of redux

        expect(wrapper.find(NewLabRequest)).toHaveLength(1)
      })

      it('should not navigate to /labs/new if the user does not have RequestLab permissions', async () => {
        const { wrapper } = await setup('/labs/new', [])

        expect(wrapper.find(NewLabRequest)).toHaveLength(0)
      })
    })

    describe('/labs/:id', () => {
      it('should render the view lab screen when /labs/:id is accessed', async () => {
        const { wrapper } = await setup('/labs/1234', [Permissions.ViewLab])

        expect(wrapper.find(ViewLab)).toHaveLength(1)
      })

      it('should not navigate to /labs/:id if the user does not have ViewLab permissions', async () => {
        const { wrapper } = await setup('/labs/1234', [])

        expect(wrapper.find(ViewLab)).toHaveLength(0)
      })
    })
  })
})
