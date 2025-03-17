import React from 'react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

function Navbar() {
  return (
    <>
      <nav className="flex items-center justify-between py-5 px-5 md:px-8 bg-background border-b border-muted container mx-auto">
        <div className="text-3xl">hh.</div>
        <div className="hidden sm:flex space-x-4">
          <button
            className="px-8 py-2 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
          >
            Log in
          </button>
          <button
            className="px-8 py-2 bg-foreground text-white rounded-full hover:bg-muted-foreground transition-colors"
          >
            Sign up
          </button>
        </div>
        <div className="sm:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-xl">
                ☰
              </button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col items-center space-y-4 p-4 w-screen mt-3 h-40 bg-background border-t border-muted">
              <button
                className="px-8 py-2 rounded-full text-foreground border border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors w-4/5"
              >
                Log in
              </button>
              <button
                className="px-8 py-2 bg-foreground text-white rounded-full hover:bg-muted-foreground transition-colors w-4/5"
              >
                Sign up
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </nav>
    </>
  )
}

export default Navbar