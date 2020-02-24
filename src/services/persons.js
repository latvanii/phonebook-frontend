import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}


const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const deletePerson = (person_id) => {
  const url = `${baseUrl}/${person_id}`
  const request = axios.delete(url)
  return request.then(response => response.data)
}

const update = (person_data) => {
  const url = `${baseUrl}/${person_data.id}`
  const request = axios.put(url, person_data)
  return request.then(response => response.data)
}

export default { getAll, create, deletePerson, update }