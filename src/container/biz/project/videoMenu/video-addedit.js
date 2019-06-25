import React from 'react';
import { Form } from 'antd';
import { getQueryString, getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class ProjectVideoAddEdit extends DetailUtil {
  render() {
    const fields = [{
        title: '摄像头名称',
        field: 'cameraName',
        required: true
    }, {
      title: '摄像机账号',
      field: 'cameraUsername',
      required: true
    }, {
      title: '摄像机密码',
      field: 'cameraPassword',
      required: true
    }, {
        title: '摄像机IP地址',
        field: 'cameraIp',
        required: true
    }, {
      title: '摄像头IP端口号',
      field: 'cameraIpPort',
      required: true
    }, {
      title: '摄像头频道',
      field: 'cameraChannel',
      required: true
    }, {
      title: '摄像头码流',
      field: 'cameraBitStream',
      type: 'select',
      key: 'bit_stream_type',
      required: true
    }, {
      title: 'CVR主机账号',
      field: 'cvrHostUsername',
      required: true
    }, {
      title: 'CVR主机密码',
      field: 'cvrHostPassword',
      required: true,
      onChange: (v) => {
        this.setState({ isBackPay: v === '1' });
      },
      formatter: (v) => {
        if(v && this.state.index < 2) {
          this.setState({ isBackPay: +v === 1, index: this.state.index + 1 });
        }
        return v;
      }
    },
    {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }];
    return this.buildDetail({
      fields,
      code: '631855',
      view: this.view,
      editCode: 631850,
      beforeDetail: (params) => {
        params.userId = getUserId();
      }
    });
  }
}

export default ProjectVideoAddEdit;
