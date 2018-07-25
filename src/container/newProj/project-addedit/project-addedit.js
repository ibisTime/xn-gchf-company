import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newProj/project-addedit';
import { getQueryString, showSucMsg, getUserId, getUserKind, moneyFormat } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import fetch from 'common/js/fetch';
import { getBankNameByCode, getBankCodeByName } from 'api/project';
import { getUserDetail } from 'api/user';
import { basename } from 'upath';

@DetailWrapper(
  state => state.newprojProjectAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectAddedit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentCode: '',
      bankCode: '',
      companyCode: '',
      projectCodeList: ''
    };
    this.code = getQueryString('projectCode', this.props.location.search);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'S') {
      getUserDetail(getUserId()).then(data => {
        this.setState({ 'projectCodeList': data.projectCodeList });
      });
    } else {
      getUserDetail(getUserId()).then(data => {
        this.setState({ 'companyCode': data.companyCode });
      });
    }
  }
  render() {
    // 新增
    const fields = [{
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
    // }, {
    //   field: 'aaa',
    //   title: '123',
    //   type: 'chooseMap',
    //   // lnglat: 'quyu',
    //   // lnglatTo: ['longitude', 'latitude'],
    //   required: true
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
      field: 'code1',
      title: '开户行',
      // type: this.view ? null : 'select',
      type: this.view ? null : 'select',
      listCode: '631106',
      keyName: 'code',
      valueName: 'bankSubbranchName',
      // _keys: ['companyCard', 'bankName'],
      required: true
    }, {
      field: 'companyCode',
      formatter: (v, d) => {
        return this.state.companyCode;
      },
      hidden: true
    // }, {
    //   field: 'subbranch',
    //   title: '开户行',
    //   listCode: '631106',
    //   keyName: 'bankCode',
    //   valueName: 'subbranchName',
    //   // _keys: ['companyCard', 'bankName'],
    //   required: true,
    //   onChange: (val) => {
    //     console.log(val);
    //     this.setState({
    //       bankCode: val
    //     });
    //     // this.props.setPageData({
    //     //   ...this.props.pageData,
    //     //   loginName: val + this.props.form.getFieldValue('subbranch')
    //     // });
    //   }
    //   // _keys: ['companyCard', 'subbranch'],
    //   required: true
    }, {
      field: 'accountName',
      title: '户名',
      required: true
    }, {
      field: 'bankcardNumber',
      title: '银行账户',
      _keys: ['companyCard', 'bankcardNumber'],
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
      field: 'remark',
      title: '备注'
    }];
    // 修改
    const fieldsedit = [{
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
      field: 'code1',
      title: '开户行',
      // type: this.view ? null : 'select',
      type: this.view ? null : 'select',
      listCode: '631106',
      keyName: 'code',
      valueName: 'bankSubbranchName',
      _keys: ['companyCard', 'bankSubbranch'],
      required: true
    // }, {
    //   field: 'companyCode',
    //   formatter: (v, d) => {
    //     return this.state.companyCode;
    //   },
    //   hidden: true
    }, {
      field: 'accountName',
      title: '户名',
      _keys: ['companyCard', 'accountName'],
      required: true
    }, {
      field: 'bankcardNumber',
      title: '银行账户',
      _keys: ['companyCard', 'bankcardNumber'],
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
      field: 'remark',
      title: '备注'
    }];
    // 详情
    const fieldos = [{
      field: 'companyName',
      title: '公司名称'
    }, {
      field: 'name',
      title: '项目名称'
    }, {
      field: 'chargeUser',
      title: '负责人',
      type: this.view ? '' : 'select',
      listCode: '631086',
      params: {
        companyCode: this.state.companyCode,
        type: 'O'
      },
      keyName: 'userId',
      valueName: 'loginName'
    }, {
      field: 'quyus',
      title: '详细地址',
      formatter: (v, d) => {
        return d.province + d.city + d.area + d.address + '';
      }
    }, {
      field: 'attendanceStarttimes',
      title: '上下班时间',
      type: 'time',
      formatter: (v, d) => {
        return d.attendanceStarttime + '--' + d.attendanceEndtime;
      }
    }, {
      field: 'code1',
      title: '开户行',
      type: this.view ? null : 'select',
      listCode: '631106',
      keyName: 'code',
      valueName: 'bankSubbranchName',
      _keys: ['companyCard', 'bankSubbranch']
    }, {
      field: 'accountName',
      title: '户名',
      _keys: ['companyCard', 'accountName']
    }, {
      field: 'bankcardNumber',
      title: '银行账户',
      _keys: ['companyCard', 'bankcardNumber']
    }, {
      field: 'leavingDays',
      title: '累计请假人次',
      _keys: ['report', 'leavingDays']
    }, {
      field: 'staffIn',
      title: '累计入职人数',
      _keys: ['report', 'staffIn']
    }, {
      field: 'staffOn',
      title: '目前在职人数',
      _keys: ['report', 'staffOn']
    }, {
      field: 'staffOut',
      title: '累计离职人数',
      _keys: ['report', 'staffOut']
    }, {
      field: 'todayDays',
      title: '今日上工人数',
      _keys: ['report', 'todayDays']
    }, {
      field: 'totalSalary',
      title: '累计发薪金额',
      _keys: ['report', 'totalSalary'],
      amount: true
    }, {
      field: 'workingDays',
      title: '累计出工人次',
      _keys: ['report', 'workingDays']
    }, {
      field: 'salaryCreateDatetimes',
      title: '工资条形成时间',
      date28: true,
      formatter: (v, d) => {
        return '每月' + d.salaryCreateDatetime + '号';
      }
    }, {
      field: 'salaryDatetimes',
      title: '薪资发放时间',
      date28: true,
      formatter: (v, d) => {
        return '每月' + d.salaryDatetime + '号';
      }
    }, {
      field: 'salaryDelayDays',
      title: '薪资发放可延迟天数',
      readonly: true
    }, {
      field: 'lastMonthSalary',
      title: '上月实际发薪金额',
      formatter: (d, v) => {
        return moneyFormat(v.report.lastMonthSalary);
      }
    }, {
      field: 'nextMonthSalary',
      title: '下月预计发薪金额',
      formatter: (d, v) => {
        return moneyFormat(v.report.nextMonthSalary);
      }
    }];
    if (getUserKind() === 'O') {
      return this.state.companyCode ? this.props.buildDetail({
        fields: this.view ? fieldos : this.code ? fieldsedit : fields,
        code: this.projectCode,
        view: this.view,
        buttons: !this.view ? [{
          title: '保存',
          handler: (param) => {
            console.log(param);
            console.log(this.props.selectData.code1);
            for (let i = 0; i < this.props.selectData.code1.length; i++) {
              if(this.code) {
                // 修改的时候匹配文字
                if (param.code1 === this.props.selectData.code1[i].code || param.code1 === this.props.selectData.code1[i].bankSubbranchName) {
                  param.bankName = this.props.selectData.code1[i].bankName;
                  param.bankCode = this.props.selectData.code1[i].bankCode;
                  param.subbranch = this.props.selectData.code1[i].subbranchName;
                }
              } else {
                // 详情的时候匹配code
                if (param.code1 === this.props.selectData.code1[i].code) {
                  param.bankName = this.props.selectData.code1[i].bankName;
                  param.bankCode = this.props.selectData.code1[i].bankCode;
                  param.subbranch = this.props.selectData.code1[i].subbranchName;
                }
              }
            }
            this.props.doFetching();
            fetch(this.code ? 631352 : 631350, param).then((res) => {
              console.log(res);
              showSucMsg('操作成功');
              this.props.cancelFetching();
              setTimeout(() => {
                if(this.code) {
                  this.props.history.go(-1);
                } else {
                  this.props.history.push(`/projectManage/project/addBumen?code=${res.code}`);
                }
              }, 1000);
            }).catch(this.props.cancelFetching);
          },
          check: true,
          type: 'primary'
        }, {
          title: '返回',
          handler: (param) => {
            this.props.history.go(-1);
          }
        }] : [ {
          title: '返回',
          handler: (param) => {
            this.props.history.go(-1);
          }
        }],
        editCode: 631352,
        detailCode: 631358,
        addCode: 631350
      }) : null;
    } else if (getUserKind() === 'S') {
      return this.state.projectCodeList ? this.props.buildDetail({
        fields: this.view ? fieldos : fields,
        key: 'code',
        code: this.projectCode,
        view: this.view,
        beforeSubmit: (params) => {
          for (let i = 0; i < this.props.selectData.code1.length; i++) {
            if (params.code1 === this.props.selectData.bankCode[i].code) {
              params.bankName = this.props.selectData.bankCode[i].bankName;
            }
          }
          return params;
        },
        editCode: 631352,
        detailCode: 631358,
        addCode: 631350
      }) : null;
    } else {
      return this.props.buildDetail({
        fields: this.view ? fieldos : fields,
        key: 'code',
        code: this.projectCode,
        view: this.view,
        beforeSubmit: (params) => {
          for (let i = 0; i < this.props.selectData.code1.length; i++) {
            if (params.code1 === this.props.selectData.bankCode[i].code) {
              params.bankName = this.props.selectData.bankCode[i].bankName;
            }
          }
          return params;
        },
        editCode: 631352,
        detailCode: 631358,
        addCode: 631350
      });
    }
  }
}

export default ProjectAddedit;
