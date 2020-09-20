import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Imagings from '../../imagings/Imagings'
import NewImagingRequest from '../../imagings/requests/NewImagingRequest'
import * as titleUtil from '../../page-header/title/TitleContext'
import ImagingRepository from '../../shared/db/ImagingRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Imaging from '../../shared/model/Imaging'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const { TitleProvider } = titleUtil
const mockStore = createMockStore<RootState, any>([thunk])

describe('Imagings', () => {
  jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
  jest.spyOn(ImagingRepository, 'findAll').mockResolvedValue([])
  jest
    .spyOn(ImagingRepository, 'find')
    .mockResolvedValue({ id: '1234', requestedOn: new Date().toISOString() } as Imaging)
  jest
    .spyOn(PatientRepository, 'find')
    .mockResolvedValue({ id: '12345', fullName: 'test test' } as Patient)
  const setup = (permissions: Permissions[], isNew = false) => {
    const store = mockStore({
      title: 'test',
      user: { permissions: [permissions] },
      breadcrumbs: { breadcrumbs: [] },
      components: { sidebarCollapsed: false },
      imaging: {
        imaging: { id: 'imagingId', patient: 'patient' } as Imaging,
        patient: { id: 'patientId', fullName: 'some name' },
        error: {},
      },
    } as any)

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/imaging/new']}>
          <TitleProvider>{isNew ? <NewImagingRequest /> : <Imagings />}</TitleProvider>
        </MemoryRouter>
      </Provider>,
    )
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper }
  }

  describe('routing', () => {
    describe('/imaging/new', () => {
      it('should render the new imaging request screen when /imaging/new is accessed', async () => {
        const permissions: Permissions[] = [Permissions.RequestImaging]
        const { wrapper } = setup(permissions, true)

        expect(wrapper.find(NewImagingRequest)).toHaveLength(1)
      })

      it('should not navigate to /imagings/new if the user does not have RequestImaging permissions', async () => {
        const permissions: Permissions[] = []
        const { wrapper } = setup(permissions)

        expect(wrapper.find(NewImagingRequest)).toHaveLength(0)
      })
    })
  })
})
