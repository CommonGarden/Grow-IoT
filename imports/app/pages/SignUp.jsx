import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd';
// import BottomNavigation from '../components/BottomNavigation.jsx';

const FormItem = Form.Item;

class SignUp extends React.Component {

  state = {
    confirmDirty: false,
  };

  componentWillMount() {
    document.title = 'Sign Up';
  }

  signUpCallback = (error) => {
    this.setState({ loggingIn: false });
    if (error) {
      const msg = error ? (error.reason || error.message) : 'Something went wrong!';
      return message.error(msg);
    }
    // Navigate to the authenticated app since the sign in was successful
    this.props.history.push('/');
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loggingIn: true });
    this.props.form.validateFields((error1, { email, password }) => {
      if (!error1) {
        return Accounts.createUser({
          email,
          password
        }, (error2) => {
          this.signUpCallback(error2);
        });
      }
      this.signUpCallback(error1);
    });
  };

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <div className="login-form">
        <style jsx>{`
.card {
  background: white;
  padding: 30px 30px 5px 30px;
  background: white;
  /* padding: 100px; */
  border-radius: 5px;
}
.login-form-forgot {
  float: right;
}
.login-form-button {
  width: 100%;
}
          `}</style>
        <Row>
          <Col span={6} />
          <Col span={12}>
            <div className="card">
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label="E-mail"
                  hasFeedback
                >
                  {getFieldDecorator('email', {
                    rules: [{
                      type: 'email', message: 'The input is not valid E-mail!',
                    }, {
                      required: true, message: 'Please input your E-mail!',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="Password"
                  hasFeedback
                >
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true, message: 'Please input your password!',
                    }, {
                      validator: this.checkConfirm,
                    }],
                  })(
                    <Input type="password" />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="Confirm Password"
                  hasFeedback
                >
                  {getFieldDecorator('confirm', {
                    rules: [{
                      required: true, message: 'Please confirm your password!',
                    }, {
                      validator: this.checkPassword,
                    }],
                  })(
                    <Input type="password" onBlur={this.handleConfirmBlur} />
                  )}
                </FormItem>
                {
                  // <FormItem
                  // {...formItemLayout}
                  // label="Captcha"
                  // extra="We must make sure that your are a human."
                  // >
                  // <Row gutter={8}>
                  // <Col span={12}>
                  // {getFieldDecorator('captcha', {
                  // rules: [{ required: true, message: 'Please input the captcha you got!' }],
                  // })(
                  // <Input size="large" />
                  // )}
                  // </Col>
                  // <Col span={12}>
                  // <Button size="large">Get captcha</Button>
                  // </Col>
                  // </Row>
                  // </FormItem>
                }
                <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
                  {getFieldDecorator('agreement', {
                    valuePropName: 'checked',
                  })(
                    <Checkbox>I have read the <Link to="/public/user-agreement">agreement</Link></Checkbox>
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">Register</Button>
                  <div className="horizontal layout">
                    <span> Already a member? <Link to="/public/account/signin">Sign In</Link></span>
                  </div>
                </FormItem>
              </Form>
            </div>
          </Col>
          <Col span={6} />
        </Row>
      </div>
    );
  }
}

const WrappedSignUpForm = Form.create()(SignUp);
export default WrappedSignUpForm;
