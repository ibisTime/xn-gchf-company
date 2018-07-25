import React from 'react';
import cookies from 'browser-cookies';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newProj/project-end';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import fetch from 'common/js/fetch';
import { getBankNameByCode } from 'api/project';
import { getUserDetail, getUserId } from 'api/user';

@DetailWrapper(
  state => state.newprojProjectEnd,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectEnd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentCode: '',
      bankCode: '',
      companyCode: ''
    };
    this.code = getQueryString('projectCode', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
        field: 'endDatetime',
        title: '项目结束时间',
        type: 'datetime',
        required: true
      }, {
        field: 'remark',
        title: '备注'
      }];
    return this.props.buildDetail({
      fields,
      buttons: [{
        title: '保存',
        check: true,
        handler: (param) => {
          param.code = this.code;
          param.updater = getUserId();
          this.props.doFetching();
          fetch(631355, param).then(() => {
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

export default ProjectEnd;
