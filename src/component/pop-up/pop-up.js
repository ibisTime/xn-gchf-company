import React from 'react';
import { getUserId, showSucMsg, showWarnMsg, moneyFormat } from 'common/js/util';
import fetch from 'common/js/fetch';
import { Form, DatePicker, Input } from 'antd';
import { popUpLayout, monthLayout } from 'common/js/config';
import close from './close.png';
import './pop-up.css';
import locale from '../../common/js/lib/date-locale';

const rule0 = {
  required: true,
  message: '必填字段'
};
const FormItem = Form.Item;
const DATE_FORMAT = 'YYYY-MM-DD';
const MONTH_FORMAT = 'YYYY-MM';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const { MonthPicker } = DatePicker;

class PopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCode: ''
    };
  }
  // 项目开工（原审核）
  checkPro = (projectCode) => {
    this.setState({ fetching: true });
    fetch(631354, {
      code: projectCode,
      approver: getUserId()
    }).then((res) => {
      if(res.isSuccess) {
        showSucMsg('操作成功');
        this.setState({ fetching: false });
        this.props.changeState('projectCurStatus', '2');
      } else {
        showWarnMsg('操作失败');
        this.setState({ fetching: false });
      }
      this.props.changeState('popUp', false);
    }).catch(() => {
      this.setState({ fetching: false });
      this.props.changeState('popUp', false);
    });
  };
  // 项目停工
  overPro = (projectCode) => {
    this.setState({ fetching: true });
    fetch(631470, {
      code: projectCode,
      updater: getUserId()
    }).then((res) => {
      if(res.isSuccess) {
        showSucMsg('操作成功');
        this.setState({ fetching: false });
        this.props.changeState('projectCurStatus', '3');
      } else {
        showWarnMsg('操作失败');
        this.setState({ fetching: false });
      }
      this.props.changeState('popUp', false);
    }).catch(() => {
      this.setState({ fetching: false });
      this.props.changeState('popUp', false);
    });
  };
  // 重新开工（和项目停工完全一样只是接口号不一样）
  aWork = (projectCode) => {
    this.setState({ fetching: true });
    fetch(631471, {
      code: projectCode,
      updater: getUserId()
    }).then((res) => {
      if(res.isSuccess) {
        showSucMsg('操作成功');
        this.setState({ fetching: false });
        this.props.changeState('projectCurStatus', '2');
      } else {
        showWarnMsg('操作失败');
        this.setState({ fetching: false });
      }
      this.props.changeState('popUp', false);
    }).catch(() => {
      this.setState({ fetching: false });
      this.props.changeState('popUp', false);
    });
  }
  // 项目结束
  overTime = (projectCode) => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        this.setState({ fetching: true });
        fetch(631355, {
          code: projectCode,
          updater: getUserId(),
          endDatetime: params.endDatetime.format(DATE_FORMAT)
        }).then((res) => {
          if(res.isSuccess) {
            showSucMsg('操作成功');
            this.setState({ fetching: false });
            this.props.changeState('projectCurStatus', '4');
          } else {
            showSucMsg('操作成功');
            this.setState({ fetching: false });
          }
          this.props.changeState('popUp', false);
        }).catch(() => {
          this.setState({ fetching: false });
          this.props.changeState('popUp', false);
        });
      } else {
        console.log(err);
      }
    });
  };
  // 生成工资条
  makeSalary = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        this.setState({ fetching: true });
        fetch(631440, {
          projectCode: this.props.projectCode,
          month: params.month.format(MONTH_FORMAT)
        }).then((res) => {
          this.setState({ fetching: false });
          if (res.salaryNumber !== '0') {
            showSucMsg('操作成功');
          } else {
            showWarnMsg('该条件下没有可生成的工资条');
          }
          this.props.changeState('popUp', false);
          this.props.getPageData();
        }).catch(() => { this.setState({ fetching: true }); });
      } else {
        console.log(err);
      }
    });
  };
  // 上班打卡
  shangban = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        this.setState({ fetching: true });
        fetch(631390, {
          codeList: this.props.kaoqinCode,
          attendanceStartDatetime: params.attendanceStartDatetime.format(DATETIME_FORMAT),
          attendanceEndDatetime: params.attendanceEndDatetime.format(DATETIME_FORMAT)
        }).then((res) => {
          this.setState({ fetching: false });
          if (res.isSuccess) {
            showSucMsg('操作成功');
          } else {
            showWarnMsg('操作失败');
          }
          this.props.changeState('popUp', false);
          this.props.getPageData();
        }).catch(() => { this.setState({ fetching: true }); });
      } else {
        console.log(err);
      }
    });
  }
  // 下班打卡
  xiaban = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        this.setState({ fetching: true });
        fetch(631391, {
          codeList: this.props.kaoqinCode,
          attendanceStartDatetime: params.attendanceStartDatetime.format(DATETIME_FORMAT),
          attendanceEndDatetime: params.attendanceEndDatetime.format(DATETIME_FORMAT)
        }).then((res) => {
          this.setState({ fetching: false });
          if (res.isSuccess) {
            showSucMsg('操作成功');
          } else {
            showWarnMsg('操作失败');
          }
          this.props.changeState('popUp', false);
          this.props.getPageData();
        }).catch(() => { this.setState({ fetching: true }); });
      } else {
        console.log(err);
      }
    });
  }
  // 审核工资条
  checkSalary = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        this.setState({ fetching: true });
        params.codeList = this.props.codeList;
        params.approver = getUserId();
        params.result = '1';
        fetch(631443, params).then(() => {
          showSucMsg('操作成功');
          this.setState({ fetching: false });
          this.props.changeState('popUp', false);
          this.props.getPageData();
        }).catch(() => { this.setState({ fetching: false }); });
      } else {
        console.log(err);
      }
    });
  };
  editSalary = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        this.setState({ fetching: true });
        params.applyUser = getUserId();
        params.tax = '0';
        params.code = this.props.saCode;
        params.cutAmount = params.cutAmount * 1000;
        params.awardAmount = params.awardAmount * 1000;
        fetch(631442, params).then((res) => {
          this.setState({ fetching: false });
          if(res.isSuccess) {
            showSucMsg('操作成功');
          }
          this.props.changeState('popUp', false);
          this.props.getPageData();
        }).catch(() => { this.setState({ fetching: false }); });
      } else {
        console.log(err);
      }
    });
  }
  getSf = () => {
    return moneyFormat(this.props.sf - this.props.form.getFieldValue('cutAmount') * 1000 + this.props.form.getFieldValue('awardAmount') * 1000);
  };
  // 确定按钮分发事件
  handleSubmit = (projectCode, mode) => {
    this.setState({ projectCode: projectCode });
    switch (mode) {
      case 'checkPro':
        this.checkPro(projectCode);
        break;
      case 'overPro':
        this.overPro(projectCode);
        break;
      case 'aWork':
        this.aWork(projectCode);
        break;
      case 'overTime':
        this.overTime(projectCode);
        break;
      case 'makeSalary':
        this.makeSalary();
        break;
      case 'shangban':
        this.shangban();
        break;
      case 'xiaban':
        this.xiaban();
        break;
      case 'checkSalary':
        this.checkSalary();
        break;
      case 'editSalary':
        this.editSalary();
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className="modal-out ant-modal-mask" style={{ display: this.props.popUpVisible ? 'block' : 'none' }}>
          <div className="my-modal-pop-up">
            <div className="pop-up-title" align="center"><span>{this.props.title}</span></div>
            <div className="pop-up-close" onClick={() => { this.props.changeState('popUp', false); }}><img src={close} alt=""/></div>
            <div className="content" style={{ display: this.props.content ? 'block' : 'none' }}><span>{this.props.content}</span></div>
            <Form>
              {
                this.props.mode === 'overTime'
                    ? <FormItem label='项目结束时间' {...popUpLayout}>
                      {getFieldDecorator('endDatetime', {
                        rules: [rule0]
                      })(
                          <DatePicker
                              allowClear={false}
                              locale={locale}
                              placeholder='请选择项目结束时间'
                              format={DATE_FORMAT}
                              showTime={false}/>
                      )}
                    </FormItem>
                    : this.props.mode === 'makeSalary'
                    ? <FormItem label='选择月份' {...monthLayout}>
                      {getFieldDecorator('month', {
                        rules: [rule0]
                      })(
                          <MonthPicker
                              allowClear={false}
                              locale={locale}
                              placeholder='请选择月份'
                              format={MONTH_FORMAT}
                              showTime={false} />
                      )}
                    </FormItem>
                    : this.props.mode === 'checkSalary'
                    ? <div className="contentInfo"><p>{this.props.contentInfo1}</p><p>{this.props.contentInfo2}</p></div>
                    : this.props.mode === 'editSalary'
                    ? <div className="editSalary">
                        <p>姓名：{this.props.staffName}</p>
                        <p>部门：{this.props.departmentName}</p>
                        <p>职位：{this.props.position}</p>
                        <FormItem label="扣款" {...monthLayout}>
                          {getFieldDecorator('cutAmount', {
                            rules: [rule0],
                            initialValue: 0
                          })(
                              <Input placeholder="输入金额"/>
                          )}
                        </FormItem>
                        <FormItem label="奖金" {...monthLayout}>
                          {getFieldDecorator('awardAmount', {
                            rules: [rule0],
                            initialValue: 0
                          })(
                              <Input placeholder="输入金额"/>
                          )}
                        </FormItem>
                        <FormItem label="实发" {...monthLayout}>
                          {getFieldDecorator('sf', {
                            rules: [rule0],
                            initialValue: this.getSf()
                          })(
                              <Input disabled/>
                          )}
                        </FormItem>
                      </div>
                    : <div>
                        <FormItem label='开始时间' {...monthLayout}>
                          {getFieldDecorator('attendanceStartDatetime', {
                            rules: [rule0]
                          })(
                              <DatePicker
                                  allowClear={false}
                                  locale={locale}
                                  placeholder='请选择开始时间'
                                  format={DATETIME_FORMAT}
                                  showTime={true}/>
                          )}
                        </FormItem>
                        <FormItem label='结束时间' {...monthLayout}>
                          {getFieldDecorator('attendanceEndDatetime', {
                            rules: [rule0]
                          })(
                              <DatePicker
                                  allowClear={false}
                                  locale={locale}
                                  placeholder='请选择结束时间'
                                  format={DATETIME_FORMAT}
                                  showTime={true}/>
                          )}
                        </FormItem>
                      </div>
              }
            </Form>
            <div className="buttons" style={{ display: this.props.okText ? 'block' : 'none' }}>
              <div className="cancel" onClick={ (e) => { this.props.changeState('popUp', false); } }>我再想想</div>
              <div className="ok" onClick={ () => { this.handleSubmit(this.props.projectCode, this.props.mode); } }>{this.props.okText}</div>
            </div>
            <div className="oneBtn" style={{ display: this.props.onlyBtnText ? 'block' : 'none' }}>
              <div className="ok" onClick={ () => { this.handleSubmit(this.props.projectCode, this.props.mode); } }>{this.props.onlyBtnText}</div>
            </div>
          </div>
        </div>
    );
  }
}
//
// ReactDOM.render(<App />, mountNode);

export default Form.create()(PopUp);
