import React from 'react';
import cookies from 'browser-cookies';
import { rock } from 'api/user';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/newId/operation';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.newIdOperation,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Operation extends React.Component {
  render() {
    const fields = [{
      title: 'id',
      field: 'id',
      hidden: true
    }, {
      title: '银行别称',
      field: 'bankCode'
    }, {
      title: '银行名',
      field: 'bankName'
    }];
    const btnEvent = {
      edit: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/newId/operation/addedit?code=${selectedRows[0].id}`);
        }
      }
    };
    return this.props.buildList({
      fields,
      btnEvent,
      pageCode: 631115
    });
  }
}

export default Operation;
