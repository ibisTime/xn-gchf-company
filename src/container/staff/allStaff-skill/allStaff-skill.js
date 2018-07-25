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
} from '@redux/staff/allStaff-skill';
import { Modal } from 'antd';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate, getQueryString } from 'common/js/util';
import { getUserDetail } from 'api/user';
import fetch from 'common/js/fetch';

@listWrapper(
    state => ({
      ...state.staffAllStaffSkill,
      parentCode: state.menu.subMenuCode
    }),
    {
      setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData
    }
)
class Skill extends React.Component {
  constructor(props) {
    super(props);
    this.staffCode = getQueryString('staffCode', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'name',
      title: '技能名称'
    }, {
      field: 'pdf',
      title: '证书',
      type: 'img'
    }, {
      field: 'score',
      title: '评分'
    }];
    const btnEvent = {
      add: (selectedRowKeys, selectedRows) => {
        this.props.history.push(`/staff/allStaff/skill-addedit?staffCode=${this.staffCode}`);
      },
      edit: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/skill-addedit?code=${selectedRowKeys[0]}&staffCode=${this.staffCode}`);
        }
      },
      delete: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          Modal.confirm({
            okText: '确认',
            cancelText: '取消',
            content: '确定删除该技能？',
            onOk: () => {
              this.setState({ fetching: true });
              fetch(631501, {code: selectedRowKeys[0]}).then(() => {
                showSucMsg('操作成功');
                this.props.cancelFetching();
                this.props.getPageData();
              }).catch(this.props.cancelFetching);
            }
          });
        }
      }
    };
    return this.props.buildList({
      fields,
      btnEvent,
      searchParams: {
        staffCode: this.staffCode
      },
      buttons: [{
        code: 'add',
        name: '新增'
      }, {
        code: 'edit',
        name: '修改'
      }, {
        code: 'delete',
        name: '删除'
      }],
      pageCode: 631505
    });
  }
}

export default Skill;
