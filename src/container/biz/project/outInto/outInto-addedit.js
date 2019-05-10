import React from 'react';
import { Form } from 'antd';
import { getQueryString, formatImg, getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class ProjectOutIntoAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
  }
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
      title: '现场照片',
      field: 'image',
      type: 'img'
    }, {
      title: '类型',
      field: 'attendType',
      type: 'select',
      key: 'attend_type'
    }];
    return this.buildDetail({
      fields,
      code: this.code,
      view: true,
      detailCode: 631846
    });
  }
}

export default ProjectOutIntoAddEdit;
