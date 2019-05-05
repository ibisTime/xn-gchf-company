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
} from '@redux/biz/project/participating';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserId, getOrganizationCode, showSucMsg, showErrMsg } from 'common/js/util';
import { showUploadConfirm } from '../../util';
import fetch from 'common/js/fetch';
import { Modal } from 'antd';

const confirm = Modal.confirm;

@listWrapper(
    state => ({
      ...state.projectParticipating,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class Participating extends React.Component {
  state = {
    uploadStatusData: []
  };
  componentWillMount() {
    fetch(631006, {
      parentKey: 'upload_status'
    }).then(data => {
      let uploadStatusData = [];
      data.forEach((item) => {
        if(item.dkey !== '3') {
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
      title: '企业名称',
      field: 'corpName',
      search: true
    }, {
      title: '社会信用代码',
      field: 'corpCode'
    }, {
      title: '对应项目',
      field: 'projectName'
    }, {
      title: '进场时间',
      field: 'entryTime',
      type: 'datetime'
    }, {
      title: '退场时间',
      field: 'exitTime',
      type: 'datetime'
    }, {
      title: '项目经理',
      field: 'pmName'
    }, {
      title: '项目经理电话',
      field: 'pmPhone'
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
      pageCode: 631645,
      deleteCode: 631631,
      singleSelect: false,
      searchParams: {
        userId: getUserId()
      },
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
              this.props.doFetching, this.props.cancelFetching, 631634);
          }
        },
        // 修改平台
        edit_p: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else {
            showUploadConfirm(keys, items, this.props.getPageData,
              this.props.doFetching, this.props.cancelFetching, 631635,
              '选择的记录中包含未上传平台的数据',
              '确定修改平台？',
              '修改成功后，需要等待几分钟。国家平台最终反馈回来的结果有可能会上传失败。如果失败，可以到详细页面查看操作日志里的失败原因。',
              '1'
            );
          }
        },
        // 导入
        import: (keys, items) => {
          this.props.history.push('/project/projectparticipant/import');
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
            this.props.history.push(`/project/projectparticipant/addedit?code=${keys[0]}`);
          }
        },
        detail: (keys) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (keys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/project/projectparticipant/detail?code=${keys[0]}&v=1`);
          }
        },
        // 查看银行卡
        bank: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (keys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/project/projectparticipant/bank?code=${keys[0]}&type=001`);
          }
        },
        // 批量删除
        delete: (keys, items) => {
          const _this = this;
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else if (items[0].uploadStatus === '1' || items[0].uploadStatus === '2' || items[0].uploadStatus === '4' || items[0].uploadStatus === '5') {
            showWarnMsg('该状态下不可删除');
          } else {
            confirm({
              title: '删除',
              content: '是否删除？',
              onOk() {
                fetch('631631', { codeList: keys, userId: getUserId() }).then(() => {
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
      },
      beforeDetail: (params) => {
        params.userId = getUserId();
      }
    });
  }
}

export default Participating;
