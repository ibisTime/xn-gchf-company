import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newProj/project-check';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import fetch from 'common/js/fetch';
import { getBankNameByCode } from 'api/project';
import { getUserDetail, getUserId } from 'api/user';
import { basename } from 'upath';

@DetailWrapper(
  state => state.newprojProjectCheck,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentCode: '',
      bankCode: '',
      projectCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    // this.projectCode = getQueryString('projectCode', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then(data => {
      this.getUserDetail(data.projectCode);
    });
  }
  getUserDetail(projectCode) {
    this.setState({ projectCode });
  }
  render() {
    const fields = [{
      field: 'name',
      title: '项目名称',
      required: true
    }, {
      field: 'chargeUser',
      title: '负责人'
    }, {
      field: 'quyus',
      title: '详细地址',
      formatter: (v, d) => {
        return d.province ? d.province + d.city + d.area + d.address + '' : '';
      },
      required: true
    }, {
      field: 'bankCodes',
      title: '开户行',
      formatter: (v, d) => {
        return d.companyCard.bankName + d.companyCard.subbranch;
      }
    }, {
      field: 'bankcardNumber',
      title: '银行账户',
      _keys: ['companyCard', 'accountName'],
      required: true
    }, {
      field: 'attendanceStarttimes',
      title: '上下班时间',
      type: 'time',
      formatter: (v, d) => {
        return d.attendanceStarttime ? d.attendanceStarttime + '--' + d.attendanceEndtime : '';
      },
      required: true
    }, {
      field: 'salaryDelayDays',
      title: '薪资发放可延迟天数',
      readonly: true,
      required: true
    }, {
      field: 'approveNote',
      title: '审核备注',
      readonly: false
    }];
    return this.state.projectCode ? this.props.buildDetail({
      fields: fields,
      key: 'code',
      code: this.state.projectCode,
      view: this.view,
      addCode: 631354,
      detailCode: 631616,
      editCode: 631354,
      buttons: [{
        title: '确定',
        handler: (param) => {
          param.code = this.state.projectCode;
          param.approver = getUserId();
          this.props.doFetching();
          fetch(631354, param).then(() => {
            showSucMsg('操作成功');
            this.props.cancelFetching();
            setTimeout(() => {
              this.props.history.go(-1);
            }, 1000);
          }).catch(this.props.cancelFetching);
        },
        check: true,
        type: 'primary'
      }, {
        title: '取消',
        handler: (param) => {
          this.props.history.go(-1);
        },
        check: true
      }]
    }) : null;
  }
}

export default ProjectCheck;
