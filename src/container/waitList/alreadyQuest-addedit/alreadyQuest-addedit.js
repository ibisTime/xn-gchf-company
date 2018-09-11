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
} from '@redux/daifa/daifa-addedit';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, getQueryString, dateTimeFormat, moneyFormat } from 'common/js/util';
import { getUserDetail } from 'api/user';
import { detailDate } from 'api/downLoad';
import './alreadyQuest-addedit.css';

@listWrapper(
    state => ({
      ...state.daifaDaifaAddEdit
    }),
    {
      setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData
    }
)
class DaifaAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      projectCode: '',
      projectCodeList: '',
      month: '',
      number: '',
      totalAmount: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    Promise.all([
      getUserDetail(getUserId()),
      detailDate(this.code)
    ]).then(([res1, res2]) => {
      this.setState({
        projectCode: res1.projectCode,
        projectCodeList: res1.projectCodeList,
        month: res2.month,
        number: res2.number,
        totalAmount: res2.totalAmount
      });
    });
  };
  render() {
    const { month, number, totalAmount, projectCode } = this.state;
    const fields = [{
      title: '员工姓名',
      field: 'staffName'
    }, {
      title: '所属月份',
      field: 'month',
      search: true
    }, {
      title: '正常考勤天数',
      field: 'attendanceDays'
    }, {
      title: '请假天数',
      field: 'leavingDays'
    }, {
      title: '迟到小时数',
      field: 'delayHours'
    }, {
      title: '早退小时数',
      field: 'earlyHours'
    }, {
      title: '扣款金额',
      field: 'cutAmount',
      amount: true,
      className: 'red'
    }, {
      title: '发放奖金',
      field: 'awardAmount',
      amount: true,
      className: 'blue'
    }, {
      title: '应发工资',
      field: 'shouldAmount',
      amount: true
    }, {
      title: '实发工资',
      field: 'factAmount',
      amount: true
    }, {
      title: '状态',
      field: 'status',
      type: 'select',
      key: 'salary_status'
    }, {
      title: '备注',
      field: 'factAmountRemark',
      nowrap: true
    }];
    return this.props.buildList({
      fields,
      buttons: [{
        code: 'goback',
        name: '返回',
        handler: (param) => {
          this.props.history.go(-1);
        }
      }],
      searchParams: {
        messageCode: this.code,
        projectCode: projectCode,
        kind: 'O'
      },
      pageCode: 631445,
      head: (
          <div className="alreadyQuest-addedit-tip">
            <span>工资月份：{month}</span><span>人数：{number}人</span><span>实发金额：{moneyFormat(totalAmount)}元</span>
          </div>
      )
    }
    );
  }
}

export default DaifaAddEdit;
