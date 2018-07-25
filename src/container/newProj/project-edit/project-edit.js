import React from 'react';
import cookies from 'browser-cookies';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newProj/project-edit';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import fetch from 'common/js/fetch';
import { getBankNameByCode } from 'api/project';
import { getUserDetail } from 'api/user';
import { basename } from 'upath';

@DetailWrapper(
  state => state.newprojProjectEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentCode: '',
      bankCode: '',
      companyCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }

  render() {
    const edit = [{
      field: 'name',
      title: '项目名称',
      required: true
    }, {
      field: 'chargeUser',
      title: '负责人',
      required: true
    }, {
      field: 'chargeMobile',
      title: '负责人手机号',
      mobile: true,
      required: true
    }, {
      field: 'quyu',
      title: '地区',
      type: 'citySelect',
      required: true
    }, {
      field: 'address',
      title: '详细地址',
      type: 'lnglat',
      lnglat: 'quyu',
      lnglatTo: ['longitude', 'latitude'],
      required: true
    }, {
      field: 'longitude',
      title: '经度',
      required: true
    }, {
      field: 'latitude',
      title: '纬度',
      required: true
    }, {
      field: 'attendanceStarttime',
      title: '上班时间',
      type: 'time',
      required: true
    }, {
      field: 'attendanceEndtime',
      title: '下班时间',
      type: 'time',
      required: true
    }, {
      field: 'startDatetime',
      title: '项目开始时间',
      type: 'date',
      required: true
    }, {
        field: 'salaryCreateDatetime',
        title: '工资条形成时间',
        type: 'date28',
        date28: true,
        required: true
    }, {
      field: 'salaryDatetime',
      title: '薪资发放时间',
      type: 'date28',
      date28: true,
      required: true
    }, {
      field: 'salaryDelayDays',
      title: '薪资发放可延迟天数',
      readonly: true,
      required: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildDetail({
      fields: edit,
      key: 'code',
      code: this.code,
      detailCode: 631358,
      buttons: [{
        title: '保存',
        check: true,
        handler: (param) => {
          param.companyCode = this.state.companyCode;
          getBankNameByCode(param.bankName).then(data => {
            param.bankCode = data[0].bankCode;
            param.bankName = data[0].bankName;
            this.props.doFetching();
            // console.log(param);
            // console.log(this.props.pageData);
            param = { address: this.props.pageData.address, area: this.props.pageData.area, attendanceEndtime: this.props.pageData.attendanceEndtime, attendanceStarttime: this.props.pageData.attendanceStarttime, chargeUser: this.props.pageData.chargeUser, chargeMobile: this.props.pageData.chargeMobile, city: this.props.pageData.city, code: this.code, latitude: this.props.pageData.latitude, longitude: this.props.pageData.longitude, name: this.props.pageData.name, province: this.props.pageData.province, salaryCreateDatetime: this.props.pageData.salaryCreateDatetime, salaryDatetime: this.props.pageData.salaryDatetime, startDatetime: this.props.pageData.startDatetime, updater: this.props.pageData.updater };
            fetch(631352, param).then(() => {
              showSucMsg('操作成功');
              this.props.cancelFetching();
              setTimeout(() => {
                this.props.history.go(-1);
              }, 1000);
            }).catch(this.props.cancelFetching);
          });
        }
      }, {
        title: '提请审核项目',
        check: true,
        handler: (param) => {
          fetch(631353, param).then(() => {
            showSucMsg('操作成功');
            this.props.cancelFetching();
            setTimeout(() => {
              this.props.history.go(-1);
            }, 1000);
          }).catch(this.props.cancelFetching);
        }
      }, {
        title: '返回',
        check: true,
        handler: (selectedRowKeys, selectedRows) => {
          this.props.history.go(-1);
        }
      }]
    });
  }
}
export default ProjectEdit;
