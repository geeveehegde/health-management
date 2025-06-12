import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'

export default function Modal({setIsOpen, isOpen, title, description}) {

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 bg-black/50 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-semibold text-gray-900">
              {title}</DialogTitle>
              <div className="mt-2 text-sm/6 text-gray-600">
                {description}
              </div>
              
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
