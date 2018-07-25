import React from 'react';
import { Input, Select, Button, Form, Modal, TreeSelect } from 'antd';
import { getProjectListForO, getZhiHang, luru } from 'api/project';
import { getUserDetail, getUserId, ruzhi, getStaffDetail } from 'api/user';
import { getDict } from 'api/dict';
import { getQiniuToken } from 'api/general';
import { getQueryString, showErrMsg, showWarnMsg, showSucMsg, formatImg } from 'common/js/util';
import { UPLOAD_URL } from 'common/js/config';
import './ruzhiInfo.css';

const InputGroup = Input.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

const rule0 = {
  required: true,
  message: '必填字段'
};
class RuzhiInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zhihang: [],
      mobile: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.code = getQueryString('code', this.props.location.search);
    this.idNo = getQueryString('idNo', this.props.location.search);
    this.ruzhi = getQueryString('ruzhi', this.props.location.search);
  }
  componentDidMount() {
    getZhiHang().then(data => {
      this.setState({ zhihang: data });
    }).catch(() => {});
    getStaffDetail(this.idNo).then((res) => {
      console.log(res);
      this.props.form.setFieldsValue({
        mobile: res.mobile,
        contacts: res.contacts,
        contactsMobile: res.contactsMobile,
        remark: res.remark
      });
    });
  }
  // 员工source change事件
  handleTypeChange(value) {
    this.setState({
      selectSource: value
    });
  }
  // 最终提交
  handleSubmit() {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        console.log(params);
        params.code = this.code;
        params.updater = getUserId();
        console.log(params.subbranch);
        console.log(this.state.zhihang);
        if(params.subbranch) {
          this.state.zhihang.map((item) => {
            if(params.subbranch === item.code || params.subbranch === item.bankSubbranchName) {
              params.bankName = item.bankName;
              params.bankCode = item.bankCode;
            }
            if(params.subbranch === item.bankSubbranchName) {
              params.subbranch = item.code;
            }
          });
        }
        luru(params).then((res) => {
          if(res.isSuccess) {
            showSucMsg('重新建档成功！');
            this.props.history.push(`/staff/allStaff`);
          } else {
            showWarnMsg('重新建档失败！');
          }
        });
      }
    });
  }
  setUploadFileUrl(fileList) {
    fileList.forEach(f => {
      if (!f.url && f.status === 'done' && f.response) {
        f.url = formatImg(f.response.key);
      }
    });
  }
  normFile = (e) => {
    if (e) {
      return e.fileList.map(v => {
        if (v.status === 'done') {
          return v.key || v.response.key;
        } else if (v.status === 'error') {
          showErrMsg('文件上传失败');
        }
        return '';
      }).filter(v => v).join('||');
    }
    return '';
  }
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  }
  mobileChange = (e) => {
    console.log(e.target);
    this.setState({
      mobile: e.target.value
    });
  }
  render() {
    const { previewVisible, previewImage, token, source } = this.state;
    const { getFieldDecorator } = this.props.form;
    const imgProps = {
      action: UPLOAD_URL,
      multiple: true,
      data: { token },
      defaultFileList: [],
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true
      },
      onChange: ({ fileList }) => this.setUploadFileUrl(fileList, true),
      onPreview: this.handlePreview,
      listType: 'picture-card',
      accept: 'image/*'
    };
    const rule1 = {
      pattern: /^1[3|4|5|7|8]\d{9}$/,
      message: '手机格式不对'
    };
    return (
        <div className='SectionContainer2' style={{ border: '2px solid #096dd9' }}>
          <div className='section2'>
            <div style={{ verticalAlign: 'middle', width: '100%' }}>
              <div className="comparison-main2 comparison-mains2">
                <div className="head-wrap2"><i></i>建档信息</div>
                <div style={{ width: 300, padding: '30px 0', margin: '0 auto' }}>
                  <Form>
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>联系方式（必填）</div>
                    <FormItem onChange={(e) => { this.mobileChange(e); }}>
                      {getFieldDecorator('mobile', {
                        rules: [rule1]
                      })(
                          <Input placeholder="请输入本人手机号"/>
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('contacts', {
                        rules: [rule0]
                      })(
                          <Input placeholder="请输入紧急联系人姓名"/>
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('contactsMobile', {
                        rules: [rule1]
                      })(
                          <Input placeholder="请输入紧急联系人手机号"/>
                      )}
                    </FormItem>
                    <div style={{ fontWeight: 700, marginBottom: 10 }}>备注（选填）</div>
                    <FormItem>
                      {getFieldDecorator('remark')(
                          <Input placeholder="请输入备注"/>
                      )}
                    </FormItem>
                    <div>
                      <Button type="primary" style={{ width: 300 }} onClick={ this.handleSubmit }>完成</Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="图片" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
    );
  }
}

export default Form.create()(RuzhiInfo);