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
} from '@redux/biz/project/member';
import { listWrapper } from 'common/js/build-list';
import { Modal } from 'antd';
import { showWarnMsg, getUserId, showSucMsg, showErrMsg } from 'common/js/util';
import { showUploadConfirm } from '../../util';
import fetch from 'common/js/fetch';

const confirm = Modal.confirm;

@listWrapper(
    state => ({
      ...state.projectMember,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectMember extends React.Component {
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
      title: '工人姓名',
      field: 'workerName',
      search: true
    }, {
      title: '证件号',
      field: 'idcardNumber'
    }, {
      title: '工种',
      field: 'workType',
      type: 'select',
      key: 'work_type'
    }, {
      title: '是否购买保险',
      field: 'hasBuyInsurance',
      type: 'select',
      key: 'is_not'
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
      title: '是否班长',
      field: 'isTeamLeader',
      type: 'select',
      key: 'is_not'
    }, {
        title: '人脸照片上传状态',
        field: 'workerPicUploadStatus',
        type: 'select',
        key: 'workerPicUploadStatus'
    }, {
      title: '人员上传国家平台状态',
      field: 'uploadStatus',
      type: 'select',
      data: this.state.uploadStatusData,
      keyName: 'dkey',
      valueName: 'dvalue',
      search: true
    }];
    return this.props.buildList({
      fields,
      pageCode: 631605,
      deleteCode: 631691,
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
              this.props.doFetching, this.props.cancelFetching, 631694);
          }
        },
        // 修改平台
        edit_p: (keys, items) => {
          if (!keys.length) {
            showWarnMsg('请选择记录');
          } else {
            showUploadConfirm(keys, items, this.props.getPageData,
              this.props.doFetching, this.props.cancelFetching, 631695,
              '选择的记录中包含未上传平台的数据',
              '确定修改平台？',
              '修改成功后，需要等待几分钟。国家平台最终反馈回来的结果有可能会上传失败。如果失败，可以到详细页面查看操作日志里的失败原因。',
              '1'
            );
          }
        },
        // 导入
        import: (keys, items) => {
          this.props.history.push('/project/member/import');
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
            this.props.history.push(`/project/member/addedit?code=${keys[0]}`);
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
                fetch('631691', { codeList: keys, userId: getUserId() }).then(() => {
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
        },
        inputting: () => {
          this.props.history.push('/staff/jiandang');
        },
        // 重新建档
        rejiandang: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            sessionStorage.setItem('isStaff', 'true');
            this.props.history.push(`/staff/jiandang?code=${selectedRows[0].workerCode}`);
          }
        },
        // 绑定银行卡
        bandBank: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/staff/allStaff/bank?bcode=${selectedRowKeys[0]}&type=002`);
          }
        },
        // 采集人脸
        face: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/project/member/acquisitionFaces?code=${selectedRows[0].workerCode}`);
          }
        },
        // 档案详情
        archivesDetail: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/staff/allStaff/addedit?code=${selectedRows[0].workerCode}&v=1`);
          }
        }
      }
    });
  }
}

export default ProjectMember;
