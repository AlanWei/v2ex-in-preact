import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { Request } from '../../utils/fetchUtils';
import { getUrl } from '../../utils/commonUtils';
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
      this.getTopics(getUrl(nextProps.matches.tab));
    }
  }

	// gets called when this route is navigated to
  componentDidMount() {
    const { tab } = this.props.matches;
    this.getTopics(getUrl(tab));
  }

  getTopics(url) {
    Request({
      url
    }, () => {
      this.setState({
        isLoading: true
      });
    }, (ro) => {
      this.setState({
        isLoading: false,
        topics: ro
      });
    });
  }

	// gets called just before navigating away from the route
  componentWillUnmount() {
  }

  render({ tab }, { topics, isLoading }) {
    return (
			<div class={style.root}>
        <div class={style.main}>
          {
            isLoading ?
            <h2>Loading...</h2>
            :
            topics.map(t => {
              const topicUrl = `/topics/${t.id}`;
              return (<div class={style.topic}>
                <div class={style.title}><Link href={topicUrl}>{t.title}</Link></div>
                <div class={style.desc}>{t.content.substring(0, 100)}</div>
                <div class={style.footer}>
                  <span class={style.item}>节点: {t.node.title}</span>
                  <span class={style.item}>回复: {t.replies}</span>
                </div>
              </div>);
            })
          }
        </div>
			</div>
    );
  }
}
