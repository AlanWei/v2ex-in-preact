import { h, Component } from 'preact';
import { getTopicUrl, getReplyUrl } from '../../utils/commonUtils';
import { Request } from '../../utils/fetchUtils';
import style from './style';

class Topic extends Component {
  constructor(props) {
    super(props);

    this.getReplies = this.getReplies.bind(this);
    this.state = {
      isLoading: false,
      topic: {
        content_rendered: ''
      },
      replies: []
    };
  }

  componentDidMount() {
    const { id } = this.props.matches;
    this.getTopic(getTopicUrl(id));
    this.getReplies(getReplyUrl(id));
  }

  getTopic(url) {
    Request({
      url
    }, () => {
      this.setState({
        isLoading: true
      });
    }, (ro) => {
      this.setState({
        isLoading: false,
        topic: ro[0]
      });
    });
  }

  getReplies(url) {
    Request({
      url
    }, () => {
      this.setState({
        isLoading: true
      });
    }, (ro) => {
      this.setState({
        isLoading: false,
        replies: ro
      });
    });
  }
  
  render({ id }, { topic, replies }) {
    return (
			<div class={style.root}>
        <div class={style.main}>
          <div class={style.card}>
            <div class={style.title}>{topic.title}</div>
            <div dangerouslySetInnerHTML={{__html: topic.content_rendered}} />
          </div>
          <div>
            {
              replies.map(r => {
                return (<div class={style.card}>
                {r.content_rendered}
                </div>);
              })
            }
          </div>
        </div>
			</div>
    );
  }
}

export default Topic;
