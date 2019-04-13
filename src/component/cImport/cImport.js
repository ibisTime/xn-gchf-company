import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Upload, Table } from 'antd';
import { noop, isUndefined, dateTimeFormat, dateFormat, monthFormat,
  moneyFormat, showWarnMsg } from 'common/js/util';
import { getDictList } from 'api/dict';
import { formItemLayout, MONTH_FORMAT, PIC_PREFIX } from 'common/js/config';
import { readXls } from 'common/js/xlsx-util';

const FormItem = Form.Item;

export default class CImport extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fileList: [] };
  }
  // 获取所有页面所需的数据
  getInfos(list) {
    let selectData = {};
    Promise.all(list).then(([...results]) => {
      results.forEach((data, i) => {
        selectData[this.fetchList[i].field] = data;
      });
      this.setState({ selectData });
    }).catch(() => {});
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.isPropsChange(nextProps) || this.isStateChange(nextState);
  }
  isPropsChange(nextProps) {
    const { field, readonly, hidden, inline, list, selectedRowKeys, options } = this.props;
    let listFlag = this.isListChange(list, nextProps.list);
    let optFlag = this.isOptionsChange(options, nextProps.options);
    let _optFlag = this.isOptChange();
    if (_optFlag) {
      this.prevOpts = this.options;
    }
    return nextProps.field !== field || nextProps.readonly !== readonly ||
      nextProps.hidden !== hidden || listFlag || optFlag ||
      nextProps.inline !== inline;
  }
  // 列表数据是否改变
  isListChange(prevList, nowList) {
    if (prevList.length !== nowList.length) {
      return true;
    }
    const { options } = this.props;
    let key = options.rowKey || 'code';
    for (let i = 0; i < prevList.length; i++) {
      let v = prevList[i];
      for (let j = 0; j < options.fields.length; j++) {
        let f = options.fields[j];
        if (v[f.field] !== nowList[i][f.field]) {
          return true;
        }
      }
    }
    return false;
  }
  isOptionsChange(prevOpts, nowOpts) {
    return Object.keys(prevOpts).length !== Object.keys(nowOpts).length;
  }
  isOptChange() {
    if (isUndefined(this.prevOpts) || isUndefined(this.options)) {
      return isUndefined(this.prevOpts) && isUndefined(this.options) ? false : this.prevOpts !== this.options;
    } else {
      if (this.prevOpts.title !== this.options.title || this.options.view !== this.prevOpts.view ||
        this.prevOpts.code !== this.options.code || this.prevOpts.key !== this.options.key) {
        return true;
      }
      if (isUndefined(this.prevOpts.useData) || isUndefined(this.options.useData)) {
        return !(isUndefined(this.prevOpts.useData) && isUndefined(this.options.useData));
      }
      let key = this.props.options.rowKey || 'code';
      return this.prevOpts.useData[key] !== this.options.useData[key];
    }
  }
  isStateChange(nextState) {
    const { fileList } = this.state;
    return fileList !== nextState.fileList;
  }
  // 获取table的props
  getTableProps(columns, options, dataSource) {
    const props = {
      columns,
      dataSource,
      bordered: true,
      rowKey: record => record[options.rowKey || 'code']
    };
    return props;
  }
  // 获取表格列
  getTableColumns(options) {
    const columns = options.fields.map(f => ({
      title: f.title,
      dataIndex: f.field,
      render: this.getRender(f)
    }));
    this.columns = columns;
    return columns;
  }
  getRender(f) {
    if (f.render) {
      return f.render;
    }
    if (f.amount) {
      return v => moneyFormat(v);
    }
    return v => v;
  }
  // 获取文件上传的属性
  getUploadProps = (field) => {
    const { fileList } = this.state;
    const props = {
      beforeUpload: (file) => {
        this.setState({ fileList: [file] });
        readXls(file).then(data => {
          this.handleData(data);
        }).catch((msg) => {
          alert(msg);
        });
        return false;
      },
      showUploadList: null
    };
    return props;
  }
  handleData(data) {
    let { options, field } = this.props;
    let fields = options.fields;
    data = data.slice(1);
    let importData = [];
    data.forEach((list) => {
      var obj = {};
      list.forEach((item, i) => {
        obj[fields[i].field] = item;
        if (fields[i].field.amount) {
          obj[fields[i].field] = item * 1000;
        }
      });
      importData.push(obj);
    });
    this.props.setImportData(field, importData);
  }
  render() {
    const { label, field, readonly, hidden, title, list, inline, options,
      getFieldDecorator } = this.props;
    let layoutProps = inline ? {} : formItemLayout;
    const columns = this.getTableColumns(options);
    const dataSource = list || [];
    return (
      <FormItem key={field} {...layoutProps} className={hidden ? 'hidden' : ''} label={label}>
        {
          getFieldDecorator(field)(
            <Upload {...this.getUploadProps(field)}>
              <Button>选择文件</Button>
            </Upload>
          )
        }
        <Table {...this.getTableProps(columns, options, dataSource)} />
      </FormItem>
    );
  }
}

CImport.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  list: PropTypes.array,
  hidden: PropTypes.bool,
  readonly: PropTypes.bool,
  inline: PropTypes.bool,
  field: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  setImportData: PropTypes.func.isRequired
};

CImport.defaultProps = {
  label: 'title',
  title: '表格导入',
  field: 'key',
  hidden: false,
  inline: false,
  setImportData: noop,
  getFieldDecorator: noop
};
