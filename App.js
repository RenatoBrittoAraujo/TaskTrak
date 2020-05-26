import React from 'react'

import TaskPage from './app/views/taskpage'
import NotificationService from './app/scripts/notifier'

class App extends React.Component {
  
  componentDidMount () {
    NotificationService.start()
  }

  render () {
    return (<TaskPage/>);
  }
};

export default App;
