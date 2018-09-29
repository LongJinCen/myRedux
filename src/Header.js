import React, { Component } from 'react'
import connect from './lib/react-redux'
import PropTypes from 'prop-types'

class Header extends Component {
  render () {
    return (
      <h1 style={{ color: this.props.themeColor }}>隆金岑</h1>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

Header.propTypes = {
  themeColor: PropTypes.string
}

export default connect(mapStateToProps)(Header)