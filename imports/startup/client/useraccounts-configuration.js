import { Accounts } from 'meteor/accounts-base';
import { AccountsTemplates } from 'meteor/useraccounts:core';

// https://github.com/meteor-useraccounts/core/blob/master/Guide.md
AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    // forbidClientAccountCreation: false,
    // overrideLoginErrors: true,
    // sendVerificationEmail: false,
    // lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    // homeRoutePath: '/',
    // redirectTimeout: 4000,

    // Hooks
    onLogoutHook: () => {
      return FlowRouter.go('/login');
    },
    // onSubmitHook: mySubmitFunc,
    // preSignUpHook: myPreSubmitFunc,
    // postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});

if (Meteor.isClient) {
  T9n.map('en', {
      error: {
          accounts: {
              'Login forbidden': 'Credentials are incorrect!'
          }
      }
  });
}

// // // See https://atmospherejs.com/useraccounts/flow-routing
// AccountsTemplates.configureRoute('signIn', {
//   layoutType: 'blaze',
//   name: 'signin',
//   path: '/login',
//   template: 'LoginComponent',
//   layoutTemplate: 'MainLayoutComponent',
//   contentRegion: 'main'
// });

// AccountsTemplates.configureRoute('signUp', {
//   layoutType: 'blaze',
//   name: 'signup',
//   path: '/register',
//   template: 'LoginComponent',
//   layoutTemplate: 'MainLayoutComponent',
//   contentRegion: 'main'
// });

// AccountsTemplates.configureRoute('forgotPwd', {
//   layoutType: 'blaze',
//   name: 'forgotpwd',
//   path: '/reset-password',
//   template: 'LoginComponent',
//   layoutTemplate: 'MainLayoutComponent',
//   contentRegion: 'main'
// });

// AccountsTemplates.configureRoute('changePwd', {
//   layoutType: 'blaze',
//   name: 'changePwd',
//   path: '/account',
//   template: 'AccountPageComponent',
//   layoutTemplate: 'MainLayoutComponent',
//   contentRegion: 'main'
// });
