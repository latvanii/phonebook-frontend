import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/notification'

const NewPersonForm = ({ handleNameChange, handleNumberChange, addPerson }) => {
  return (
    <form onSubmit={addPerson}>
      <div>name: <input
        onChange={handleNameChange}
      />
      </div>
      <div>number: <input
        onChange={handleNumberChange}
      />
      </div>
      <button type="submit">add</button>
    </form>

  )
}

const SearchForm = ({ handleSearchTermChange }) => {
  return (
    <form>
      <div>searching: <input
        onChange={handleSearchTermChange}
      />
      </div>
    </form>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])



  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearchTerm, setSearchTerm] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationMessageIsError, setNotificationMessageIsError] = useState(null)

  const findByName = (name) => {
    const filtered_persons = persons.filter(person => person.name === name)
    return filtered_persons[0]
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)) {
      const result = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (result) {
        const person_to_be_replaced = findByName(newName)
        person_to_be_replaced.number = newNumber
        personService
          .update(person_to_be_replaced)
          .then(data => {
            personService
              .getAll()
              .then(initialPersons => setPersons(initialPersons))
            setNewName('')
            setNewNumber('')
            setNotificationMessage(`Number of ${newName} updated successfully`)
            setNotificationMessageIsError(false)
          })
          .catch(error => {
            setNotificationMessage(`There was a problem in adding ${newName} to phonebook`)
            setNotificationMessageIsError(true)
          })

      }
      return
    }

    const max_id = Math.max(persons.map(person => person.id))

    const personObject = {
      name: newName,
      id: max_id - 1,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(data => {
        setPersons(persons.concat(data))
        setNewName('')
        setNewNumber('')
        setNotificationMessage(`${newName} added successfully`)
        setNotificationMessageIsError(false)
      })
      .catch(error => {
        console.log(error)
        console.log('fail')
        setNotificationMessage(`There was a problem in adding ${newName} to phonebook`)
        setNotificationMessageIsError(true)
      })
  }


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const removePerson = (person_id, name) => {
    const result = window.confirm(`Remove person ${name}`)
    if (result) {
      personService
        .deletePerson(person_id)
        .then(data => {
          personService
            .getAll()
            .then(initialPersons => setPersons(initialPersons))
          setNotificationMessage(`${name} removed successfully`)
          setNotificationMessageIsError(false)
        }
        )
    }
  }

  const PersonRow = (props) => {
    return (
      <div>
        {props.name}: {props.number} <button onClick={() => removePerson(props.id, props.name)}>remove</button>
      </div>
    )
  }


  const Persons = () => {
    const filtered_persons = persons.filter(person => person.name.toLowerCase().includes(newSearchTerm.toLowerCase()))
    return (
      filtered_persons.map(person =>
        <PersonRow
          key={person.name}
          name={person.name}
          number={person.number}
          id={person.id}
        />
      )
    )
  }

  return (
    <div>
      <Notification message={notificationMessage} isError={notificationMessageIsError} />
      <h2>Phonebook</h2>
      <NewPersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <SearchForm handleSearchTermChange={handleSearchTermChange} />
      <Persons />

    </div>
  )

}

export default App
