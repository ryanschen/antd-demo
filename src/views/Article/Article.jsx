import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  Divider,
  Button,
  Modal
} from 'antd';
import $http from '@/axios'
/**
 * fix: https://github.com/ant-design/ant-design/issues/14895
 */
require('antd/lib/message/style');
const message = require('antd/lib/message').default;

function code2html (code) {
  return {__html: code}
}

export default class extends Component {
  constructor(props, context) {
    super()
    this.columns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center'
    }, {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      align: 'center',
      render: tags => (
        tags.map((tag, index) => (
          <span key={index}>{tag}{
            index + 1 !== tags.length ? <span>、</span> : null
          }</span>
        ))
      )
    }, {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      align: 'center',
      render: code => (
        <div dangerouslySetInnerHTML={code2html(code)} className="markdown-content"></div>
      )
    }, {
      title: '创建日期',
      key: 'createDate',
      align: 'center',
      dataIndex: 'meta.createDate'
    }, {
      title: '修改日期',
      key: 'updateDate',
      align: 'center',
      dataIndex: 'meta.updateDate'
    }, {
      title: '操作',
      key: 'action',
      align: 'center',
      dataIndex: 'action',
      render: (text, record) => (
        <span>
          <Button type="dashed" size="small" onClick={() => this.editHandle(record)}>修改</Button>
          <Divider type="vertical" />
          <Button type="danger" size="small" onClick={() => this.removeHandle(record)}>删除</Button>
        </span>
      ),
    }]
  }
  state = {
    data: []
  }

  componentDidMount () {
    $http.get('/api/articles')
      .then(res => {
        this.setState({
          data: res
        })
      })
      .catch((e) => {
        console.log(e);
      })
  }

  removeHandle (record) {
    Modal.confirm({
      title: '系统提示',
      content: `确定删除该文章吗？`,
      okType: 'danger',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        $http.post('/api/removeArticleById', { id: record._id })
          .then(res => {
            this.setState({ data: res })
            message.success('删除成功！');
          })
          .catch((e) => {
            console.log(e);
          })
      }
    });
  }

  editHandle (record) {
    window.sessionStorage.setItem('ADMIN_ARTICLE', JSON.stringify(record))
    this.props.history.push('/home/editArticle?type=edit');
  }

  render () {
    return (
      <div>
        <p style={{marginBottom: '20px'}}>
          <Link to="/home/editArticle?type=add">
            <Button type="primary" icon="plus">新增</Button>
          </Link>
        </p>
        <Table columns={this.columns} dataSource={this.state.data} rowKey="_id" bordered/>
      </div>
    )
  }
}
