import React from 'react';
import { Form } from 'antd';
import { getQueryString, getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class WisdomBrakeMachineAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.state = {
      ...this.state,
      directionData: []
    };
  }
  render() {
    const fields = [{
      title: '人脸识别设备序列号',
      field: 'deviceKey',
      maxlength: 64,
      readonly: this.code,
      required: true
    }, {
      title: '方向',
      field: 'direction',
      type: 'select',
      required: true,
      key: 'direction'
    }, {
      title: '设备名称',
      field: 'name',
      maxlength: 32
    }, {
      title: '设备标签',
      field: 'tag',
      maxlength: 32
    }, {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }];
    return this.buildDetail({
      fields,
      code: this.code,
      detailCode: 631826,
      editCode: 631821,
      addCode: 631820,
      beforeDetail: (params) => {
        params.userId = getUserId();
      },
      beforeSubmit: (params) => {
        params.projectCode = getOrganizationCode();
        return params;
      }
    });
  }
}

export default WisdomBrakeMachineAddEdit;
