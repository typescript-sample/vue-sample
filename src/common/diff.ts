// import {clone, diff} from 'reflectx';
// import {Vue} from 'vue-property-decorator';
// import {DiffApprService, DiffModel, messageByHttpStatus} from './core';
// import {Locale} from './core';
// import {ResourceService} from './core';
// import {LoadingService} from './core';

// export function formatDiffModel<T, ID>(obj: DiffModel<T, ID>, formatFields?: (obj3: T) => T): DiffModel<T, ID> {

//   if (!obj) {
//     return obj;
//   }
//   const obj2 = clone(obj);
//   if (!obj2.origin) {
//     obj2.origin = {};
//   } else {
//     if (typeof obj2.origin === 'string') {
//       obj2.origin = JSON.parse(obj2.origin);
//     }
//     if (formatFields && typeof obj2.origin === 'object' && !Array.isArray(obj2.origin)) {
//       obj2.origin = formatFields(obj2.origin);
//     }
//   }
//   if (!obj2.value) {
//     obj2.value = {};
//   } else {
//     if (typeof obj2.value === 'string') {
//       obj2.value = JSON.parse(obj2.value);
//     }
//     if (formatFields && typeof obj2.value === 'object' && !Array.isArray(obj2.value)) {
//       obj2.value = formatFields(obj2.value);
//     }
//   }
//   return obj2;
// }
