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
import fetch from 'common/js/fetch';
import {Modal, message} from 'antd';
const confirm = Modal.confirm;

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
      field: 'deviceKey'
    }, {
      title: '设备名称',
      field: 'code',
      search: true,
      pageCode: '631825',
      type: 'select',
      keyName: 'code',
      valueName: 'name',
      searchName: 'name',
      params: {
        userId: getUserId()
      },
      hidden: true
    }, {
      title: '设备名称',
      field: 'name'
    }, {
      title: '设备标签',
      field: 'tag'
    }, {
      title: '设备总识别次数',
      field: 'regNum'
    }, {
      title: '设备状态',
      field: 'state',
      type: 'select',
      key: 'device_status',
      search: true
    }, {
      title: '网络状态',
      field: 'status',
      type: 'select',
      key: 'device_net_status'
    }, {
      title: '人脸识别设备是否禁用',
      field: 'expired',
      type: 'select',
      key: 'is_not'
    }, {
      title: '方向',
      field: 'direction',
      type: 'select',
      key: 'direction'
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
      },
      btnEvent: {
        enable: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            if(selectedRows[0].expired === 0) {
              message.warning('该设备已启用');
              return;
            }
            confirm({
              title: '启用设备',
              content: '是否启用？',
              onOk: () => {
                const hasMsg = message.loading('', 10);
                fetch(631823, {
                  userId: getUserId(),
                  deviceKey: selectedRows[0].deviceKey
                }).then(() => {
                  hasMsg();
                  message.success('操作成功', 1, () => {
                    this.props.getPageData();
                  });
                });
              },
              okText: '确定',
              cancelText: '取消'
            });
          }
        },
        disable: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            if(selectedRows[0].expired === 1) {
              message.warning('该设备已禁用');
              return;
            }
            confirm({
              title: '禁用设备',
              content: '是否禁用？',
              onOk: () => {
                const hasMsg = message.loading('', 10);
                fetch(631822, {
                  userId: getUserId(),
                  deviceKey: selectedRows[0].deviceKey
                }).then(() => {
                  hasMsg();
                  message.success('操作成功', 1, () => {
                    this.props.getPageData();
                  });
                });
              },
              okText: '确定',
              cancelText: '取消'
            });
          }
        }
      }
    });
  }
}

export default WisdomBrakeMachine;
