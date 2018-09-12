import React from 'react';
import { Form, Button, DatePicker } from 'antd';
import { getQueryString, getUserKind, getUserId, showSucMsg, showWarnMsg } from 'common/js/util';
import { getUserDetail } from 'api/user';
import './../../../common/css/blueTitle.css';
import './project-weekday.css';
import { weekdayItemLayout } from 'common/js/config';
import locale from 'common/js/lib/date-locale';
import { askWeekday } from 'api/staff';
import warning from './warning.png';

const FormItem = Form.Item;

class ProjectWeekday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.code = getQueryString('code', this.props.location.search);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
  }
  componentDidMount() {
  };
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        let format = 'YYYY-MM-DD';
        params.projectCode = this.projectCode;
        params.employCode = this.code;
        params.startDatetime = params.startDatetime.format(format);
        params.endDatetime = params.endDatetime.format(format);
        askWeekday(params).then((res) => {
          if(res.code) {
            showSucMsg('请假成功！');
            setTimeout(() => {
              this.props.history.go(-1);
            }, 500);
          } else {
            showWarnMsg('请假失败！');
          }
        });
      } else {
        console.log(err);
      }
    });
  };
  back = () => {
    this.props.history.go(-1);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const rule0 = {
      required: true,
      message: '必填字段'
    };
    return (
        <div>
          <div className="blue-title"><i></i><span>请假</span></div>
          <div>
            <div style={{ verticalAlign: 'middle', width: '100%' }}>
              <div>
                <div className="weekday-content">
                  <Form>
                    <FormItem label="开始时间" {...weekdayItemLayout}>
                      {getFieldDecorator('startDatetime', {
                        rules: [rule0]
                      })(
                          <DatePicker
                              allowClear={false}
                              locale={locale}
                              placeholder="请选择开始时间"
                              format='YYYY-MM-DD' />
                      )}
                    </FormItem>
                    <FormItem label="销假时间" {...weekdayItemLayout}>
                      {getFieldDecorator('endDatetime', {
                        rules: [rule0]
                      })(
                          <DatePicker
                              allowClear={false}
                              locale={locale}
                              placeholder="请选择销假时间"
                              format='YYYY-MM-DD' />
                      )}
                    </FormItem>
                    <div className="weekday-tips">
                      <img src={warning} alt=""/><span>请假期间不计算薪资</span>
                    </div>
                    <div className="weekday-buttons">
                      <Button type="primary" onClick={ this.handleSubmit }>保存</Button>
                      <Button onClick={ this.back }>返回</Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default Form.create()(ProjectWeekday);
