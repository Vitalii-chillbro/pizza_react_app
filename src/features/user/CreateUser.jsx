import { useState } from 'react'
import Input from '../../UI/Input'
import Button from '../../UI/Button'
import { useDispatch } from 'react-redux'
import { updateName } from './userSlice'
import { useNavigate } from 'react-router-dom'

const CreateUser = () => {
    const [username, setUsername] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!username) return
        dispatch(updateName(username))
        navigate('/menu')
    }

    return (
        <form onSubmit={handleSubmit}>
            <p className="mb-4 text-sm text-stone-600 md:text-base">
                👋 Welcome! Please start by telling us your name:
            </p>

            <Input
                type="text"
                placeholder="Your full name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                userInput
            />

            {username !== '' && (
                <div className="pt-20">
                    <Button type="primary">Start ordering</Button>
                </div>
            )}
        </form>
    )
}

export default CreateUser
