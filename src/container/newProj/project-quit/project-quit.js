import React from 'react';
import { Form, Button, DatePicker } from 'antd';
import { getQueryString, getUserKind, getUserId, showSucMsg, showWarnMsg } from 'common/js/util';
import { getUserDetail } from 'api/user';
import { askLeave } from 'api/staff';
import { weekdayItemLayout } from 'common/js/config';
import locale from 'common/js/lib/date-locale';
import warning from './../project-weekday/warning.png';
import './../../../common/css/blueTitle.css';
import './../project-quit/project-quit.css';
const FormItem = Form.Item;

class ProjectQuit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCodeList: ''
    };
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
        params.staffCode = this.code;
        params.leavingDatetime = params.leavingDatetime.format(format);
        askLeave(params).then((res) => {
          if(res.isSuccess) {
            showSucMsg('离职成功！');
            setTimeout(() => {
              this.props.history.go(-1);
            }, 500);
          } else {
            showWarnMsg('离职失败！');
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
        <div className="blue-title"><i></i><span>离职</span></div>
        <div>
          <div>
            <div>
              <div className="quit-content">
                <Form>
                  <FormItem label="离职时间" {...weekdayItemLayout}>
                    {getFieldDecorator('leavingDatetime', {
                      rules: [rule0]
                    })(
                        <DatePicker
                            allowClear={false}
                            locale={locale}
                            placeholder="请选择离职时间"
                            format='YYYY-MM-DD' />
                    )}
                  </FormItem>
                  <div className="quit-tips">
                    <img src={warning} alt=""/><span>离职后，系统自动结算员工的未结工资，于下月1号生成工资条</span>
                  </div>
                  <div className="quit-buttons">
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
    // const fields = [{
    //   title: '项目名称',
    //   field: 'projectCode',
    //   value: this.projectCode,
    //   hidden: true
    // }, {
    //   field: 'staffCode',
    //   value: this.code,
    //   hidden: true
    // }, {
    //   title: '离职时间',
    //   field: 'leavingDatetime',
    //   required: true,
    //   type: 'date'
    // }, {
    //   title: '备注',
    //   field: 'remark'
    // }];
    // return this.props.buildDetail({
    //   fields,
    //   addCode: 631462
    // });
  }
}

export default Form.create()(ProjectQuit);
