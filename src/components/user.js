import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchUser} from '../actions/index'

class User extends Component {
  componentWillMount() {
    this.props.fetchUser(this.props.params.id)
  }

  render() {
    if (!this.props.user.user) {
      return <div>loading</div>
    } else {
      console.log("User param", this.props.user.user)
      return (
        <div className="user-header">
          <h1>{this.props.user.user.id}</h1>
          <h3>Karma: {this.props.user.user.karma}</h3>
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps, {fetchUser})(User)