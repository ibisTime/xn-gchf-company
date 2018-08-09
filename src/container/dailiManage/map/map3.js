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
} from '@redux/map/map';
import { listWrapper } from 'common/js/build-list';
import { showSucMsg, showWarnMsg, getUserKind, getUserId, dateFormat, dateTimeFormat } from 'common/js/util';
import fetch from 'common/js/fetch';
import { getUserDetail } from 'api/user';
import { getProject, getZhiHang } from 'api/project';
import { getDict } from 'api/dict';
import { Divider, Button, Form, Select, Input, Cascader, Row, Col, TimePicker, DatePicker } from 'antd';
import './map3.css';
import { UPLOAD_URL, projectLayout } from 'common/js/config';
import cityData from 'common/js/lib/city';
import Moment from 'moment';
import locale from '../../../common/js/lib/date-locale';
import PopUp from '../../../component/pop-up/pop-up';

const rule0 = {
  required: true,
  message: '必填字段'
};
const FormItem = Form.Item;
const TIME_FORMAT1 = 'HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD';

@listWrapper(
    state => ({
      ...state.mapMap,
      parentCode: state.menu.subMenuCode
    }),
    {
      setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData
    }
)
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCode: '',
      initVal: [],
      zhihang: [],
      projectStatus: [],
      projectCurStatus: '',
      projectName: '',
      initialLongitude: '', // 原始经度
      initialLatitude: '', // 原始纬度
      longitude: '', // 经度
      latitude: '', // 纬度,
      disabled: true, // disabled为true，非编辑状态，不可编辑，按钮不显示，
      // 以下是为了非编辑状态下能正常显示
      chargeUser: '',
      chargeMobile: '',
      attendanceStarttime: '',
      attendanceEndtime: '',
      accountName: '',
      bankcardNumber: '',
      bankSubbranch: '',
      startDatetime: '',
      salaryCreateDatetime: '',
      salaryDatetime: '',
      quyu: '',
      endDatetime: '',
      companyName: '',
      // 弹窗
      popUp: false,
      title: '',
      content: '',
      okText: '',
      mode: ''
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((res) => {
      getProject(res.projectCode).then((data) => {
        console.log(data);
        data.startDatetime = data.startDatetime ? dateFormat(data.startDatetime) : '';
        this.setState({
          projectCode: res.projectCode,
          initVal: [data.province, data.city, data.area],
          longitude: data.longitude ? data.longitude : '',
          latitude: data.latitude ? data.latitude : '',
          initialLongitude: data.longitude ? data.longitude : '',
          initialLatitude: data.latitude ? data.latitude : '',
          projectCurStatus: data.status,
          // 以下是为了非编辑状态下能正常显示
          projectName: data.name,
          chargeUser: data.chargeUser,
          chargeMobile: data.chargeMobile,
          attendanceStarttime: data.attendanceStarttime,
          attendanceEndtime: data.attendanceEndtime,
          accountName: data.projectCard ? data.projectCard.accountName : '',
          bankcardNumber: data.projectCard ? data.projectCard.bankcardNumber : '',
          bankSubbranch: data.projectCard ? data.projectCard.bankSubbranch : '',
          startDatetime: data.startDatetime,
          salaryCreateDatetime: data.salaryCreateDatetime ? data.salaryCreateDatetime : '',
          salaryDatetime: data.salaryDatetime ? data.salaryDatetime : '',
          quyu: data.province ? data.province + data.city + data.area : '',
          endDatetime: data.endDatetime,
          companyName: data.companyName
        });
        let startDatetime = data.startDatetime ? Moment(data.startDatetime, DATE_FORMAT) : '';
        let attendanceStarttime = data.attendanceStarttime ? Moment(data.attendanceStarttime, TIME_FORMAT1) : '';
        let attendanceEndtime = data.attendanceEndtime ? Moment(data.attendanceEndtime, TIME_FORMAT1) : '';
        this.props.form.setFieldsValue({
          name: data.name,
          chargeUser: data.chargeUser,
          chargeMobile: data.chargeMobile,
          attendanceStarttime: attendanceStarttime,
          attendanceEndtime: attendanceEndtime,
          accountName: data.projectCard ? data.projectCard.accountName : '',
          bankcardNumber: data.projectCard ? data.projectCard.bankcardNumber : '',
          bankSubbranch: data.projectCard ? data.projectCard.bankSubbranch : '',
          startDatetime: startDatetime,
          salaryCreateDatetime: data.salaryCreateDatetime ? data.salaryCreateDatetime : '',
          salaryDatetime: data.salaryDatetime ? data.salaryDatetime : '',
          companyName: data.companyName ? data.companyName : ''
        });
        this.initMap();
        this.makeMarker();
      });
    });
    getZhiHang().then((res) => {
      this.setState({
        zhihang: res
      });
    });
    getDict('project_status').then((res) => {
      res.map((item) => {
        this.state.projectStatus[item.dkey] = item.dvalue;
      });
    });
  }
  initMap = () => {
    let traffic = new AMap.TileLayer({
      getTileUrl: function (x, y, z) {
        return 'http://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&t=1&zoom=' + (17 - z) + '&x=' + x + '&y=' + y;
      },
      zooms: [6, 20],
      zIndex: 5
    });
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      layers: [
        new AMap.TileLayer.Satellite(),
        new AMap.TileLayer.RoadNet(),
        traffic
      ],
      zoom: 15,
      center: [this.state.longitude ? this.state.longitude : 119.970206, this.state.latitude ? this.state.latitude : 30.249695]
    });
  };
  // 创建marker
  makeMarker = () => {
    this.points = {};
    this.data = [];
    getProject(this.state.projectCode).then((res) => {
      this.data.push(res);
      this.data.forEach((item, i) => {
        let point = [item.longitude, item.latitude];
        this.marker = new AMap.Marker({
          position: point,
          map: this.map,
          zIndex: 99,
          content: `<div class="map-marker-point">${i + 1}</div>`
        });
        this.marker.content = { index: i, code: item.code };
        this.marker.on('click', this.markerClick);
        this.points[item.code] = point;
      });
    });
  }
  mapClick = (e) => {
    console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
    // 删除原有点标记
    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
    }
    // 添加新坐标点标记
    this.marker = new AMap.Marker({
      icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
      position: [e.lnglat.getLng(), e.lnglat.getLat()]
    });
    this.marker.setMap(this.map);
    this.setState({
      longitude: e.lnglat.getLng(),
      latitude: e.lnglat.getLat()
    });
  }
  // 编辑项目
  editPro = (selectedRowKeys, selectedRows) => {
    this.setState({ disabled: false });
    this.map.on('click', this.mapClick);
    // this.props.history.push(`/projectManage/project/addedit?projectCode=${selectedRowKeys[0]}`);
  };
  // 施工单位(项目的部门管理)
  addBumen = (selectedRowKeys, selectedRows) => {
    if(this.state.projectCurStatus !== '5') {
      this.props.history.push(`/projectManage/project/addBumen?code=${this.state.projectCode}`);
    }else {
      showWarnMsg('该项目已结束');
    }
  };
  // 项目开工（原审核）
  checkPro = () => {
    if(this.state.projectCurStatus === '1') {
      this.setState({
        popUp: true,
        title: '是否开工',
        content: '请仔细核对您的项目信息是否正确并如实填写开工后相关单位即可通过平台查询您的项目资料',
        okText: '马上开工',
        mode: 'checkPro'
      });
    } else {
      showWarnMsg('该项目未处于待开工状态');
    }
    // this.props.history.push(`/projectManage/project/check?v=1&projectCode=${selectedRowKeys[0]}`);
  };
  // 项目停工
  overPro = () => {
    if(this.state.projectCurStatus === '2') {
      this.setState({
        popUp: true,
        title: '是否停工',
        content: '停工后项目不继续考勤，但相关部门仍可以查看项目资料',
        okText: '马上停工',
        mode: 'overPro'
      });
    } else {
      showWarnMsg('该项目未处于在建状态');
    }
    // this.props.history.push(`/projectManage/project/stop?stop=1&projectCode=${selectedRowKeys[0]}`);
  };
  // 重新开工
  aWork = () => {
    if(this.state.projectCurStatus === '3') {
      this.setState({
        popUp: true,
        title: '重新开工',
        content: '重新开工后项目继续开启考勤，相关部门可以查看项目资料',
        okText: '重新开工',
        mode: 'aWork'
      });
    } else {
      showWarnMsg('该项目未处于停工状态');
    }
    // this.props.history.push(`/projectManage/project/stop?start=1&projectCode=${selectedRowKeys[0]}`);
  };
  // 项目结束
  overTime = () => {
    if(this.state.projectCurStatus === '2') {
      this.setState({
        popUp: true,
        title: '是否结束',
        content: '项目结束后不可再开启，不能对项目的任何资料作出编辑，相关部门可继续查看项目资料',
        okText: '项目结束',
        mode: 'overTime'
      });
    } else {
      showWarnMsg('该项目未处于在建状态');
    }
    // this.props.history.push(`/projectManage/project/end?v=1&projectCode=${selectedRowKeys[0]}`);
  };
  // 取消
  cancel = () => {
    this.setState({
      disabled: true,
      longitude: this.state.initialLongitude,
      latitude: this.state.initialLatitude
    });
    this.map.off('click', this.mapClick);
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
  // 最终提交
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, params) => {
      if (!err) {
        params.province = params.quyu[0];
        params.city = params.quyu[1];
        params.area = params.quyu[2];
        params.startDatetime = params.startDatetime.format(DATE_FORMAT);
        params.attendanceStarttime = params.attendanceStarttime.format(TIME_FORMAT1);
        params.attendanceEndtime = params.attendanceEndtime.format(TIME_FORMAT1);
        params.longitude = this.state.longitude;
        params.latitude = this.state.latitude;
        params.code = this.state.projectCode;
        params.updater = getUserId();
        this.state.zhihang.map((item) => {
          if(params.bankSubbranch === item.code || params.bankSubbranch === item.bankSubbranchName) {
            params.bankCode = item.bankCode;
            params.bankName = item.bankName;
            params.subbranch = item.subbranchName;
          };
        });
        this.props.doFetching();
        fetch(631352, params).then((res) => {
          console.log(params);
          if(res.isSuccess) {
            showSucMsg('操作成功');
            this.setState({
              // 以下是为了非编辑状态下能正常显示
              chargeUser: params.chargeUser,
              chargeMobile: params.chargeMobile,
              attendanceStarttime: params.attendanceStarttime,
              attendanceEndtime: params.attendanceEndtime,
              accountName: params.accountName,
              bankcardNumber: params.bankcardNumber,
              bankSubbranch: params.bankName + params.subbranch,
              startDatetime: params.startDatetime,
              salaryCreateDatetime: params.salaryCreateDatetime,
              salaryDatetime: params.salaryDatetime,
              quyu: params.province + params.city + params.area,
              companyName: params.companyName
            });
            this.setState({ disabled: true });
            this.map.off('click', this.mapClick);
          } else {
            showWarnMsg('操作失败');
          }
          this.props.cancelFetching();
        }).catch(this.props.cancelFetching);
      } else {
        console.log(err);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return this.state.initVal ? (
        <div className="all">
          <div className="tools-wrapper" style={{ marginTop: 8 }}>
            <button type="button" className="ant-btn" onClick={this.editPro}><span>编辑项目</span></button>
            <button type="button" className="ant-btn" onClick={this.addBumen}><span>施工单位</span></button>
            <button type="button" className="ant-btn" onClick={this.checkPro}><span>项目开工</span></button>
            <button type="button" className="ant-btn" onClick={this.overPro}><span>项目停工</span></button>
            <button type="button" className="ant-btn" onClick={this.aWork}><span>重新开工</span></button>
            <button type="button" className="ant-btn" onClick={this.overTime}><span>项目结束</span></button>
          </div>
          <Divider />
          <div className="status" style={{ background: this.state.projectCurStatus === '2' ? '#6bbc6f' : '#d75d32' }}>
            <span style={{ marginRight: '20px' }}>项目状态：{this.state.projectStatus[this.state.projectCurStatus]}</span>
            {this.state.projectStatus[this.state.projectCurStatus] === '结束'
             ? `结束时间：${dateFormat(this.state.endDatetime)}`
             : ''}
            </div>
          <div className="info-content">
            <Form>
              <div className="left-project-info">
                <FormItem label="项目名称" {...projectLayout}>
                  <span>{this.state.projectName}</span>
                </FormItem>
                <FormItem label="施工单位" {...projectLayout}>
                  {getFieldDecorator('companyName', {
                    rules: [rule0]
                  })(
                      this.state.disabled
                          ? <span>{this.state.companyName}</span>
                          : <Input style={{ width: '280px' }} placeholder="请输入施工单位"/>
                  )}
                </FormItem>
                <FormItem label="负责人" {...projectLayout}>
                  {getFieldDecorator('chargeUser', {
                    rules: [rule0]
                  })(
                      this.state.disabled
                          ? <span>{this.state.chargeUser}</span>
                          : <Input style={{ width: '280px' }} placeholder="请输入负责人名称" disabled={this.state.disabled}/>
                  )}
                </FormItem>
                <FormItem label="负责人联系方式" {...projectLayout}>
                  {getFieldDecorator('chargeMobile', {
                    rules: [rule0]
                  })(
                      this.state.disabled
                          ? <span>{this.state.chargeMobile}</span>
                          : <Input style={{ width: '280px' }} placeholder="请输入负责人联系方式" disabled={this.state.disabled}/>
                  )}
                </FormItem>
                <FormItem label="地区" {...projectLayout}>
                  {getFieldDecorator('quyu', {
                    rules: [rule0]
                    // initialValue: this.state.initVal
                  })(
                      this.state.disabled
                          ? <span>{this.state.quyu}</span>
                          : <Cascader placeholder="请选择" options={cityData} disabled={this.state.disabled}/>
                      // <Cascader placeholder="请选择" options={cityData} defaultValue={[this.state.province, this.state.city, this.state.area]}/>
                  )}
                </FormItem>
                <FormItem label="上班时间" {...projectLayout}>
                  {getFieldDecorator('attendanceStarttime', {
                    rules: [rule0]
                  })(
                      this.state.disabled
                          ? <span>{this.state.attendanceStarttime}</span>
                          : <TimePicker placeholder='选择上班时间时间' format={TIME_FORMAT1}/>
                  )}
                </FormItem>
                <FormItem label="下班时间" {...projectLayout}>
                  {getFieldDecorator('attendanceEndtime', {
                    rules: [rule0]
                  })(
                      this.state.disabled
                          ? <span>{this.state.attendanceEndtime}</span>
                          : <TimePicker placeholder='选择下班时间时间' format={TIME_FORMAT1}/>
                  )}
                </FormItem>
                <FormItem label="项目开始时间" {...projectLayout}>
                  {getFieldDecorator('startDatetime', {
                    rules: [rule0]
                  })(
                      this.state.disabled
                          ? <span>{this.state.startDatetime}</span>
                          : <DatePicker
                          allowClear={false}
                          locale={locale}
                          placeholder='请选择项目开始时间'
                          format={DATE_FORMAT}
                          showTime={false}
                          disabled={this.state.disabled} />
                  )}
                </FormItem>
                <FormItem label="工资条生成时间" {...projectLayout}>
                  <Row gutter={8}>
                    <span style={{ float: 'left' }}>每月</span>
                    <Col span={5}>
                      {getFieldDecorator('salaryCreateDatetime', {
                        rules: [rule0]
                      })(
                          this.state.disabled
                              ? <span>{this.state.salaryCreateDatetime}</span>
                              : <Input disabled={this.state.disabled}/>
                      )}
                    </Col>
                    <span>日</span>
                </Row>
                </FormItem>
                <FormItem label="薪资发放时间" {...projectLayout}>
                  <Row gutter={8}>
                    <span style={{ float: 'left' }}>每月</span>
                    <Col span={5}>
                      {getFieldDecorator('salaryDatetime', {
                        rules: [rule0]
                      })(
                          this.state.disabled
                              ? <span>{this.state.salaryDatetime}</span>
                              : <Input disabled={this.state.disabled}/>
                      )}
                    </Col>
                    <span>日</span>
                  </Row>
                </FormItem>
              </div>
              <div className="right-project-info">
                <FormItem label="工资专户户名" {...projectLayout}>
                  {getFieldDecorator('accountName', {
                    rules: [rule0]
                  })(
                      this.state.disabled
                          ? <span>{this.state.accountName}</span>
                          : <Input style={{ width: '280px' }} placeholder="请输入工资专户户名" disabled={this.state.disabled}/>
                  )}
                </FormItem>
                <FormItem label="工资专户账户" {...projectLayout}>
                  {getFieldDecorator('bankcardNumber', {
                    rules: [rule0]
                  })(
                      this.state.disabled
                          ? <span>{this.state.bankcardNumber}</span>
                          : <Input style={{ width: '280px' }} placeholder="请输入工资专户账户" disabled={this.state.disabled}/>
                  )}
                </FormItem>
                <FormItem label="工资专户开户行" {...projectLayout}>
                  {getFieldDecorator('bankSubbranch', {
                    rules: [rule0]
                  })(
                      this.state.disabled
                          ? <span>{this.state.bankSubbranch}</span>
                          : <Select style={{ width: '300px' }} placeholder="请选择工资专户开户行" onChange={this.handleProjectChange} disabled={this.state.disabled}>
                        {this.state.zhihang.map((item) => <Option key={item.code} value={item.code}>{item.bankSubbranchName}</Option>)}
                      </Select>
                  )}
                </FormItem>
                <div className="map-out">
                  <div className="map" id='container' onClick={ this.getLongitude }></div>
                  <div className="showLongitude">项目位置：{this.state.longitude}/{this.state.latitude}</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', display: this.state.disabled ? 'none' : 'block' }}>
                <Button style={{ width: 100, marginRight: '50px' }} onClick={ this.cancel }>返回</Button>
                <Button type="primary" style={{ width: 100 }} onClick={ this.handleSubmit }>保存</Button>
              </div>
            </Form>
          </div>
          <PopUp popUpVisible={this.state.popUp}
                 title={this.state.title}
                 content={this.state.content}
                 okText={this.state.okText}
                 changeState={this.changeState}
                 mode={this.state.mode}
                 projectCode={this.state.projectCode}
          />
        </div>
    ) : null;
  }
}

export default Form.create()(Map);