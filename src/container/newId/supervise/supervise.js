import React from 'react';
import cookies from 'browser-cookies';
import { rock } from 'api/user';
import { Modal } from 'antd';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/newId/supervise';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.newIdSupervise,
    parentCode: state.menu.subMenuCode
  }),
  { setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData }
)
class Supervise extends React.Component {
  render() {
    const fields = [{
      title: '登录名',
      field: 'loginName'
    }, {
      title: '手机号',
      field: 'mobile'
    }, {
      title: '状态',
      field: 'status',
      type: 'select',
      key: 'user_status'
    // }, {
    //   title: '角色',
    //   field: 'roleCode',
    //   type: 'select',
    //   params: {
    //     updater: ''
    //   },
    //   listCode: '631046',
    //   keyName: 'code',
    //   valueName: 'name'
    }, {
      title: '备注',
      field: 'remark'
    }, {
      title: '关键字',
      field: 'keyword',
      search: true,
      hidden: true
    }];
    const btnEvent = {
      reset: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/security/user/resetPwd?userId=${selectedRowKeys[0]}&loginName=${selectedRows[0].loginName}`);
        }
      },
      rock: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          Modal.confirm({
            okText: '确认',
            cancelText: '取消',
            content: '确定注销/激活？',
            onOk: () => {
              this.props.doFetching();
              rock(selectedRowKeys[0]).then(() => {
                showSucMsg('操作成功');
                this.props.cancelFetching();
              }).catch(this.props.cancelFetching);
            }
          });
        }
      },
      assign: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/security/user/setRole?userId=${selectedRowKeys[0]}&loginName=${selectedRows[0].loginName}`);
        }
      },
      changeMobile: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/security/user/changeMobile?userId=${selectedRowKeys[0]}&loginName=${selectedRows[0].loginName}`);
        }
      },
      setBumen: (selectedRowKeys, selectedRows) => {
        this.props.history.push(`/security/user/setBumen?userId=${selectedRowKeys[0]}&loginName=${selectedRows[0].loginName}`);
      }
    };
    return this.props.buildList({
      fields,
      btnEvent,
      searchParams: {
        'type': 'S',
        'updater': ''
      },
      pageCode: 631085,
      rowKey: 'userId'
    });
  }
}

export default Supervise;
