import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd';
// import BottomNavigation from '../components/BottomNavigation.jsx';

const FormItem = Form.Item;

const noError = {
  message: '',
};

class SignIn extends Component {
  state = {
    loggingIn: false,
  };

  componentWillMount() {
    document.title = 'Sign In';
  }

  signInCallback = (error) => {
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
    this.props.form.validateFields((err, { email, password }) => {
      if (!err) {
        return Meteor.loginWithPassword({ email }, password, this.signInCallback);
      }
      this.signUpCallback(err);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
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
          <Col span={8} />
          <Col span={8}>
            <div className="card">
              <Form onSubmit={this.handleSubmit}>
                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your email!' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                  )}
                </FormItem>
                <FormItem>
                  <div className="layout horizontal">
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: true,
                    })(
                      <Checkbox>Remember me</Checkbox>
                    )}
                    <span className="flex"></span>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loggingIn}>
                      Log in
                    </Button>
                  </div>
                  <div className="horizontal layout">
                    <Link className="login-form-forgot" to="/public/account/request-password-reset">Forgot password</Link>
                    <span className="flex"></span>
                    <span> Or <Link to="/public/account/signup">register now!</Link></span>
                  </div>
                </FormItem>
              </Form>
            </div>
          </Col>
          <Col span={8} />
        </Row>
      </div>
    );
  }
}

const WrappedSignInForm = Form.create()(SignIn);
export default WrappedSignInForm;
