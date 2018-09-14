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
} from '@redux/staff/allStaff-error';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getQueryString, getUserKind, getUserId, moneyFormat } from 'common/js/util';
import { getUserDetail } from 'api/user';
import './allStaff-error.css';

@listWrapper(
  state => ({
    ...state.staffAllStaffError,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AllStaffError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCodeList: '',
      projectCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.staffCode = getQueryString('staffCode', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCode': data.projectCode });
    });
  }
  render() {
    const fields = [{
      field: 'code',
      title: '编号',
      hidden: true
    }, {
      field: 'salaryCode',
      title: '工资条编号',
      hidden: true
    }, {
      field: 'projectCode',
      title: '项目编号',
      hidden: true
    }, {
      title: '姓名',
      field: 'staffName'
    }, {
      field: 'month',
      title: '工资月份'
    }, {
      field: 'factAmount',
      title: '工资单金额（元）',
      amount: true
    }, {
      field: 'payAmount',
      title: '实发金额（元）',
      amount: true
    }, {
      field: 'delayAmount',
      title: '欠薪金额（元）',
      amount: true
    }, {
      title: '异常类型',
      field: 'status',
      type: 'select',
      key: 'salary_status'
    }, {
      title: '最新处理反馈详情',
      field: 'handleNote'
    }, {
      title: '发言人',
      field: 'handler'
    }, {
      title: '更新时间',
      field: 'handleDatetime',
      type: 'datetime'
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
      detail: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStafferror/addedit?v=1&code=${selectedRowKeys[0]}`);
        }
      }
    };
    return this.state.projectCode ? this.props.buildList({
      fields,
      btnEvent,
      searchParams: {
        staffCode: this.staffCode,
        type: '1',
        projectCode: this.state.projectCode,
        statusList: ['4', '6', '7']
      },
      pageCode: 631445,
      head: (
          <div style={{ height: '15px' }}>
            <div className="blue-tips"><span>发生异常事件请及时处理，相关监管单位可实时查看您的处理进度，请详细填写跟进的过程。</span></div>
          </div>
      )
    }) : null;
  }
}

export default AllStaffError;
