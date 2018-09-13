import React from 'react';
import { Button, Input, Divider, Spin, Form, Table, Timeline, Modal, Upload, Icon } from 'antd';
import { getQueryString, showSucMsg, formatDate, getUserKind, formatImg, moneyFormat } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getDict } from 'api/dict';
import { getQiniuToken } from 'api/general';
import { getUserId, getUserDetail, getUserErrorInfo, getUserWagesInfo, senderrInfo } from 'api/user';
import { UPLOAD_URL } from 'common/js/config';
import './allStaff-errorHistoryAddedit.css';

const { TextArea } = Input;
const FormItem = Form.Item;

class AllStaffAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      errordata: '',
      loading: true,
      type: '',
      token: '',
      fileList: [],
      handleNote: '',
      list: [],
      textValue: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    Promise.all([
      getUserErrorInfo(this.code),
      getUserWagesInfo(this.code),
      getDict('salary_status'),
      getQiniuToken()
    ]).then(([errordata, data, abType, qiniu]) => {
      let abTypeObj = {};
      this.setState({
        errordata,
        data,
        loading: false,
        token: qiniu.uploadToken
      });
      abType.map((item) => {
        abTypeObj[item.dkey] = item.dvalue;
      });
      this.setState({ type: abTypeObj[data.status] });
      this.list();
    }).catch(() => this.setState({ loading: false }));
  };
  goBack() {
    this.props.history.go(-1);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    // this.sendInfo(values['handleNote']);
  };
  sendInfo = () => {
    this.setState({ loading: true });
    senderrInfo({
      salaryCode: this.code,
      handleNote: this.state.handleNote,
      handlePicList: this.state.fileList,
      handler: getUserId()
    }).then((res) => {
      if(res.code) {
        showSucMsg('发送成功！');
      } else {
        showSucMsg('发送失败！');
      }
      getUserErrorInfo(this.code).then(errordata => {
        this.setState({
          errordata,
          loading: false,
          fileList: [],
          textValue: ''
        });
        this.list();
      }).catch(() => this.setState({ loading: false }));
    }).catch(() => this.setState({ loading: false }));
  };
  handleCancel = () => this.setState({ previewVisible: false });
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };
  setUploadFileUrl(fileList) {
    fileList.forEach(f => {
      if (!f.url && f.status === 'done' && f.response) {
        f.url = formatImg(f.response.key);
      }
    });
    let picArr = [];
    fileList.map((item) => {
      item.response && picArr.push(item.response.key);
    });
    this.setState({ fileList: picArr });
  };
  textChange = (e) => {
    console.log(this.texta);
    this.setState({ handleNote: e.target.value });
  };
  Transformation = () => {
    this.props.history.push(`/staff/allStaff/error/Edit?code=${this.code}`);
  };
  list = () => {
    let res = [];
    if (!this.state.errordata.length) {
      res.push(
          <p>没有异常处理记录!</p>
      );
    } else {
      for (let i = 0; i < this.state.errordata.length; i++) {
        res.push(
            <Timeline.Item>
              <p className="error-handle-time">{formatDate(this.state.errordata[i].handleDatetime, 'yyyy-MM-dd hh:mm:ss')}</p>
              <p className={this.state.errordata[i].handler === 'admin' ? 'blue' : 'six'}>{this.state.errordata[i].handleName || '系统'}：{this.state.errordata[i].handleNote}</p>
              <div style={{ display: this.state.errordata[i].handlePicList.length ? 'block' : 'none' }}>
                {this.state.errordata[i].handlePicList.map((item) => {
                  return(
                      <img src={formatImg(item)} alt="" className="error-img"/>
                  );
                })}
              </div>
            </Timeline.Item>
        );
      }
    }
    this.setState({ list: res });
    return res;
  };
  render() {
    const { loading, data, type, list, textValue } = this.state;
    const { previewVisible, previewImage, token } = this.state;
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
    const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
    );
    const dataSource = [{
      key: '1',
      name: data.staffName,
      month: data.month,
      factAmount: moneyFormat(data.factAmount),
      payAmount: moneyFormat(data.payAmount),
      delayAmount: moneyFormat(data.delayAmount),
      status: type
    }];
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '工资月份',
      dataIndex: 'month',
      key: 'month'
    }, {
      title: '工资单金额（元）',
      dataIndex: 'factAmount',
      key: 'factAmount'
    }, {
      title: '实发金额（元）',
      dataIndex: 'payAmount',
      key: 'payAmount'
    }, {
      title: '欠薪金额（元）',
      dataIndex: 'delayAmount',
      key: 'delayAmount'
    }, {
      title: '异常类型',
      dataIndex: 'status',
      key: 'status'
    }];
    return (
        <Spin spinning={loading}>
          <Table dataSource={dataSource}
                 columns={columns}
                 bordered
                 pagination={false}/>
          <div className="error-big">
            <div className="error-people">
              <p className="error-people-title">事件相关人员与单位</p>
              <p className="error-people-content">项目组负责人：{data.projectChargeUser} {data.projectChargeUserMobile ? '(' + data.projectChargeUserMobile + ')' : ''}</p>
              <p className="error-people-content">所在班组负责人：{data.departmentLeaderName}{data.departmentLeaderMobile ? '(' + data.departmentLeaderMobile + ')' : ''}</p>
              <p className="error-people-content">财务负责人：{data.sendUserName} {data.sendUserMobile ? '(' + data.sendUserMobile + ')' : ''}</p>
              <p className="error-people-content">被欠薪务工人员：{data.staffName}（{data.staffMobile}）</p>
              <p className="error-people-content">监管单位：{data.superviseUser}{data.superviseUserMobile ? '(' + data.superviseUserMobile + ')' : ''}</p>
            </div>
            <div className="error-right">
              <div className="error-handle-record">
                <p className="error-people-title">异常事件处理记录</p>
                <Timeline>
                  {list}
                </Timeline>
              </div>
            </div>
          </div>
        </Spin>
    );
  }
}

export default Form.create()(AllStaffAddEdit);
