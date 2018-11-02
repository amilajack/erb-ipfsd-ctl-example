import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

const IPFSFactory = require('ipfsd-ctl')

const port = 9090
const server = IPFSFactory.createServer(port)
const f = IPFSFactory.create({ remote: true, port: port })

server.start((err) => {
  if (err) { throw err }

  f.spawn((err, ipfsd) => {
    if (err) { throw err }

    ipfsd.api.id(function (err, id) {
      if (err) { throw err }

      console.log(id)
      ipfsd.stop(server.stop)
    })
  })
})

const store = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
