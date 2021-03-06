import React from 'react';
import ReactDom from 'react-dom';
import './search.less';
import avatar from '../assets/avatar.jpg';
import {a} from './tree-shaking';
import bg from '../assets/bg.jpg';

export default class Search extends React.Component {
    constructor () {
        super(...arguments);

        this.state = {
            Text: null
        };
    }

    loadComponent () {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            })
        });
    }

    render () {
        return (
            <div class="search-text">
                {
                    Text ? <Text /> : null
                }
                Search MichLiu123123
                <img src={avatar} alt="" onClick= {this.loadComponent.bind(this)}/>
                <img src={ bg } alt="" />
            </div>
        )
    }
}

ReactDom.render(
    <Search />,
    document.getElementById('root')
)
