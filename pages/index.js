import Head from 'next/head';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from '../components/Map';
import { Tab } from '@headlessui/react'
import { useState } from 'react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Home({ sheds }) {
    const [categories] = useState(['Octane 92', 'Octane 95', 'Diesel', 'Super Diesel', 'Kerosene'])
    const [selectedCategory, setSelectedCategory] = useState(0);

    const center = { lat: 7.867373, lng: 80.800702 };
    const zoom = 8;

    function render(status) {
        if (status === Status.LOADING) return <h3>{status} ..</h3>;
        if (status === Status.FAILURE) return <h3>{status} ...</h3>;
        return null;
    }

    return (
        <>
            <Head>
                <title>Fuel</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Wrapper apiKey={"AIzaSyBnPWI3aKEk5Nj-WJhnnDlJcRWmppMVI2E"} render={render} libraries={['visualization']}>
                <Map center={center} zoom={zoom} sheds={sheds} selectedCategory={selectedCategory} />
            </Wrapper>

            <div className="fixed -top-14 right-0 w-full max-w-md px-1 py-16 sm:px-0">
                <Tab.Group
                    onChange={(index) => {
                        setSelectedCategory(index)
                    }}
                >
                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        {categories.map((category) => (
                            <Tab
                                key={category}
                                className={({ selected }) =>
                                    classNames(
                                        'w-full rounded-lg py-2 text-sm font-medium leading-5 text-blue-700 px-[1px]',
                                        'focus:outline-none',
                                        selected
                                            ? 'bg-white shadow'
                                            : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                    )
                                }
                            >
                                {category}
                            </Tab>
                        ))}
                    </Tab.List>
                </Tab.Group>
            </div>
        </>
    )
}

export async function getServerSideProps() {
    const response = await fetch('https://fuel-4qabjkn7x-nova9.vercel.app/api/sheds')
    const sheds = await response.json()

    return { props: { sheds } }
}