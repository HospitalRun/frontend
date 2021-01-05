import { Button, Tab, Panel, TabsHeader } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory, useLocation } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import useTranslator from '../../shared/hooks/useTranslator'
import { RootState } from '../../shared/store'
import Permissions from '../../shared/model/Permissions'
import Note from '../../shared/model/Note'
import { uuid } from '../../shared/util/uuid'
import ViewIncidentDetails from './ViewIncidentDetails'
import useIncident from '../hooks/useIncident'
import useResolveIncident from '../hooks/useResolveIncident'
import useAddIncidentNote from '../hooks/useAddIncidentNote'
import useDeleteIncidentNote from '../hooks/useDeleteIncidentNote'
import NotesTable from './NotesTable'
import NewNoteModal from '../../shared/notes/NewNoteModal'

const ViewIncident = () => {
  const { id } = useParams() as any
  const { permissions, user } = useSelector((root: RootState) => root.user)
  const { data, isLoading } = useIncident(id)
  const [mutate] = useResolveIncident()
  const [mutateAddNote] = useAddIncidentNote()
  const [deleteNote] = useDeleteIncidentNote()
  const location = useLocation()
  const history = useHistory()
  const { t } = useTranslator()
  const updateTitle = useUpdateTitle()
  updateTitle(t('incidents.reports.view'))
  useAddBreadcrumbs([
    {
      i18nKey: 'incidents.reports.view',
      location: `/incidents/${id}`,
    },
  ])

  //New Note Modal
  const newNoteState = {
    id: uuid(),
    givenBy: user?.id,
    text: '',
    date: '',
  }
  const [showNewNoteModal, setShowNoteModal] = useState<boolean>(false)
  const [editedNote, setEditedNote] = useState<Note>(newNoteState)
  const onNewNoteClick = () => {
    setEditedNote(newNoteState)
    setShowNoteModal(true)
  }
  const closeNewNoteModal = () => {
    setShowNoteModal(false)
  }

  if (id === undefined || permissions === undefined) {
    return <></>
  }

  const onResolve = async () => {
    await mutate(data)
    history.push('/incidents')
  }

  return (
    <div>
      <ViewIncidentDetails isLoading={isLoading} incident={data} />
      <TabsHeader>
        <Tab
          active={location.pathname === `/incidents/${id}/notes`}
          label={t('patient.notes.label')}
          onClick={() => history.push(`/incidents/${id}/notes`)}
        />
      </TabsHeader>
      <Panel>
        <div className="col-md-12 d-flex mb-3 justify-content-end">
          <Button outlined color="success" icon="add" iconLocation="right" onClick={onNewNoteClick}>
            {t('patient.notes.new')}
          </Button>
        </div>
        <NotesTable
          onEditNote={(note: Note) => {
            setEditedNote(note)
            setShowNoteModal(true)
          }}
          onDeleteNote={async (note: Note) => {
            await deleteNote({
              note: note,
              incidentId: id,
            })
            window.location.reload()
          }}
          notes={(data && data.notes) || []}
        />
      </Panel>
      {data &&
        data.resolvedOn === undefined &&
        data.status !== 'resolved' &&
        permissions.includes(Permissions.ResolveIncident) && (
          <div className="row float-right">
            <div className="btn-group btn-group-lg mt-3">
              <Button
                className="mr-2"
                onClick={onResolve}
                color="primary"
                key="incidents.reports.resolve"
              >
                {t('incidents.reports.resolve')}
              </Button>
            </div>
          </div>
        )}

      <NewNoteModal
        show={showNewNoteModal}
        toggle={closeNewNoteModal}
        onCloseButtonClick={closeNewNoteModal}
        setNote={setEditedNote}
        onSave={async (note: Note) => {
          await mutateAddNote({
            note: note,
            incidentId: id,
          })
          setEditedNote(newNoteState)
          window.location.reload()
        }}
        note={editedNote}
      />
    </div>
  )
}

export default ViewIncident
