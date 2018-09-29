import React, { Component } from 'react'
import PropTypes from 'prop-types'
import connect from './lib/react-redux'

class ThemeSwitch extends Component {
  handle_color_button_click = (color) => {
    const { dispatch } = this.props
    dispatch({
      type: 'CHANGE_COLOR',
      themeColor: color
    })
  }
  render () {
    return (
      <div>
        <button style={{ color: this.props.themeColor }} onClick={() => { this.handle_color_button_click('red') }}>Red</button>
        <button style={{ color: this.props.themeColor }} onClick={() => { this.handle_color_button_click('blue') }}>Blue</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}

ThemeSwitch.propsTypes = {
  themeColor: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitch)