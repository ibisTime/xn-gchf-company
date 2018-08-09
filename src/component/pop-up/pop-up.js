import React from 'react';
import { getUserId, showSucMsg, showWarnMsg } from 'common/js/util';
import fetch from 'common/js/fetch';
import { Form, DatePicker } from 'antd';
import { popUpLayout } from 'common/js/config';
import './pop-up.css';
import locale from '../../common/js/lib/date-locale';

const rule0 = {
  required: true,
  message: '必填字段'
};
const FormItem = Form.Item;
const DATE_FORMAT = 'YYYY-MM-DD';

class PopUp extends React.Component {
  constructor(props) {
    super(props);
    this.text = 'https://gw.alipayobjects.com/zos/rmsportal/DkKNubTaaVsKURhcVGkh.svg';
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
        console.log(params);
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
  }
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
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className="modal-out ant-modal-mask" style={{ display: this.props.popUpVisible ? 'block' : 'none' }}>
          <div className="my-modal-pop-up">
            <div className="pop-up-title" align="center"><span>{this.props.title}</span></div>
            <div className="content"><span>{this.props.content}</span></div>
            <Form style={{ display: this.props.mode === 'overTime' ? 'block' : 'none', height: '38pt' }}>
              <FormItem label='项目结束时间' {...popUpLayout}>
                {getFieldDecorator('endDatetime', {
                  rules: [rule0]
                })(
                    <DatePicker
                      allowClear={false}
                      locale={locale}
                      placeholder='请选择项目结束时间'
                      format={DATE_FORMAT}
                      showTime={false}
                      disabled={this.state.disabled} />
                )}
              </FormItem>
            </Form>
            <div className="buttons">
              <div className="cancel" onClick={ (e) => { this.props.changeState('popUp', false); } }>我再想想</div>
              <div className="ok" onClick={ () => { this.handleSubmit(this.props.projectCode, this.props.mode); } }>{this.props.okText}</div>
            </div>
          </div>
        </div>
    );
  }
}
//
// ReactDOM.render(<App />, mountNode);

export default Form.create()(PopUp);
