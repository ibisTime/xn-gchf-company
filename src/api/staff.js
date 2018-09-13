import fetch from 'common/js/fetch';
import { SYS_USER, SYS_USER_TG } from 'common/js/config';
import { getUserId } from 'common/js/util';

// 请假
export function askWeekday(info) {
  return fetch(631461, {
    employCode: info.employCode,
    startDatetime: info.startDatetime,
    endDatetime: info.endDatetime,
    updater: getUserId()
  });
}

// 离职
export function askLeave(info) {
  return fetch(631462, {
    projectCode: info.projectCode,
    staffCode: info.staffCode,
    leavingDatetime: info.leavingDatetime,
    updater: getUserId()
  });
}

// 修改银行卡
export function editBankCard(info) {
  return fetch(631422, {
    bankcardNumber: info.bankcardNumber,
    bankCode: info.bankCode,
    bankName: info.bankName,
    code: info.code,
    subbranch: info.subbranch,
    updater: getUserId()
  });
}

// 查银行卡详情
export function queryBankCardDetail(code) {
  return fetch(631427, {
    code
  });
}

// 详情查询务工人员
export function queryStaffDetail(code) {
  return fetch(631417, {
    code
  });
}