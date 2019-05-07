import React from 'react';
import moment from 'moment';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/biz/project/attence';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserId, showSucMsg, showErrMsg } from 'common/js/util';
import { showUploadConfirm } from '../../util';
import fetch from 'common/js/fetch';
import { Modal } from 'antd';

const confirm = Modal.confirm;

@listWrapper(
    state => ({
      ...state.projectAttence,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectAttence extends React.Component {
  state = {
    uploadStatusData: []
  };
  componentWillMount() {
    fetch(631006, {
      parentKey: 'upload_status'
    }).then(data => {
      let uploadStatusData = [];
      data.forEach((item) => {
        if(item.dkey !== '1' && item.dkey !== '2' && item.dkey !== '5') {
          uploadStatusData.push({
            dkey: item.dkey,
            dvalue: item.dvalue
          });
        }
      });
      this.setState({
        uploadStatusData
      });
    });
  }
  render() {
    const fields = [{
      title: '工人姓名',
      field: 'workerName',
      search: true
    }, {
      title: '证件号',
      field: 'idCardNumber'
    }, {
      title: '来源',
      field: 'idCardNumber'
    }, {
      title: '刷卡时间',
      field: 'date',
      type: 'datetime'
    }, {
      title: '刷卡进出方向',
      field: 'direction',
      type: 'select',
      key: 'direction'
    }, {
      title: '对应项目',
      field: 'projectName'
    }, {
      title: '所在企业',
      field: 'corpName',
      search: true
    }, {
      title: '所在班组',
      field: 'teamSysNo',
      type: 'select',
      keyName: 'code',
      valueName: 'teamName',
      searchName: 'teamName',
      pageCode: 631665,
      params: {
        userId: getUserId()
      },
      search: true,
      hidden: true
    }, {
      title: '所在班组',
      field: 'teamName'
    }, {
      title: '状态',
      field: 'uploadStatus',
      type: 'select',
      data: this.state.uploadStatusData,
      keyName: 'dkey',
      valueName: 'dvalue',
      search: true
    }];
    return this.props.buildList({
      fields,
      pageCode: 631725,
      deleteCode: 631711,
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
              this.props.doFetching, this.props.cancelFetching, 631714);
          }
        },
        // 导入
        import: (keys, items) => {
          this.props.history.push('/project/attence/import');
        },
        edit: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (keys.length > 1) {
            showWarnMsg('请选择一条记录');
            items = [];
          } else if (items[0].uploadStatus === '3') {
            showWarnMsg('已上传不可修改');
          } else if (items[0].uploadStatus === '4' || items[0].uploadStatus === '5') {
            showWarnMsg('该状态下不可修改');
          } else {
            this.props.history.push(`/project/attence/addedit?code=${keys[0]}`);
          }
        },
        create: () => {
          this.props.history.push('/project/attence/create');
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
                fetch('631711', { codeList: keys, userId: getUserId() }).then(() => {
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

export default ProjectAttence;
