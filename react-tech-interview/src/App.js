import './App.css';
import React, { useReducer } from 'react';
import useDidUpdate from './hooks/useDidUpdate';

const KEY_STATE_SESSION_STORAGE = 'state'

function reducer(state, action) {
  const { type, payload: { value } } = action;
  switch (type) {
    case 'divide': return { ...state, value: state.value / value };
    case 'minus': return { ...state, value: state.value - value };
    case 'multiply': return { ...state, value: state.value * value };
    case 'plus': return { ...state, value: state.value + value };
    case 'setState': return { ...state, ...action.payload };
    default: return state;
  }
}

const seState = (key, value) => {
  if (key && value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}

const getInitState = () => {
  const defaultState = { operator: 'plus', value: 10, valueOperator: 10 };

  const state = sessionStorage.getItem(KEY_STATE_SESSION_STORAGE);
  debugger;
  if (state) {
    return JSON.parse(state);
  }
  return defaultState;
}

const basicComponent = React.memo(({ onClick, value = 0, operator, valueOperator, setState }) => {
  const options = ['divide', 'minus', 'multiply', 'plus'];

  return (
    <>
      <div className="form">
        <span>Current value: {value}</span>
        <select value={operator} onChange={(select) => {
          setState({ operator: select.target.value });
        }}>
          {options.map((option) => (<option value={option} key={option}>{option}</option>))}
        </select>
        <input type="number" value={valueOperator} onChange={(input) => setState({ valueOperator: Number(input.target.value) })} />
        <button onClick={() => onClick()}>Apply operation</button>
      </div>
    </>
  );
});

const HigherOrderComponent = (Component) => {
  const [state, dispatch] = useReducer(reducer, getInitState());
  const { value, operator, valueOperator } = state;

  useDidUpdate(() => {
    seState(KEY_STATE_SESSION_STORAGE, state);
  }, [operator, value, valueOperator]);

  return (
    <Component
      onClick={() => {
        dispatch({ type: operator, payload: { value: valueOperator } });
      }}
      setState={(nextState) => {
        dispatch({type: 'setState', payload: nextState});
      }}
      value={value}
      operator={operator}
      valueOperator={valueOperator}
    />
      );
}

function App() {
  return (
    HigherOrderComponent(basicComponent)
  );
}

export default App;
