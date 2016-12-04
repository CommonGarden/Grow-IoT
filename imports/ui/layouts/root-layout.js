/* eslint-disable new-cap */
import { AppState } from '../state';
import { setRoute } from '../actions';

class rootLayout extends Polymer.Class(
  {
    is: 'root-layout',
    properties: {
      route: {
        type: Object,
        statePath: 'route',
      },
      routeCache: String,
    },
    behaviors: [mwcMixin, AppState],
    observers: ['routeChange(route)']
  }
) {
  tracker() {
    this.firstRedirect();
  }
  routeChange(route) {
    if (route.path === '/') {
      this.set('route.path', '/dashboard/main/home');
    }
    this.dispatch(setRoute.bind(this, route));
  }
  firstRedirect() {
    if (!(Meteor.user() || Meteor.loggingIn())) {
      this.set('routeCache', this.route.path);
      if (this.routeData.view !== 'account') {
        this.set('route.path', '/account/sign-in');
      }
    } else if (Meteor.loggingIn()) { // eslint-disable-line no-empty
      // Waiting for Meteor logginIn to complete before routing
    } else if (this.route.path === '/') {
      this.set('route.path', this.routeCache || '/dashboard/main/home');
    }
  }
}

document.registerElement(rootLayout.prototype.is, rootLayout);
