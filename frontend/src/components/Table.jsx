import { Component, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'

const Table = () => {
    return(
        <div className='relative overflow-x-auto'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Item Name
                        </th>
                        <th scope='col' className='px-6 py-3'>
                            Quantity In Stock
                        </th>
                        <th scope='col' className='px-6 py-3'>
                            
                        </th>
                    </tr>
                </thead>

            </table>
        </div>
    )
}