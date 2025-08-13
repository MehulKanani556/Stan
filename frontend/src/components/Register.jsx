import React from 'react'
import { Link } from 'react-router-dom'
import loginBg from '../images/login-bg.jpg'

const Register = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    console.log('Register attempt:', { username, email, password })
  }

  return (
    <>
      <section className="relative min-h-screen bg-[#0b1020]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1020]/80 via-[#2a0a4a]/60 to-[#3b0764]/70" />

        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="rounded-md bg-white/20 p-8 shadow-2xl backdrop-blur-lg border border-white/30">
              <h1 className="mb-6 text-center text-3xl font-bold text-white">Create account</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-200">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="yourname"
                    className="input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/70 focus:bg-white/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/70 focus:bg-white/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="input input-bordered w-full bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-white/70 focus:bg-white/15 focus:outline-none"
                  />
                </div>

                <button type="submit" className="btn border-0 shadow-none text-white bg-[#110B24] w-full">
                  Create account
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-300">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-300 hover:text-blue-200">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Register 