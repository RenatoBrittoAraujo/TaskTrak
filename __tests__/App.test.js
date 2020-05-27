import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('../app/views/taskpage', () => 'TaskPage')
jest.mock('../app/scripts/notifier', () => {
  return { start: jest.fn() } })

it('renders correctly', () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});
