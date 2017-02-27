import { h, Component } from 'preact';
import style from './style';

class Topic extends Component {
  render({ id }, { }) {
    return (
			<div class={style.root}>
        <div class={style.main}>
          {id}
        </div>
			</div>
    );
  }
}

export default Topic;
