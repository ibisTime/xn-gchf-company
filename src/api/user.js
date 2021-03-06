import fetch from 'common/js/fetch';
import cookies from 'browser-cookies';

export function setRoleMenus(menuCodeList, roleCode, updater) {
  return fetch(631050, { menuCodeList, roleCode, updater });
}

export function rock(userId, updater) {
  return fetch(631075, { userId, updater });
}

export function getUserDetail(userId) {
  return fetch(631087, { userId });
}

export function getUserId() {
  return cookies.get('userId');
}

export function getjinduList(projectCodeList, companyCode, kind) {
  return fetch(631357, { projectCodeList, companyCode, kind: 'O' });
}

export function getUserErrorInfo(salaryCode) {
  return fetch(631456, { salaryCode });
}

export function query(idNo, projectCodeList) {
  return fetch(631418, { idNo, projectCodeList });
}

export function query1(idNo) {
  return fetch(631418, { idNo });
}

export function senderrInfo(salaryCode, handleNote, handler) {
  return fetch(631450, { salaryCode, handleNote, handler });
}

export function getUserWagesInfo(code) {
  return fetch(631447, { code });
}

export function gongzirizi(code) {
  return fetch(631457, { code });
}

export function getjinduO(projectCode) {
  return fetch(631386, { projectCode });
}

export function getjindu(companyCode, projectCode) {
  return fetch(631386, { companyCode, projectCode });
}

// 建档
export function jiandang(birthday,
  idAddress,
  idEndDate,
  idNation,
  idNo,
  idPic,
  idPolice,
  idStartDate,
  realName,
  sex,
  updater,
  companyCode) {
  return fetch(631410, { birthday,
    idAddress,
    idEndDate,
    idNation,
    idNo,
    idPic,
    idPolice,
    idStartDate,
    realName,
    sex,
    updater,
    companyCode});
}

// 免冠照片
export function mianguanPicture(info) {
  return fetch(631411, {
    code: info.code,
    feat: info.feat,
    pict1: info.pic1,
    updater: info.updater
  });
}

// 身份证照片*3
export function idPicture3(info) {
  return fetch(631414, {
    code: info.code,
    pict2: info.pic1,
    pict3: info.pic2,
    pict4: info.pic3,
    updater: info.updater
  });
}

// 获取特征值
export function getFeatInfo(pict1) {
  return fetch(631093, { pict1 });
}

// 入职
export function ruzhi(info) {
  return fetch(631460, info);
}
// 重新入职
export function reruzhi(info) {
  return fetch(631463, info);
}

// 详情查务工人员
export function getStaffDetail(code) {
  return fetch(631418, {
    idNo: code
  });
}

// 获取职位信息
export function getPosition(code) {
  return fetch(631418, {
    idNo: code
  });
}
// 详情查雇佣
export function getEmploy(code) {
  return fetch(631467, {
    code
  });
}
// 分页查用工合同
export function getEmployContract(info) {
  return fetch(631405, {
    start: 1,
    limit: 10,
    employCode: info.code || '',
    kind: 'O'
  });
}
// 列表查用工合同
export function getEmployContractList(info) {
  return fetch(631406, {
    projectCode: info.projectCode || '',
    employCode: info.code || '',
    kind: 'O'
  });
}
// 合同录入
export function uploadContract(info) {
  console.log(1);
  return fetch(631400, {
    contentPicList: info.contentPicList || [],
    employCode: info.code || '',
    updater: info.updater || ''
  });
}