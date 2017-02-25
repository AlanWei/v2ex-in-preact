import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style';

export default class Header extends Component {
  render() {
    return (
			<header class={style.header}>
				<Link href="/"><h1>V2EX</h1></Link>
				<nav>
					<Link href="/tabs/hot">最热</Link>
					<Link href="/tabs/latest">最新</Link>
				</nav>
			</header>
    );
  }
}
