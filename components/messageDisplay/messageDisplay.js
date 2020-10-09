import React, { Component } from 'react';
import uuid from 'uuid-random';

import { Alert } from 'react-bootstrap';

export default class MessageDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: new Map(),
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.renderMessage = this.renderMessage.bind(this);

    if (this.props.message) {
      this.show(this.props.type, this.props.message);
    }
  }

  show(type, text, id) {
    if (!id)
      id = uuid();

    const message = {
      type: type,
      text: text
    };

    const messages = this.state.messages;
    messages.set(id, message);

    this.setState({messages: messages});

    return id;
  }

  hide(id) {
    const messages = this.state.messages;
    messages.delete(id);

    this.setState({messages: messages});
  }

  renderMessage(message) {
    if (message.type === 'success')
      return (<Alert variant="success">{message.text}</Alert>);

    if (message.type === 'warning')
      return (<Alert variant="warning">{message.text}</Alert>);

    if (message.type === 'error')
      return (<Alert variant="danger">{message.text}</Alert>);
  }

  render() {
    return (
      <div>
        {Array.from(this.state.messages).map((message, index) => (
          <span key={index} className="shaker">{this.renderMessage(message[1])}</span>
        ))}
      </div>
    );
  }
}