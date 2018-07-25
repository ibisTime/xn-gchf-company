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
} from '@redux/people/wugong';
import { listWrapper } from 'common/js/build-list';
import { getQueryString, showWarnMsg, showSucMsg, getUserId, getUserKind } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.peopleWugong,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class PWugong extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      code: '',
      companyCode: ''
    };
    this.projectCode = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ 'companyCode': data.companyCode });
      });
    }
  };
  render() {
    const fields = [{
      field: 'projectCode',
      title: '项目编号',
      value: this.projectCode,
      hidden: true
    }, {
      field: 'name',
      title: '员工',
      formatter: (v, data) => {
        return data.staff ? data.staff.name : '-';
      }
    }, {
      field: 'type',
      title: '员工类别',
      type: 'select',
      search: true,
      key: 'staff_type'
    }, {
      field: 'position',
      title: '职位'
    }, {
      field: 'salary',
      title: '薪酬'
    }, {
      field: 'joinDatetime',
      title: '入职时间',
      type: 'date'
    }, {
      field: 'upUserName',
      title: '上级'
    }, {
      field: 'status',
      title: '状态',
      type: 'select',
      search: true,
      key: 'staff_status'
    }, {
      field: 'remark',
      title: '备注'
    }, {
      field: 'keyword',
      search: true,
      hidden: true,
      title: '关键字'
    }];
    let buttons = [{
      code: 'detail',
      name: '详情',
      handler: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/people/wugong/addedit?v=1&staffCode=${selectedRowKeys[0]}&projectCode=${this.projectCode}`);
        }
      }
    }];
    if (getUserKind() === 'O') {
      buttons.unshift({
        code: 'break',
        name: '请假',
        handler: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/people/wugong/break?code1=${selectedRows[0].code}`);
          }
        }
      });
      buttons.unshift({
        code: 'leave',
        name: '离职',
        handler: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/people/wugong/leave?code1=${selectedRows[0].code}`);
          }
        }
      });
    }
    if (getUserKind() === 'O') {
      return this.state.companyCode ? this.props.buildList({
        fields,
        searchParams: { projectCode: this.projectCode, updater: '', companyCode: this.state.companyCode },
        pageCode: 631465,
        rowKey: 'staffCode',
        buttons: buttons
      }) : null;
    } else {
      return this.props.buildList({
        fields,
        searchParams: { projectCode: this.projectCode, updater: '' },
        pageCode: 631465,
        rowKey: 'staffCode',
        buttons: buttons
      });
    }
  }
}

export default PWugong;
