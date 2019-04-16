import React, { Component } from 'react';
import fetch from 'common/js/fetch';
import { Upload, Icon, message } from 'antd';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

export default class DemoImg extends Component {
  state = {
    uploadToken: '',
    loading: false,
    imageUrl: ''
  };
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false
      }, () => {
        console.log(this.state.imageUrl);
      }));
    }
  };
  componentDidMount() {
    fetch('600100').then(data => {
      this.setState({
        uploadToken: data.uploadToken
      });
    });
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="http://up-z0.qiniu.com"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        data={{
          token: this.state.uploadToken
        }}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    );
  }
}