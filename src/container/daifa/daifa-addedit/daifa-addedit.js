import React from 'react';
import cookies from 'browser-cookies';
import XLSX from 'xlsx';
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
import ModalDetail from 'common/js/build-modal-detail';
import fetch from 'common/js/fetch';

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
      companyCode: '',
      projectCodeList: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({
        companyCode: data.companyCode,
        projectCodeList: data.projectCodeList
      });
    });
  };
  render() {
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
      field: 'factAmountRemark'
    }];
    const options = {
      fields: [{
        field: 'codeList',
        title: '编号',
        value: this.codeList,
        hidden: true
      }, {
        field: 'approveNote',
        title: '审核备注'
      }],
      buttons: [{
        title: '通过',
        check: true,
        handler: (param) => {
          param.approver = getUserId();
          param.result = '1';
          this.props.doFetching();
          fetch(631443, param).then(() => {
            showSucMsg('操作成功');
            this.props.cancelFetching();
            this.setState({ visible: false });
          }).catch(this.props.cancelFetching);
        }
      }, {
        title: '不通过',
        check: true,
        handler: (param) => {
          param.approver = getUserId();
          param.result = '0';
          this.props.doFetching();
          fetch(631443, param).then(() => {
            showSucMsg('操作成功');
            this.props.cancelFetching();
            this.setState({ visible: false });
          }).catch(this.props.cancelFetching);
        }
      }]
    };
    if (getUserKind() === 'O') {
      return this.state.companyCode ? (
        <div>
          {
            this.props.buildList({
              fields,
              buttons: [{
                code: 'detail',
                name: '详情',
                handler: (selectedRowKeys, selectedRows) => {
                  if (!selectedRowKeys.length) {
                    showWarnMsg('请选择记录');
                  } else if (selectedRowKeys.length > 1) {
                    showWarnMsg('请选择一条记录');
                  } else {
                    this.props.history.push(`/daifa/daifa/addedit/edit?v=1&code=${selectedRowKeys[0]}&projectCode=${this.projectCode}`);
                  }
                }
              }, {
                code: 'goback',
                name: '返回',
                handler: (param) => {
                  this.props.history.go(-1);
                }
              }],
              searchParams: {
                messageCode: this.code,
                companyCode: this.state.companyCode,
                kind: 'O'
              },
              pageCode: 631445
            })
          }
          <ModalDetail
            title='审核'
            visible={this.state.visible}
            hideModal={() => this.setState({ visible: false })}
            options={options} />
        </div>
      ) : null;
    } else {
      return (
        <div>
          {
            this.state.projectCodeList ? this.props.buildList({
              fields,
              singleSelect: false,
              buttons: [],
              searchParams: { messageCode: this.code },
              pageCode: 631445
            }) : null
          }
          <ModalDetail
            title='审核'
            visible={this.state.visible}
            hideModal={() => this.setState({ visible: false })}
            options={options} />
        </div>
      );
    }
  }
}

export default DaifaAddEdit;
