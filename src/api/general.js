import fetch from 'common/js/fetch';

// 加载七牛token 805951
export function getQiniuToken() {
  return fetch(631091, {});
}

// 列表查操作指南 631126
export function getHelpList(info) {
  return fetch(631126, {
    orderColumn: info.orderColumn || '',
    orderDir: info.orderDir || '',
    systemCode: 'O'
  });
}
