import {Privilege} from 'uione';
import {storage} from 'uione';

export function authorized(path: string): boolean {
  const user = storage.user();
  const privileges = user ? user.privileges : null;
  if (!privileges) {
    return false;
  } else {
    return hasPrivilege(privileges, path);
  }
}

export function hasPrivilege(privileges: Privilege[], link: string): boolean {
  if (!privileges || !link) {
    return false;
  }
  let result = link.trim();
  if (result.endsWith('/')) {
    result = result.substr(0, result.length - 1);
  }
  for (const privilege of privileges) {
    if (result.startsWith(privilege.path as any)) {
      return true;
    } else if (privilege.children && privilege.children.length > 0) {
      for (const item of privilege.children) {
        if (item.path && result.startsWith(item.path)) {
          return true;
        } else if (item.children && item.children.length > 0) {
          for (const sub of item.children) {
            if (sub.path && result.startsWith(sub.path)) {
              return true;
            } else if (sub.children && sub.children.length > 0) {
              for (const last of sub.children) {
                if (last.path && result.startsWith(last.path)) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
  }
  return false;
}
