import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ newFilter, handleNewFilter }) => {
  return (
    <div>
      filter shown with <input value={newFilter} onChange={handleNewFilter}/>
    </div>
  )
}

const PersonForm = ({ newName, handleNewName, newNumber, handleNewNumber, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNewName}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNumber}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map((person) => 
      <li key={person.name}>{person.name} {person.number}
      <button onClick={() => deletePerson(person)}>delete</button>
      </li>)}
    </ul>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={type}>{message}</div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [showAll, setShowAll] = useState(true)
  const personsToShow = showAll ? persons : filteredPersons
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
      setFilteredPersons(initialPersons)
    }
    ).catch((error) => {
      console.error('Error fetching data:', error)
    })
  }
  , [])
  const handleNewName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNewNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleNewFilter = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
    const value = event.target.value
    if (value !== '') {
      setFilteredPersons(persons.filter(person => person.name.toLowerCase().includes(value.toLowerCase())))
      setShowAll(false)
      return
    }
    setShowAll(true)
  }
  const addPerson = (event) => {
    event.preventDefault()
    if (newName === '' || newNumber === '') {
      alert('Please fill in both name and number')
      return
    }

    if (persons.some(person => person.name === newName)) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        console.log('Update cancelled')
        return
      }
      const existingPerson = persons.find(person => person.name === newName)
      const updatedPerson = {...existingPerson, number: newNumber}
      const request = personService.update(existingPerson.id, updatedPerson)
      return request.then((returnedPerson) => {
        setNewName('')
        setNewNumber('')
        setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
        setFilteredPersons(filteredPersons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
        setNotificationType('success')
        setNotification(`Updated ${returnedPerson.name}'s number`)
        setTimeout(() => {
          setNotification(null)
        }, 4000)
      }
      ).catch((error) => {
        setNotificationType('error')
      setNotification(`Information of ${newName} has been removed from server`)
        setTimeout(() => {
          setNotification(null)
        }, 4000)
        console.error('Error updating person:', error)
      })
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      const request = personService.create(newPerson)
      return request.then((returnedPerson) => {
        setNewName('')
        setNewNumber('')
        setPersons(persons.concat(returnedPerson))
        setFilteredPersons(filteredPersons.concat(returnedPerson))
        setNotificationType('success')
        setNotification(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 4000)
      }
      ).catch((error) => {
        setNotificationType('error')
        setNotification(`Information of ${newName} has been removed from server`)
        setTimeout(() => {
          setNotification(null)
        }, 4000)
        console.error('Error creating person:', error)
      })
    }
    
  }
  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name} ?`)) {
      console.log('Delete cancelled')
      return
    }
    const request = personService.deletePerson(person)
    return request.then((returnedPerson) => {
      setPersons(persons.filter(p => p.id !== returnedPerson.id))
      setFilteredPersons(filteredPersons.filter(p => p.id !== person.id))
      setNotificationType('success')
      setNotification(`Deleted ${returnedPerson.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 4000)
    }
    ).catch((error) => {
      console.error('Error deleting person:', error)
      setNotificationType('error')
      setNotification(`Information of ${returnedPerson.name} has been removed from server`)
        setTimeout(() => {
          setNotification(null)
        }, 4000)
    })
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType}/>
      <Filter newFilter={newFilter} handleNewFilter={handleNewFilter}/>
      <h3>Add a new person</h3>
      <PersonForm newName={newName} handleNewName={handleNewName} newNumber={newNumber} handleNewNumber={handleNewNumber} addPerson={addPerson}/>
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App