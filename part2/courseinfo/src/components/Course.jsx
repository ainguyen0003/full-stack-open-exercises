const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => (
  parts.map(part => (
    <Part key={part.id} part={part} />
  )))

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)
const Total = (props) => <p style={{ fontWeight:'bold'}}>total of {props.total} exercises</p>

const Course = ({courses}) => (
  courses.map(course => (
    <div key={course.id}>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total total={course.parts.reduce(
    (accumulator, curr) => accumulator + curr.exercises, 0,)} />
  </div>
  ))
  
)
export default Course