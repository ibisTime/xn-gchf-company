import fetch from 'common/js/fetch';
import { SYS_USER, SYS_USER_TG } from 'common/js/config';

/**
 * 分页查询账号
 * @param start
 * @param limit
 * @param type
 */
export function getPageAccount({ start, limit, type }) {
  return fetch(802500, {
    // updater: cookies.get('userName'),
    start,
    limit,
    type
  });
}

/**
 * 列表查公司
 */
export function getCompany() {
  return fetch(631026);
}

/**
 * 列表查部门
 * @param companyCode
 */
export function getBumen(info) {
  return fetch(631036, {
    parentCode: info.parentCode || '',
    projectCode: info.projectCode || ''
  });
}

export function getBumen1(info) {
  return fetch(631036, {
    parentCode: info.parentCode || '',
    projectCode: info.projectCode || ''
  });
}
/**
 * 删除公司
 * @param code
 */
export function deleteCompany1(code) {
  return fetch(631021, { code });
}

/**
 * 查银行
 * @param code
 */
export function getBankNameByCode() {
  return fetch(631116);
}

export function luru(param) {
  return fetch(631413, { ...param });
}

export function getBankCodeByName(bankName) {
  return fetch(631116, { bankName, updater: '' });
}

export function getProjectList(kind, projectCodeList, companyCode) {
  return fetch(631357, { updater: '', kind, projectCodeList, companyCode: companyCode || '' });
}

export function getProjectListForO(info) {
  return fetch(631357, { updater: '',
  kind: 'O',
  companyCode: info.companyCode || '',
  status: info.status
});
}

export function getProjectStatus() {
  return fetch(631006, { parentKey: 'project_status' });
}
/**
 * 详情查询项目
 * @param code
 */
export function getProject(code) {
  return fetch(631358, { code });
}
/**
 * 分页查询工资条
 * @param start
 * @param limit
 * @param projectCode
 */
export function getPagePayCode(start, limit, projectCode) {
  return fetch(631445, {
    start,
    limit,
    projectCode,
    month: new Date().getMonth() + 1
  });
}
/**
 * 分页查询考勤记录
 * @param start
 * @param limit
 * @param projectCode
 */
export function getPageChecks(start, limit, projectCode) {
  return fetch(631395, {
    start,
    limit,
    projectCode
  });
}
/**
 * 分页查询异常信息
 * @param start
 * @param limit
 * @param projectCode
 */
export function getPageabnormal(start, limit, projectCode, status) {
  return fetch(631445, {
    start,
    limit,
    projectCode,
    statusList: ['4', '5', '6', '7']
  });
}

/**
 * 查询累积发薪
 * @param projectCode
 */
export function getTotalSalary(projectCode) {
  return fetch(631448, {
    projectCode
  });
}

/**
 * 批量删除工资条
 * @param salaryCodeList
 */
export function deleteSalaryMany(salaryCodeList) {
  return fetch(631441, {
    salaryCodeList
  });
}

/**
 * 列表查支行
 */
export function getZhiHang() {
  return fetch(631106, {});
}