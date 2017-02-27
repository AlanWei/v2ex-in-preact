import { h, Component } from 'preact';
import style from './style';

export default class Home extends Component {
  render() {
    return (
			<div class={style.home}>
        <h1>Hello V2EX</h1>
			</div>
    );
  }
}
