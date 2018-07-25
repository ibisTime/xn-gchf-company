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
export function getCompany(projectCodeList, kind) {
  return fetch(631026, { projectCodeList, kind });
}

export function getCompanyDetail(code) {
  return fetch(631027, { code });
}
/**
 * 列表查部门
 * @param companyCode
 */
export function getBumen(companyCode) {
  return fetch(631036, { companyCode });
}

/**
 * 删除公司
 * @param code
 */
export function deleteCompany1(code) {
  return fetch(631021, { code });
}

/**
 * 删除部门
 * @param code
 */
export function deleteBumen1(code) {
  return fetch(631031, { code });
}