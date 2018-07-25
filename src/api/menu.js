import fetch from 'common/js/fetch';
import { getRoleCode } from 'common/js/util';

/**
 * 获取当前菜单拥有的按钮列表
 * @param parentKey
 */
export function getOwnerBtns(parentCode) {
  // 627056
  return fetch(631056, {
    parentCode,
    roleCode: getRoleCode(),
    type: 2,
    updater: '',
    roleType: 'O'
  });
}

/**
 * 列表获取菜单和按钮
 */

export function getMenuBtnList() {
  return fetch(631066, {roleType: 'O'});
}

/**
 * 根据角色列表获取菜单
 */
export function getRoleMenuList() {
  return fetch(631056, {
    type: 1,
    roleCode: getRoleCode(),
    updater: '',
    roleType: 'O'
  });
}

/**
 * 根据角色列表获取菜单和按钮getRoleMenuList
 */
export function getRoleMenuBtnList(roleCode) {
  roleCode = roleCode || getRoleCode();
  return fetch(631056, { roleCode, updater: '', roleType: 'O' });
}
