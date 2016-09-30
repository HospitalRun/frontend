import Ember from 'ember';
import PatientId from 'hospitalrun/mixins/patient-id';
export default Ember.Mixin.create(PatientId, {
  newPatientId: null,

  actions: {
    addedNewPatient: function(record) {
      this.send('closeModal');
      this.set('model.patient', record);
      this.set('newPatientId');
      this.send('update');
    }
  },

  addNewPatient: function() {
    let i18n = this.get('i18n');
    this.displayAlert(i18n.t('alerts.pleaseWait'), i18n.t('messages.newPatientHasToBeCreated'));
    this._getNewPatientId().then(function(friendlyId) {
      var patientTypeAhead = this.get('model.patientTypeAhead'),
        nameParts = patientTypeAhead.split(' '),
        patientDetails = {
          friendlyId: friendlyId,
          patientFullName: patientTypeAhead,
          requestingController: this
        },
        patient;
      if (nameParts.length >= 3) {
        patientDetails.firstName = nameParts[0];
        patientDetails.middleName = nameParts[1];
        patientDetails.lastName = nameParts.splice(2, nameParts.length).join(' ');
      } else if (nameParts.length === 2) {
        patientDetails.firstName = nameParts[0];
        patientDetails.lastName = nameParts[1];
      } else {
        patientDetails.firstName = patientTypeAhead;
      }
      patient = this.store.createRecord('patient', patientDetails);
      this.send('openModal', 'patients.quick-add', patient);
    }.bind(this));
  },

  _getNewPatientId: function() {
    var newPatientId = this.get('newPatientId');
    if (Ember.isEmpty(newPatientId)) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        this.generateFriendlyId().then(function(friendlyId) {
          this.set('newPatientId', friendlyId);
          resolve(friendlyId);
        }.bind(this), reject);
      }.bind(this));
    } else {
      return Ember.RSVP.resolve(newPatientId);
    }
  }
});
