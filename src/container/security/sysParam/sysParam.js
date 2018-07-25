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
import { showWarnMsg } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.securityMenu,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class SysParam extends React.Component {
  render() {
    const fields = [{
      field: 'remark',
      title: '参数名'
    }, {
      field: 'cvalue',
      title: '参数值'
    }, {
      field: 'updateDatetime',
      title: '最近修改时间',
      type: 'datetime'
    }];
    const btnEvent = {
      edit: (selectedRowKeys, selectedRows) => {
        console.log(selectedRows);
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/system/sysPara/addedit?code=${selectedRows[0].id}`);
        }
      }
    };
    return this.props.buildList({
      fields,
      btnEvent,
      pageCode: 631015,
      searchParam: {
        updater: null
      }
    });
  }
}

export default SysParam;
