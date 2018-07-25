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
} from '@redux/staff/allStaff';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.staffAllStaff,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AllStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCode: null,
      searchParams: null,
      province: null,
      city: null,
      area: null
    };
  }
  componentDidMount() {
    if (getUserKind() === 'S') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({
          projectCodeList: data.projectCodeList,
          province: data.province,
          city: data.city,
          area: data.area
        });
      });
    };
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ 'companyCode': data.companyCode });
      });
    };
  }
  render() {
    const fields = [{
      field: 'name',
      title: '姓名'
    }, {
      field: 'idNo',
      title: '证件号'
    }, {
      field: 'mobile',
      title: '手机号'
    }, {
      field: 'birthdays',
      title: '生日',
      type: 'datetime',
      formatter: (v, d) => {
        return formatDate(d.birthday);
      }
    }, {
      field: 'keyword',
      title: '关键字查询',
      placeholder: '名字/证件号',
      hidden: true,
      search: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    const btnEvent = {
      error: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/error?staffCode=${selectedRowKeys[0]}`);
        }
      },
      history: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/history?staffCode=${selectedRowKeys[0]}`);
        }
      },
      skill: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/skill?staffCode=${selectedRowKeys[0]}`);
        }
      },
      // addWorkers: (selectedRowKeys, selectedRows) => {
      //   console.log(selectedRowKeys, selectedRows);
      //   if (!selectedRowKeys.length) {
      //     showWarnMsg('请选择记录');
      //   } else if (selectedRowKeys.length > 1) {
      //     showWarnMsg('请选择一条记录');
      //   } else {
      //     this.props.history.push(`/staff/allStaff/entry?code=${selectedRowKeys[0]}`);
      //   }
      // },
      weekday: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/weekday?code=${selectedRowKeys[0]}`);
        }
      },
      leaveRecords: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/leaveRecords?staffCode=${selectedRowKeys[0]}`);
        }
      },
      quit: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/quit?code=${selectedRowKeys[0]}`);
        }
      },
      addBankCard: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          console.log(selectedRows[0].bankCard);
          if(selectedRows[0].bankCard === undefined) {
            this.props.history.push(`/staff/allStaff/addBankCard?code=${selectedRowKeys[0]}&name=${selectedRows[0].name}`);
          } else {
            showWarnMsg('该员工已有工资卡，无法新增');
          }
        }
      },
      rejiandang: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/jiandang/mianguanRead2?idNo=${selectedRows[0].idNo}&code=${selectedRows[0].code}`);
        }
      }
    };
    if (getUserKind() === 'O') {
      return this.state.companyCode ? this.props.buildList({
        fields,
        btnEvent,
        searchParams: {
          updater: '',
          kind: 'O',
          companyCode: this.state.companyCode
        },
        pageCode: 631415
      }) : null;
    } else if(getUserKind() === 'S') {
      return this.state.province && this.state.city && this.state.area ? this.props.buildList({
        fields,
        btnEvent,
        searchParams: {
          updater: '',
          province: this.state.province,
          city: this.state.city,
          area: this.state.area
        },
        pageCode: 631415
      }) : null;
    } else {
      return this.props.buildList({
        fields,
        btnEvent,
        searchParams: {
          updater: ''
        },
        pageCode: 631415
      });
    }
  }
}

export default AllStaff;
