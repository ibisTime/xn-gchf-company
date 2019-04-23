import React from 'react';
import { Form } from 'antd';
import { getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class ProjectAttenceCreate extends DetailUtil {
  componentDidMount() {
    const SP_ELE = document.querySelector('.ant-btn-primary span');
    SP_ELE.innerText = '生成';
  }
  render() {
    const fields = [{
      field: 'projectCode',
      value: getOrganizationCode(),
      hidden: true,
      required: true
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
      required: true
    }, {
      title: '刷卡进出方向',
      field: 'direction',
      type: 'select',
      key: 'direction',
      required: true
    }, {
      title: '考勤开始时间',
      field: 'startDatetime',
      type: 'datetime',
      required: true
    }, {
      title: '考勤结束时间',
      field: 'endDatetime',
      type: 'datetime',
      required: true
    }, {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }];
    return this.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      addCode: 631715
    });
  }
}

export default ProjectAttenceCreate;
