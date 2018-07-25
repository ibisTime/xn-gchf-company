import React from 'react';
import cookies from 'browser-cookies';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/staff/allStaff-history';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getQueryString, getUserId, getUserKind } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.staffAllStaffHistory,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AllStaffHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyCode: '',
      projectCodeList: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.staffCode = getQueryString('staffCode', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        console.log(data);
        this.setState({ 'companyCode': data.companyCode, 'updater': '' });
      });
    }
    if (getUserKind() === 'S') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ 'projectCodeList': data.projectCodeList, 'updater': '' });
      });
    }
  }
  render() {
    const fields = [{
      field: 'staffName',
      title: '姓名'
    }, {
      field: 'idNo',
      title: '证件号',
      formatter: (v, d) => {
        return d.staff.idNo;
      }
    }, {
      field: 'mobile',
      title: '手机号',
      formatter: (v, d) => {
        return d.staff.mobile;
      }
    }, {
      field: 'projectName',
      title: '所在工程'
    }, {
      field: 'departmentName',
      title: '部门'
    }, {
      field: 'position',
      title: '职位'
    }, {
      field: 'status',
      title: '状态',
      key: 'staff_status',
      type: 'select'
    }, {
      field: 'remark',
      title: '备注'
    }, {
      field: 'keyword',
      title: '关键字查询',
      placeholder: '名字/手机号',
      hidden: true,
      search: true
    }];
    if (getUserKind() === 'P') {
      return this.props.buildList({
        fields,
        searchParams: {
          staffCode: this.staffCode
        },
        buttons: [{
          code: 'detail',
          name: '详情',
          handler: (selectedRowKeys, selectedRows) => {
            if (!selectedRowKeys.length) {
              showWarnMsg('请选择记录');
            } else if (selectedRowKeys.length > 1) {
              showWarnMsg('请选择一条记录');
            } else {
              this.props.history.push(`/staff/allStaff/history-detail?v=1&code=${selectedRowKeys[0]}`);
            }
          }
        }, {
          code: 'goBack',
          name: '返回',
          handler: () => {
            this.props.history.go(-1);
          }
        }],
        pageCode: 631465
      });
    } else if (getUserKind() === 'S') {
      return this.state.projectCodeList ? this.props.buildList({
        fields,
        searchParams: {
          staffCode: this.staffCode,
          projectCodeList: this.state.projectCodeList
        },
        buttons: [{
          code: 'detail',
          name: '详情',
          handler: (selectedRowKeys, selectedRows) => {
            if (!selectedRowKeys.length) {
              showWarnMsg('请选择记录');
            } else if (selectedRowKeys.length > 1) {
              showWarnMsg('请选择一条记录');
            } else {
              this.props.history.push(`/staff/allStaff/history-detail?v=1&code=${selectedRowKeys[0]}`);
            }
          }
        }, {
          code: 'goBack',
          name: '返回',
          handler: () => {
            this.props.history.go(-1);
          }
        }],
        pageCode: 631465
      }) : null;
    } else {
      return this.props.buildList({
        fields,
        searchParams: {
          staffCode: this.staffCode
        },
        buttons: [],
        pageCode: 631465
      });
    }
  }
}

export default AllStaffHistory;
