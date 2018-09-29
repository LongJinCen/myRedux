# MyRedux

这里简单的封装了`redux`的`createStore`与`react-redux`的`connect`, 他们的源码在`src/lib`下可以找到。给了一个简单的例子，例子是所有子组件共享父组件中或者是外部`store`中的`state`中的主题颜色，并实现点击按钮切换主题颜色。下面会分别介绍两个库

## install

```
git clone git@github.com:LongJinCen/myRedux.git
npm install
npm run start
```

## redux

```
function createStore (reducer) {
  let state = null
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }
  dispatch({}) // 初始化 state
  return { getState, dispatch, subscribe }
}
```

将`state`存储在`createStore`内部，以便`getState`能够访问它，同时每次`dispatch`时，又能修改它。

监听的所有函数都存在一个叫做`listeners`的数组中，以便每次`dispatch`时，先更新`state`,然后调用所有被监听的函数。

第一次创建时，需要初始化`state`,方法有多种，这里是直接靠`reducer`的返回值初始化，即在`createStore`的最后调用一次`dispatch`时，由于第一次的`state`是`null`，我们就可以根绝是否为`null`来初始化`state`,这要求你的`reducer`需要按照以下格式

```
reducer(state, action) {
  if (!state) {
    state = {
      ...
    }
  } else {
    ...
  }
  return state
}
```

## react-redux

`react-redux`中核心部分是`connect`, 这样我们就可以将数据与组件很好的分离，大幅度提高组件的复用性。由于源码比较长，这里就不列举，请自行查看。

`connect`使用`react`提供的`context`与`redux`中`store`结合的方式。可能会有疑问，可能会觉得直接将共享数据放在父组件的state中，然后通过`context`共享就行了。我们考虑以下两种情形

1. 要是你想改变该共享的状态怎么办？在父组件中定义一个回调往下传? 要是深度不止一层而是好多层又怎么办? 继续往下传吗？
2. 所有需要用到该共享状态的子组件都需要获取该`context`,考虑如何提高子组件的复用性

要解决以上问题其实我们可以使用高级组件。该高阶组件负责从父组件取出共享数据，并通过`props`传给被包含的子组件，这就解决了第二点的问题。对于第一个问题，需要父组件在`context`中添加一个负责修改共享数据的方法，在高阶组件中也将它通过`props`和共享数据一起传给被包含的子组件，子组件就可以调用该方法修改共享数据。

但是考虑下要是我们将数据剥离出来，交给`store`来处理，那么就实现了组件与数据的玻璃，那么我们的父组件的逻辑会简单得更多，组件的复用性也会提高，同时整个思路也会更加清晰。而且用过`react-redux`也知道，这确实会带来很多的好处。下面来考虑下如何实现。

### 思路

#### 父组件

查看`index.js`中的代码，可以发现我们创建了一个`store`,并将它放在了父组件的的`context`中。通常该父组件作为整个项目中最外层的组件，并且整个项目的数据也都托管给`store`,这样所有的组件就可以通过一个可配置的高阶组件与该`store`建立联系，这就是像`antdPro`等项目框架实现的思路之一。有没有觉得这一下子思路比上面我们没有剥离的时候清晰得多。

好了知道了父组件的写法，接下来看一下子组件是如何通过高阶组件与`store`关联起来的

#### 高阶组件(connect)

打开`lib/react-redux.js`,可以看到导出的是一个方法(`connect`),该方法接收两个参数(我就不说它的具体含义了，想必你应该知道),并返回一个高阶组件，在高阶组件中接收需要被包装的组件，最后返回一个新的组件。

我们来看看这个新的组件干了什么。由于顶层父组件的`contex`中包含`store`，所以我们这里第一步是为获得`context`作声明

```
    static contextTypes = {
      store: PropTypes.object
    }
```

然后在`componentWillMount`调用初始化函数，在`initalState`中根据传进来的`mapStateToProps`得到被包装组件需要的数据，然后存到`state`中，同时在`inital`中，我们也给`initalState`加上了一个监听，这是由于数据更新之后需要刷新数据，`dispatch`之后，会调用该`initalState`,帮助该组件重新获得新的数据存到`state`中，进而引发渲染。

我们不仅需要获得数据，还需要修改数据，这是通过`dispatch`实现的，`dispatch`的注意方式和上面注入数据一样，只不过他只会被注入一次，数据刷新并不会影响它，所以没有把`initalDispatch`添加到`store`的监听中

新的组件最后一步，在`render`中返回被包含的组件，并将刚刚得到的数据、dispatch等通过`props`的方式传给该组件，该组件内部就可以通过`this.props`获得该数据了。

来看一个应用`connect`的例子，打开`src/Header.js`,看看最下面是不是声名了一个`mapStateToProps`(实现是默认添加`dispatch`)，然后调用我们自己定义的`connect`将它传入，然后再将需要包装的`Header`传入，是不是和正真的`connect`一模一样。