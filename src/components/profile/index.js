import { h, Component } from 'preact';
import { Request } from '../../utils/fetchUtils';
import style from './style';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.getTopics = this.getTopics.bind(this);
    this.state = {
      isLoading: false,
      topics: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.matches.tab !== nextProps.matches.tab) {
      const url = `http://www.v2ex.com/api/topics/${nextProps.matches.tab}.json`;
      this.getTopics(url);
    }
  }

	// gets called when this route is navigated to
  componentDidMount() {
    const { tab } = this.props.matches;
    const url = `http://www.v2ex.com/api/topics/${tab}.json`;
    this.getTopics(url);
  }

  getTopics(url) {
    Request({
      url
    }, () => {
      this.setState({
        isLoading: true
      });
    }, (json) => {
      this.setState({
        isLoading: false,
        topics: json
      });
    });
  }

	// gets called just before navigating away from the route
  componentWillUnmount() {
  }

  render({ tab }, { topics, isLoading }) {
    return (
			<div class={style.profile}>
        <div class={style.main}>
          {
            isLoading ?
            <h2>Loading...</h2>
            :
            topics.map(t => {
              return (<div class={style.topic}>
                <div class={style.title}>{t.title}</div>
                <div class={style.desc}>{t.content.substring(0, 200)}</div>
                <div class={style.replies}>{t.replies}</div>
              </div>);
            })
          }
        </div>
			</div>
    );
  }
}
