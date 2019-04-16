import React from 'react';
import { Form, Spin } from 'antd';
import DetailUtil from 'common/js/build-detail-dev';
import { getUserId, findAndchangeInfo, isUndefined, getOrganizationCode } from 'common/js/util';
import { getDictList } from 'api/dict';

@Form.create()
class AttenceImport extends DetailUtil {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      projectCode: getOrganizationCode(),
      directionList: [],
      isLoading: false
    };
  }
  componentDidMount() {
    Promise.all([
      getDictList({ parentKey: 'direction' })
    ]).then(([directionList]) => {
      this.setState({
        directionList,
        isLoading: false
      });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }
  render() {
    const { directionList, isLoading } = this.state;
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
        projectCode: this.state.projectCode,
        userId: getUserId()
      },
      required: true
    }, {
      title: '导入模版',
      field: 'downloadTmp',
      type: 'download',
      links: [{
        name: '字段填写说明',
        url: '/download/00.字段填写说明.xlsx'
      }, {
        name: '项目人员考勤导入模板',
        url: '/download/06.项目人员考勤导入模板.xlsx'
      }]
    }, {
      title: '项目人员考勤列表',
      field: 'dateList',
      type: 'import',
      required: true,
      options: {
        fields: [{
          title: '企业统一社会信用代码',
          field: 'corpCode'
        }, {
          title: '工人所属企业名称',
          field: 'corpName'
        }, {
          title: '工人所属班组名称',
          field: 'teamName'
        }, {
          title: '工人姓名',
          field: 'workerName'
        }, {
          title: '证件号码',
          field: 'idCardNumber'
        }, {
          title: '刷卡时间',
          field: 'date',
          type: 'datetime'
        }, {
          title: '刷卡进出方向',
          field: 'direction'
        }, {
          title: '通行方式',
          field: 'channel'
        }]
      }
    }];
    return isLoading ? (
      <Spin spinning={true}></Spin>
    ) : this.buildDetail({
      fields,
      addCode: 631713,
      beforeSubmit: (params) => {
        let error = false;
        for (let i = 0; i < params.dateList.length; i++) {
          let item = params.dateList[i];
          let error2 = findAndchangeInfo(directionList, item, 'direction', i);
          if (!error) {
            error = error2;
          }
        }
        return !error;
      }
    });
  }
}

export default AttenceImport;
