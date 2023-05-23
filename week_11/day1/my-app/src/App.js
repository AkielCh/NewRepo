import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient('https://rmbhqvzbpmydhusndknd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtYmhxdnpicG15ZGh1c25ka25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3Njg4MjEsImV4cCI6MjAwMDM0NDgyMX0.0nFbwCZrc-1aP8iXzfKIIpM0oXkJQqoUWmKh98Ona0Y')

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


async function handleLogOutClick(){
  const {error}= await supabase.auth.signOut()
  console.log(error)
}

async function handleClickAdd(){
  {//writing
    let { data, error } = await supabase.from('leaderboard').insert({ name: 'Bob', score: 99999 })
  console.log('WRITE',data,error)
  }
//reading
  let { data, error } = await supabase
  .from('leaderboard')
  .select('name, score')
  .order('score', { ascending: false })
  console.log('READ',data,error)
}


  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  }

  else {
    return (
        <div>Logged in!
          <button onClick={handleLogOutClick}>Log Out</button>
          <button onClick={handleClickAdd}>add and view leaderboard</button>
    
        </div>)
  }
  
}
