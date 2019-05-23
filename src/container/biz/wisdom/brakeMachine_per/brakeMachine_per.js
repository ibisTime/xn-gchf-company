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
} from '@redux/biz/wisdom/brakeMachine_per';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserId, showSucMsg, showErrMsg, getOrganizationCode } from 'common/js/util';
import { Modal, Transfer, Select, message, TimePicker } from 'antd';
import fetch from 'common/js/fetch';
import moment from 'moment';

const {Option} = Select;

@listWrapper(
  state => ({
    ...state.wisdomBrakeMachinePer,
    parentCode: state.menu.subMenuCode
  }),
  { setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData }
)
class WisdomBrakeMachinePer extends React.Component {
  state = {
    mockData: [],
    targetKeys: [],
    deviceData: [],
    visible: false,
    deviceKey: '',
    equipmentCode: '',
    selectValue: null,
    startTime: '',
    endTime: '',
    defaultCode: ''
  };
  componentDidMount() {
    fetch(631827, {
      userId: getUserId(),
      projectCode: getOrganizationCode()
    }).then(data => {
      let devList = [];
      data.forEach(item => {
        devList.push({
          code: item.code,
          deviceKey: item.deviceKey,
          name: item.name
        });
      });
      this.setState({
        deviceData: devList
      });
    });
  }
  onStartChange= (value, dateString) => {
    this.setState({
      startTime: dateString
    });
  };
  onEndChange= (value, dateString) => {
    this.setState({
      endTime: dateString
    });
  };
  getMock = (deviceKey, hasMsg) => {
    const targetKeys = [];
    const mockData = [];
    fetch(631607, {
      deviceKey,
      userId: getUserId()
    }).then(data => {
      hasMsg();
      data.forEach(item => {
        mockData.push({
          key: item.code,
          title: item.workerName
        });
        if(item.isLink === '1') {
          targetKeys.push(item.code);
        }
      });
      this.setState({ mockData, targetKeys });
    });
  };
  filterOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1;
  };
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  };
  handleOk = () => {
    const hasMsg = message.loading('', 10);
    let equipmentCode = this.state.equipmentCode;
    if(this.state.defaultValue) {
      equipmentCode = this.state.defaultCode;
    }
    fetch(631830, {
      userId: getUserId(),
      equipmentCode: equipmentCode,
      workerList: this.state.targetKeys,
      startTime: this.state.startTime,
      endTime: this.state.endTime
    }).then(() => {
      hasMsg();
      message.success('操作成功', 1, () => {
        this.setState({
          visible: false,
          mockData: [],
          targetKeys: [],
          selectValue: null
        });
        this.props.getPageData();
      });
    }, hasMsg);
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  deviceOption = (value) => {
    let v = value.split('-');
    const hasMsg = message.loading('', 10);
    this.setState({
      equipmentCode: v[1],
      deviceKey: v[0]
    });
    this.getMock(v[0], hasMsg);
  };
  ownerModel = () => {
    const { deviceData } = this.state;
    return <Modal
      width={1000}
      title = '设备人员关联'
      visible = {this.state.visible}
      onOk = {this.handleOk}
      onCancel = {this.handleCancel}
      okText = '确定'
      cancelText = '取消'
    >
      <div style={{'marginBottom': '30px', 'display': 'flex'}}>
        <div>
          <label>设备：</label>
          <Select
            style={{width: '200px'}}
            placeholder='请选择设备'
            value={this.state.selectValue}
            onChange={
              (value) => {
                this.setState({
                  selectValue: value
                });
                this.deviceOption(value);
              }}>
            {
              deviceData.map(item => (
                <Option value={`${item.deviceKey}-${item.code}`} key={item.code}>{item.name}</Option>
              ))
            }
          </Select>
        </div>
        <div style={{'marginLeft': '50px'}}>
          <label>考勤开始时间：</label>
          <TimePicker onChange={this.onStartChange} value={this.state.startTime ? moment(this.state.startTime, 'HH:mm:ss') : this.state.startTime} placeholder='请选择开始时间' style={{'width': '150px'}}/>
        </div>
        <div style={{'marginLeft': '20px'}}>
          <label>考勤结束时间：</label>
          <TimePicker onChange={this.onEndChange} value={this.state.endTime ? moment(this.state.endTime, 'HH:mm:ss') : this.state.endTime} placeholder='请选择结束时间' style={{'width': '150px'}}/>
        </div>
      </div>
      <div>
        <p><span>未关联人员：</span><span style={{'marginLeft': '410px'}}>已关联人员：</span></p>
        <Transfer
          dataSource={this.state.mockData}
          showSearch
          filterOption={this.filterOption}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          render={item => item.title}
          listStyle={{
            width: 450,
            height: 300
          }}
        />
      </div>
    </Modal>;
  };
  showModal = (d) => {
    const startTime = d ? d.passTimes.split(',')[0] : '';
    const endTime = d ? d.passTimes.split(',')[1] : '';
    let svalue = d ? `${d.deviceKey}-${d.deviceCode}` : null;
    this.setState({
      visible: true,
      mockData: [],
      targetKeys: [],
      defaultCode: d ? d.deviceCode : '',
      selectValue: d ? d.deviceName : null,
      startTime,
      endTime
    });
    if(d) {
      this.deviceOption(svalue);
    }
  };
  render() {
    const fields = [{
      title: '设备序列号',
      field: 'deviceKey'
    }, {
      title: '设备名称',
      field: 'deviceCode',
      search: true,
      pageCode: '631825',
      type: 'select',
      keyName: 'code',
      valueName: 'name',
      searchName: 'deviceName',
      params: {
        userId: getUserId()
      },
      hidden: true
    }, {
      title: '设备名称',
      field: 'deviceName'
    }, {
      title: '工人姓名',
      field: 'workerName',
      search: true
    }, {
      title: '证件号',
      field: 'idCardNumber'
    }, {
      title: '所在班组',
      field: 'teamName'
    }, {
      title: '允许进入时段',
      field: 'passTimes'
    }, {
      title: '添加时间',
      field: 'createTime',
      type: 'date'
    }];
    return this.props.buildList({
      fields,
      pageCode: 631835,
      searchParams: {
        userId: getUserId()
      },
      ownerModel: this.ownerModel,
      btnEvent: {
        associated: (v, d) => {
          this.showModal(d[0]);
        }
      }
    });
  }
}

export default WisdomBrakeMachinePer;
