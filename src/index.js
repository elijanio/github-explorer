import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import CodePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import '~/config/ReactotronConfig';

import createNavigator from './routes';

class App extends Component {
  state = {
    userChecked: false,
    userLogged: false,
  };

  async componentDidMount() {
    OneSignal.init('08071658-e65f-4aa9-a9a9-f92c2e2c9a26');

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);

    const username = await AsyncStorage.getItem('@Githuber:username');

    this.setState({
      userChecked: true,
      userLogged: !!username,
    });
  }

  onReceived = (notification) => {
    console.log('Notification received: ', notification);
  };

  onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  };

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  render() {
    const { userChecked, userLogged } = this.state;

    if (!userChecked) return null;

    const Routes = createNavigator(userLogged);

    return <Routes />;
  }
}

export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
})(App);
