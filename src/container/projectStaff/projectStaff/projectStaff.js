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
} from '@redux/projectStaff/projectStaff';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.projectStaff,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class ProjectStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCode: null,
      projectCode: ''
    };
  }
  componentDidMount() {
    let userKind = getUserKind();
    this.setState({ userKind });
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCode': data.projectCode });
    });
  }
  render() {
    const fields = [{
      field: 'companyName',
      title: '公司名称',
      hidden: true
    }, {
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
    const btnEvent = {
      weekday: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/weekday?code=${selectedRows[0].staffCode}&projectCode=${selectedRows[0].projectCode}`);
        }
      },
      leaveRecords: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/leaveRecords?staffCode=${selectedRows[0].staffCode}`);
        }
      },
      quit: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/quit?code=${selectedRows[0].staffCode}&projectCode=${selectedRows[0].projectCode}`);
        }
      },
      detail: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/addedit?v=1&code=${selectedRowKeys[0]}`);
        }
      },
      addBankCard: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          if(selectedRows[0].staff.bankCard) {
            this.props.history.push(`/projectStaff/projectStaff/addBankCard?staffCode=${selectedRows[0].staffCode}&code=${selectedRows[0].staff.bankCard.code || ''}&name=${selectedRows[0].staff.name}&projectCode=${selectedRows[0].projectCode}`);
          } else {
            this.props.history.push(`/projectStaff/projectStaff/addBankCard?staffCode=${selectedRows[0].staffCode}&name=${selectedRows[0].staff.name}&projectCode=${selectedRows[0].projectCode}`);
          }
        }
      },
      skill: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/skill?staffCode=${selectedRows[0].staffCode}`);
        }
      },
      reruzhi: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/ruzhiInfo?code=${selectedRows[0].code}&reruzhi=1&staffCode=${selectedRows[0].staffCode}`);
        }
      }
    };
    return this.state.projectCode ? this.props.buildList({
      fields,
      btnEvent,
      searchParams: {
        updater: '',
        projectCode: this.state.projectCode
      },
      pageCode: 631465
    }) : null;
  }
}

export default ProjectStaff;
