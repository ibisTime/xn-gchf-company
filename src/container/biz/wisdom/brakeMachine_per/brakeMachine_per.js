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
import { Modal, Transfer, Select, message } from 'antd';
import fetch from 'common/js/fetch';

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
    equipmentCode: ''
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
  getMock = (deviceKey) => {
    const targetKeys = [];
    const mockData = [];
    fetch(631607, {
      deviceKey,
      userId: getUserId()
    }).then(data => {
      data.forEach(item => {
        mockData.push({
          key: item.workerCode,
          title: item.workerName
        });
        if(item.isLink === '1') {
          targetKeys.push(item.workerCode);
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
  // handleSearch = (dir, value) => {
  //   console.log('search:', dir, value);
  // };
  handleOk = () => {
    this.setState({
      visible: false
    });
    if(this.state.targetKeys.length === 0) {
      message.warning('请选择后操作', 1.5);
      return;
    }
    const hasMsg = message.loading('');
    fetch(631830, {
      userId: getUserId(),
      equipmentCode: this.state.equipmentCode,
      workerList: this.state.targetKeys
    }).then(() => {
      hasMsg();
      message.success('关联成功', 1, () => {
        this.setState({
          visible: false,
          mockData: [],
          targetKeys: []
        });
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
    this.setState({
      equipmentCode: v[1],
      deviceKey: v[0]
    });
    this.getMock(v[0]);
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
      <div style={{'marginBottom': '30px'}}>
        <label>设备：</label>
        <Select style={{width: '200px'}} placeholder='请选择设备' onChange={(value) => { this.deviceOption(value); }}>
          {
            deviceData.map(item => (
              <Option value={`${item.deviceKey}-${item.code}`} key={item.code}>{item.name}</Option>
            ))
          }
        </Select>
      </div>
      <div>
        <Transfer
          dataSource={this.state.mockData}
          showSearch
          filterOption={this.filterOption}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          render={item => item.title}
          listStyle={{
            width: 450,
            height: 300
          }}
        />
      </div>
    </Modal>;
  };
  render() {
    const fields = [{
      title: '设备编号',
      field: 'code'
    }, {
      title: '设备编号',
      field: 'deviceCode',
      hidden: true
    }, {
      title: '设备名称',
      field: 'deviceName',
      search: true,
      pageCode: '631825',
      type: 'select',
      keyName: 'code',
      valueName: 'name',
      searchName: 'deviceName',
      params: {
        userId: getUserId()
      },
      render(v) {
        return v;
      }
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
        associated: () => {
          this.setState({
            visible: true
          });
        }
      }
    });
  }
}

export default WisdomBrakeMachinePer;
