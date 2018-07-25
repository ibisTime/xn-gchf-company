import React from 'react';
import cookies from 'browser-cookies';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newProj/project-stop';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import fetch from 'common/js/fetch';
import { getBankNameByCode } from 'api/project';
import { getUserDetail, getUserId } from 'api/user';

@DetailWrapper(
  state => state.newprojProjectStop,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectStop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentCode: '',
      bankCode: '',
      companyCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.stop = !!getQueryString('stop', this.props.location.search);
    this.start = !!getQueryString('start', this.props.location.search);
  }
  // componentDidMount() {
  //     getUserDetail(cookies.get('userId')).then(data => {
  //       this.getUserDetail(data.departmentCode, data.companyCode);
  //     });
  // }
  // getUserDetail(departmentCode, companyCode) {
  //   this.setState({ departmentCode: departmentCode, companyCode: companyCode });
  // }
  render() {
    const fields = [{
      field: 'remark',
      title: this.stop ? '停工备注' : '重新开工备注',
      required: true,
      readonly: false
    }];
    return this.props.buildDetail({
      fields: fields,
      key: 'code',
      code: this.projectCode,
      view: false,
      addCode: 631350,
      detailCode: 631358,
      editCode: 631352,
      buttons: [{
        title: '保存',
        check: true,
        handler: (param) => {
          param.code = this.projectCode;
          param.updater = getUserId();
          let code = this.stop ? '631470' : '631471';
          this.props.doFetching();
          fetch(code, param).then(() => {
            showSucMsg('操作成功');
            this.props.cancelFetching();
            setTimeout(() => {
              this.props.history.go(-1);
            }, 1000);
          }).catch(this.props.cancelFetching);
        }
      },
      {
        title: '返回',
        handler: (param) => {
          this.props.history.go(-1);
        }
      }]
    });
  }
}

export default ProjectStop;
