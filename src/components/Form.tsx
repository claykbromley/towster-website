'use client'
import './styles.css'
import React, { useState } from 'react'

export default function BasicFormData() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function resetStates() {
    setSubmitted(false)
    setError('')
  }

  function resetForm() {
    setName('')
    setEmail('')
    setMessage('')
  }

  function onSubmit(e: any) {
    e.preventDefault()
    e.stopPropagation()

    resetStates()

    let formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('message', message)

    fetch('https://formcarry.com/s/Yr4xVANckL', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.code === 200) {
          setSubmitted(true)
          resetForm()
        } else if (response.code === 422) {
          setError(response.message)
        } else {
          setError(response.message)
        }
      })
      .catch((error) => {
        setError(error.message ? error.message : error)
      })
  }

  const showNotification = submitted || error

  function renderStatus() {
    let message = error
      ? error
      : `Thanks for reaching out!, we'll get back to you soon.`
    let icon = error ? 'error' : 'success'

    return (
      <div className="formcarry-block">
        <div className={`formcarry-message-block fc-${icon} active`}>
          <div className="fc-message-icon"></div>
          <div className="fc-message-content">{message}</div>
          <div className="fc-message-close" onClick={() => resetStates()}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="formcarry-container mx-auto max-w-sm items-center space-x-4 rounded-xl bg-white p-6">
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="formcarry-block mb-4">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            placeholder="Your first and last name"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div className="formcarry-block mb-4">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Your Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="john@doe.com"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div className="formcarry-block mb-4">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Your message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="message"
            placeholder="Enter your message..."
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          ></textarea>
        </div>

        <div className="formcarry-block">
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          >
            Send
          </button>
        </div>

        {showNotification && renderStatus()}
      </form>
    </div>
  )
}
