"use client";
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import logoImage from '../assets/cc-logo-icon.png';
// import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/actions/authAction';
//import { useRouter } from "next/router";
import { useRouter, usePathname } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar2() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const accountEmail = user?.email || (user?.isAnonymous ? 'Guest session' : '');
  const navigation = [
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'News', href: '/news' },
        { name: 'Market', href: '/market' },
      ].map((item) => ({ ...item, current: pathname === item.href }))

/*   const userNavigation = [
    { name: 'Your Profile', href: '/' },
    { name: 'Settings', href: '/' },
    { name: 'Sign out', href: '/' },
  ] */

  const logoutClick = () => {
    dispatch(logout());
    router.push('/');
  }

  return (
   <>
   {isAuthenticated ? 
   
      <div className="min-h-full">
       <Disclosure as="nav" className="bg-ink">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <Link href="/portfolio" className="flex flex-shrink-0 items-center">
                      <Image
                        className="h-8 w-8"
                        src={logoImage}
                        alt="Crypto Crossing"
                      />
                    </Link>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-1">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-white/10 text-white'
                                : 'text-white/60 hover:bg-white/5 hover:text-white',
                              'rounded-lg px-3 py-2 text-sm font-medium transition'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center">
                     {isAuthenticated ? (
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full text-sm text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                            <span className="sr-only">Open user menu</span>
                            <UserCircleIcon className="h-8 w-8" alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item as="div">
                                  <Link
                                    href={"/account"}
                                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                    My Profile
                                  </Link>
                              </Menu.Item>
                               <Menu.Item as="div" onClick={logoutClick} className='block px-4 py-2 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-100'>
                                    Logout
                               </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      )
                      : 
                      <></>
                      }
                    </div>
                  </div>

                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
                </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
                        'block rounded-lg px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>

                <div className="border-t border-white/10 pb-3 pt-4">
                  {isAuthenticated ?
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-10 w-10 rounded-full text-white/70" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">Signed in</div>
                      <div className="mt-1 font-mono text-sm leading-none text-white/40">{accountEmail}</div>
                    </div>
                  </div>
                  : <></>
                  }
                  {isAuthenticated ?
                  <div className="mt-3 space-y-1 px-2">
                      <Disclosure.Button
                        as="a"
                        href={'/account'}
                        className="block rounded-lg px-3 py-2 text-base font-medium text-white/60 hover:bg-white/5 hover:text-white"
                      >
                        My Profile
                      </Disclosure.Button>
                      <Disclosure.Button
                        as="button"
                        onClick={logoutClick}
                        className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-white/60 hover:bg-white/5 hover:text-white"
                      >
                        Logout
                      </Disclosure.Button>

                  </div>
                  : <></>
                  }
                </div>
              </Disclosure.Panel>
              </>
          )}
        </Disclosure>
      </div>
      : <></>
      }
    </>
  )
}
