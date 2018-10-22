import { computed } from '@ember/object';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import CascadingDeletions from 'hospitalrun/mixins/cascading-deletion';
import { translationMacro as t } from 'ember-i18n';
import { task, taskGroup, all } from 'ember-concurrency';

export default AbstractDeleteController.extend(PouchDbMixin, ProgressDialog, CascadingDeletions, {

  // these should be added to translations
  title: 'Delete Visit',
  progressTitle: t('Delete Visit Record'),
  progressMessage: t('Deleting visit and all associated records'),
  deleting: taskGroup(),

  deleteVisit() {
    return this.get('deleteVisitTask').perform();
  },

  getVisitInvoices(visit) {
    let visitId = visit.get('id');
    return this.store.query('invoice', {
      options: {
        key: visitId
      },
      mapReduce: 'invoice_by_visit'
    });
  },

  deleteActionTask: task(function* (visit) {
    // delete related records without modal dialogs
    this.send('closeModal');
    this.showProgressModal();
    yield this.deleteVisit(visit);
    this.closeProgressModal();
    this.send(this.get('afterDeleteAction'), visit);
  }).drop(),

  afterDeleteAction: computed('model.deleteFromPatient', function() {
    let deleteFromPatient = this.get('model.deleteFromPatient');
    if (deleteFromPatient) {
      return 'visitDeleted';
    } else {
      return 'closeModal';
    }
  }),

  actions: {
    delete(visit) {
      this.get('deleteActionTask').perform(visit);
    }
  }
});
