import { useState } from 'react'

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>
        <h3>statistics</h3>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <h3>statistics</h3>
      <table>
      <tbody>
      <StatisticLine text='good' value={props.good}/>
      <StatisticLine text='neutral' value={props.neutral}/>
      <StatisticLine text='bad' value={props.bad}/>
      <StatisticLine text='all' value={props.all}/>
      <StatisticLine text='average' value={props.average}/>
      <StatisticLine text='positive' value={props.positive}/>
      </tbody>
      </table>
    </div>
  )
}
const StatisticLine = (props) => {
  return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
  )
}
const Button = (props) => {
  return (
    <button onClick={props.handleClick}>{props.text}</button>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => {
    setGood(good + 1)
  }
  const addNeutral = () => {
    setNeutral(neutral + 1)
  }
  const addBad = () => {
    setBad(bad + 1)
  }
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <div>
      <h3>give feedback</h3>
      <Button handleClick={addGood} text='good' />
      <Button handleClick={addNeutral} text='neutral' />
      <Button handleClick={addBad} text='bad' />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

export default App