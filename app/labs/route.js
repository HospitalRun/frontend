import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import { t } from 'hospitalrun/macro';
export default AbstractModuleRoute.extend({
  addCapability: 'add_lab',
  additionalModels: [{
    name: 'labPricingTypes',
    findArgs: ['lookup', 'lab_pricing_types']
  }],
  allowSearch: false,
  moduleName: 'labs',
  newButtonText: t('labs.buttons.newButton'),
  sectionTitle: t('labs.sectionTitle')
});
