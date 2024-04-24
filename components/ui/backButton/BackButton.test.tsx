import React from 'react';
import renderer from 'react-test-renderer';
import {BackButton} from './BackButton';

describe('Back button test', () => {
  it('should render the back button ', () => {
    const backButtonTree = renderer.create(<BackButton onPress={jest.fn} />);

    expect(backButtonTree).toMatchSnapshot();
  });
});
