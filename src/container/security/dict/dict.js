import React from 'react';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/security/menu';
import { listWrapper } from 'common/js/build-list';

@listWrapper(
  state => ({
    ...state.securityMenu,
    parentCode: state.menu.subMenuCode
  }),
  { setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData }
)
class SysParam extends React.Component {
  render() {
    const fields = [{
      field: 'parentKey',
      title: '种类',
      search: true,
      type: 'select',
      listCode: '631006',
      params: {
          type: 0
      },
      keyName: 'dkey',
      valueName: 'dvalue'
    }, {
      field: 'dkey',
      title: '字典键'
    }, {
      field: 'dvalue',
      title: '字典值'
    }, {
      field: 'updater',
      title: '更新人'
    }, {
      field: 'updateDatetime',
      title: '最近修改时间',
      type: 'datetime'
    }];
    return this.props.buildList({ fields, searchParams: {type: '1'}, pageCode: 631005, deleteCode: 631001, rowKey: 'id' });
  }
}

export default SysParam;
