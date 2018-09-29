import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ThemeSwitch from './ThemeSwitch'
import connect from './lib/react-redux'

class Content extends Component {
  render () {
    return (
      <div>
        <p style={{ color: this.props.themeColor }}>隆金岑的信息</p>
        <ThemeSwitch />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

Content.propTypes = {
  themeColor: PropTypes.string
}

export default connect(mapStateToProps)(Content)