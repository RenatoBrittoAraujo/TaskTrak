import 'react-native';
import React from 'react';
import TaskPage from '../taskpage';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/MaterialIcons', () => {
  return { loadFont: jest.fn() }
})

it('renders correctly', () => {
  const tree = renderer.create(<TaskPage />).toJSON();
  expect(tree).toMatchSnapshot();
});
