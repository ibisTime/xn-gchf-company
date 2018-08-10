import React from 'react';
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
} from '@redux/newProj/project-salary';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getQueryString, dateTimeFormat, moneyFormat, getUserKind, getUserId } from 'common/js/util';
import ModalDetail from 'common/js/build-modal-detail';
import fetch from 'common/js/fetch';
import { getUserDetail } from 'api/user';
import { deleteSalaryMany } from 'api/project';
import './project-salary.css';
import { getDict } from 'api/dict';

@listWrapper(
  state => ({
    ...state.newProjProjectSalary,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Salary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      projectCode: '',
      projectName: '',
      projectCodeList: '',
      salaryStatus: []
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({
        projectCode: data.projectCode,
        projectName: data.projectName,
        projectCodeList: data.projectCodeList
      });
    });
    getDict('salary_status').then((res) => {
      res.map((item) => {
        this.state.salaryStatus[item.dkey] = item.dvalue;
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
      key: 'salary_status',
      search: true
    }, {
      title: '备注',
      field: 'factAmountRemark',
      nowrap: true
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
            this.setState({visible: false});
            this.props.getPageData();
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
            this.setState({visible: false});
            this.props.getPageData();
          }).catch(this.props.cancelFetching);
        }
      }]
    };
    const makeSalaryOptions = {
      fields: [{
        field: 'projectCode',
        title: '项目',
        hidden: true,
        value: this.state.projectCode
      }, {
        field: 'month',
        title: '生成工资月份',
        type: 'month',
        required: true
      }],
      addCode: 631440,
      buttons: [{
        title: '确认',
        check: true,
        type: 'primary',
        handler: (params, doFetching, cancelFetching, handleCancelModal) => {
          doFetching();
          fetch(631440, params).then((res) => {
            cancelFetching();
            if (res.salaryNumber !== '0') {
              showSucMsg('操作成功');
            } else {
              showWarnMsg('该条件下没有可生成的工资条');
            }
            this.props.getPageData();
            handleCancelModal();
          }).catch(cancelFetching);
        }
      }]
    };

    return this.state.projectCode ? (
        <div>
          {
            this.props.buildList({
              fields,
              singleSelect: false,
              buttons: [{
                code: 'makeSalary',
                name: '生成工资条',
                handler: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    showMakeSalary: true
                  });
                }
              }, {
                code: 'edit',
                name: '手工调整',
                handler: (selectedRowKeys, selectedRows) => {
                  if (!selectedRowKeys.length) {
                    showWarnMsg('请选择记录');
                  } else if (selectedRowKeys.length > 1) {
                    showWarnMsg('请选择一条记录');
                  } else {
                    if (selectedRows[0].status === '0') {
                      this.props.history.push(`/projectManage/project/salary/edit?code=${selectedRowKeys[0]}&projectCode=${this.state.projectCode}`);
                    } else {
                      showWarnMsg('该状态的工资条不可调整');
                    }
                  }
                }
              }, {
                code: 'check',
                name: '审核',
                handler: (selectedRowKeys, selectedRows) => {
                  if (!selectedRowKeys.length) {
                    showWarnMsg('请选择记录');
                  } else {
                    // if (selectedRows[0].status === '0') {
                    this.codeList = selectedRowKeys;
                    this.setState({ visible: true });
                    // } else {
                    // showWarnMsg('该状态的工资条不可审核');
                    // }
                  }
                }
              }, {
                code: 'delete',
                name: '删除',
                handler: (selectedRowKeys, selectedRows) => {
                  if (!selectedRowKeys.length) {
                    showWarnMsg('请选择记录');
                  } else {
                    deleteSalaryMany(selectedRowKeys).then((res) => {
                      if(res.isSuccess) {
                        showSucMsg('操作成功');
                        this.props.getPageData();
                      }
                    });
                  }
                }
              }, {
                code: 'export',
                name: '导出',
                handler: (selectedRowKeys, selectedRows) => {
                  fetch(631446, {
                    projectCode: this.state.projectCode,
                    companyCode: this.state.companyCode,
                    kind: 'O'
                  }).then((data) => {
                    let payroll1 = [
                      ['员工姓名', '所属月份', '正常考勤天数', '请假天数', '迟到小时数', '早退小时数', '扣款金额', '发放奖金', '应发工资', '实发工资', '状态', '备注']
                    ];
                    let payroll2 = data.map((d, i) => {
                      return [d.staffName, d.month, d.attendanceDays, d.leavingDays, d.delayHours, d.earlyHours, moneyFormat(d.cutAmount), moneyFormat(d.awardAmount), moneyFormat(d.factAmount), moneyFormat(d.factAmount), this.state.salaryStatus[d.status], d.factAmountRemark];
                    });
                    payroll1 = payroll1.concat(payroll2);
                    const ws = XLSX.utils.aoa_to_sheet(payroll1);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
                    XLSX.writeFile(wb, this.state.projectName + '工资明细.xlsx');
                  }, () => { });
                }
              }],
              searchParams: {
                projectCode: this.state.projectCode,
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
          <ModalDetail
              title='生成工资月份'
              visible={this.state.showMakeSalary}
              hideModal={() => this.setState({ showMakeSalary: false })}
              options={makeSalaryOptions} />
        </div>
    ) : null;
  }
}

export default Salary;
