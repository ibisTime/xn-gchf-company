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
} from '@redux/biz/project/video';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, monthFormat, getUserId, showSucMsg, showErrMsg } from 'common/js/util';
import fetch from 'common/js/fetch';
import { Modal } from 'antd';

const confirm = Modal.confirm;

@listWrapper(
    state => ({
      ...state.projectVideo,
      parentCode: state.menu.subMenuCode
    }),
    { setTableData, clearSearchParam, doFetching, setBtnList,
      cancelFetching, setPagination, setSearchParam, setSearchData }
)
class ProjectVideo extends React.Component {
  render() {
    const fields = [
    {
      title: '项目名称',
      field: 'projectName'
    }, {
      title: '摄像头名称',
      field: 'cameraName',
      search: true
    }, {
      title: '摄像头账户',
      field: 'cameraUsername'
    },
    {
      title: '摄像头地址',
      field: 'cameraIp'
    }, {
      title: '摄像头端口',
      field: 'cameraIpPort'
    }, {
      title: 'cvr主机用户名',
      field: 'cvrHostUsername'
    }];
    return this.props.buildList({
      fields,
      pageCode: 631855,
      deleteCode: 631851,
      searchParams: {
        userId: getUserId()
      },
      singleSelect: false,
      beforeDelete: (params) => {
        params.userId = getUserId();
      },
      btnEvent: {
        add: () => this.props.history.push('/project/videoMenu/add'),
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
            this.props.history.push(`/project/videoMenu/change?code=${keys[0]}`);
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
                fetch('631851', { codeList: keys, userId: getUserId() }).then(() => {
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

export default ProjectVideo;
