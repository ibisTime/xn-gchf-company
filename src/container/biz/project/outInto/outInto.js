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
} from '@redux/biz/project/outInto';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, dateFormat, getUserId, isUndefined, showSucMsg, showErrMsg } from 'common/js/util';
import { showUploadConfirm } from '../../util';
import fetch from 'common/js/fetch';
import { Modal } from 'antd';

const confirm = Modal.confirm;

@listWrapper(
  state => ({
    ...state.projectOutInto,
    parentCode: state.menu.subMenuCode
  }),
  { setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectOutInto extends React.Component {
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
      field: 'deviceName'
    }, {
      title: '方向',
      field: 'direction',
      type: 'select',
      key: 'direction',
      search: true
    }, {
      title: '工人姓名',
      field: 'workerName',
      search: true
    }, {
      title: '证件号',
      field: 'idcardNumber'
    }, {
      title: '所在班组',
      field: 'teamName'
    }, {
      title: '记录时间',
      field: 'date',
      type: 'datetime'
    }, {
      title: '类型',
      field: 'attendType',
      type: 'select',
      key: 'attend_type'
    }];
    return this.props.buildList({
      fields,
      pageCode: 631845,
      searchParams: {
        userId: getUserId()
      },
      singleSelect: false,
      beforeDelete: (params) => {
        params.userId = getUserId();
      },
      btnEvent: {
        // 上传平台
        up: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else {
            showUploadConfirm(keys, items, this.props.getPageData,
              this.props.doFetching, this.props.cancelFetching, 631674);
          }
        },
        // 导入
        import: (keys, items) => {
          this.props.history.push('/project/memcontract/import');
        },
        edit: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (keys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else if (items[0].uploadStatus === '3') {
            showWarnMsg('已上传不可修改');
          } else if (items[0].uploadStatus === '4' || items[0].uploadStatus === '5') {
            showWarnMsg('该状态下不可修改');
          } else {
            this.props.history.push(`/project/memcontract/addedit?code=${keys[0]}`);
          }
        },
        // 批量删除
        delete: (keys) => {
          const _this = this;
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else {
            confirm({
              title: '删除',
              content: '是否删除？',
              onOk() {
                fetch('631671', { codeList: keys, userId: getUserId() }).then(() => {
                  showSucMsg('操作成功');
                  setTimeout(() => {
                    _this.props.getPageData();
                  }, 1000);
                });
              },
              onCancel() {
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

export default ProjectOutInto;
