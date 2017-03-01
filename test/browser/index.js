import { h, render, rerender } from 'preact';
import { route } from 'preact-router';
import App from 'components/app';
import Home from 'components/home';
import 'style';

/*global sinon,expect*/

describe('App', () => {
  let scratch;

  before( () => {
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch);
  });

  beforeEach( () => {
    scratch.innerHTML = '';
  });

  after( () => {
    scratch.parentNode.removeChild(scratch);
    scratch = null;
  });


  describe('routing', () => {
    it('should render the homepage', () => {
      render(<App />, scratch);
      route('/');
      expect(scratch.innerHTML).to.contain('Hello V2EX');
    });
  });
});
