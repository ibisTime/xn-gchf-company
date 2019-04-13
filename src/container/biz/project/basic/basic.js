import React from 'react';
import { Form } from 'antd';
import { getQueryString, getUserId, getOrganizationCode, showSucMsg } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';
import { days } from './data';
import fetch from 'common/js/fetch';

@Form.create()
class ProjectBasicAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.code = getOrganizationCode();
  }
  render() {
    const fields = [{
      field: 'name',
      title: '项目名称',
      required: true
    }, {
      field: 'contractorCorpCode',
      title: '总承包单位统一社会信用代码',
      required: true
    }, {
      field: 'contractorCorpName',
      title: '施工总承包单位名称',
      required: true
    }, {
      field: 'description',
      title: '项目简介',
      type: 'textarea',
      normalArea: true
    }, {
      field: 'category',
      title: '项目分类',
      key: 'category',
      type: 'select',
      required: true
    }, {
      field: 'buildCorpCode',
      title: '建设单位统一社会信用代码',
      required: true
    }, {
      field: 'buildCorpName',
      title: '建设单位名称'
    }, {
      field: 'prjPlanNum',
      title: '建设工程规划许可证编号'
    }, {
      field: 'buildPlanNum',
      title: '建设用地规划许可证编号'
    }, {
      field: 'areaCode',
      title: '项目所在地',
      required: true
    }, {
      field: 'invest',
      title: '总投资'
    }, {
      field: 'buildingArea',
      title: '总面积'
    }, {
      field: 'buildingLength',
      title: '总长度'
    }, {
      field: 'startDate',
      title: '开工日期',
      type: 'date'
    }, {
      field: 'completeDate',
      title: '竣工日期',
      type: 'date'
    }, {
      field: 'linkMan',
      title: '项目实名制负责人姓名',
      required: true
    }, {
      field: 'linkPhone',
      title: '项目实名制负责人手机号码',
      mobile: true,
      required: true
    }, {
      field: 'chargeEmail',
      title: '项目实名制负责人邮箱地址'
    }, {
      field: 'prjStatus',
      title: '项目状态',
      type: 'select',
      key: 'prj_status',
      required: true
    }, {
      field: 'lng',
      title: '经度'
    }, {
      field: 'lat',
      title: '纬度'
    }, {
      field: 'address',
      title: '项目地址'
    }, {
      field: 'approvalNum',
      title: '立项文号'
    }, {
      field: 'approvalLevelNum',
      title: '立项级别',
      type: 'select',
      key: 'project_approval_level'
    }, {
      field: 'prjSize',
      title: '建设规模',
      type: 'select',
      key: 'project_size'
    }, {
      field: 'propertyNum',
      title: '建设性质',
      type: 'select',
      key: 'property_num'
    }, {
      field: 'prjNum',
      title: '工程用途',
      type: 'select',
      key: 'function_num'
    }, {
      field: 'nationNum',
      title: '国籍或地区'
    }, {
      field: 'thirdPartyProjectCode',
      title: '第三方项目编码'
    }, {
      field: 'attendanceStarttime',
      title: '上班时间',
      type: 'time'
    }, {
      field: 'attendanceEndtime',
      title: '下班时间',
      type: 'time'
    }, {
      field: 'payRollCreateDatetime',
      title: '工资条形成时间',
      type: 'select',
      data: days,
      keyName: 'dkey',
      valueName: 'dvalue'
    }, {
      field: 'payRollDatetime',
      title: '薪资发放时间',
      type: 'select',
      data: days,
      keyName: 'dkey',
      valueName: 'dvalue'
    }, {
      field: 'builderLicenses',
      title: '施工许可证',
      required: true,
      type: 'o2m',
      options: {
        add: true,
        edit: true,
        delete: true,
        fields: [{
          field: 'prjName',
          title: '工程名称',
          required: true
        }, {
          field: 'builderLicenseNum',
          title: '施工许可证编号',
          required: true
        }]
      }
    }, {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }];
    return this.buildDetail({
      fields,
      code: this.code,
      detailCode: 631616,
      buttons: [{
        check: true,
        type: 'primary',
        title: '保存',
        handler: (params) => {
          this.doFetching();
          fetch(631602, params).then((data) => {
            showSucMsg('操作成功');
            this.cancelFetching();
          }).catch(() => this.cancelFetching());
        }
      }]
    });
  }
}

export default ProjectBasicAddEdit;
