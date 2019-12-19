import { Fields } from '../../lib/helpers';
import c from './content.yml';

export default {
  drugName: {
    root: true,
    heading: c.drugName.heading,
    fields: [Fields.Autocomplete('drugName')],
    next: 'forSaleInUS',
  },
  forSaleInUS: {
    heading: c.forSaleInUS.heading,
    fields: [
      Fields.Radio('forSaleInUS', c.forSaleInUS.options, { helpText: c.forSaleInUS.helpText }),
    ],
    next: obligationTest,
  },
  drugCost: {
    heading: c.drugCost.heading,
    fields: [Fields.Text('drugCost', { helpText: c.drugCost.helpText })],
    next: formData => (formData.drugCost <= 670 ? 'drugInOregonDatabase' : 'introDate'),
  },
  introDate: {
    heading: c.introDate.heading,
    fields: [Fields.Date('introDate')],
    next: 'introName',
  },
  introName: {
    heading: c.introName.heading,
    fields: [Fields.Autocomplete('introName')],
    next: 'introReminder',
  },
  introReminder: {
    heading: c.introReminder.heading,
    description: c.introReminder.description,
    fields: [Fields.Email('email', { label: c.introReminder.label, optional: true })],
    next: 'drugInOregonDatabase',
  },
  drugInOregonDatabase: {
    heading: c.drugInOregonDatabase.heading,
    fields: [Fields.Radio('forSaleInOregon', c.drugInOregonDatabase.options)],
    next: formData => {
      if (formData.drugNameInItems || formData.forSaleInOregon) {
        return formData.drugCost ? 'costCalc' : 'drugCost2';
      } else {
        return 'requestInfo';
      }
    },
  },
  drugCost2: {
    heading: c.drugCost.heading,
    fields: [Fields.Text('drugCost', { helpText: c.drugCost.helpText })],
    next: formData => (formData.drugCost < 100 ? 'requestInfo' : 'costCalc'),
  },
  costCalc: {
    heading: c.costCalc.heading,
    fields: [Fields.Text('netCostIncrease', { helpText: c.costCalc.helpText })],
    next: formData => (formData.netCostIncrease < 0.1 ? 'requestInfo' : 'thanks'),
  },
  requestInfo: {
    heading: c.requestInfo.heading,
    description: c.requestInfo.description,
    fields: [Fields.Email('email2', { label: c.requestInfo.label, optional: true })],
    next: 'thanks',
  },
  thanks: { heading: c.thanks.heading, description: c.thanks.description },
  noObligation: { heading: c.noObligation.heading },
};

function obligationTest(formData) {
  if (formData.forSaleInUS === 'No' && formData.drugNameInItems) {
    return 'drugInOregonDatabase';
  }
  if (formData.forSaleInUS === 'No' && !formData.drugNameInItems) {
    return 'noObligation';
  }
  return 'drugCost';
}
