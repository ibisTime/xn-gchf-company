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
} from '@redux/biz/wisdom/brakeMachine';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserId, showSucMsg, showErrMsg } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.wisdomBrakeMachine,
    parentCode: state.menu.subMenuCode
  }),
  { setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData }
)
class WisdomBrakeMachine extends React.Component {
  render() {
    const fields = [{
      title: '设备序列号',
      field: 'code'
    }, {
      title: '设备名称',
      field: 'name',
      search: true,
      pageCode: '631825',
      type: 'select',
      keyName: 'code',
      valueName: 'name',
      searchName: 'name',
      params: {
        userId: getUserId()
      },
      render(v) {
        return v;
      }
    }, {
      title: '设备tag',
      field: 'tag'
    }, {
      title: '设备总识别次数',
      field: 'regNum'
    }, {
      title: '设备状态',
      field: 'state',
      type: 'select',
      key: 'device_status'
    }, {
      title: '网络状态',
      filed: 'status',
      render(v) {
        if(v === '1') {
          return '在线';
        }else {
          return '离线';
        }
      }
    }, {
      title: '人脸识别设备是否禁用',
      field: 'expired',
      render(v) {
        if(v === '1') {
          return '是';
        }else {
          return '否';
        }
      }
    }, {
      title: '添加时间',
      field: 'createTime',
      type: 'date'
    }];
    return this.props.buildList({
      fields,
      pageCode: 631825,
      searchParams: {
        userId: getUserId()
      }
    });
  }
}

export default WisdomBrakeMachine;
