const React = require('react');
const avatar = require('../assets/avatar.jpg');
require('./search.less');

class Search extends React.Component {
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
        const { Text } = this.state;
        return (
            <div className="search-text">
                {
                    Text ? <Text /> : null
                }
                Search MichLiu123123
                <img src={avatar} alt="" onClick={this.loadComponent.bind(this)}/>
            </div>
        )
    }
}

module.exports = <Search />;
