import React from 'react'
import { Link } from 'react-router-dom'
import loginBg from '../images/login-bg.jpg'

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    console.log('Login attempt:', { email, password })
  }

  return (
    <>
      {/* Background */}
      <section className="relative min-h-screen bg-[#0b1020]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1020]/80 via-[#2a0a4a]/60 to-[#3b0764]/70" />

        {/* Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="rounded-md bg-white/20 p-8 shadow-2xl backdrop-blur-lg border border-white/30">
              <h1 className="mb-6 text-center text-3xl font-bold text-white">Sign in</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="flex flex-col sm:flex-row  sm:items-center justify-between">
                  <label className="label cursor-pointer justify-start gap-2 p-0">
                    <input type="checkbox" name="remember" className="checkbox checkbox-sm" />
                    <span className="label-text text-sm text-slate-200">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-right font-medium text-blue-300 hover:text-blue-200">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="btn border-0 shadow-none text-white bg-[#110B24] w-full">
                  Sign in
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-300">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-medium text-blue-300 hover:text-blue-200">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login