import React from 'react';
import XLSX from 'xlsx';
import ModalDetail from 'common/js/build-modal-detail';
import fetch from 'common/js/fetch';
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
import { showWarnMsg, showSucMsg, moneyFormat, getUserId, getOrganizationCode,
  getProjectName } from 'common/js/util';
import { getUserDetail, getEmploy } from 'api/user';
import { deleteSalaryMany } from 'api/project';
import { getDict } from 'api/dict';
import PopUp from '../../../component/pop-up/pop-up';
import './project-salary.css';

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
      projectCode: getOrganizationCode(),
      projectName: getProjectName(),
      salaryStatus: [],
      popUp: false,
      title: '',
      content: '',
      mode: '',
      positionType: {}
    };
  }
  componentDidMount() {
    getDict('salary_status').then((res) => {
      res.map((item) => {
        this.state.salaryStatus[item.dkey] = item.dvalue;
      });
    });
    this.monthData = [];
    for(let i = 1; i <= 12; i++) {
      this.monthData.push({
        dkey: i,
        dvalue: i + '月'
      });
    }
  };
  // 弹窗事件
  changeState = (who, value) => {
    switch (who) {
      case 'popUp':
        this.setState({ popUp: value });
        break;
      case 'projectCurStatus':
        this.setState({ projectCurStatus: value });
    }
  };
  getPageData = () => {
    this.props.getPageData();
  };
  render() {
    const fields = [{
      title: '姓名',
      field: 'staffName',
      search: true
    }, {
      title: '所属月份',
      field: 'month'
    }, {
      title: '考勤(天)',
      field: 'attendanceDays'
    }, {
      title: '请假(天)',
      field: 'leavingDays'
    }, {
      title: '迟到(小时)',
      field: 'delayHours'
    }, {
      title: '早退(小时)',
      field: 'earlyHours'
    }, {
      title: '扣款(元)',
      field: 'cutAmount',
      amount: true,
      className: 'red'
    }, {
      title: '奖金(元)',
      field: 'awardAmount',
      amount: true,
      className: 'blue'
    }, {
      title: '考勤工资(元)',
      field: 'shouldAmount',
      amount: true
    }, {
      title: '实发工资(元)',
      field: 'factAmount',
      amount: true
    }, {
      title: '所属月份',
      field: 'month',
      type: 'select',
      data: this.monthData,
      keyName: 'dkey',
      valueName: 'dvalue',
      search: true,
      hidden: true
    }, {
      title: '状态',
      field: 'status',
      type: 'select',
      key: 'salary_status',
      search: true
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

    return this.state.projectCode ? (
        <div>
          {
            this.props.buildList({
              fields,
              singleSelect: false,
              buttons: [{
                code: 'makeSalary',
                name: '生成待结算的工资条',
                handler: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    popUp: true,
                    title: '生成待结算的工资条',
                    mode: 'makeSalary',
                    onlyBtnText: '确认生成'
                  });
                }
              }, {
                code: 'edit',
                name: '调整工资条',
                handler: (selectedRowKeys, selectedRows) => {
                  if (!selectedRowKeys.length) {
                    showWarnMsg('请选择记录');
                  } else if (selectedRowKeys.length > 1) {
                    showWarnMsg('请选择一条记录');
                  } else {
                    if (selectedRows[0].status === '0') {
                      Promise.all([
                        getEmploy(selectedRows[0].employCode),
                        getDict('position_type')
                      ]).then(([res1, res2]) => {
                        res2.map((item) => {
                          this.state.positionType[item.dkey] = item.dvalue;
                        });
                        this.setState({
                          popUp: true,
                          title: '调整工资条',
                          mode: 'editSalary',
                          onlyBtnText: '确认生成',
                          saCode: selectedRowKeys[0],
                          departmentName: res1.departmentName,
                          staffName: res1.staffName,
                          position: this.state.positionType[res1.position],
                          sf: selectedRows[0].shouldAmount + ''
                        });
                        console.log(this.state.sf);
                      });
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
                    let flag = true;
                    selectedRows.map((item) => {
                      if(item.status !== '0') {
                        flag = false;
                      }
                    });
                    if (flag) {
                      this.codeList = selectedRowKeys;
                      let total = 0;
                      selectedRows.map((item) => {
                        total += item.factAmount;
                      });
                      this.setState({
                        popUp: true,
                        title: '审核工资条',
                        mode: 'checkSalary',
                        onlyBtnText: '审核',
                        contentInfo1: `选中${selectedRowKeys.length}条工资条`,
                        contentInfo2: `共计金额${moneyFormat(total)}元`,
                        codeList: this.codeList
                      });
                    } else {
                      showWarnMsg('包含不可审核的工资条');
                    }
                  }
                }
              }, {
                code: 'delete',
                name: '删除',
                handler: (selectedRowKeys) => {
                  if (!selectedRowKeys.length) {
                    showWarnMsg('请选择记录');
                  } else {
                    this.props.doFetching();
                    deleteSalaryMany(selectedRowKeys).then((res) => {
                      this.props.cancelFetching();
                      if(res.isSuccess) {
                        showSucMsg('操作成功');
                        this.props.getPageData();
                      }
                    }).catch(() => { this.props.doFetching(); });
                  }
                }
              }, {
                code: 'export',
                name: '导出',
                handler: () => {
                  fetch(631446, {
                    projectCode: this.state.projectCode,
                    companyCode: this.state.companyCode,
                    kind: 'O'
                  }).then((data) => {
                    let payroll1 = [
                      ['姓名', '所属月份', '考勤（天）', '请假（天）', '迟到（小时）', '早退（小时）', '扣款（元）', '奖金（元）', '考勤工资（元）', '实发工资（元）', '状态']
                    ];
                    let payroll2 = data.map((d, i) => {
                      return [d.staffName, d.month, d.attendanceDays, d.leavingDays, d.delayHours, d.earlyHours, moneyFormat(d.cutAmount), moneyFormat(d.awardAmount), moneyFormat(d.factAmount), moneyFormat(d.factAmount), this.state.salaryStatus[d.status]];
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
          <PopUp popUpVisible={this.state.popUp}
                 title={this.state.title}
                 content={this.state.content}
                 onlyBtnText={this.state.onlyBtnText}
                 changeState={this.changeState}
                 mode={this.state.mode}
                 projectCode={this.state.projectCode}
                 getPageData={this.getPageData}
                 contentInfo1={this.state.contentInfo1}
                 contentInfo2={this.state.contentInfo2}
                 codeList={this.state.codeList}
                 saCode={this.state.saCode}
                 departmentName={this.state.departmentName}
                 staffName={this.state.staffName}
                 position={this.state.position}
                 sf={this.state.sf}
          />
        </div>
    ) : null;
  }
}

export default Salary;
