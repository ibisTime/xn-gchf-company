import React from 'react';
import cookies from 'browser-cookies';
import { rock, getUserId } from 'api/user';
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
} from '@redux/security/user';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.securityUser,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class User extends React.Component {
  render() {
    const fields = [{
      title: '用户名',
      field: 'loginName',
      render: (v) => v + '1'
    }, {
      title: '状态',
      field: 'status',
      type: 'select',
      key: 'user_status'
    }, {
      title: '角色',
      field: 'roleCode',
      type: 'select',
      listCode: '631046',
      params: {
        updater: ''
      },
      keyName: 'code',
      valueName: 'name'
    }, {
      title: '手机号',
      field: 'mobile',
      mobile: true
    }, {
      title: '关键字',
      field: 'keyword',
      placeholder: '用户名/手机号',
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
              rock(selectedRowKeys[0], getUserId()).then(() => {
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
      }
    };
    return this.props.buildList({
      fields,
      btnEvent,
      searchParams: cookies.get('loginKind') === 'P' ? { type: 'P', updater: '' }
        : cookies.get('loginKind') === 'O' ? { 'type': 'O', updater: '' }
          : cookies.get('loginKind') === 'B' ? { 'type': 'B', updater: '' } : { 'type': 's', updater: '' },
      pageCode: 631085,
      rowKey: 'userId'
    });
  }
}

export default User;
