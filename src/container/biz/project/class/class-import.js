import React from 'react';
import { Form, Spin } from 'antd';
import DetailUtil from 'common/js/build-detail-dev';
import { getUserId, findAndchangeInfo, isUndefined, getOrganizationCode } from 'common/js/util';
import { getDictList } from 'api/dict';

@Form.create()
class ClassImport extends DetailUtil {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      cardTypeList: [],
      isLoading: false
    };
  }
  componentDidMount() {
    // getDictList({ parentKey: 'legal_manid_card_type' }).then((cardTypeList) => {
    //   this.setState({
    //     cardTypeList,
    //     isLoading: false
    //   });
    // }).catch(() => {
    //   this.setState({ isLoading: false });
    // });
  }
  render() {
    const { cardTypeList, isLoading } = this.state;
    const fields = [{
      field: 'projectCode',
      value: getOrganizationCode(),
      hidden: true,
      required: true
    }, {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }, {
      title: '导入模版',
      field: 'downloadTmp',
      type: 'download',
      links: [{
        name: '字段填写说明',
        url: '/download/00.字段填写说明.xlsx'
      }, {
        name: '项目班组导入模板',
        url: '/download/02.项目班组导入模板.xlsx'
      }]
    }, {
      title: '项目班组列表',
      field: 'dateList',
      type: 'import',
      required: true,
      options: {
        fields: [{
          title: '企业统一社会信用代码',
          field: 'corpCode'
        }, {
          title: '企业名称',
          field: 'corpName'
        }, {
          title: '班组名称',
          field: 'teamName'
        }, {
          title: '责任人姓名',
          field: 'responsiblePersonName'
        }, {
          title: '责任人联系电话',
          field: 'responsiblePersonPhone'
        }, {
          title: '责任人证件号码',
          field: 'responsiblePersonIdNumber'
        }, {
          title: '备注',
          field: 'remark'
        }, {
          title: '进场时间',
          field: 'entryTime',
          type: 'datetime'
        }, {
          title: '退场时间',
          field: 'exitTime',
          type: 'datetime'
        }]
      }
    }];
    return isLoading ? (
      <Spin spinning={true}></Spin>
    ) : this.buildDetail({
      fields,
      addCode: 631653,
      beforeSubmit: (params) => {
        let error = false;
        // for (let i = 0; i < params.dateList.length; i++) {
        //   let item = params.dateList[i];
        //   if (!isUndefined(item.responsiblePersonIdcardType)) {
        //     let error1 = findAndchangeInfo(cardTypeList, item, 'responsiblePersonIdcardType', i);
        //     if (error1 && !error) {
        //       error = true;
        //     }
        //   }
        // }
        return !error;
      }
    });
  }
}

export default ClassImport;
