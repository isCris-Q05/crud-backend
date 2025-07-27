import './App.css'
import { useFetch } from './useFetch';

function App() {
  
  // desestructuramos el hook useFetch
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  return (
    <>
      <div>
        <h1>Fetch API</h1>
        <div className="card">
          <ul>
            {error && <p>Error: {error}</p>}
            {loading && <p>Loading...</p>}
            {data?.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      </div>
      
    </>
  )
}

export default App
