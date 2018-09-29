import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default (mapStateToProps, mapDispatchToProps) => (WrappedComponent) =>{
  class newComponent extends Component {
    constructor () {
      super()
      this.state = {

      }
    }

    static contextTypes = {
      store: PropTypes.object
    }

    componentWillMount () {
      this.inital()
    }

    inital = () => {
      const { store } = this.context
      store.subscribe(() => {
        this.initalState(store)
      })
      this.initalState(store)
      this.initalDispatch(store)
    }

    initalState = (store) => {
      if (!mapStateToProps) {
        throw 'a mapStateToProps should be defined when you use connect'
      }
      const current_state = mapStateToProps(store.getState())
      this.setState({
        ...current_state
      })
    }

    initalDispatch = (store) => {
      const current_dispatch = mapDispatchToProps ? mapDispatchToProps(store.dispatch) : { dispatch: store.dispatch }
      this.setState((prevState) => {
        return { ...prevState, ...current_dispatch }
      })
    }
    
    render () {
      return <WrappedComponent {...this.state}/>
    }
  }
  return newComponent
}