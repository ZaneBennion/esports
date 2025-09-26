import { useState } from 'react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSignup = () => {
    console.log(email, password)

    try {
        const { data, error } = await supabase.auth.signUp({
            email: 'valid.email@supabase.io',
            password: 'example-password',
        
    } catch (error) {
        console.error(error)
    }
  }

  return (
    <div>
        <h1>SignupPage</h1>
        <form onSubmit={handleSignup}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit">Signup</button>
        </form>
    </div>
  )
}