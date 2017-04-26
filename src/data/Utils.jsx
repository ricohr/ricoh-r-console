//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import FS from 'fs';
import AppStore from '../data/AppStore';


/* collect writeable propValues
  @return Promise of deviceProps
 */
export function collectValues(property) {
  if (!property) {
    property = 'current';
  }
  const propValues = AppStore.getState().get('current').propValues;
  return Array.from(propValues.keys()).reduce((hash, propName)=>{
    const desc = propValues.get(propName).toObject();
    if (desc.get_set === 1) {
      hash[propName] = desc[property];
    }
    return hash;
  }, {});
}
